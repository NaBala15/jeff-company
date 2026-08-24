/* ==========================================================================

   REFORMA CERTA — Simples 01 — industrial
   Modelo de landing page para serviços técnicos e reformas

   Criado por JEFF COMPANY · JeffDev
   Criação de sites, automação de WhatsApp e Google Meu Negócio
   WhatsApp (11) 99709-7050

   Propriedade da Jeff Company. Material de trabalho da agência: pode ser
   personalizado e entregue a quantos clientes forem necessários. O cliente
   contrata o site pronto, não o modelo.

   ========================================================================== */

/* ==========================================================================
   REFORMA CERTA — comportamento da página

   São três coisas só:
     1. abrir e fechar o menu no celular
     2. revelar os blocos conforme a pessoa rola a página
     3. escrever o ano no rodapé

   Nada aqui depende de biblioteca. A página funciona mesmo se este arquivo
   não carregar — o menu fica fechado, mas todo o conteúdo continua visível.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. MENU DO CELULAR
     ------------------------------------------------------------------ */

  var hamburguer = document.getElementById('hamburguer');
  var menu = document.getElementById('menu');

  function fecharMenu() {
    menu.classList.remove('aberto');
    hamburguer.setAttribute('aria-expanded', 'false');
    hamburguer.setAttribute('aria-label', 'Abrir menu');
  }

  function alternarMenu() {
    var aberto = menu.classList.toggle('aberto');
    hamburguer.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }

  if (hamburguer && menu) {
    hamburguer.addEventListener('click', alternarMenu);

    /* clicou num link do menu: rola até a seção e fecha o menu */
    menu.addEventListener('click', function (evento) {
      if (evento.target.tagName === 'A') fecharMenu();
    });

    /* Esc fecha o menu e devolve o foco para o botão, senão quem navega
       pelo teclado fica preso num menu invisível */
    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
        fecharMenu();
        hamburguer.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. REVELAR OS BLOCOS AO ROLAR

     Usamos IntersectionObserver, e não um ouvinte de scroll: o navegador
     avisa quando o bloco entra na tela em vez de a gente perguntar a cada
     pixel rolado. Em celular fraco a diferença é enorme.
     ------------------------------------------------------------------ */

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var alvos = document.querySelectorAll(
    '.card-servico, .bloco-info, .sobre-texto, .sobre-foto, ' +
    '.hero-texto, .hero-foto, .contato-dados, .mapa-espaco'
  );

  if (!semMovimento && 'IntersectionObserver' in window) {

    for (var i = 0; i < alvos.length; i++) {
      alvos[i].classList.add('anima');
      /* atraso pequeno e escalonado dentro de cada grupo: dá a sensação de
         cascata sem atrasar de verdade a leitura */
      alvos[i].style.transitionDelay = ((i % 3) * 90) + 'ms';
    }

    var observador = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        if (entradas[j].isIntersecting) {
          entradas[j].target.classList.add('visivel');
          observador.unobserve(entradas[j].target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    for (var k = 0; k < alvos.length; k++) observador.observe(alvos[k]);

    /* Rede de segurança: se por algum motivo o observador não disparar
       (aba em segundo plano, navegador antigo), depois de 4 segundos tudo
       aparece assim mesmo. Página em branco nunca. */
    setTimeout(function () {
      var escondidos = document.querySelectorAll('.anima:not(.visivel)');
      for (var m = 0; m < escondidos.length; m++) {
        escondidos[m].classList.add('visivel');
      }
    }, 4000);
  }

  /* ------------------------------------------------------------------
     3. ANO NO RODAPÉ
     ------------------------------------------------------------------ */

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

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
    var aviso = document.createElement('aside');
    aviso.className = 'aviso-modelo';
    aviso.innerHTML =
      '<b>Modelo de exemplo</b>' +
      '<span>O nome do negócio, as fotos, os preços e os depoimentos desta ' +
      'página são fictícios. A sua fica com os seus.</span>' +
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
