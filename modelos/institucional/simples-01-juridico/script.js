/* ==========================================================================

   BERTOLDI & SALLES ADVOCACIA — institucional · Simples 1
   Modelo da JEFF COMPANY · JeffDev

   Três coisas: menu do celular, blocos que aparecem ao rolar e o ano do
   rodapé. Mais a tarja de demonstração, que só existe com ?demo=1.

   Sem biblioteca. Se este arquivo não carregar, o conteúdo continua todo
   visível — só o menu do celular deixa de abrir.

   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      if (e.target.tagName !== 'A') return;
      menu.classList.remove('aberto');
      hamburguer.setAttribute('aria-expanded', 'false');
      hamburguer.setAttribute('aria-label', 'Abrir menu');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.classList.contains('aberto')) return;
      menu.classList.remove('aberto');
      hamburguer.setAttribute('aria-expanded', 'false');
      hamburguer.focus();
    });
  }

  /* ------------------------------------------------------ aparecer ao rolar

     IntersectionObserver e não ouvinte de scroll: o navegador avisa quando o
     bloco entra na tela, em vez de o código perguntar a cada pixel. Em
     celular fraco a diferença é grande. */

  var alvos = document.querySelectorAll('.cartao, .passos li, .pessoa');

  if (!semMovimento && 'IntersectionObserver' in window) {
    for (var i = 0; i < alvos.length; i++) {
      alvos[i].classList.add('anima');
      alvos[i].style.transitionDelay = ((i % 3) * 85) + 'ms';
    }

    var obs = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        if (!entradas[j].isIntersecting) continue;
        entradas[j].target.classList.add('visivel');
        obs.unobserve(entradas[j].target);
      }
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

    for (var k = 0; k < alvos.length; k++) obs.observe(alvos[k]);

    /* Rede de segurança: nada fica escondido para sempre */
    setTimeout(function () {
      var escondidos = document.querySelectorAll('.anima:not(.visivel)');
      for (var m = 0; m < escondidos.length; m++) escondidos[m].classList.add('visivel');
    }, 4000);
  }

  /* ----------------------------------------------------------------- ano */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ==================================================================
     AVISO DE MODELO DE EXEMPLO

     Só aparece quando o endereço tem ?demo=1 — que é como o site da Jeff
     Company linka para cá na hora de escolher o modelo.

     Existe porque esta página tem nome, sócios e número de OAB inventados.
     Sem o aviso, quem chega pelo formulário lê aquilo como se fosse
     escritório de verdade.

     Na página entregue ao cliente o endereço nunca tem ?demo=1, então o
     aviso simplesmente não é criado.
     ================================================================== */

  if (location.search.indexOf('demo=1') !== -1) {
    var aviso = document.createElement('aside');
    aviso.className = 'aviso-modelo';
    aviso.innerHTML =
      '<b>Modelo de exemplo</b>' +
      '<span>O nome do escritório, os advogados, os números de OAB e as ' +
      'fotos desta página são fictícios. O seu site fica com os seus.</span>' +
      '<a href="https://wa.me/5511997097050" target="_blank" rel="noopener">' +
      'Falar com a Jeff Company</a>' +
      '<button type="button" class="aviso-x" aria-label="Fechar aviso">&times;</button>';

    /* fechável porque é um quadro fixo: parado num canto, mais cedo ou mais
       tarde ele cobre um botão da página que a pessoa quis clicar */
    aviso.querySelector('.aviso-x').addEventListener('click', function () {
      aviso.remove();
    });

    document.body.appendChild(aviso);
  }

})();
