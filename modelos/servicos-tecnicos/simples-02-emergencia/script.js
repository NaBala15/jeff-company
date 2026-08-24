/* ==========================================================================

   PRONTO 24H — Simples 02 — emergência
   Modelo de landing page para serviços técnicos e reformas

   Criado por JEFF COMPANY · JeffDev
   Criação de sites, automação de WhatsApp e Google Meu Negócio
   WhatsApp (11) 99709-7050

   Propriedade da Jeff Company. Material de trabalho da agência: pode ser
   personalizado e entregue a quantos clientes forem necessários. O cliente
   contrata o site pronto, não o modelo.

   ========================================================================== */

/* ==========================================================================
   PRONTO 24H — comportamento da página

   Quatro coisas:
     1. menu do celular
     2. cabeçalho ganha sombra mais forte depois que a pessoa rola
     3. blocos aparecem conforme entram na tela
     4. ano no rodapé

   Sem biblioteca nenhuma. Se este arquivo não carregar, o conteúdo continua
   todo visível — só o menu do celular deixa de abrir.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  if (hamburguer && menu) {
    hamburguer.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      hamburguer.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      hamburguer.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });

    menu.addEventListener('click', function (evento) {
      if (evento.target.tagName === 'A') fecharMenu();
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
        fecharMenu();
        hamburguer.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. SOMBRA DO CABEÇALHO

     Um elemento invisível de 1px no topo da página serve de sentinela.
     Quando ele sai da tela, é porque a pessoa rolou. Isso evita ficar
     ouvindo o evento de scroll, que dispara centenas de vezes por segundo
     e trava celular fraco.
     ------------------------------------------------------------------ */

  var cabecalho = document.querySelector('.cabecalho');

  if (cabecalho && 'IntersectionObserver' in window) {
    var sentinela = document.createElement('div');
    sentinela.setAttribute('aria-hidden', 'true');
    sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
    document.body.prepend(sentinela);

    new IntersectionObserver(function (entradas) {
      cabecalho.style.boxShadow = entradas[0].isIntersecting
        ? '0 6px 20px rgba(20, 24, 31, 0.07)'
        : '0 8px 28px rgba(20, 24, 31, 0.14)';
    }).observe(sentinela);
  }

  /* ------------------------------------------------------------------
     3. APARECER AO ROLAR
     ------------------------------------------------------------------ */

  var alvos = document.querySelectorAll(
    '.linha-servico, .passos li, .caixa-destaque, .cartao-horario, ' +
    '.contato-linha, .mapa-espaco, .hero-numeros li'
  );

  if (!semMovimento && 'IntersectionObserver' in window) {

    for (var i = 0; i < alvos.length; i++) {
      alvos[i].classList.add('anima');
      alvos[i].style.transitionDelay = ((i % 4) * 80) + 'ms';
    }

    var observador = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        if (entradas[j].isIntersecting) {
          entradas[j].target.classList.add('visivel');
          observador.unobserve(entradas[j].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    for (var k = 0; k < alvos.length; k++) observador.observe(alvos[k]);

    /* Rede de segurança: nada fica escondido para sempre */
    setTimeout(function () {
      var escondidos = document.querySelectorAll('.anima:not(.visivel)');
      for (var m = 0; m < escondidos.length; m++) {
        escondidos[m].classList.add('visivel');
      }
    }, 4000);
  }

  /* ------------------------------------------------------------------
     4. ANO NO RODAPÉ
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
