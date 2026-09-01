/* ==========================================================================

   COZINHA DA VILA — exemplo do tipo CATÁLOGO COM PEDIDO
   Criado por JEFF COMPANY · JeffDev

   O que este arquivo faz, na ordem:
   1. desenha os botões de categoria e os produtos que estão em produtos.js;
   2. guarda o que a pessoa escolheu (no aparelho dela, em localStorage);
   3. soma o pedido;
   4. monta a mensagem e abre o WhatsApp já preenchido.

   Nada é enviado para servidor nenhum. Se o JavaScript não rodar, o cardápio
   não aparece — por isso o telefone e o WhatsApp também estão no HTML fixo.

   ========================================================================== */

(function () {
  'use strict';

  var CHAVE = 'cozinha-da-vila-pedido';
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LOJA = window.LOJA || {};
  var PRODUTOS = (window.PRODUTOS || []).filter(function (p) { return p.ativo !== false; });
  var CATEGORIAS = window.CATEGORIAS || [];

  var elCategorias = document.getElementById('categorias');
  var elProdutos   = document.getElementById('produtos');
  var elVazio      = document.getElementById('vazio');
  var elItens      = document.getElementById('itens');
  var elCarrVazio  = document.getElementById('carrinho-vazio');
  var elTotais     = document.getElementById('totais');
  var elBarra      = document.getElementById('barra');
  var elAviso      = document.getElementById('aviso');

  var pedido = carregar();
  var categoriaAtual = 'todos';

  /* ------------------------------------------------------------ dinheiro */

  function reais(v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  }

  /* -------------------------------------------------------------- estado */

  function carregar() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      return bruto ? JSON.parse(bruto) : {};
    } catch (e) {
      return {};   /* navegador com armazenamento bloqueado: segue sem memória */
    }
  }

  function guardar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch (e) {}
  }

  function produtoPorId(id) {
    for (var i = 0; i < PRODUTOS.length; i++) if (PRODUTOS[i].id === id) return PRODUTOS[i];
    return null;
  }

  /* ---------------------------------------------------------- categorias */

  function desenharCategorias() {
    if (!elCategorias) return;
    elCategorias.innerHTML = '';

    for (var i = 0; i < CATEGORIAS.length; i++) {
      var c = CATEGORIAS[i];

      /* categoria sem nenhum produto ativo não vira botão */
      if (c.id !== 'todos' && !PRODUTOS.some(function (p) { return p.categoria === c.id; })) continue;

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat' + (c.id === categoriaAtual ? ' ativa' : '');
      b.textContent = c.nome;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', c.id === categoriaAtual ? 'true' : 'false');
      b.dataset.cat = c.id;
      elCategorias.appendChild(b);
    }
  }

  if (elCategorias) {
    elCategorias.addEventListener('click', function (e) {
      var b = e.target.closest('.cat');
      if (!b) return;
      categoriaAtual = b.dataset.cat;
      desenharCategorias();
      desenharProdutos();
      document.getElementById('bloco-cardapio')
        .scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ------------------------------------------------------------ produtos */

  function desenharProdutos() {
    if (!elProdutos) return;
    elProdutos.innerHTML = '';

    var lista = PRODUTOS.filter(function (p) {
      return categoriaAtual === 'todos' || p.categoria === categoriaAtual;
    });

    if (elVazio) elVazio.hidden = lista.length > 0;

    for (var i = 0; i < lista.length; i++) {
      elProdutos.appendChild(cartaoProduto(lista[i]));
    }
    atualizarBotoes();
  }

  function cartaoProduto(p) {
    var art = document.createElement('article');
    art.className = 'produto';

    /* A foto vem de produtos.js. Se o item ainda não tiver arquivo de foto,
       fica o retângulo com o rótulo — a página não quebra por causa disso.
       width e height vão declarados: sem eles o navegador não reserva o
       espaço e a página inteira pula quando cada foto chega. */
    var foto = document.createElement('div');
    foto.className = 'foto';

    if (p.foto) {
      var im = document.createElement('img');
      im.src = p.foto;
      im.alt = p.alt || p.nome;
      im.width = 640;
      im.height = 480;
      im.loading = 'lazy';
      im.decoding = 'async';
      foto.appendChild(im);
    } else {
      foto.setAttribute('role', 'img');
      foto.setAttribute('aria-label', p.alt || p.nome);
      foto.innerHTML = '<span class="foto__rotulo">FOTO — ' + p.nome + '</span>';
    }
    art.appendChild(foto);

    if (p.selo) {
      var selo = document.createElement('span');
      selo.className = 'selo';
      selo.textContent = p.selo;
      art.appendChild(selo);
    }

    var corpo = document.createElement('div');
    corpo.className = 'produto-corpo';
    corpo.innerHTML =
      '<h3>' + p.nome + '</h3>' +
      '<p>' + p.descricao + '</p>' +
      '<p class="preco">' + reais(p.preco) + '</p>';

    var acao = document.createElement('div');
    acao.className = 'produto-acao';
    acao.dataset.id = p.id;
    acao.innerHTML =
      '<button type="button" class="add" data-acao="add">Adicionar</button>' +
      '<div class="contador" hidden>' +
        '<button type="button" data-acao="menos" aria-label="Tirar um ' + p.nome + '">−</button>' +
        '<b class="qtd">0</b>' +
        '<button type="button" data-acao="mais" aria-label="Somar um ' + p.nome + '">+</button>' +
      '</div>';

    corpo.appendChild(acao);
    art.appendChild(corpo);
    return art;
  }

  /* Um ouvinte só, na grade inteira, em vez de um por botão. Em celular
     fraco isso pesa menos e continua valendo para itens desenhados depois. */
  if (elProdutos) {
    elProdutos.addEventListener('click', function (e) {
      var b = e.target.closest('[data-acao]');
      if (!b) return;
      var id = b.closest('.produto-acao').dataset.id;

      if (b.dataset.acao === 'add' || b.dataset.acao === 'mais') pedido[id] = (pedido[id] || 0) + 1;
      if (b.dataset.acao === 'menos') {
        pedido[id] = (pedido[id] || 0) - 1;
        if (pedido[id] <= 0) delete pedido[id];
      }
      guardar();
      atualizarBotoes();
      desenharCarrinho();
    });
  }

  function atualizarBotoes() {
    var acoes = document.querySelectorAll('.produto-acao');
    for (var i = 0; i < acoes.length; i++) {
      var qtd = pedido[acoes[i].dataset.id] || 0;
      acoes[i].querySelector('.add').hidden = qtd > 0;
      acoes[i].querySelector('.contador').hidden = qtd === 0;
      acoes[i].querySelector('.qtd').textContent = qtd;
    }
  }

  /* ------------------------------------------------------------ carrinho */

  function linhas() {
    var out = [];
    for (var id in pedido) {
      if (!Object.prototype.hasOwnProperty.call(pedido, id)) continue;
      var p = produtoPorId(id);
      if (!p) continue;                       /* item saiu do cardápio */
      out.push({ p: p, qtd: pedido[id], subtotal: p.preco * pedido[id] });
    }
    return out;
  }

  function desenharCarrinho() {
    var ls = linhas();
    var itens = 0, soma = 0;

    for (var i = 0; i < ls.length; i++) { itens += ls[i].qtd; soma += ls[i].subtotal; }

    if (elItens) {
      elItens.innerHTML = '';
      for (var j = 0; j < ls.length; j++) {
        var li = document.createElement('li');
        li.innerHTML =
          '<span class="n">' + ls[j].qtd + '×</span>' +
          '<span class="d">' + ls[j].p.nome + '</span>' +
          '<span class="v">' + reais(ls[j].subtotal) + '</span>' +
          '<button type="button" class="tirar" data-id="' + ls[j].p.id + '" ' +
          'aria-label="Tirar ' + ls[j].p.nome + ' do pedido">×</button>';
        elItens.appendChild(li);
      }
    }

    var taxa = ls.length ? (LOJA.taxaEntrega || 0) : 0;

    if (elCarrVazio) elCarrVazio.hidden = ls.length > 0;
    if (elTotais)    elTotais.hidden    = ls.length === 0;

    texto('t-itens',  reais(soma));
    texto('t-entrega', reais(taxa));
    texto('t-total',  reais(soma + taxa));

    if (elBarra) {
      elBarra.hidden = ls.length === 0;
      texto('b-qtd', itens + (itens === 1 ? ' item' : ' itens'));
      texto('b-total', reais(soma + taxa));
    }
  }

  function texto(id, v) {
    var el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  if (elItens) {
    elItens.addEventListener('click', function (e) {
      var b = e.target.closest('.tirar');
      if (!b) return;
      delete pedido[b.dataset.id];
      guardar();
      atualizarBotoes();
      desenharCarrinho();
    });
  }

  /* ------------------------------------------------------------ WhatsApp */

  var enviar = document.getElementById('enviar');

  if (enviar) {
    enviar.addEventListener('click', function () {
      var ls = linhas();

      if (!ls.length) {
        aviso('Escolha pelo menos um item do cardápio antes de enviar.');
        return;
      }

      var soma = ls.reduce(function (t, l) { return t + l.subtotal; }, 0);

      if (LOJA.pedidoMinimo && soma < LOJA.pedidoMinimo) {
        aviso('O pedido mínimo é ' + reais(LOJA.pedidoMinimo) + ' sem a entrega. Faltam ' +
              reais(LOJA.pedidoMinimo - soma) + '.');
        return;
      }

      var nome = valor('c-nome');
      var endereco = valor('c-endereco');

      if (!nome || !endereco) {
        aviso('Escreva seu nome e o endereço com número para a gente conseguir entregar.');
        (nome ? document.getElementById('c-endereco') : document.getElementById('c-nome')).focus();
        return;
      }

      var taxa = LOJA.taxaEntrega || 0;
      var linhasTxt = ls.map(function (l) {
        return '• ' + l.qtd + '× ' + l.p.nome + ' — ' + reais(l.subtotal);
      }).join('\n');

      var msg =
        'Olá! Quero fazer um pedido pelo site.\n\n' +
        linhasTxt + '\n\n' +
        'Itens: ' + reais(soma) + '\n' +
        'Entrega: ' + reais(taxa) + '\n' +
        'Total: ' + reais(soma + taxa) + '\n\n' +
        'Nome: ' + nome + '\n' +
        'Endereço: ' + endereco + '\n' +
        'Pagamento: ' + valor('c-pagamento');

      var obs = valor('c-obs');
      if (obs) msg += '\nObservação: ' + obs;

      window.open('https://wa.me/' + LOJA.whatsapp + '?text=' + encodeURIComponent(msg), '_blank');
      aviso('Pedido aberto no WhatsApp. É só tocar em enviar por lá.');
    });
  }

  function valor(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function aviso(t) {
    if (elAviso) elAviso.textContent = t;
  }

  /* ---------------------------------------------------------------- menu */

  var hamburguer = document.getElementById('hamburguer');
  var menu = document.getElementById('menu');

  if (hamburguer && menu) {
    hamburguer.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      hamburguer.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('aberto');
        hamburguer.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------ destaque vindo de fora

     A seção "Que tipo de página o seu negócio precisa", do site da agência,
     abre esta página numa janela e pede para destacar um bloco. Só aceita
     mensagem da mesma origem. */

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    if (!e.data || e.data.tipo !== 'destacar-bloco') return;

    var alvo = document.getElementById(e.data.bloco);
    if (!alvo) return;

    alvo.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });
    alvo.style.transition = 'box-shadow 300ms ease';
    alvo.style.boxShadow = 'inset 0 0 0 3px var(--tomate)';
    setTimeout(function () { alvo.style.boxShadow = ''; }, 1600);
  });

  /* ------------------------------------------------- modo passo 3 do pedido

     Com ?pedido=1 esta página é o passo 3 de quem pediu catálogo com
     carrinho no formulário: aparece a barra com o caminho de volta, e o
     resto do CSS cuida de não empilhar dois cabeçalhos grudentos. */

  if (location.search.indexOf('pedido=1') !== -1) {
    var barra = document.getElementById('passo-barra');
    if (barra) {
      barra.hidden = false;
      document.body.classList.add('com-barra');
    }
  }

  /* ----------------------------------------------------------- arranque */

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  desenharCategorias();
  desenharProdutos();
  desenharCarrinho();

})();
