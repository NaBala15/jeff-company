/* ==========================================================================

   MARINO CONTABILIDADE — institucional · Premium
   Modelo da JEFF COMPANY · JeffDev

   Três coisas: menu do celular, blocos que aparecem ao rolar e o ano do
   rodapé. Sem biblioteca. Se este arquivo não carregar, o conteúdo continua
   todo visível — só o menu do celular deixa de abrir.

   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- menu */
  var hamburguer = document.getElementById('hamburguer');
  var menu = document.getElementById('menu');

  function fecharMenu() {
    menu.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
    hamburguer.setAttribute('aria-label', 'Abrir menu');
  }

  if (hamburguer && menu) {
    hamburguer.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      hamburguer.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') fecharMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) {
        fecharMenu();
        hamburguer.focus();
      }
    });
  }

  /* ------------------------------------------------------ aparecer ao rolar

     IntersectionObserver e não ouvinte de scroll: o navegador avisa quando o
     bloco entra na tela, em vez de o código perguntar a cada pixel. Em
     celular fraco a diferença é grande. */

  var alvos = document.querySelectorAll('.cartao, .pessoa, .depo, .numeros li, .marcos li');

  if (!semMovimento && 'IntersectionObserver' in window) {
    for (var i = 0; i < alvos.length; i++) {
      alvos[i].classList.add('anima');
      alvos[i].style.transitionDelay = ((i % 3) * 90) + 'ms';
    }

    var obs = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        if (entradas[j].isIntersecting) {
          entradas[j].target.classList.add('visivel');
          obs.unobserve(entradas[j].target);
        }
      }
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

    for (var k = 0; k < alvos.length; k++) obs.observe(alvos[k]);

    /* Rede de segurança: nada fica escondido para sempre */
    setTimeout(function () {
      var escondidos = document.querySelectorAll('.anima:not(.visivel)');
      for (var m = 0; m < escondidos.length; m++) escondidos[m].classList.add('visivel');
    }, 4000);
  }

  /* ------------------------------------------------- números que sobem

     Só no Premium. Sobem uma vez, quando entram na tela, e param. Se o
     navegador não tiver IntersectionObserver — ou a pessoa pedir menos
     movimento — o número final já está escrito no HTML e nada se perde. */

  var numeros = document.querySelectorAll('[data-num]');

  if (!semMovimento && numeros.length && 'IntersectionObserver' in window) {
    var obsNum = new IntersectionObserver(function (entradas) {
      for (var n = 0; n < entradas.length; n++) {
        if (!entradas[n].isIntersecting) continue;
        subir(entradas[n].target);
        obsNum.unobserve(entradas[n].target);
      }
    }, { threshold: .5 });

    for (var q = 0; q < numeros.length; q++) obsNum.observe(numeros[q]);
  }

  function subir(el) {
    var fim = Number(el.dataset.num) || 0;
    var suf = el.dataset.suf || '';
    var passos = 34;
    var i = 0;

    var t = setInterval(function () {
      i++;
      /* desacelera no fim: fica menos mecânico que somar de tanto em tanto */
      var f = 1 - Math.pow(1 - i / passos, 3);
      el.textContent = Math.round(fim * f) + suf;
      if (i >= passos) { el.textContent = fim + suf; clearInterval(t); }
    }, 26);
  }

  /* ----------------------------------------------------------------- ano */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ------------------------------------------------ destaque vindo de fora

     A seção "Que tipo de página o seu negócio precisa", do site da agência,
     abre esta página numa janela e pede para destacar um bloco. O pedido
     chega por postMessage; a resposta é rolar até lá e piscar a borda.

     Só aceita mensagem da mesma origem — página aberta dentro de janela de
     terceiro não manda esta página fazer nada. */

  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    if (!e.data || e.data.tipo !== 'destacar-bloco') return;

    var alvo = document.getElementById(e.data.bloco);
    if (!alvo) return;

    alvo.scrollIntoView({ behavior: semMovimento ? 'auto' : 'smooth', block: 'start' });

    alvo.style.transition = 'box-shadow 300ms ease';
    alvo.style.boxShadow = 'inset 0 0 0 3px var(--ambar)';
    setTimeout(function () { alvo.style.boxShadow = ''; }, 1600);
  });

  /* ==================================================================
     AVISO DE MODELO DE EXEMPLO

     Só aparece quando o endereço tem ?demo=1 — que é como o site da Jeff
     Company linka para cá na hora de escolher o modelo.

     Existe porque esta página tem nome, sócios, preços e depoimentos
     inventados. Sem o aviso, quem chega pelo formulário lê aquilo como se
     fosse cliente de verdade — e aí a gente estaria vendendo com prova
     falsa.

     Na página entregue ao cliente o endereço nunca tem ?demo=1, então o
     aviso simplesmente não é criado.
     ================================================================== */

  if (location.search.indexOf('demo=1') !== -1) {
    var aviso = document.createElement('aside');
    aviso.className = 'aviso-modelo';
    aviso.innerHTML =
      '<b>Modelo de exemplo</b>' +
      '<span>O nome do escrit\u00f3rio, os s\u00f3cios, as fotos, os pre\u00e7os e os ' +
      'depoimentos desta p\u00e1gina s\u00e3o fict\u00edcios. O seu site fica com os seus.</span>' +
      '<a href="https://wa.me/5511997097050" target="_blank" rel="noopener">' +
      'Falar com a Jeff Company</a>' +
      '<button type="button" class="aviso-x" aria-label="Fechar aviso">&times;</button>';

    aviso.querySelector('.aviso-x').addEventListener('click', function () {
      aviso.remove();
    });

    document.body.appendChild(aviso);
  }

})();
