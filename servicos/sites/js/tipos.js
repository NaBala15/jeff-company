/* ==========================================================================
   Os três tipos de página, com páginas de verdade

   Antes esta seção desenhava retângulos de CSS para representar as seções.
   Explicava, mas não mostrava. Agora cada tipo abre uma página real que já
   existe aqui dentro, numa janela rolável, e a lista de blocos ao lado é
   clicável: clicou em "Provas", a janela rola até os depoimentos e a seção
   pisca. Quem não conhece nada entende vendo, não lendo.

   Como a página da janela mora no mesmo domínio, dá para rolar direto pelo
   documento dela. Se algum dia isso for bloqueado (arquivo aberto por duplo
   clique, por exemplo), o pedido vai por postMessage — as duas páginas de
   exemplo sabem responder.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Largura que a página de dentro finge ter. A janela encolhe tudo por
     transform, então o exemplo aparece como aparece num computador, mesmo
     quando a seção está estreita no celular. */
  var LARGURA = 1280;

  var TIPOS = [
    {
      id: 'landing',
      botao: 'Landing page',
      url: 'barbeariaonobre.com.br',
      pagina: '../../modelos/barbearia/premium-01-nobre/index.html?demo=1',
      titulo: 'Landing page',
      texto: 'Uma página só, com um objetivo só: fazer a pessoa te chamar. ' +
             'Tudo nela empurra para o mesmo botão. É o formato que mais converte ' +
             'quando você tem um serviço principal.',
      exemplo: 'Modelo real da barbearia, do catálogo de modelos.',
      dados: [
        ['Tamanho', '1 página'],
        ['Melhor para', 'Um serviço principal'],
        ['Prazo', '5 a 7 dias'],
        ['Também existe como', 'assinatura a partir de R$ 50/mês']
      ],
      blocos: [
        ['Topo',          'Sua frase principal e o botão de WhatsApp', 'inicio', 'hero'],
        ['Serviços',      'O que você faz, com preço',                 'servicos'],
        ['Trabalhos',     'Fotos do que você já fez',                  'galeria'],
        ['Provas',        'O que os clientes dizem',                   'depoimentos'],
        ['Dúvidas',       'As perguntas que travam a decisão',         'duvidas'],
        ['Onde e quando', 'Endereço, horário e a chamada final',       'local', 'cta']
      ]
    },
    {
      id: 'institucional',
      botao: 'Site institucional',
      url: 'marinocontabilidade.com.br',
      pagina: '../../modelos/institucional/premium-01-contabil/index.html?demo=1',
      titulo: 'Site institucional',
      texto: 'Mais espaço para contar história, mostrar a equipe e detalhar ' +
             'vários serviços. É o formato de quem precisa vender confiança ' +
             'antes de vender o serviço.',
      exemplo: 'Modelo real do ramo institucional — há outros dois no catálogo.',
      dados: [
        ['Tamanho', '4 a 7 seções'],
        ['Melhor para', 'Vários serviços ou equipe'],
        ['Prazo', '5 a 7 dias no modelo pronto'],
        ['Também existe como', 'assinatura a partir de R$ 50/mês']
      ],
      blocos: [
        ['Topo',     'Apresentação do negócio e chamada',            'bloco-topo', 'hero'],
        ['Sobre',    'História, tempo de mercado, o que diferencia', 'bloco-sobre'],
        ['Serviços', 'Cada serviço com explicação própria',          'bloco-servicos'],
        ['Equipe',   'Quem atende, com foto e formação',             'bloco-equipe'],
        ['Provas',   'Depoimentos e números do escritório',          'bloco-provas'],
        ['Contato',  'Endereço, mapa, horário e WhatsApp',           'bloco-contato', 'cta']
      ]
    },
    {
      id: 'catalogo',
      botao: 'Catálogo com pedido',
      url: 'cozinhadavila.com.br',
      pagina: '../../exemplos/catalogo/index.html',
      titulo: 'Catálogo com pedido no WhatsApp',
      texto: 'Seus produtos com foto e preço, e um botão que já monta a ' +
             'mensagem do pedido. Funciona como loja, sem a complicação e o ' +
             'custo de uma loja com carrinho e pagamento online.',
      exemplo: 'Exemplo de marmitaria, criado por mim. Pode mexer: some itens ' +
               'e veja o pedido montar sozinho.',
      dados: [
        ['Tamanho', '1 página + catálogo'],
        ['Melhor para', 'Quem vende produto'],
        ['Prazo', '1 a 2 semanas'],
        ['Valor', 'sob medida, orçamento em 24h']
      ],
      blocos: [
        ['Topo',       'Foto do produto e chamada de pedido',      'bloco-topo', 'hero'],
        ['Categorias', 'Filtro por tipo, sem recarregar a página', 'bloco-categorias'],
        ['Catálogo',   'Cada item com foto, descrição e preço',    'bloco-cardapio'],
        ['Pedido',     'O que a pessoa escolheu, já somado',       'bloco-pedido', 'cta'],
        ['Entrega',    'Área atendida, taxa, horário e pagamento', 'bloco-entrega'],
        ['Dúvidas',    'O que ela perguntaria antes de pedir',     'bloco-duvidas']
      ]
    }
  ];

  var elTipos  = document.getElementById('s-tipos');
  var elBlocos = document.getElementById('s-blocos');
  var elQuadro = document.getElementById('s-quadro');
  var elCaixa  = document.getElementById('s-caixa');
  var elAbrir  = document.getElementById('s-abrir');

  if (!elTipos || !elQuadro || !elCaixa) return;

  var atual = null;

  /* ---------------------------------------------------- encolher a janela

     A página de dentro é desenhada com LARGURA pixels e depois encolhida por
     transform. Uso ResizeObserver e não ouvinte de resize: o navegador avisa
     quando a caixa muda de tamanho, sem custo no meio do caminho. */

  function ajustar() {
    var z = elCaixa.clientWidth / LARGURA;
    if (!z) return;
    elQuadro.style.width  = LARGURA + 'px';
    elQuadro.style.height = (elCaixa.clientHeight / z) + 'px';
    elQuadro.style.transform = 'scale(' + z + ')';
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(ajustar).observe(elCaixa);
  } else {
    window.addEventListener('resize', ajustar);
  }

  /* -------------------------------------------------------- trocar de tipo */

  function pintar(tipo) {
    atual = tipo;

    elQuadro.src = tipo.pagina;
    elQuadro.title = 'Exemplo de ' + tipo.titulo;
    texto('s-url', tipo.url);
    texto('s-titulo', tipo.titulo);
    texto('s-texto', tipo.texto);
    texto('s-exemplo', tipo.exemplo);

    if (elAbrir) elAbrir.href = tipo.pagina;

    /* --- os dados --- */
    var dados = document.getElementById('s-dados');
    dados.innerHTML = '';
    tipo.dados.forEach(function (d, i) {
      var el = document.createElement('div');
      el.className = 'dado';
      el.innerHTML = '<b></b><span></span>';
      el.querySelector('b').textContent = d[0];
      var v = el.querySelector('span');
      v.textContent = d[1];
      /* a última linha é sempre a de preço: destacada, porque é a informação
         que a pessoa está procurando enquanto lê o resto */
      if (i === tipo.dados.length - 1) v.className = 'destaque';
      dados.appendChild(el);
    });

    /* --- a lista de blocos --- */
    elBlocos.innerHTML = '';
    tipo.blocos.forEach(function (b, i) {
      var li = document.createElement('li');

      var bt = document.createElement('button');
      bt.type = 'button';
      bt.className = 'bloco-pg' + (b[3] ? ' ' + b[3] : '');
      bt.dataset.alvo = b[2];
      bt.style.animationDelay = semMovimento ? '0s' : (i * 0.06) + 's';
      bt.innerHTML =
        '<span class="bloco-num"></span>' +
        '<span class="bloco-txt"><span class="bloco-nome"></span>' +
        '<span class="bloco-desc"></span></span>' +
        '<span class="bloco-seta" aria-hidden="true">→</span>';
      bt.querySelector('.bloco-num').textContent = ('0' + (i + 1)).slice(-2);
      bt.querySelector('.bloco-nome').textContent = b[0];
      bt.querySelector('.bloco-desc').textContent = b[1];

      li.appendChild(bt);
      elBlocos.appendChild(li);
    });

    ajustar();
  }

  function texto(id, v) {
    var el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  /* ------------------------------------------------- rolar até um bloco */

  function irAoBloco(id) {
    var win = elQuadro.contentWindow;

    /* Caminho normal: mesma origem, mexo direto no documento da janela. */
    try {
      var alvo = win.document.getElementById(id);
      if (alvo) {
        alvo.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
        piscar(alvo);
        return;
      }
    } catch (e) {
      /* origem diferente ou ainda carregando: cai no plano B */
    }

    /* Plano B: peço para a própria página se destacar. */
    try {
      win.postMessage({ tipo: 'destacar-bloco', bloco: id }, '*');
    } catch (e2) {}
  }

  function piscar(alvo) {
    var antes = alvo.style.boxShadow;
    alvo.style.transition = 'box-shadow 260ms ease';
    alvo.style.boxShadow = 'inset 0 0 0 4px #C7F53F';
    setTimeout(function () { alvo.style.boxShadow = antes; }, 1500);
  }

  if (elBlocos) {
    elBlocos.addEventListener('click', function (e) {
      var bt = e.target.closest('.bloco-pg');
      if (!bt) return;

      var todos = elBlocos.querySelectorAll('.bloco-pg');
      for (var i = 0; i < todos.length; i++) todos[i].classList.remove('is-on');
      bt.classList.add('is-on');

      irAoBloco(bt.dataset.alvo);
    });
  }

  /* Ao trocar de tipo a janela recarrega; o primeiro bloco só fica marcado
     depois que a página de dentro terminou de carregar. */
  elQuadro.addEventListener('load', function () {
    ajustar();
    var primeiro = elBlocos.querySelector('.bloco-pg');
    if (primeiro) primeiro.classList.add('is-on');
  });

  /* -------------------------------------------------------------- botões */

  TIPOS.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tipo' + (i === 0 ? ' is-on' : '');
    b.textContent = t.botao;
    b.addEventListener('click', function () {
      if (atual === t) return;
      var todos = elTipos.querySelectorAll('.tipo');
      for (var j = 0; j < todos.length; j++) todos[j].classList.remove('is-on');
      b.classList.add('is-on');
      pintar(t);
    });
    elTipos.appendChild(b);
  });

  pintar(TIPOS[0]);

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
