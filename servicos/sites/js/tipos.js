/* ==========================================================================
   Os três tipos de página, montando-se na tela

   Em vez de descrever "landing page" com palavras, a maquete mostra as seções
   aparecendo uma a uma, com o nome e a função de cada bloco. Quem nunca
   contratou um site entende a diferença vendo o tamanho e a ordem das peças.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TIPOS = [
    {
      id: 'landing',
      botao: 'Landing page',
      url: 'seunegocio.com.br',
      titulo: 'Landing page',
      texto: 'Uma página só, com um objetivo só: fazer a pessoa te chamar. ' +
             'Tudo nela empurra para o mesmo botão. É o formato que mais converte ' +
             'quando você tem um serviço principal.',
      dados: [
        ['Tamanho', '1 página'],
        ['Melhor para', 'Um serviço principal'],
        ['Prazo', '5 a 7 dias'],
        ['Também existe como', 'assinatura a partir de R$ 50/mês']
      ],
      blocos: [
        ['Topo', 'Sua frase principal e o botão de WhatsApp', 'hero'],
        ['Serviços', 'O que você faz, em 3 a 6 itens'],
        ['Provas', 'Depoimentos e fotos de trabalhos'],
        ['Dúvidas', 'As perguntas que travam a decisão'],
        ['Chamada final', 'Falar no WhatsApp', 'cta']
      ]
    },
    {
      id: 'institucional',
      botao: 'Site institucional',
      url: 'seunegocio.com.br',
      titulo: 'Site institucional',
      texto: 'Mais de uma página, para quem precisa contar história, mostrar ' +
             'equipe e detalhar vários serviços. É o formato de quem vende ' +
             'confiança antes de vender o serviço.',
      dados: [
        ['Tamanho', '4 a 6 seções'],
        ['Melhor para', 'Vários serviços ou equipe'],
        ['Prazo', '2 a 3 semanas'],
        ['Valor', 'sob orçamento']
      ],
      blocos: [
        ['Topo', 'Apresentação do negócio e chamada', 'hero'],
        ['Sobre', 'História, tempo de mercado, o que te diferencia'],
        ['Serviços', 'Cada serviço com explicação própria'],
        ['Equipe', 'Quem atende, com foto e formação'],
        ['Depoimentos', 'O que os clientes dizem'],
        ['Contato', 'Endereço, mapa, horário e formulário', 'cta']
      ]
    },
    {
      id: 'catalogo',
      botao: 'Catálogo com pedido',
      url: 'seunegocio.com.br',
      titulo: 'Catálogo com pedido no WhatsApp',
      texto: 'Seus produtos organizados com foto e preço, e um botão que já ' +
             'monta a mensagem do pedido. Funciona como loja, sem a complicação ' +
             'e o custo de uma loja com carrinho e pagamento online.',
      dados: [
        ['Tamanho', '1 página + catálogo'],
        ['Melhor para', 'Quem vende produto'],
        ['Prazo', '1 a 2 semanas'],
        ['Valor', 'sob orçamento']
      ],
      blocos: [
        ['Topo', 'Foto do produto e chamada de pedido', 'hero'],
        ['Categorias', 'Filtro por tipo de produto'],
        ['Catálogo', 'Cada item com foto, descrição e preço'],
        ['Entrega', 'Área atendida, taxa e prazo'],
        ['Pedir agora', 'Botão que monta a mensagem pronta', 'cta']
      ]
    }
  ];

  var maquete = document.getElementById('s-maquete');
  var elTipos = document.getElementById('s-tipos');
  var timers = [];

  function pintar(tipo) {
    timers.forEach(clearTimeout);
    timers = [];
    maquete.innerHTML = '';

    document.getElementById('s-url').textContent = tipo.url;
    document.getElementById('s-titulo').textContent = tipo.titulo;
    document.getElementById('s-texto').textContent = tipo.texto;

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

    tipo.blocos.forEach(function (b, i) {
      var el = document.createElement('div');
      el.className = 'bloco-pg' + (b[2] ? ' ' + b[2] : '');
      el.style.animationDelay = semMovimento ? '0s' : (i * 0.09) + 's';
      el.innerHTML =
        '<span class="bloco-num"></span>' +
        '<span class="bloco-txt"><span class="bloco-nome"></span>' +
        '<span class="bloco-desc"></span></span>';
      el.querySelector('.bloco-num').textContent = String(i + 1).padStart(2, '0');
      el.querySelector('.bloco-nome').textContent = b[0];
      el.querySelector('.bloco-desc').textContent = b[1];
      maquete.appendChild(el);
    });
  }

  TIPOS.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tipo' + (i === 0 ? ' is-on' : '');
    b.textContent = t.botao;
    b.addEventListener('click', function () {
      elTipos.querySelectorAll('.tipo').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      pintar(t);
    });
    elTipos.appendChild(b);
  });

  pintar(TIPOS[0]);

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
