/* ==========================================================================

   VERTEK REFORMAS — Premium 01 — elegante
   Modelo de landing page para serviços técnicos e reformas

   Criado por JEFF COMPANY · JeffDev
   Criação de sites, automação de WhatsApp e Google Meu Negócio
   WhatsApp (11) 99709-7050

   Propriedade da Jeff Company. Material de trabalho da agência: pode ser
   personalizado e entregue a quantos clientes forem necessários. O cliente
   contrata o site pronto, não o modelo.

   ========================================================================== */

/* ==========================================================================
   VERTEK REFORMAS — comportamento da página

   Oito coisas, nesta ordem:
     1. menu do celular
     2. cabeçalho que muda depois que a pessoa rola
     3. blocos que aparecem ao entrar na tela
     4. números que contam sozinhos
     5. carrossel de depoimentos (mouse, toque e teclado)
     6. sanfona de dúvidas
     7. foto ampliada da galeria
     8. ano no rodapé

   Nenhuma biblioteca. Se este arquivo não carregar, a página continua
   legível: o menu não abre, a sanfona fica fechada e a galeria não amplia,
   mas todo o conteúdo permanece visível.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==================================================================
     1. MENU DO CELULAR
     ================================================================== */

  var hamburguer = document.getElementById('hamburguer');
  var menu = document.getElementById('menu');

  function fecharMenu() {
    if (!menu) return;
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
  }

  /* ==================================================================
     2. CABEÇALHO QUE MUDA AO ROLAR

     Uma sentinela invisível de 1px no topo da página avisa quando saiu
     da tela. É mais barato do que ouvir o evento de scroll, que dispara
     dezenas de vezes por segundo e trava celular fraco.
     ================================================================== */

  var cabecalho = document.getElementById('cabecalho');

  if (cabecalho && 'IntersectionObserver' in window) {
    var sentinela = document.createElement('div');
    sentinela.setAttribute('aria-hidden', 'true');
    sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
    document.body.prepend(sentinela);

    new IntersectionObserver(function (entradas) {
      cabecalho.classList.toggle('encolhido', !entradas[0].isIntersecting);
    }).observe(sentinela);
  }

  /* ==================================================================
     3. APARECER AO ROLAR
     ================================================================== */

  var alvos = document.querySelectorAll(
    '.card-servico, .galeria-item, .sobre-fotos, .sobre-texto, ' +
    '.bloco-info, .sanfona-item, .duvidas-lado, .contato-item, ' +
    '.mapa-espaco, .faixa-cta-linha > *'
  );

  if (!semMovimento && 'IntersectionObserver' in window) {

    for (var i = 0; i < alvos.length; i++) {
      alvos[i].classList.add('anima');
      alvos[i].style.transitionDelay = ((i % 3) * 100) + 'ms';
    }

    var obsAnima = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        if (entradas[j].isIntersecting) {
          entradas[j].target.classList.add('visivel');
          obsAnima.unobserve(entradas[j].target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    for (var k = 0; k < alvos.length; k++) obsAnima.observe(alvos[k]);

    /* Rede de segurança: nada fica escondido para sempre */
    setTimeout(function () {
      var escondidos = document.querySelectorAll('.anima:not(.visivel)');
      for (var m = 0; m < escondidos.length; m++) {
        escondidos[m].classList.add('visivel');
      }
    }, 4000);
  }

  /* ==================================================================
     4. NÚMEROS QUE CONTAM SOZINHOS

     Cada número guarda o valor final em data-alvo e o que vem depois
     dele (% ou " meses") em data-sufixo.
     ================================================================== */

  var numeros = document.querySelectorAll('.numero');

  function contar(elemento) {
    var alvo = parseInt(elemento.getAttribute('data-alvo'), 10) || 0;
    var sufixo = elemento.getAttribute('data-sufixo') || '';
    var duracao = 1400;
    var inicio = null;

    function passo(agora) {
      if (inicio === null) inicio = agora;
      var fracao = Math.min((agora - inicio) / duracao, 1);
      /* desacelera no fim: fica bem mais agradável do que linear */
      var suave = 1 - Math.pow(1 - fracao, 3);
      elemento.textContent = Math.round(alvo * suave) + sufixo;
      if (fracao < 1) requestAnimationFrame(passo);
    }

    requestAnimationFrame(passo);
  }

  if (numeros.length) {
    if (semMovimento || !('IntersectionObserver' in window)) {
      /* sem animação: mostra o valor final de uma vez */
      for (var n = 0; n < numeros.length; n++) {
        numeros[n].textContent =
          numeros[n].getAttribute('data-alvo') +
          (numeros[n].getAttribute('data-sufixo') || '');
      }
    } else {
      var obsNumeros = new IntersectionObserver(function (entradas) {
        for (var p = 0; p < entradas.length; p++) {
          if (entradas[p].isIntersecting) {
            contar(entradas[p].target);
            obsNumeros.unobserve(entradas[p].target);
          }
        }
      }, { threshold: 0.5 });

      for (var q = 0; q < numeros.length; q++) obsNumeros.observe(numeros[q]);
    }
  }

  /* ==================================================================
     5. CARROSSEL DE DEPOIMENTOS
     ================================================================== */

  var carrossel = document.getElementById('carrossel');
  var trilha = document.getElementById('trilha');

  if (carrossel && trilha) {
    var depoimentos = trilha.querySelectorAll('.depo');
    var pontos = document.getElementById('pontos');
    var atual = 0;

    var mostrar = function (indice) {
      atual = (indice + depoimentos.length) % depoimentos.length;
      trilha.style.transform = 'translateX(' + (-100 * atual) + '%)';

      var botoes = pontos.querySelectorAll('.ponto-btn');
      for (var r = 0; r < botoes.length; r++) {
        botoes[r].setAttribute('aria-selected', r === atual ? 'true' : 'false');
        botoes[r].setAttribute('tabindex', r === atual ? '0' : '-1');
      }
    };

    /* bolinhas, uma por depoimento */
    for (var s = 0; s < depoimentos.length; s++) {
      (function (indice) {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'ponto-btn';
        botao.setAttribute('role', 'tab');
        botao.setAttribute('aria-label', 'Depoimento ' + (indice + 1));
        botao.setAttribute('aria-selected', indice === 0 ? 'true' : 'false');
        botao.addEventListener('click', function () { mostrar(indice); });
        pontos.appendChild(botao);
      })(s);
    }

    document.getElementById('anterior').addEventListener('click', function () {
      mostrar(atual - 1);
    });
    document.getElementById('proximo').addEventListener('click', function () {
      mostrar(atual + 1);
    });

    /* setas do teclado quando o foco está dentro do carrossel */
    carrossel.addEventListener('keydown', function (evento) {
      if (evento.key === 'ArrowLeft')  { evento.preventDefault(); mostrar(atual - 1); }
      if (evento.key === 'ArrowRight') { evento.preventDefault(); mostrar(atual + 1); }
    });

    /* arrastar com o dedo */
    var toqueX = null;
    trilha.addEventListener('touchstart', function (evento) {
      toqueX = evento.changedTouches[0].clientX;
    }, { passive: true });

    trilha.addEventListener('touchend', function (evento) {
      if (toqueX === null) return;
      var distancia = evento.changedTouches[0].clientX - toqueX;
      if (Math.abs(distancia) > 45) mostrar(atual + (distancia < 0 ? 1 : -1));
      toqueX = null;
    }, { passive: true });

    mostrar(0);
  }

  /* ==================================================================
     6. SANFONA DE DÚVIDAS

     Abre uma e fecha a anterior. Quem manda é o atributo hidden do
     HTML: assim o leitor de tela também entende que a resposta está
     fechada, e não só quem enxerga a tela.
     ================================================================== */

  var sanfona = document.getElementById('sanfona');

  if (sanfona) {
    var botoesSanfona = sanfona.querySelectorAll('.sanfona-botao');

    for (var t = 0; t < botoesSanfona.length; t++) {
      botoesSanfona[t].addEventListener('click', function () {
        var estavaAberto = this.getAttribute('aria-expanded') === 'true';

        /* fecha todas */
        for (var u = 0; u < botoesSanfona.length; u++) {
          botoesSanfona[u].setAttribute('aria-expanded', 'false');
          document.getElementById(
            botoesSanfona[u].getAttribute('aria-controls')
          ).hidden = true;
        }

        /* e abre esta, se ela estava fechada */
        if (!estavaAberto) {
          this.setAttribute('aria-expanded', 'true');
          document.getElementById(this.getAttribute('aria-controls')).hidden = false;
        }
      });
    }

    /* a primeira já nasce aberta, para a seção não parecer vazia */
    if (botoesSanfona.length) {
      botoesSanfona[0].setAttribute('aria-expanded', 'true');
      document.getElementById(
        botoesSanfona[0].getAttribute('aria-controls')
      ).hidden = false;
    }
  }

  /* ==================================================================
     7. FOTO AMPLIADA DA GALERIA

     Enquanto as fotos forem os blocos de exemplo, o que a lupa mostra
     é uma cópia do bloco. Quando você trocar por <img> de verdade, a
     cópia continua funcionando sem mexer em nada aqui.
     ================================================================== */

  var lupa = document.getElementById('lupa');
  var botoesGaleria = document.querySelectorAll('.galeria-botao');

  if (lupa && botoesGaleria.length) {
    var palco = document.getElementById('lupa-palco');
    var legenda = document.getElementById('lupa-legenda');
    var indiceAtual = 0;
    var focoAnterior = null;

    var pintarLupa = function (indice) {
      indiceAtual = (indice + botoesGaleria.length) % botoesGaleria.length;
      var origem = botoesGaleria[indiceAtual];
      var foto = origem.querySelector('.galeria-foto, img');

      palco.innerHTML = '';
      if (foto) {
        var copia = foto.cloneNode(true);
        copia.removeAttribute('style');
        palco.appendChild(copia);
      }
      legenda.textContent = origem.getAttribute('data-legenda') || '';
    };

    var fecharLupa = function () {
      lupa.hidden = true;
      document.body.style.overflow = '';
      if (focoAnterior) focoAnterior.focus();
    };

    var abrirLupa = function (indice) {
      focoAnterior = document.activeElement;
      pintarLupa(indice);
      lupa.hidden = false;
      /* trava a rolagem do fundo enquanto a foto está aberta */
      document.body.style.overflow = 'hidden';
      document.getElementById('lupa-fechar').focus();
    };

    for (var v = 0; v < botoesGaleria.length; v++) {
      (function (indice) {
        botoesGaleria[indice].addEventListener('click', function () {
          abrirLupa(indice);
        });
      })(v);
    }

    document.getElementById('lupa-fechar').addEventListener('click', fecharLupa);
    document.getElementById('lupa-fundo').addEventListener('click', fecharLupa);
    document.getElementById('lupa-anterior').addEventListener('click', function () {
      pintarLupa(indiceAtual - 1);
    });
    document.getElementById('lupa-proxima').addEventListener('click', function () {
      pintarLupa(indiceAtual + 1);
    });

    document.addEventListener('keydown', function (evento) {
      if (lupa.hidden) return;

      if (evento.key === 'Escape')     { fecharLupa(); return; }
      if (evento.key === 'ArrowLeft')  { pintarLupa(indiceAtual - 1); return; }
      if (evento.key === 'ArrowRight') { pintarLupa(indiceAtual + 1); return; }

      /* prende o Tab dentro da janela: sem isso o foco escapa para a
         página atrás, que nem deveria estar sendo lida agora */
      if (evento.key === 'Tab') {
        var focaveis = lupa.querySelectorAll('button');
        var primeiro = focaveis[0];
        var ultimo = focaveis[focaveis.length - 1];

        if (evento.shiftKey && document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    });
  }

  /* ==================================================================
     8. ANO NO RODAPÉ
     ================================================================== */

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* Esc fecha o menu do celular. A lupa trata o próprio Esc antes disto
     e devolve, então uma tecla nunca dispara as duas coisas. */
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menu && menu.classList.contains('aberto')) {
      fecharMenu();
      hamburguer.focus();
    }
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
