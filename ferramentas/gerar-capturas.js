#!/usr/bin/env node
/* ==========================================================================
   GERADOR DAS CAPTURAS DOS MODELOS

   Regera as fotos que aparecem nos cartões do passo 3 do formulário.

   Existe porque fazer isso na mão já deu errado duas vezes, do mesmo jeito:
   a captura pega a página ANTES de as seções terminarem de aparecer, e o
   cartão sai praticamente em branco. Aconteceu com o Buffet Girassol e com
   o Corte Bruto. O motivo é a animação de entrada — as seções começam em
   opacity 0 e sobem em 0,6s.

   A correção é uma flag do navegador (--force-prefers-reduced-motion), que
   liga o modo de movimento reduzido. Aí o CSS de cada modelo já manda
   mostrar tudo de uma vez, e a captura sai com a página inteira.

   COMO USAR, na raiz do projeto:

       node ferramentas/gerar-capturas.js                 todas as capturas
       node ferramentas/gerar-capturas.js barbearia       só as de um ramo
       node ferramentas/gerar-capturas.js bar-simples-01  só uma

   O que ele faz sozinho:
     - lê quais páginas existem no catálogo (pedido/js/modelos.js), então
       nunca esquece uma nem gera captura de página que não existe mais
     - sobe um servidor local temporário e derruba no fim
     - compara cada captura nova com a antiga e só grava o que mudou
     - sobe o window.VERSAO_PREVIAS quando alguma imagem muda, senão o
       navegador de quem já visitou continua mostrando a foto velha

   PRECISA DE: Microsoft Edge (ou Chrome) e Python com Pillow — os dois já
   usados no projeto. O Node não converte para .webp sozinho.
   ========================================================================== */

'use strict';

var fs   = require('fs');
var os   = require('os');
var path = require('path');
var http = require('http');
var cp   = require('child_process');

var RAIZ     = path.resolve(__dirname, '..');
var CATALOGO = path.join(RAIZ, 'pedido', 'js', 'modelos.js');
var DESTINO  = path.join(RAIZ, 'assets', 'img', 'modelos');

/* A captura é feita em 1280×960 para a página cair no layout de computador,
   e só depois reduzida para 640×480. Capturar direto em 640 faria a página
   entrar no layout de celular, que não é o que o cliente quer ver. */
var LARGURA_CAPTURA = 1280;
var ALTURA_CAPTURA  = 960;
var LARGURA_FINAL   = 640;
var ALTURA_FINAL    = 480;
var QUALIDADE       = 82;

/* Tempo virtual dado ao navegador antes de fotografar. Cobre o carregamento,
   o IntersectionObserver e a rede de segurança de 4s dos modelos. */
var TEMPO_VIRTUAL = 9000;

/* Diferença média de pixel a partir da qual consideramos que a captura mudou
   de verdade. Abaixo disso é ruído de recompressão do .webp. */
var LIMITE_DIFERENCA = 3;

/* --------------------------------------------------------------- utilidades */

function existe(p) {
  try { fs.statSync(p); return true; } catch (e) { return false; }
}

function acharNavegador() {
  if (process.env.EDGE_BIN && existe(process.env.EDGE_BIN)) return process.env.EDGE_BIN;

  var candidatos = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (var i = 0; i < candidatos.length; i++) {
    if (existe(candidatos[i])) return candidatos[i];
  }
  return null;
}

function temPython() {
  try {
    cp.execFileSync('python', ['-c', 'import PIL'], { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/* ------------------------------------------------------- catálogo de páginas */

function lerCatalogo() {
  var codigo = fs.readFileSync(CATALOGO, 'utf8');
  var janela = {};
  new Function('window', codigo)(janela);
  return janela;
}

function listarPaginas(janela, filtro) {
  var lista = [];

  (janela.CONJUNTOS || []).forEach(function (c) {
    Object.keys(c.paginas || {}).forEach(function (vaga) {
      var p = c.paginas[vaga];
      lista.push({
        ramo: c.id,
        vaga: vaga,
        link: p.link,
        imagem: p.imagem,
        nome: p.imagem.replace(/\.webp$/, ''),
        titulo: p.titulo
      });
    });
  });

  if (!filtro) return lista;

  var f = filtro.toLowerCase();
  return lista.filter(function (p) {
    return p.ramo.toLowerCase().indexOf(f) !== -1 ||
           p.nome.toLowerCase().indexOf(f) !== -1 ||
           p.link.toLowerCase().indexOf(f) !== -1;
  });
}

/* ------------------------------------------------------- servidor temporário */

var TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.jpg':  'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.json': 'application/json'
};

function subirServidor(pronto) {
  var servidor = http.createServer(function (req, res) {
    var caminho = decodeURIComponent(req.url.split('?')[0]);
    if (caminho.endsWith('/')) caminho += 'index.html';

    var arquivo = path.join(RAIZ, caminho);

    /* não deixa sair da pasta do projeto */
    if (arquivo.indexOf(RAIZ) !== 0) { res.writeHead(403); return res.end(); }

    fs.readFile(arquivo, function (erro, dados) {
      if (erro) { res.writeHead(404); return res.end('nao encontrado'); }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
      res.end(dados);
    });
  });

  /* porta 0 = o sistema escolhe uma livre, então nunca esbarra em servidor
     que você já tenha aberto */
  servidor.listen(0, '127.0.0.1', function () {
    pronto(servidor, servidor.address().port);
  });
}

/* ------------------------------------------------------------------ execução */

var filtro = process.argv[2];

console.log('');
console.log('GERANDO AS CAPTURAS DOS MODELOS');
console.log('==============================');

var navegador = acharNavegador();
if (!navegador) {
  console.log('');
  console.log('  ✖ Não achei o Edge nem o Chrome.');
  console.log('    Se estiverem em outro lugar, aponte com a variável EDGE_BIN:');
  console.log('    EDGE_BIN="C:/caminho/msedge.exe" node ferramentas/gerar-capturas.js');
  console.log('');
  process.exit(1);
}

if (!temPython()) {
  console.log('');
  console.log('  ✖ Preciso do Python com a biblioteca Pillow para gravar em .webp.');
  console.log('    Instale com:  python -m pip install Pillow');
  console.log('');
  process.exit(1);
}

var janela;
try {
  janela = lerCatalogo();
} catch (e) {
  console.log('  ✖ Não consegui ler o pedido/js/modelos.js: ' + e.message);
  process.exit(1);
}

var paginas = listarPaginas(janela, filtro);

if (!paginas.length) {
  console.log('');
  console.log(filtro
    ? '  Nenhuma captura casa com "' + filtro + '".'
    : '  Nenhuma página declarada no catálogo.');
  console.log('');
  process.exit(1);
}

console.log('');
console.log(filtro ? 'Filtro: "' + filtro + '" — ' + paginas.length + ' captura(s)'
                   : paginas.length + ' captura(s), todos os ramos');
console.log('Navegador: ' + path.basename(navegador));
console.log('');

var temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'capturas-'));

/* Fotografa uma página. Precisa ser ASSÍNCRONO: o servidor que entrega as
   páginas roda neste mesmo processo, e uma chamada síncrona travaria o
   Node inteiro — o navegador pediria a página e ninguém responderia, até
   estourar o tempo. Foi exatamente o que aconteceu na primeira versão. */
function fotografar(navegador, args) {
  return new Promise(function (resolve) {
    cp.execFile(navegador, args, { timeout: 120000 }, function (erro) {
      if (!erro) return resolve('');
      resolve(erro.signal === 'SIGTERM'
        ? 'o navegador travou e estourou o tempo'
        : String(erro.message || '').trim().split('\n').pop().slice(0, 120));
    });
  });
}

subirServidor(function (servidor, porta) {
  (async function () {

  /* ---- 1) fotografa cada página ---- */
  var falhas = [];

  for (var i = 0; i < paginas.length; i++) {
    var p = paginas[i];
    var destinoPng = path.join(temporaria, p.nome + '.png');
    var url = 'http://127.0.0.1:' + porta + '/modelos/' + p.link;

    process.stdout.write('  [' + (i + 1) + '/' + paginas.length + '] ' + p.nome + ' ... ');

    var motivo = await fotografar(navegador, [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        /* a flag que evita a captura no meio da animação de entrada */
        '--force-prefers-reduced-motion',
        /* perfil próprio e descartável: sem isso, se você estiver com o Edge
           aberto, o processo novo tenta conversar com o que já está rodando
           em vez de fazer o trabalho, e trava até o tempo acabar */
        '--user-data-dir=' + path.join(temporaria, 'perfil'),
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--disable-background-networking',
        '--window-size=' + LARGURA_CAPTURA + ',' + ALTURA_CAPTURA,
        '--virtual-time-budget=' + TEMPO_VIRTUAL,
        '--screenshot=' + destinoPng,
        url
    ]);

    /* o navegador às vezes devolve código diferente de zero mesmo tendo
       gravado a imagem, então quem decide é a existência do arquivo — o
       motivo guardado acima só serve para explicar quando ele falha mesmo */

    if (existe(destinoPng)) {
      console.log('ok');
    } else {
      console.log('FALHOU' + (motivo ? ' — ' + motivo : ''));
      falhas.push(p.nome);
    }
  }

  servidor.close();

  if (falhas.length === paginas.length) {
    console.log('');
    console.log('  ✖ Nenhuma captura foi gerada. O navegador não conseguiu abrir as páginas.');
    console.log('');
    process.exit(1);
  }

  /* ---- 2) reduz, grava em .webp e compara com a versão anterior ---- */
  var script = path.join(temporaria, '_converter.py');
  fs.writeFileSync(script, [
    '# -*- coding: utf-8 -*-',
    'import sys, os, json',
    'from PIL import Image, ImageChops',
    'origem, destino, larg, alt, qual = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])',
    'saida = []',
    'for arquivo in sorted(os.listdir(origem)):',
    '    if not arquivo.endswith(".png"): continue',
    '    nome = arquivo[:-4]',
    '    novo = Image.open(os.path.join(origem, arquivo)).convert("RGB").resize((larg, alt), Image.LANCZOS)',
    '    alvo = os.path.join(destino, nome + ".webp")',
    '    antes = os.path.getsize(alvo) if os.path.exists(alvo) else 0',
    '    dif = None',
    '    if os.path.exists(alvo):',
    '        velho = Image.open(alvo).convert("RGB")',
    '        if velho.size == novo.size:',
    '            h = ImageChops.difference(velho, novo).convert("L").histogram()',
    '            dif = sum(i * v for i, v in enumerate(h)) / float(larg * alt)',
    '    novo.save(alvo, "WEBP", quality=qual, method=6)',
    '    saida.append({"nome": nome, "antes": antes, "depois": os.path.getsize(alvo), "dif": dif})',
    'print(json.dumps(saida))'
  ].join('\n'), 'utf8');

  var bruto;
  try {
    bruto = cp.execFileSync('python', [
      script, temporaria, DESTINO,
      String(LARGURA_FINAL), String(ALTURA_FINAL), String(QUALIDADE)
    ], { encoding: 'utf8' });
  } catch (e) {
    console.log('');
    console.log('  ✖ Falhou ao converter para .webp: ' + e.message);
    console.log('');
    process.exit(1);
  }

  var resultados = JSON.parse(bruto.trim().split('\n').pop());

  /* ---- 3) relatório ---- */
  console.log('');
  console.log('RESULTADO');
  console.log('');

  var mudaram = [];

  resultados.forEach(function (r) {
    var kb = Math.round(r.depois / 1024);
    var estado;

    if (r.antes === 0) {
      estado = 'NOVA';
      mudaram.push(r.nome);
    } else if (r.dif === null) {
      estado = 'regravada (tamanho diferente, não deu para comparar)';
      mudaram.push(r.nome);
    } else if (r.dif > LIMITE_DIFERENCA) {
      estado = 'MUDOU (diferença ' + r.dif.toFixed(1) + ')';
      mudaram.push(r.nome);
    } else {
      estado = 'igual';
    }

    console.log('  ' + pad(r.nome, 22) + pad(kb + ' KB', 8) + estado);
  });

  /* ---- 4) sobe a versão das prévias, se algo mudou ---- */
  console.log('');

  if (!mudaram.length) {
    console.log('  Nenhuma captura mudou. A versão das prévias fica como está.');
  } else {
    var codigo = fs.readFileSync(CATALOGO, 'utf8');
    var achado = codigo.match(/window\.VERSAO_PREVIAS\s*=\s*(\d+)\s*;/);

    if (!achado) {
      console.log('  △ ' + mudaram.length + ' captura(s) mudaram, mas não achei o');
      console.log('    window.VERSAO_PREVIAS no modelos.js para subir. Suba na mão,');
      console.log('    senão quem já visitou continua vendo a imagem velha.');
    } else {
      var nova = parseInt(achado[1], 10) + 1;
      fs.writeFileSync(CATALOGO,
        codigo.replace(achado[0], 'window.VERSAO_PREVIAS = ' + nova + ';'), 'utf8');
      console.log('  ' + mudaram.length + ' captura(s) mudaram: ' + mudaram.join(', '));
      console.log('  VERSAO_PREVIAS subiu de ' + achado[1] + ' para ' + nova +
                  ', para o navegador buscar as imagens novas.');
    }
  }

  if (falhas.length) {
    console.log('');
    console.log('  △ Não consegui fotografar: ' + falhas.join(', '));
  }

  /* limpa os arquivos temporários */
  try {
    fs.readdirSync(temporaria).forEach(function (f) { fs.unlinkSync(path.join(temporaria, f)); });
    fs.rmdirSync(temporaria);
  } catch (e) { /* se não der, o sistema limpa depois */ }

  console.log('');
  console.log('Confira o resultado com:  node ferramentas/conferir-modelos.js');
  console.log('');

  process.exit(falhas.length ? 1 : 0);

  })().catch(function (e) {
    servidor.close();
    console.log('');
    console.log('  ✖ Erro inesperado: ' + e.message);
    console.log('');
    process.exit(1);
  });
});

function pad(texto, tamanho) {
  texto = String(texto);
  while (texto.length < tamanho) texto += ' ';
  return texto;
}
