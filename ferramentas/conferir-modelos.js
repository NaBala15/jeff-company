#!/usr/bin/env node
/* ==========================================================================
   CONFERIDOR DOS MODELOS DA VITRINE

   Roda em todos os modelos de uma vez e avisa o que saiu do padrão.

   Existe porque cada modelo é uma cópia completa e independente: o mesmo
   botão de WhatsApp, o mesmo menu, a mesma tarja de demonstração estão
   repetidos em cada pasta. Com 2 ramos dá para conferir no olho. Com 9,
   não dá — e o jeito que isso quebra é silencioso: você conserta um bug
   num modelo, esquece dos outros, e só descobre quando um cliente reclama.

   COMO USAR, na raiz do projeto:

       node ferramentas/conferir-modelos.js

   Sai com código 1 se achar erro, então serve para rodar antes do push.

   O QUE ELE NÃO FAZ: não julga design nem texto. Confere só o que tem
   resposta certa e errada.
   ========================================================================== */

'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var RAIZ     = path.resolve(__dirname, '..');
var MODELOS  = path.join(RAIZ, 'modelos');
var CATALOGO = path.join(RAIZ, 'pedido', 'js', 'modelos.js');

var erros = 0, avisos = 0;

/* --------------------------------------------------------------- utilidades */

function ler(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
}

function existe(p) {
  try { fs.statSync(p); return true; } catch (e) { return false; }
}

/* Comentário de HTML some antes de qualquer conferência: os modelos são
   cheios de <!-- EDITAR: https://wa.me/55DDDNUMERO -->, e o marcador não
   pode ser confundido com número mal escrito. */
function semComentarios(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '');
}

function erro(onde, msg) {
  console.log('  ✖ ERRO   ' + onde + ' — ' + msg);
  erros++;
}

function aviso(onde, msg) {
  console.log('  △ AVISO  ' + onde + ' — ' + msg);
  avisos++;
}

function ok(msg) {
  console.log('  ✓ ' + msg);
}

/* ------------------------------------------------- catálogo (pedido/js/modelos.js)

   Em vez de repetir aqui qual página usa qual captura, a gente lê o próprio
   catálogo. Assim o conferidor nunca discorda do que o site realmente usa. */

function lerCatalogo() {
  var codigo = ler(CATALOGO);
  if (codigo === null) {
    erro('pedido/js/modelos.js', 'arquivo não encontrado');
    return null;
  }
  var janela = {};
  try {
    /* o arquivo só declara window.ALGUMA_COISA = ...; roda sem navegador */
    new Function('window', codigo)(janela);
  } catch (e) {
    erro('pedido/js/modelos.js', 'não foi possível interpretar: ' + e.message);
    return null;
  }
  return janela;
}

/* ------------------------------------------------------- conferência por página */

function conferirPagina(ramo, modelo) {
  var dir  = path.join(MODELOS, ramo, modelo);
  var onde = 'modelos/' + ramo + '/' + modelo;

  var html = ler(path.join(dir, 'index.html'));
  var css  = ler(path.join(dir, 'style.css'));
  var js   = ler(path.join(dir, 'script.js'));

  if (html === null) { erro(onde, 'falta index.html'); return; }
  if (css  === null) { erro(onde, 'falta style.css');  return; }
  if (js   === null) { erro(onde, 'falta script.js');  return; }

  var limpo = semComentarios(html);

  /* --- cabeça do documento --- */
  if (!/<html[^>]*lang="pt-BR"/i.test(limpo)) erro(onde, 'falta lang="pt-BR" no <html>');
  if (!/<meta[^>]+name="viewport"/i.test(limpo)) erro(onde, 'falta a meta viewport');

  var titulo = limpo.match(/<title>([^<]*)<\/title>/i);
  if (!titulo || !titulo[1].trim()) erro(onde, 'falta o <title>');

  var desc = limpo.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  if (!desc || !desc[1].trim()) {
    erro(onde, 'falta a meta description');
  } else if (desc[1].length > 165) {
    aviso(onde, 'meta description com ' + desc[1].length + ' caracteres (o Google corta perto de 155)');
  }

  /* --- a armadilha do noindex ---
     A pasta do modelo é copiada para virar o site do cliente. Um noindex
     esquecido viajaria junto e o site dele nasceria invisível na busca.
     Quem barra os modelos é o robots.txt da raiz, que não é copiado. */
  if (/noindex/i.test(limpo)) {
    erro(onde, 'tem noindex: a pasta vira o site do cliente e ele nasceria invisível no Google');
  }

  /* --- a tarja de demonstração --- */
  if (js.indexOf('demo=1') === -1) {
    erro(onde, 'script.js sem o bloco ?demo=1: quem chega pelo formulário leria os depoimentos inventados como verdadeiros');
  }
  if (css.indexOf('.aviso-modelo') === -1) {
    erro(onde, 'style.css sem o visual da tarja .aviso-modelo (o script cria o elemento, mas ele fica sem estilo)');
  }

  /* --- links de WhatsApp ---

     Pega TUDO que vem depois de wa.me/ até a aspa, e não só os dígitos.
     Se olhasse só dígitos, um link errado como wa.me/(11) 99999-9999 não
     casaria com nada e a página passaria como se não tivesse WhatsApp. */
  var zaps = [];
  var rx = /wa\.me\/([^"'\s<>]*)/g, achado;
  while ((achado = rx.exec(limpo)) !== null) { zaps.push(achado[1]); }

  if (!zaps.length) {
    erro(onde, 'nenhum link de WhatsApp encontrado');
  }
  zaps.forEach(function (z) {
    var num = z.split('?')[0];            // tira o ?text= da mensagem pronta
    if (!/^55\d{10,11}$/.test(num)) {
      erro(onde, 'WhatsApp fora do formato: wa.me/' + z +
                 ' (esperado wa.me/55DDNUMERO, só dígitos, sem espaço nem parêntese)');
    }
  });

  /* --- nada de rede: o modelo tem que abrir offline --- */
  if (/<link[^>]+rel="stylesheet"[^>]+href="https?:/i.test(limpo)) erro(onde, 'CSS vindo de fora (link http)');
  if (/<script[^>]+src="https?:/i.test(limpo))                    erro(onde, 'JavaScript vindo de fora (script http)');
  if (/@import\s+url\(\s*['"]?https?:/i.test(css))                erro(onde, 'CSS importando de fora (@import http)');
  if (/fonts\.googleapis|fonts\.gstatic/i.test(html + css))       erro(onde, 'usando Google Fonts (a página precisa abrir sem internet)');
  if (/url\(\s*['"]?https?:/i.test(css))                          erro(onde, 'CSS carregando arquivo de fora (url http)');

  /* --- toda imagem precisa de alt --- */
  var imgs = limpo.match(/<img\b[^>]*>/gi) || [];
  imgs.forEach(function (tag) {
    if (!/\salt\s*=/.test(tag)) erro(onde, 'uma <img> está sem alt');
  });

  /* --- âncoras do menu apontando para seção que existe --- */
  var vistos = {};
  (limpo.match(/href="#[^"]+"/g) || []).forEach(function (h) {
    var id = h.slice(7, -1);
    if (!id || vistos[id]) return;
    vistos[id] = true;
    if (limpo.indexOf('id="' + id + '"') === -1) {
      erro(onde, 'o menu aponta para #' + id + ', que não existe na página');
    }
  });

  /* --- os três arquivos estão amarrados? --- */
  if (limpo.indexOf('href="style.css"') === -1) erro(onde, 'o index.html não carrega o style.css');
  if (limpo.indexOf('src="script.js"') === -1)  erro(onde, 'o index.html não carrega o script.js');
}

/* ------------------------------------------------- captura x página (data)

   A pergunta é: a página mudou DEPOIS da última vez que a captura foi
   atualizada? Se sim, o formulário mostra uma imagem de uma versão que não
   existe mais.

   Medimos isso pelo HISTÓRICO DO GIT, não pela data do arquivo no disco.
   Data de arquivo é sinal ruim aqui: sincronizar o OneDrive, copiar a pasta
   ou trocar de branch reescreve a data sem ninguém ter mexido no conteúdo —
   e aí o conferidor grita à toa. Já um commit que tocou a página e não tocou
   a captura é indício de verdade.

   Arquivo ainda não commitado conta como "agora", que é o certo: ele mudou
   e o histórico ainda não sabe. */

function ultimaMudancaNoGit(caminhoRelativo) {
  try {
    /* trabalho ainda não commitado ganha a data de agora */
    var sujo = cp.execFileSync('git', ['status', '--porcelain', '--', caminhoRelativo],
                               { cwd: RAIZ, encoding: 'utf8' }).trim();
    if (sujo) return Date.now();

    var saida = cp.execFileSync('git', ['log', '-1', '--format=%ct', '--', caminhoRelativo],
                                { cwd: RAIZ, encoding: 'utf8' }).trim();
    if (!saida) return null;              // nunca commitado e sem alteração: não dá para julgar
    return parseInt(saida, 10) * 1000;
  } catch (e) {
    return null;                          // sem git disponível: não inventa conclusão
  }
}

function conferirCaptura(onde, dirPagina, arquivoImagem) {
  var relImg = path.posix.join('assets', 'img', 'modelos', arquivoImagem);
  var img = path.join(RAIZ, 'assets', 'img', 'modelos', arquivoImagem);

  if (!existe(img)) {
    erro(onde, 'a captura ' + arquivoImagem + ' não existe');
    return;
  }

  var dataImg = ultimaMudancaNoGit(relImg);
  if (dataImg === null) return;           // sem histórico confiável, não opina

  var maisNova = 0, culpado = '';

  ['index.html', 'style.css', 'script.js'].forEach(function (f) {
    var abs = path.join(dirPagina, f);
    if (!existe(abs)) return;
    var rel = path.relative(RAIZ, abs).split(path.sep).join('/');
    var d = ultimaMudancaNoGit(rel);
    if (d !== null && d > maisNova) { maisNova = d; culpado = f; }
  });

  if (maisNova > dataImg) {
    var dias = Math.round((maisNova - dataImg) / 86400000);
    aviso(onde, 'o ' + culpado + ' mudou depois da captura ' + arquivoImagem +
                (dias >= 1 ? ' (' + dias + ' dia(s) de diferença)' : '') +
                ' — se o visual mudou, gere a captura de novo');
  }
}

/* ------------------------------------------------------------------ execução */

console.log('');
console.log('CONFERINDO OS MODELOS DA VITRINE');
console.log('================================');

var janela = lerCatalogo();
if (!janela) { process.exit(1); }

var conjuntos = janela.CONJUNTOS || [];

/* 1) o que está no catálogo aponta para coisa que existe? */
console.log('');
console.log('CATÁLOGO (pedido/js/modelos.js)');

if (!conjuntos.length) {
  erro('modelos.js', 'nenhum conjunto declarado em window.CONJUNTOS');
}

var registradas = {};

conjuntos.forEach(function (c) {
  var vagas = Object.keys(c.paginas || {});
  var esperadas = ['simples-1', 'simples-2', 'premium'];

  esperadas.forEach(function (v) {
    if (vagas.indexOf(v) === -1) {
      erro('conjunto ' + c.id, 'falta a vaga "' + v + '"');
    }
  });

  vagas.forEach(function (v) {
    var p = c.paginas[v];
    var destino = path.join(MODELOS, p.link.replace(/\/$/, ''));

    registradas[p.link.replace(/\/$/, '')] = true;

    if (!existe(destino)) {
      erro('conjunto ' + c.id + ' / ' + v, 'link aponta para ' + p.link + ', que não existe');
    } else {
      conferirCaptura('conjunto ' + c.id + ' / ' + v, destino, p.imagem);
    }

    if (!p.titulo || !p.resumo || !p.bom_para) {
      erro('conjunto ' + c.id + ' / ' + v, 'falta titulo, resumo ou bom_para');
    }
  });
});

if (!erros && !avisos) ok('catálogo consistente');

/* 2) toda pasta de modelo no disco está registrada no catálogo? */
console.log('');
console.log('PASTAS NO DISCO');

var ramos = fs.existsSync(MODELOS)
  ? fs.readdirSync(MODELOS).filter(function (d) {
      return fs.statSync(path.join(MODELOS, d)).isDirectory();
    })
  : [];

if (!ramos.length) erro('modelos/', 'nenhum ramo encontrado');

var totalPaginas = 0;

ramos.forEach(function (ramo) {
  var dirRamo = path.join(MODELOS, ramo);

  /* cada ramo tem o próprio LEIA-ME e comparativo */
  if (!existe(path.join(dirRamo, 'LEIA-ME.md'))) {
    aviso('modelos/' + ramo, 'sem LEIA-ME.md');
  }
  if (!existe(path.join(dirRamo, 'comparativo.html'))) {
    aviso('modelos/' + ramo, 'sem comparativo.html (é o que você mostra ao cliente)');
  }

  var modelos = fs.readdirSync(dirRamo).filter(function (d) {
    return fs.statSync(path.join(dirRamo, d)).isDirectory();
  });

  modelos.forEach(function (m) {
    totalPaginas++;
    var chave = ramo + '/' + m;
    if (!registradas[chave]) {
      erro('modelos/' + chave, 'a página existe mas não está em nenhum conjunto do modelos.js — ninguém vai vê-la');
    }
    conferirPagina(ramo, m);
  });
});

/* ------------------------------------------------------------------ resumo */

console.log('');
console.log('--------------------------------');
console.log(ramos.length + ' ramo(s), ' + totalPaginas + ' página(s) conferida(s)');

if (!erros && !avisos) {
  console.log('Tudo dentro do padrão.');
} else {
  console.log(erros + ' erro(s), ' + avisos + ' aviso(s)');
}
console.log('');

process.exit(erros ? 1 : 0);
