/* ==========================================================================
   Jeff Company — comportamento da página
   Sem bibliotecas. Nenhum listener de scroll: tudo que reage à rolagem usa
   IntersectionObserver, que o navegador resolve fora da thread principal.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. Cabeçalho ganha borda depois dos primeiros pixels de rolagem.
        Um elemento-sentinela no topo avisa quando saiu da tela — mais
        barato que escutar o scroll.
     --------------------------------------------------------------------- */
  (function cabecalho() {
    var hdr = document.querySelector('.hdr');
    if (!hdr || !('IntersectionObserver' in window)) return;

    var sentinela = document.createElement('div');
    sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
    document.body.prepend(sentinela);

    new IntersectionObserver(function (entradas) {
      hdr.classList.toggle('is-stuck', !entradas[0].isIntersecting);
    }).observe(sentinela);
  })();

  /* ---------------------------------------------------------------------
     2. Menu mobile
     --------------------------------------------------------------------- */
  (function menu() {
    var botao = document.querySelector('.burger');
    var painel = document.getElementById('menu-mobile');
    if (!botao || !painel) return;

    function alterna(abrir) {
      botao.setAttribute('aria-expanded', String(abrir));
      botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
      painel.hidden = !abrir;
    }

    botao.addEventListener('click', function () {
      alterna(botao.getAttribute('aria-expanded') !== 'true');
    });

    painel.addEventListener('click', function (e) {
      if (e.target.closest('a')) alterna(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !painel.hidden) { alterna(false); botao.focus(); }
    });
  })();

  /* ---------------------------------------------------------------------
     3. Comparador antes / depois
        O input range é a fonte da verdade (mouse, toque e teclado já
        funcionam nele de graça). O JS só copia o valor para a variável
        CSS --pos, dentro de um requestAnimationFrame.
     --------------------------------------------------------------------- */
  (function comparador() {
    var ba = document.getElementById('comparador');
    if (!ba) return;

    var range = ba.querySelector('.ba-range');
    var pedido = null;
    var demoAtiva = false;

    function aplica(valor) {
      ba.style.setProperty('--pos', valor + '%');
    }

    range.addEventListener('input', function () {
      demoAtiva = false;                       // usuário assumiu o controle
      if (pedido) return;
      pedido = requestAnimationFrame(function () {
        pedido = null;
        aplica(range.value);
      });
    });

    /* Demonstração de uma vez só: quando o comparador aparece na tela, a
       divisão desliza sozinha para mostrar que dá para arrastar. Qualquer
       toque do usuário interrompe na hora. */
    if (semMovimento || !('IntersectionObserver' in window)) return;

    var observador = new IntersectionObserver(function (entradas, obs) {
      if (!entradas[0].isIntersecting) return;
      obs.disconnect();
      setTimeout(demonstra, 700);
    }, { threshold: 0.45 });

    observador.observe(ba);

    function demonstra() {
      demoAtiva = true;
      var inicio = performance.now();
      var duracao = 2600;

      function passo(agora) {
        if (!demoAtiva) return;
        var t = Math.min((agora - inicio) / duracao, 1);
        /* vai para a direita, volta para a esquerda e assenta no meio */
        var suave = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        var valor = 50 + Math.sin(suave * Math.PI * 2) * 26;

        range.value = valor;
        aplica(valor);

        if (t < 1) requestAnimationFrame(passo);
        else { demoAtiva = false; range.value = 50; aplica(50); }
      }

      requestAnimationFrame(passo);
    }
  })();

  /* ---------------------------------------------------------------------
     4. Aparição na rolagem
     --------------------------------------------------------------------- */
  (function aparicoes() {
    var alvos = document.querySelectorAll('.reveal');
    if (!alvos.length) return;

    if (semMovimento || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-in');
        obs.unobserve(entrada.target);          // cada elemento anima uma vez só
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    alvos.forEach(function (el) { obs.observe(el); });
  })();

  /* ---------------------------------------------------------------------
     4b. Captura de projeto que ainda não existe
         Em vez de mostrar o ícone de imagem quebrada, o quadro assume um
         estado de espera. Assim que o arquivo .webp for colocado em
         assets/img/cases/, isto para de acontecer sozinho.
     --------------------------------------------------------------------- */
  (function capturas() {
    document.querySelectorAll('.case-janela img').forEach(function (img) {
      function falhou() {
        var janela = img.closest('.case-janela');
        if (janela) janela.classList.add('sem-captura');
        img.remove();
      }
      if (img.complete && img.naturalWidth === 0) falhou();
      else img.addEventListener('error', falhou);
    });
  })();

  /* ---------------------------------------------------------------------
     5. Ano do rodapé — para nunca ficar desatualizado
     --------------------------------------------------------------------- */
  (function ano() {
    var el = document.getElementById('ano');
    if (el) el.textContent = new Date().getFullYear();
  })();

  /* ---------------------------------------------------------------------
     6. Formulário de contato
        Envia sem recarregar a página e responde na própria tela. Enquanto
        o endereço do Formspree não estiver configurado, o formulário avisa
        e manda a pessoa para o WhatsApp em vez de falhar em silêncio.
     --------------------------------------------------------------------- */
  (function formulario() {
    var form = document.getElementById('form-contato');
    if (!form) return;

    var aviso = form.querySelector('.form-aviso');
    var botao = form.querySelector('.form-enviar');
    var textoBotao = botao.textContent;

    function fala(msg, tipo) {
      aviso.textContent = msg;
      aviso.className = 'form-aviso' + (tipo ? ' ' + tipo : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('foi-enviado');

      if (!form.checkValidity()) {
        fala('Preencha os campos destacados para continuar.', 'erro');
        var primeiro = form.querySelector(':invalid');
        if (primeiro) primeiro.focus();
        return;
      }

      /* Endereço ainda não configurado: não adianta tentar enviar. */
      if (form.action.indexOf('SEU_CODIGO_AQUI') !== -1) {
        fala('O envio ainda não foi configurado. Chame no WhatsApp que respondo na hora.', 'erro');
        return;
      }

      botao.disabled = true;
      botao.textContent = 'Enviando…';
      fala('');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error('falhou');
          form.reset();
          form.classList.remove('foi-enviado');
          fala('Mensagem enviada. Respondo em até 24h.', 'ok');
        })
        .catch(function () {
          fala('Não consegui enviar agora. Chame no WhatsApp que respondo na hora.', 'erro');
        })
        .finally(function () {
          botao.disabled = false;
          botao.textContent = textoBotao;
        });
    });
  })();

})();
