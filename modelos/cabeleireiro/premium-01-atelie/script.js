/* ==================================================================
   PREMIUM 01 — ATELIÊ  |  Casa Anelis
   JavaScript puro, sem bibliotecas nem dependências.

   1) menu hambúrguer no mobile
   2) cabeçalho que muda de aparência ao rolar
   3) rolagem suave das âncoras
   4) aparição das seções ao rolar (IntersectionObserver)
   5) contador animado dos números, dispara ao entrar na tela
   6) galeria com lightbox (mouse e teclado)
   7) carrossel de depoimentos (setas, pontos, teclado e arraste)
   8) FAQ em accordion acessível

   Tudo respeita prefers-reduced-motion: com a preferência ligada, os
   efeitos são desligados mas as funções continuam funcionando.
   ================================================================== */

(function () {
  'use strict';

  var menosMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     1) MENU MOBILE
     ================================================================ */
  var botaoMenu = document.querySelector('.js-menu-botao');
  var menu = document.querySelector('.js-menu');

  function fecharMenu() {
    if (!menu || !botaoMenu) { return; }
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { fecharMenu(); }
    });
  }

  /* ================================================================
     2) CABEÇALHO QUE MUDA AO ROLAR
     Usa requestAnimationFrame para não rodar a cada pixel de rolagem.
     ================================================================ */
  var cabecalho = document.querySelector('.js-cabecalho');
  var esperando = false;

  function atualizarCabecalho() {
    if (!cabecalho) { return; }
    if (window.pageYOffset > 40) {
      cabecalho.classList.add('encolhido');
    } else {
      cabecalho.classList.remove('encolhido');
    }
    esperando = false;
  }

  if (cabecalho) {
    window.addEventListener('scroll', function () {
      if (esperando) { return; }
      esperando = true;
      window.requestAnimationFrame(atualizarCabecalho);
    }, { passive: true });
    atualizarCabecalho();
  }

  /* ================================================================
     3) ROLAGEM SUAVE DAS ÂNCORAS
     ================================================================ */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) { return; }

    var id = link.getAttribute('href');
    if (!id || id === '#') { return; }

    var alvo = document.querySelector(id);
    if (!alvo) { return; }

    e.preventDefault();

    var altura = cabecalho ? cabecalho.offsetHeight : 0;
    var y = alvo.getBoundingClientRect().top + window.pageYOffset - altura - 12;

    window.scrollTo({
      top: y < 0 ? 0 : y,
      behavior: menosMovimento ? 'auto' : 'smooth'
    });

    alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });

  /* ================================================================
     4) APARIÇÃO AO ROLAR
     ================================================================ */
  var temObservador = 'IntersectionObserver' in window;

  if (temObservador && !menosMovimento) {
    var alvos = document.querySelectorAll(
      '.secao, .hero__texto, .hero__midia, .faixa-cta__interno, .protocolo, .galeria > li'
    );

    var observadorEntrada = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observadorEntrada.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.08 });

    alvos.forEach(function (el, i) {
      el.classList.add('aparece');
      /* escada leve: cada cartão entra um pouco depois do anterior */
      if (el.classList.contains('protocolo') || el.parentElement.classList.contains('galeria')) {
        el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      }
      observadorEntrada.observe(el);
    });
  }

  /* ================================================================
     5) CONTADOR ANIMADO DOS NÚMEROS
     ================================================================ */
  var contadores = document.querySelectorAll('.js-contar');

  function formatar(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /* O número final já está escrito no HTML. Esta função só faz a contagem
     subir de 0 até ele — se ela nunca rodar, o valor certo continua na tela. */
  function animarContador(caixa) {
    if (caixa.dataset.animado === 'sim') { return; }
    caixa.dataset.animado = 'sim';

    var valor = caixa.querySelector('.numero__valor');
    var alvo = parseInt(caixa.dataset.alvo, 10) || 0;
    var sufixo = caixa.dataset.sufixo || '';

    if (menosMovimento) {
      valor.textContent = formatar(alvo) + sufixo;
      return;
    }

    var duracao = 1500;
    var inicio = null;

    function passo(agora) {
      if (inicio === null) { inicio = agora; }
      var progresso = Math.min((agora - inicio) / duracao, 1);
      /* desaceleração no fim, para o número "assentar" */
      var suave = 1 - Math.pow(1 - progresso, 3);
      valor.textContent = formatar(Math.round(alvo * suave)) + sufixo;
      if (progresso < 1) { window.requestAnimationFrame(passo); }
    }

    window.requestAnimationFrame(passo);
  }

  if (contadores.length) {
    if (temObservador) {
      var observadorNumero = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observadorNumero.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.5 });

      contadores.forEach(function (c) { observadorNumero.observe(c); });
    } else {
      /* navegador antigo: mostra o número final direto */
      contadores.forEach(animarContador);
    }
  }

  /* ================================================================
     6) GALERIA COM LIGHTBOX
     ================================================================ */
  var lightbox = document.querySelector('.js-lightbox');
  var itensGaleria = Array.prototype.slice.call(document.querySelectorAll('.js-abrir'));

  if (lightbox && itensGaleria.length) {
    var lbRotulo  = lightbox.querySelector('.js-lb-rotulo');
    var lbLegenda = lightbox.querySelector('.js-lb-legenda');
    var lbFechar  = lightbox.querySelector('.js-fechar');
    var lbAnterior = lightbox.querySelector('.js-lb-anterior');
    var lbProximo  = lightbox.querySelector('.js-lb-proximo');
    var atual = 0;
    var quemAbriu = null;

    function mostrar(indice) {
      atual = (indice + itensGaleria.length) % itensGaleria.length;
      var item = itensGaleria[atual];
      /* Antes o lightbox mostrava o TEXTO do rótulo, porque não havia foto.
         Agora há: ele copia a imagem do item clicado. */
      var imgOriginal = item.querySelector('img');
      var lbImg = lightbox.querySelector('.js-lb-img');
      if (lbImg && imgOriginal) {
        lbImg.src = imgOriginal.getAttribute('src');
        lbImg.alt = imgOriginal.getAttribute('alt') || '';
        lbImg.hidden = false;
      }
      /* lbRotulo só existia enquanto o lightbox mostrava texto no lugar da
         foto. Agora pode não existir — e sem esta guarda a função quebrava
         aqui e a janela nunca chegava a abrir. */
      if (lbRotulo) {
        var rotuloOriginal = item.querySelector('.foto__rotulo');
        lbRotulo.textContent = rotuloOriginal ? rotuloOriginal.textContent : '';
      }
      if (lbLegenda) lbLegenda.textContent = item.dataset.legenda || '';
    }

    function abrir(indice) {
      quemAbriu = document.activeElement;
      mostrar(indice);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lbFechar.focus();
    }

    function fechar() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (quemAbriu && quemAbriu.focus) { quemAbriu.focus(); }
    }

    itensGaleria.forEach(function (item, i) {
      item.addEventListener('click', function () { abrir(i); });
    });

    lbFechar.addEventListener('click', fechar);
    lbAnterior.addEventListener('click', function () { mostrar(atual - 1); });
    lbProximo.addEventListener('click', function () { mostrar(atual + 1); });

    /* clicar no fundo escuro também fecha */
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { fechar(); }
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) { return; }
      if (e.key === 'Escape')     { fechar(); }
      if (e.key === 'ArrowLeft')  { mostrar(atual - 1); }
      if (e.key === 'ArrowRight') { mostrar(atual + 1); }

      /* prende o Tab dentro do lightbox enquanto ele estiver aberto */
      if (e.key === 'Tab') {
        var focaveis = lightbox.querySelectorAll('button');
        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault(); ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault(); primeiro.focus();
        }
      }
    });
  }

  /* ================================================================
     7) CARROSSEL DE DEPOIMENTOS
     ================================================================ */
  var carrossel = document.querySelector('.js-carrossel');

  if (carrossel) {
    var trilho = carrossel.querySelector('.js-trilho');
    var slides = Array.prototype.slice.call(trilho.children);
    var caixaPontos = carrossel.querySelector('.js-pontos');
    var btAnterior = carrossel.querySelector('.js-anterior');
    var btProximo  = carrossel.querySelector('.js-proximo');
    var indice = 0;

    /* os pontos são criados aqui para o HTML não precisar saber
       quantos depoimentos existem — some ou adicione <li> à vontade */
    slides.forEach(function (slide, i) {
      var ponto = document.createElement('button');
      ponto.type = 'button';
      ponto.className = 'carrossel__ponto';
      ponto.setAttribute('role', 'tab');
      ponto.setAttribute('aria-label', 'Depoimento ' + (i + 1) + ' de ' + slides.length);
      ponto.addEventListener('click', function () { irPara(i); });
      caixaPontos.appendChild(ponto);
    });

    var pontos = Array.prototype.slice.call(caixaPontos.children);

    function irPara(i) {
      indice = (i + slides.length) % slides.length;
      trilho.style.transform = 'translateX(-' + (indice * 100) + '%)';

      pontos.forEach(function (p, k) {
        p.setAttribute('aria-selected', k === indice ? 'true' : 'false');
      });
      slides.forEach(function (s, k) {
        /* o slide fora de vista sai da ordem de tabulação */
        s.setAttribute('aria-hidden', k === indice ? 'false' : 'true');
      });
    }

    btAnterior.addEventListener('click', function () { irPara(indice - 1); });
    btProximo.addEventListener('click', function () { irPara(indice + 1); });

    /* setas do teclado quando o foco está dentro do carrossel */
    carrossel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); irPara(indice - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(indice + 1); }
    });

    /* arraste com o dedo no celular */
    var xInicial = null;

    trilho.addEventListener('touchstart', function (e) {
      xInicial = e.touches[0].clientX;
    }, { passive: true });

    trilho.addEventListener('touchend', function (e) {
      if (xInicial === null) { return; }
      var distancia = e.changedTouches[0].clientX - xInicial;
      if (Math.abs(distancia) > 50) {
        irPara(distancia < 0 ? indice + 1 : indice - 1);
      }
      xInicial = null;
    });

    irPara(0);
  }

  /* ================================================================
     8) FAQ EM ACCORDION
     Um aberto por vez. Funciona com clique, Enter e Espaço porque
     usa <button> de verdade — não precisa de listener de teclado.
     ================================================================ */
  var perguntas = document.querySelectorAll('.js-faq-botao');

  perguntas.forEach(function (botao) {
    botao.addEventListener('click', function () {
      var aberta = botao.getAttribute('aria-expanded') === 'true';

      /* fecha todas antes de abrir a escolhida */
      perguntas.forEach(function (outra) {
        outra.setAttribute('aria-expanded', 'false');
        var resp = document.getElementById(outra.getAttribute('aria-controls'));
        if (resp) { resp.hidden = true; }
      });

      if (!aberta) {
        botao.setAttribute('aria-expanded', 'true');
        var resposta = document.getElementById(botao.getAttribute('aria-controls'));
        if (resposta) { resposta.hidden = false; }
      }
    });
  });

  /* ESC fecha o menu mobile e qualquer pergunta aberta */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    fecharMenu();
  });

  /* ================================================================
     REDE DE SEGURANÇA — não deixar a página em branco

     As seções começam com opacity: 0 e só aparecem quando o
     IntersectionObserver avisa. Se ele não disparar por qualquer
     motivo (aba aberta em segundo plano, navegador antigo, página
     restaurada do histórico), o visitante veria uma página vazia.

     Então depois de 4 segundos a gente mostra tudo na marra e cobre
     os contadores que ficaram parados no zero. É melhor perder a
     animação do que perder o cliente.
     ================================================================ */
  window.setTimeout(function () {
    document.querySelectorAll('.aparece').forEach(function (el) {
      el.classList.add('visivel');
    });

    /* Os contadores não entram aqui: o número final já está no HTML, então
       quem não viu a animação continua vendo o valor certo. */
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

    /* fechável porque é um quadro fixo: parado num canto, mais cedo ou mais
       tarde ele cobre um botão da página que a pessoa quis clicar */
    avisoModelo.querySelector('.aviso-x').addEventListener('click', function () {
      avisoModelo.remove();
    });

    document.body.appendChild(avisoModelo);
  }

})();
