/* ==================================================================
   MODELO 04 — URBANA / STREETWEAR
   JavaScript puro, sem bibliotecas. Faz apenas três coisas:
   1) abre e fecha o menu no mobile
   2) rolagem suave ao clicar nas âncoras do menu
   3) efeito leve de aparição das seções ao rolar a página
   (a faixa rolante do topo é 100% CSS, não usa JavaScript)
   ================================================================== */

(function () {
  'use strict';

  /* ---------- 1) MENU MOBILE ---------- */
  var botaoMenu = document.querySelector('.js-menu-botao');
  var menu = document.querySelector('.js-menu');

  function fecharMenu() {
    if (!menu || !botaoMenu) { return; }
    menu.classList.remove('esta-aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var aberto = menu.classList.toggle('esta-aberto');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) { fecharMenu(); }
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape') { fecharMenu(); }
    });
  }

  /* ---------- 2) ROLAGEM SUAVE DAS ÂNCORAS ---------- */
  var cabecalho = document.querySelector('.cabecalho');

  document.addEventListener('click', function (evento) {
    var link = evento.target.closest('a[href^="#"]');
    if (!link) { return; }

    var alvoId = link.getAttribute('href');
    if (!alvoId || alvoId === '#') { return; }

    var alvo = document.querySelector(alvoId);
    if (!alvo) { return; }

    evento.preventDefault();

    var alturaCabecalho = cabecalho ? cabecalho.offsetHeight : 0;
    var posicao = alvo.getBoundingClientRect().top + window.pageYOffset - alturaCabecalho - 6;

    window.scrollTo({ top: posicao < 0 ? 0 : posicao, behavior: 'smooth' });

    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });

  /* ---------- 3) APARIÇÃO AO ROLAR ---------- */
  var alvosAnimados = document.querySelectorAll('.secao, .hero__texto, .hero__midia');

  if (!('IntersectionObserver' in window)) { return; }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('esta-visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 });

  alvosAnimados.forEach(function (elemento) {
    elemento.classList.add('aparece');
    observador.observe(elemento);
  });

  /* ==================================================================
     AVISO DE MODELO DE EXEMPLO

     Só aparece quando o endereço tem ?demo=1 — que é como o site da Jeff
     Company linka para cá na hora de escolher o modelo.

     Existe porque esta página tem nome, preços e depoimentos inventados.
     Sem o aviso, quem chega pelo formulário lê aquilo como se fosse cliente
     de verdade — e aí a gente estaria vendendo com prova falsa.

     Na página entregue ao cliente o endereço nunca tem ?demo=1, então o
     aviso simplesmente não é criado.
     ================================================================== */

  if (location.search.indexOf('demo=1') !== -1) {
    var avisoModelo = document.createElement('aside');
    avisoModelo.className = 'aviso-modelo';
    avisoModelo.innerHTML =
      '<b>Modelo de exemplo</b>' +
      '<span>O nome do negócio, as fotos, os preços e os depoimentos desta ' +
      'página são fictícios. A sua fica com os seus.</span>' +
      '<a href="https://wa.me/5511997097050" target="_blank" rel="noopener">' +
      'Falar com a Jeff Company</a>' +
      '<button type="button" class="aviso-x" aria-label="Fechar aviso">&times;</button>';

    avisoModelo.querySelector('.aviso-x').addEventListener('click', function () {
      avisoModelo.remove();
    });

    document.body.appendChild(avisoModelo);
  }

})();
