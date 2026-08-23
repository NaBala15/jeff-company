/* ==========================================================================
   O caminho de um pedido de alteração

   A linha do tempo acende etapa por etapa, e no fim o preço muda no site ao
   lado — com o valor antigo riscado. É a única forma de "manutenção" parecer
   concreta: mostrando a coisa mudando de lugar.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ETAPAS = [
    { hora: '14:32', nome: 'Você manda a mensagem',  desc: '"Jeff, subiu o corte para R$ 45"' },
    { hora: '14:35', nome: 'Recebo e confirmo',      desc: 'Confirmo o que vai mudar, para não trocar a coisa errada' },
    { hora: '16:10', nome: 'Alterado e testado',     desc: 'Mudo, confiro no celular e publico' },
    { hora: '16:11', nome: 'No ar',                  desc: 'Te aviso. Acabou o seu trabalho' }
  ];

  /* O item que muda é o primeiro: preço do corte, de 38 para 45. */
  var SERVICOS = [
    { nome: 'Corte masculino', antes: 'R$ 38', depois: 'R$ 45' },
    { nome: 'Barba',           antes: 'R$ 30', depois: 'R$ 30' },
    { nome: 'Corte + barba',   antes: 'R$ 60', depois: 'R$ 60' }
  ];

  var linha = document.getElementById('m-linha');
  var lista = document.getElementById('m-lista');
  var timers = [];
  var jaComecou = false;

  /* ---------------------------------------------------------------------
     Desenho
     --------------------------------------------------------------------- */

  function montarLinha() {
    linha.innerHTML = '';
    ETAPAS.forEach(function (e, i) {
      var el = document.createElement('div');
      el.className = 'etapa';
      el.dataset.i = i;
      el.innerHTML =
        '<span class="etapa-bola"></span>' +
        '<span class="etapa-txt">' +
          '<span class="etapa-hora"></span>' +
          '<span class="etapa-nome"></span>' +
          '<span class="etapa-desc"></span>' +
        '</span>';
      el.querySelector('.etapa-bola').textContent = String(i + 1);
      el.querySelector('.etapa-hora').textContent = e.hora;
      el.querySelector('.etapa-nome').textContent = e.nome;
      el.querySelector('.etapa-desc').textContent = e.desc;
      linha.appendChild(el);
    });
  }

  function montarSite(mudou) {
    lista.innerHTML = '';
    SERVICOS.forEach(function (s, i) {
      var trocou = mudou && i === 0;
      var el = document.createElement('div');
      el.className = 'sf-item' + (trocou ? ' mudou' : '');
      el.innerHTML = '<span class="nome"></span><span class="valor"></span>';
      el.querySelector('.nome').textContent = s.nome;

      var v = el.querySelector('.valor');
      if (trocou) {
        var velho = document.createElement('span');
        velho.className = 'sf-antigo';
        velho.textContent = s.antes;
        v.appendChild(velho);
      }
      var novo = document.createElement('b');
      novo.textContent = mudou ? s.depois : s.antes;
      v.appendChild(novo);

      lista.appendChild(el);
    });

    document.getElementById('m-atualizado').textContent =
      mudou ? 'Atualizado hoje às 16h11' : 'Atualizado há 3 meses';
  }

  /* ---------------------------------------------------------------------
     Reprodução
     --------------------------------------------------------------------- */

  function acender(i) {
    var el = linha.querySelector('.etapa[data-i="' + i + '"]');
    if (el) el.classList.add('is-on');
  }

  function tocar() {
    timers.forEach(clearTimeout);
    timers = [];
    linha.querySelectorAll('.etapa').forEach(function (e) { e.classList.remove('is-on'); });
    montarSite(false);

    if (semMovimento) {
      ETAPAS.forEach(function (_, i) { acender(i); });
      montarSite(true);
      return;
    }

    ETAPAS.forEach(function (_, i) {
      timers.push(setTimeout(function () {
        acender(i);
        /* o site só muda quando a etapa "alterado e testado" acende —
           antes disso, mostrar a mudança seria mentir sobre o processo */
        if (i === 2) montarSite(true);
      }, 600 + i * 1300));
    });
  }

  montarLinha();
  montarSite(false);

  document.getElementById('m-repetir').addEventListener('click', tocar);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas, obs) {
      if (!entradas[0].isIntersecting || jaComecou) return;
      jaComecou = true;
      obs.disconnect();
      tocar();
    }, { threshold: 0.35 }).observe(linha);
  } else {
    tocar();
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
