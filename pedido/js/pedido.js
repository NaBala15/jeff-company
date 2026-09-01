/* ==========================================================================
   Fluxo de pedido

   Regra que orienta tudo aqui: só três campos são obrigatórios — nome,
   WhatsApp e nome do negócio. Todo o resto pode ficar em branco e o pedido
   segue. Formulário que trava por causa de campo vazio não protege ninguém:
   faz a pessoa fechar a aba, e aí você não tem nem os três campos.

   O que sai daqui é uma mensagem de WhatsApp pronta, com tudo que foi
   preenchido. Sem servidor, sem banco, sem custo — e o cliente já cai numa
   conversa onde consegue mandar as fotos em seguida.

   ATENÇÃO: troque SEU_WHATSAPP abaixo pelo seu número.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========  TROQUE AQUI  ==========
     Formato: 55 + DDD + número, tudo junto.
     Para (11) 91234-5678 escreva 5511912345678 */
  var SEU_WHATSAPP = '5511997097050';

  var TOTAL_PASSOS = 5;
  var passoAtual = 0;

  var pedido = {
    plano: '',
    modelo: '',
    /* '' enquanto não perguntamos, 'sim' ou 'nao' depois de responder */
    catalogo: '',
    materiais: []
  };

  /* ---------------------------------------------------------------------
     Memória do formulário

     O passo 3 leva a pessoa para outra página (o comparativo do ramo). Sem
     guardar nada, ela voltaria com o formulário em branco e desistiria — e
     com razão. Então tudo que foi digitado fica no navegador dela, some
     quando o pedido é enviado, e nunca sai do aparelho.
     --------------------------------------------------------------------- */

  var CHAVE = 'jc-pedido';

  function salvarEstado() {
    try {
      var campos = {};
      document.querySelectorAll('.passo input, .passo textarea, .passo select')
        .forEach(function (c) {
          if (!c.id && !c.name) return;
          campos[c.id || c.name] = c.type === 'checkbox' ? c.checked : c.value;
        });
      localStorage.setItem(CHAVE, JSON.stringify({ pedido: pedido, campos: campos }));
    } catch (e) { /* navegador sem armazenamento: segue sem memória */ }
  }

  function restaurarEstado() {
    var dados;
    try { dados = JSON.parse(localStorage.getItem(CHAVE) || 'null'); }
    catch (e) { return false; }
    if (!dados) return false;

    if (dados.pedido) {
      pedido.plano = dados.pedido.plano || '';
      pedido.modelo = dados.pedido.modelo || '';
      pedido.catalogo = dados.pedido.catalogo || '';
      pedido.materiais = dados.pedido.materiais || [];
    }
    Object.keys(dados.campos || {}).forEach(function (id) {
      var c = document.getElementById(id) ||
              document.querySelector('[name="' + id + '"]');
      if (!c) return;
      if (c.type === 'checkbox') c.checked = dados.campos[id];
      else c.value = dados.campos[id];
    });

    /* a pergunta do catálogo também volta como estava */
    if (pedido.catalogo) marcarCatalogo(pedido.catalogo);

    /* o cartão de plano precisa voltar marcado, senão a pessoa acha que perdeu */
    if (pedido.plano) {
      var b = document.querySelector('.plano[data-plano="' + pedido.plano + '"]');
      if (b) {
        document.querySelectorAll('.plano').forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');
      }
    }
    return true;
  }

  function esquecerEstado() {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
  }

  var elProgresso = document.getElementById('progresso');
  var elProgressoI = document.getElementById('progresso-i');
  var elProgressoTxt = document.getElementById('progresso-txt');

  /* ---------------------------------------------------------------------
     Navegação entre passos
     --------------------------------------------------------------------- */

  function irPara(n) {
    if (n === 2 && !validarPasso1()) return;

    /* Catálogo com carrinho: o passo 3 não é escolha de modelo, porque não
       há modelo pronto que faça isso. É a página de exemplo, aberta inteira,
       para a pessoa mexer antes de pedir orçamento.

       Vem ANTES do desvio da personalizada logo abaixo: quem pede catálogo
       está sempre na personalizada, e se a ordem fosse a outra o exemplo
       nunca apareceria. */
    if (n === 3 && pedido.catalogo === 'sim') {
      salvarEstado();
      location.href = window.EXEMPLO_CATALOGO + '?pedido=1';
      return;
    }

    /* quem escolheu página personalizada não passa pela escolha de modelo */
    if (n === 3 && pedido.plano === 'personalizada') n = 4;

    /* O passo 3 é o comparativo do ramo, e não uma tela aqui dentro: lá as
       três páginas aparecem inteiras, com preço e com o que o premium tem a
       mais. Cartão pequeno não decide R$ 50 contra R$ 60.

       Só vale quando o ramo tem páginas prontas. Sem conjunto não há
       comparativo para onde mandar, e aí o passo 3 continua sendo os
       cartões desenhados aqui. */
    if (n === 3) {
      var conjunto = window.conjuntoDoRamo(campoRamo.value);
      if (conjunto) {
        salvarEstado();
        location.href = window.BASE_MODELOS + conjunto.id + '/comparativo.html?pedido=1';
        return;
      }
    }

    document.querySelectorAll('.passo').forEach(function (s) {
      s.classList.toggle('is-on', Number(s.dataset.passo) === n);
    });

    passoAtual = n;
    atualizarProgresso();
    if (n === 5) montarResumo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function atualizarProgresso() {
    elProgresso.hidden = passoAtual === 0;
    if (passoAtual === 0) return;
    elProgressoI.style.width = (passoAtual / TOTAL_PASSOS * 100) + '%';
    elProgressoTxt.textContent = passoAtual + ' de ' + TOTAL_PASSOS;
  }

  /* ---------------------------------------------------------------------
     Validação — só o que realmente impede de começar
     --------------------------------------------------------------------- */

  function validarPasso1() {
    var faltando = [];
    [['c-nome', 'seu nome'], ['c-whats', 'seu WhatsApp'], ['c-negocio', 'o nome do negócio']]
      .forEach(function (par) {
        var el = document.getElementById(par[0]);
        var vazio = !el.value.trim();
        el.classList.toggle('erro', vazio);
        if (vazio) faltando.push(par[1]);
      });

    if (faltando.length) {
      avisar('Falta ' + faltando.join(', ') + '.');
      var primeiro = document.querySelector('.campo input.erro');
      if (primeiro) primeiro.focus();
      return false;
    }
    return true;
  }

  /* ---------------------------------------------------------------------
     Passo 0 — os dois caminhos
     --------------------------------------------------------------------- */

  document.getElementById('caminho-zap').href =
    'https://wa.me/' + SEU_WHATSAPP + '?text=' +
    encodeURIComponent('Olá! Vi o site da Jeff Company e quero criar minha página. Pode me ajudar?');

  document.getElementById('caminho-form').addEventListener('click', function () { irPara(1); });

  /* ---------------------------------------------------------------------
     Passo 1 — ramo, com sugestão de modelo
     --------------------------------------------------------------------- */

  var datalist = document.getElementById('lista-ramos');
  window.RAMOS_COMUNS.forEach(function (r) {
    var o = document.createElement('option');
    o.value = r;
    datalist.appendChild(o);
  });

  var campoRamo = document.getElementById('c-ramo');
  var dicaRamo = document.getElementById('dica-ramo');

  campoRamo.addEventListener('input', function () {
    mostrarPerguntaCatalogo();

    var id = window.sugerirModelo(campoRamo.value);
    if (!id) { dicaRamo.textContent = ''; return; }
    var m = acharModelo(id);
    dicaRamo.textContent = 'Para esse ramo, o modelo "' + m.nome + '" costuma funcionar melhor.';
  });

  /* ---------------------------------------------------------------------
     Pergunta do catálogo

     Só para quem vende produto. Aparece embaixo do campo do ramo, no passo
     1, e decide dois desvios adiante: o plano marcado no passo 2 e o que o
     passo 3 mostra.
     --------------------------------------------------------------------- */

  var caixaCatalogo = document.getElementById('quer-catalogo');
  var notaCatalogo = document.getElementById('nota-catalogo');

  function mostrarPerguntaCatalogo() {
    if (!caixaCatalogo) return;
    var cabe = window.pedeCatalogo(campoRamo.value);

    caixaCatalogo.hidden = !cabe;

    /* Mudou de pizzaria para dentista: a resposta antiga não vale mais e
       não pode continuar guiando o passo 2. */
    if (!cabe && pedido.catalogo) {
      pedido.catalogo = '';
      marcarCatalogo('');
      aplicarCatalogo();
    }
  }

  function marcarCatalogo(valor) {
    var ops = document.querySelectorAll('.catalogo-op');
    for (var i = 0; i < ops.length; i++) {
      ops[i].classList.toggle('is-on', ops[i].dataset.catalogo === valor);
    }
  }

  /* O passo 2 muda de cara conforme a resposta. */
  function aplicarCatalogo() {
    var pronta = document.querySelector('.plano[data-plano="assinatura"]');
    var medida = document.querySelector('.plano[data-plano="personalizada"]');
    if (!pronta || !medida) return;

    var comCarrinho = pedido.catalogo === 'sim';

    if (notaCatalogo) notaCatalogo.hidden = !comCarrinho;

    /* A página pronta continua visível, só apagada: sumir com a opção mais
       barata faria a pessoa achar que ela deixou de existir. */
    pronta.classList.toggle('is-off', comCarrinho);
    pronta.disabled = comCarrinho;

    if (comCarrinho) {
      pedido.plano = 'personalizada';
      pronta.classList.remove('is-on');
      medida.classList.add('is-on');
      montarModelos();
    }
  }

  if (caixaCatalogo) {
    caixaCatalogo.addEventListener('click', function (e) {
      var b = e.target.closest('.catalogo-op');
      if (!b) return;

      pedido.catalogo = b.dataset.catalogo;
      marcarCatalogo(pedido.catalogo);
      aplicarCatalogo();
    });
  }

  /* "mudar de ideia", no aviso do passo 2: volta ao passo 1 com a pergunta
     limpa, em vez de deixar a pessoa presa na personalizada. */
  var voltarCatalogo = document.getElementById('voltar-catalogo');
  if (voltarCatalogo) {
    voltarCatalogo.addEventListener('click', function (e) {
      e.preventDefault();
      pedido.catalogo = '';
      pedido.plano = '';
      marcarCatalogo('');
      aplicarCatalogo();
      document.querySelectorAll('.plano').forEach(function (o) { o.classList.remove('is-on'); });
      irPara(1);
    });
  }

  /* máscara leve de telefone: ajuda a digitar, não impede nada */
  document.getElementById('c-whats').addEventListener('input', function (e) {
    var d = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6)      e.target.value = '(' + d.slice(0,2) + ') ' + d.slice(2,7) + '-' + d.slice(7);
    else if (d.length > 2) e.target.value = '(' + d.slice(0,2) + ') ' + d.slice(2);
    else if (d.length)     e.target.value = '(' + d;
  });

  /* ---------------------------------------------------------------------
     Passo 2 — plano
     --------------------------------------------------------------------- */

  document.querySelectorAll('.plano').forEach(function (b) {
    b.addEventListener('click', function () {
      /* página pronta bloqueada por causa do catálogo com carrinho */
      if (b.classList.contains('is-off')) return;

      document.querySelectorAll('.plano').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      pedido.plano = b.dataset.plano;

      /* o preço só aparece nos cartões quando o plano é a assinatura */
      montarModelos();
    });
  });

  /* Voltar do passo 4 respeita quem pulou a escolha de modelo */
  document.getElementById('voltar-4').addEventListener('click', function () {
    irPara(pedido.plano === 'personalizada' ? 2 : 3);
  });

  /* ---------------------------------------------------------------------
     Passo 3 — modelos
     --------------------------------------------------------------------- */

  function acharModelo(id) {
    for (var i = 0; i < window.MODELOS.length; i++) {
      if (window.MODELOS[i].id === id) return window.MODELOS[i];
    }
    return null;
  }

  /* Miniaturas: cada esqueleto é um desenho diferente, para a diferença
     entre os modelos entrar pelos olhos antes de entrar pela leitura. */
  function miniatura(tipo) {
    var m = { vitrine:
      '<span class="barra"></span><span class="foto"></span>' +
      '<span class="linhas"><span></span><span></span><span></span><span></span></span>',
      agenda:
      '<span class="barra"></span><span class="topo2"><span></span><span></span></span>' +
      '<span class="lista"><span></span><span></span><span></span></span><span class="cta"></span>',
      /* A miniatura do completo mostra a página MAIOR: mesma barra, foto de
         topo, grade de galeria e ainda sobra bloco embaixo. A diferença de
         tamanho tem que entrar pelos olhos, senão os R$ 10 não se explicam. */
      completa:
      '<span class="barra"></span><span class="foto"></span>' +
      '<span class="grade"><span></span><span></span><span></span></span>' +
      '<span class="linhas"><span></span><span></span></span><span class="cta"></span>'
    };
    return '<span class="mini mini-' + tipo + '">' + (m[tipo] || '') + '</span>';
  }

  /* Mensalidade do modelo escolhido. Sem modelo escolhido ainda, vale a base. */
  function mensalidade() {
    var m = pedido.modelo ? acharModelo(pedido.modelo) : null;
    return (m && m.mensalidade) || window.MENSALIDADE_BASE;
  }

  /* A prévia de uma página de verdade. Uma imagem estática e leve, e não a
     página embutida: três páginas dentro de janelas fariam o celular do
     visitante carregar quatro sites de uma vez para escolher um. */
  function previa(pagina) {
    /* O ?v= na captura tem o mesmo motivo do ?v= dos scripts: o navegador
       guarda imagem por muito tempo. Quando uma captura \u00e9 regerada com o
       mesmo nome de arquivo, quem j\u00e1 visitou continuaria vendo a antiga \u2014
       foi o que aconteceu com a do Corte Bruto. Suba window.VERSAO_PREVIAS
       no modelos.js sempre que regerar qualquer captura. */
    return '<img class="modelo-foto" src="' +
             window.BASE_PREVIAS + pagina.imagem +
             '?v=' + (window.VERSAO_PREVIAS || 1) + '"' +
           ' width="640" height="480" loading="lazy" decoding="async"' +
           ' alt="Pr\u00e9via da p\u00e1gina: ' + pagina.bom_para.toLowerCase() + '">';
  }

  function montarModelos() {
    var alvo = document.getElementById('modelos');
    var ramo = campoRamo.value;
    var sugerido = window.sugerirModelo(ramo);

    /* O ramo digitado tem páginas prontas? Se tiver, os cartões mostram a
       captura da página de verdade daquele ofício. Se não tiver, seguem com
       a miniatura desenhada — nunca com a página de outro ramo. */
    var conjunto = window.conjuntoDoRamo(ramo);

    /* Na página personalizada o valor é orçamento, então mostrar mensalidade
       no cartão só confundiria. O preço é coisa da assinatura. */
    var mostrarPreco = pedido.plano !== 'personalizada';

    /* o sugerido vai para a frente da fila */
    var lista = window.MODELOS.slice();
    if (sugerido) {
      lista.sort(function (a, b) {
        return (b.id === sugerido) - (a.id === sugerido);
      });
    }

    alvo.innerHTML = '';
    alvo.classList.toggle('tem-fotos', !!conjunto);

    lista.forEach(function (m) {
      var pagina = conjunto ? conjunto.paginas[m.id] : null;

      /* O cartão é um botão, e link dentro de botão não funciona nem é HTML
         válido. Por isso a caixa: o botão escolhe, o link embaixo abre a
         página. São dois gestos diferentes e ficam separados. */
      var caixa = document.createElement('div');
      caixa.className = 'modelo-caixa';

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'modelo' + (pedido.modelo === m.id ? ' is-on' : '');
      b.dataset.modelo = m.id;
      b.innerHTML =
        (m.id === sugerido ? '<span class="modelo-rec">Recomendado</span>' : '') +
        (m.selo && mostrarPreco ? '<span class="modelo-selo"></span>' : '') +
        (pagina ? previa(pagina) : miniatura(m.esqueleto)) +
        '<span class="modelo-txt">' +
          '<span class="modelo-topo">' +
            '<span class="modelo-nome"></span>' +
            (mostrarPreco ? '<span class="modelo-preco"></span>' : '') +
          '</span>' +
          '<span class="modelo-resumo"></span>' +
          '<span class="modelo-bom"></span>' +
        '</span>';

      b.querySelector('.modelo-nome').textContent = m.nome;
      b.querySelector('.modelo-resumo').textContent = pagina ? pagina.resumo : m.resumo;
      b.querySelector('.modelo-bom').textContent = pagina ? pagina.bom_para : m.bom_para;
      if (m.selo && mostrarPreco) b.querySelector('.modelo-selo').textContent = m.selo;

      /* O valor fica no cartão, não só no resumo do fim. Quem escolhe o
         premium tem que ver os R$ 60 na hora de clicar, não depois. */
      if (mostrarPreco) {
        b.querySelector('.modelo-preco').textContent = 'R$ ' + m.mensalidade + '/m\u00eas';
        if (m.mensalidade > window.MENSALIDADE_BASE) {
          b.querySelector('.modelo-preco').classList.add('is-mais');
        }
      }

      b.addEventListener('click', function () {
        alvo.querySelectorAll('.modelo').forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');
        pedido.modelo = m.id;
      });

      caixa.appendChild(b);

      /* Link para ver a página inteira, em outra aba. Abrir na mesma aba
         faria a pessoa perder o formulário que já começou a preencher. */
      if (pagina) {
        var a = document.createElement('a');
        a.className = 'modelo-link';
        a.href = window.BASE_MODELOS + pagina.link + '?demo=1';
        a.target = '_blank';
        /* nofollow: o robots.txt pede para não rastrear /modelos/, mas um
           link seguido daqui ainda poderia pôr a página fictícia no Google */
        a.rel = 'noopener nofollow';
        a.innerHTML = 'Ver a p\u00e1gina inteira' +
          '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"' +
          ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M7 17 17 7M9 7h8v8"/></svg>';
        caixa.appendChild(a);
      }

      alvo.appendChild(caixa);
    });

    /* Aviso honesto para quem é de um ramo que ainda não tem página pronta:
       o desenho mostra o formato, não a página final. */
    var aviso = document.getElementById('modelo-aviso');
    if (aviso) {
      aviso.hidden = !!conjunto || !ramo.trim();
    }

    textoDoPasso3(conjunto);
  }

  /* O título e a linha de apoio do passo 3 dependem de duas coisas: o plano
     escolhido e o ramo ter páginas prontas.

     Ficam aqui, e não dentro do clique do plano, porque quem chega por
     /pedido/?ramo=...#passo-3 nunca clica em plano nenhum — e mesmo assim
     tem que ler o texto certo. */
  function textoDoPasso3(conjunto) {
    var t = document.getElementById('t-modelo');
    var s = document.getElementById('s-modelo');
    if (!t || !s) return;

    if (pedido.plano === 'personalizada') {
      t.textContent = 'Tem algum formato que te agrada?';
      s.textContent = 'Sua página será desenhada do zero. Se algum destes formatos ' +
                      'te agrada como ponto de partida, escolha — se não, pule.';
      return;
    }

    t.textContent = 'Escolha o modelo da sua página';
    s.textContent = conjunto
      ? 'Estas são páginas de verdade, feitas para o seu ramo. Todas ficam com ' +
        'o seu nome, suas cores e suas fotos — clique em "ver a página inteira" ' +
        'para conhecer cada uma por dentro.'
      : 'Três modelos prontos. Todos ficam com o seu nome, suas cores e suas ' +
        'fotos — o que muda é o tamanho e a organização da página.';
  }

  /* ---------------------------------------------------------------------
     Passo 5 — resumo e mensagem
     --------------------------------------------------------------------- */

  function valor(id) { return (document.getElementById(id).value || '').trim(); }

  /* No cartão a vaga se chama só "Simples 1" — de propósito, porque para quem
     está comprando o que importa é o tamanho e o preço.

     Na mensagem que chega para mim vai também o nome da página de verdade.
     Com nove ramos × três páginas, "Simples 1" sozinho me obrigaria a cruzar
     com o ramo toda vez para saber qual arquivo abrir. */
  function nomeDoModeloEscolhido(m) {
    if (!m) return '';

    var conjunto = window.conjuntoDoRamo(campoRamo.value);
    var pagina = conjunto && conjunto.paginas[m.id];
    if (pagina) return m.nome + ' — ' + pagina.titulo;

    return m.selo ? m.nome + ' (' + m.selo + ')' : m.nome;
  }

  function coletar() {
    pedido.materiais = [];
    document.querySelectorAll('#checks input:checked').forEach(function (c) {
      pedido.materiais.push(c.value);
    });

    var m = pedido.modelo ? acharModelo(pedido.modelo) : null;

    return [
      ['Nome',            valor('c-nome')],
      ['WhatsApp',        valor('c-whats')],
      ['Negócio',         valor('c-negocio')],
      ['Ramo',            valor('c-ramo')],
      ['Cidade',          valor('c-cidade')],
      ['Tipo de página',  pedido.plano === 'assinatura' ? 'Página pronta — assinatura de R$ ' + mensalidade() + '/mês'
                        : pedido.plano === 'personalizada' ? 'Página personalizada — orçamento'
                        : ''],
      /* Só entra quando a pergunta foi feita. Para um dentista a linha
         "Catálogo: não" só poluiria a mensagem. */
      ['Catálogo com pedido', pedido.catalogo === 'sim' ? 'SIM — com carrinho, sob medida'
                            : pedido.catalogo === 'nao' ? 'não — lista de produtos basta'
                            : ''],
      ['Modelo escolhido', nomeDoModeloEscolhido(m)],
      ['Serviços',        valor('c-servicos')],
      ['Horário',         valor('c-horario')],
      ['Endereço',        valor('c-endereco')],
      ['Instagram',       valor('c-instagram')],
      ['Mostrar preço',   valor('c-preco')],
      ['Frase de destaque', valor('c-frase')],
      ['Quer também',     valor('c-extras')],
      ['Já tem em mãos',  pedido.materiais.join(', ')]
    ];
  }

  function montarResumo() {
    var alvo = document.getElementById('resumo');
    alvo.innerHTML = '';
    var vazios = 0;

    coletar().forEach(function (par) {
      var linha = document.createElement('div');
      linha.className = 'resumo-linha';
      linha.innerHTML = '<span class="resumo-rot"></span><span class="resumo-val"></span>';
      linha.querySelector('.resumo-rot').textContent = par[0];

      var val = linha.querySelector('.resumo-val');
      if (par[1]) {
        val.textContent = par[1];
      } else {
        val.textContent = 'não informado';
        val.classList.add('vazio');
        vazios++;
      }
      alvo.appendChild(linha);
    });

    document.getElementById('aviso-falta').textContent = vazios
      ? 'Você deixou ' + vazios + ' item(ns) em branco — tudo bem, a gente completa na conversa.'
      : 'Está tudo preenchido. Depois de enviar, mande o logo e as fotos na mesma conversa.';

    var enviar = document.getElementById('btn-enviar');
    enviar.href = 'https://wa.me/' + SEU_WHATSAPP + '?text=' + encodeURIComponent(mensagem());

    /* Pedido enviado, memória apagada. Sem isso, o próximo visitante do mesmo
       aparelho — numa lan house, no celular emprestado — abriria o formulário
       com os dados de outra pessoa. */
    enviar.addEventListener('click', esquecerEstado, { once: true });
  }

  function mensagem() {
    var linhas = ['*PEDIDO DE PÁGINA — JEFF COMPANY*', ''];
    coletar().forEach(function (par) {
      if (par[1]) linhas.push('*' + par[0] + ':* ' + par[1]);
    });
    linhas.push('', 'Vou mandar o logo e as fotos aqui em seguida.');
    return linhas.join('\n');
  }

  document.getElementById('btn-copiar').addEventListener('click', function () {
    var texto = mensagem();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto)
        .then(function () { avisar('Texto copiado.'); })
        .catch(function () { copiarNaMarra(texto); });
    } else {
      copiarNaMarra(texto);
    }
  });

  /* navegador antigo, ou página aberta sem https: a área de transferência
     moderna não existe, então cai no truque do campo temporário */
  function copiarNaMarra(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); avisar('Texto copiado.'); }
    catch (e) { avisar('Não consegui copiar. Selecione o resumo e copie na mão.'); }
    ta.remove();
  }

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */

  var timer = null;
  function avisar(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(function () { t.classList.remove('is-on'); }, 3400);
  }

  document.querySelectorAll('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () {
      var destino = Number(b.dataset.ir);
      if (destino === 3) montarModelos();      // remonta com a sugestão do ramo
      irPara(destino);
    });
  });

  /* Enter avança em vez de recarregar a página */
  document.querySelectorAll('.campo input').forEach(function (i) {
    i.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var proximo = document.querySelector('.passo.is-on .btn-p');
      if (proximo) proximo.click();
    });
  });

  /* ---------------------------------------------------------------------
     Link direto para um passo: #passo-3 abre já nos modelos.
     Serve para mandar "dá uma olhada nos modelos" pelo WhatsApp sem obrigar
     a pessoa a preencher tudo antes de ver.

     O ramo pode vir junto no endereço:

         /pedido/?ramo=encanador#passo-3

     Agora que os modelos mudam por ramo, isso deixou de ser luxo: sem o ramo
     a pessoa cai nas miniaturas genéricas; com o ramo, ela abre direto nas
     páginas do ofício dela. É o link para responder "e no meu caso, como
     fica?" sem escrever nada.

     O valor entra por .value, nunca por innerHTML — endereço é coisa que
     qualquer um escreve, e não vira HTML aqui dentro.
     --------------------------------------------------------------------- */
  /* Voltando do comparativo com um modelo escolhido. Restaura o que estava
     preenchido, marca a vaga e pula direto para o passo 4 — refazer o passo 3
     seria mandar a pessoa escolher duas vezes. */
  /* Voltando da página de exemplo do catálogo. Não há modelo para escolher
     ali — só uma página para conhecer —, então a volta cai direto no passo 4. */
  if (/[?&]catalogo=1/.test(location.search)) {
    restaurarEstado();
    pedido.catalogo = 'sim';
    pedido.plano = 'personalizada';
    marcarCatalogo('sim');
    aplicarCatalogo();
    mostrarPerguntaCatalogo();
    irPara(4);
    atualizarProgresso();
    return;
  }

  var modeloEscolhido = (location.search.match(/[?&]modelo=([a-z0-9-]+)/) || [])[1];
  if (modeloEscolhido) {
    restaurarEstado();
    pedido.modelo = modeloEscolhido;
    if (!pedido.plano) pedido.plano = 'assinatura';
    montarModelos();
    irPara(4);
    atualizarProgresso();
    return;
  }

  var ramoDoLink = (location.search.match(/[?&]ramo=([^&]*)/) || [])[1];
  if (ramoDoLink) {
    campoRamo.value = decodeURIComponent(ramoDoLink.replace(/\+/g, ' ')).slice(0, 60);
    campoRamo.dispatchEvent(new Event('input', { bubbles: true }));
    mostrarPerguntaCatalogo();
  }

  var pedidoDeInicio = (location.hash.match(/^#passo-([0-5])$/) || [])[1];
  if (pedidoDeInicio) {
    var n = Number(pedidoDeInicio);
    if (n === 3) { pedido.plano = pedido.plano || 'assinatura'; montarModelos(); }
    irPara(n);
  }

  atualizarProgresso();
})();
