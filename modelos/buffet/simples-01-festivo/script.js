/* ==================================================================
   SIMPLES 01 — FESTIVO / GIRASSOL  |  Buffet Girassol
   JavaScript puro, sem bibliotecas:
   1) menu hambúrguer no mobile
   2) rolagem suave das âncoras, descontando a altura do cabeçalho
   3) aparição leve das seções ao rolar (respeita prefers-reduced-motion)
   ================================================================== */

(function () {
  'use strict';

  var menosMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) MENU MOBILE ---------- */
  var botao = document.querySelector('.js-menu-botao');
  var menu  = document.querySelector('.js-menu');

  function fecharMenu() {
    if (!menu || !botao) { return; }
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { fecharMenu(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fecharMenu(); }
    });
  }

  /* ---------- 2) ROLAGEM SUAVE DAS ÂNCORAS ---------- */
  var topo = document.querySelector('.topo');

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) { return; }

    var id = link.getAttribute('href');
    if (!id || id === '#') { return; }

    var alvo = document.querySelector(id);
    if (!alvo) { return; }

    e.preventDefault();

    var altura = topo ? topo.offsetHeight : 0;
    var y = alvo.getBoundingClientRect().top + window.pageYOffset - altura - 10;

    window.scrollTo({
      top: y < 0 ? 0 : y,
      behavior: menosMovimento ? 'auto' : 'smooth'
    });

    /* mantém o teclado acompanhando a navegação */
    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });

  /* ---------- 3) APARIÇÃO AO ROLAR ---------- */
  var alvos = document.querySelectorAll('.secao, .hero__conteudo, .foto--hero');

  if (menosMovimento || !('IntersectionObserver' in window)) { return; }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  alvos.forEach(function (el) {
    el.classList.add('aparece');
    observador.observe(el);
  });

  /* Rede de segurança: as seções começam invisíveis e só aparecem quando o
     IntersectionObserver avisa. Se ele não disparar (aba em segundo plano,
     navegador antigo, página restaurada do histórico), o visitante veria a
     página em branco. Depois de 4 segundos, mostramos tudo na marra. */
  window.setTimeout(function () {
    document.querySelectorAll('.aparece').forEach(function (el) {
      el.classList.add('visivel');
    });
  }, 4000);

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
