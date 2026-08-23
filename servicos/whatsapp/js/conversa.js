/* ==========================================================================
   A conversa que acontece sozinha

   Três roteiros, escolhidos pela pessoa. Cada mensagem entra com o intervalo
   de quem está digitando de verdade — se aparecesse tudo de uma vez, viraria
   um print, e print não mostra que existe uma conversa acontecendo.

   As mensagens do robô vêm precedidas de "digitando", as do cliente não:
   é a mesma assimetria de uma conversa real, e ajuda a leitura a separar os
   dois lados sem precisar de legenda.
   ========================================================================== */

(function () {
  'use strict';

  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Roteiros
     --------------------------------------------------------------------- */

  var ROTEIROS = [
    {
      id: 'madrugada',
      botao: 'Chegou 23h40',
      negocio: 'Barbearia Dom Marcos',
      inicial: 'B',
      status: 'responde na hora',
      titulo: 'Mensagem de madrugada',
      texto: 'O cliente mandou mensagem quase meia-noite. Sem o robô, ele acordaria ' +
             'sem resposta — e provavelmente já teria marcado em outro lugar.',
      marcador: 'Você estava dormindo esse tempo todo',
      falas: [
        { de: 'cliente', t: 'Boa noite, vocês estão abertos amanhã?', h: '23:41' },
        { de: 'robo', t: 'Boa noite! 🌙 Estamos fechados agora, mas abrimos amanhã às 9h.\n\nSou o atendimento automático da Dom Marcos — posso te ajudar agora mesmo.', h: '23:41' },
        { de: 'robo', t: 'O que você precisa?', h: '23:41', opcoes: ['Agendar', 'Ver preços', 'Endereço'] },
        { de: 'cliente', t: 'Queria agendar um corte', h: '23:42' },
        { de: 'robo', t: 'Perfeito! Tenho estes horários amanhã:\n\n• 10h00\n• 14h00\n• 16h30', h: '23:42' },
        { de: 'cliente', t: '14h tá bom', h: '23:42' },
        { de: 'robo', t: 'Fechado! ✅\n\n*Corte masculino*\nAmanhã (22/08) às 14h\n\nComo é seu nome?', h: '23:42' },
        { de: 'cliente', t: 'Marcos', h: '23:43' },
        { de: 'robo', t: 'Prontinho, Marcos! Já está na agenda.\n\nMando um lembrete 1h antes. Até amanhã 👋', h: '23:43' }
      ]
    },
    {
      id: 'preco',
      botao: 'Quanto custa?',
      negocio: 'Clínica Norvi',
      inicial: 'N',
      status: 'responde na hora',
      titulo: 'A pergunta que todo mundo faz',
      texto: 'Em vez de responder só o preço e a pessoa sumir, o robô responde e ' +
             'já convida para o próximo passo. Você recebe o contato pronto, não uma dúvida solta.',
      marcador: 'Você recebe o cliente já qualificado',
      falas: [
        { de: 'cliente', t: 'Oi, quanto custa o clareamento?', h: '14:08' },
        { de: 'robo', t: 'Oi! 😊 Sou o atendimento automático da Clínica Norvi.\n\nO clareamento sai a partir de R$ 450, feito em 2 sessões.', h: '14:08' },
        { de: 'robo', t: 'O valor exato depende de uma avaliação, que é gratuita. Quer marcar?', h: '14:08', opcoes: ['Quero marcar', 'Só pesquisando'] },
        { de: 'cliente', t: 'Quero marcar', h: '14:09' },
        { de: 'robo', t: 'Ótimo! Qual o melhor dia pra você?', h: '14:09', opcoes: ['Esta semana', 'Semana que vem'] },
        { de: 'cliente', t: 'Esta semana, de tarde', h: '14:10' },
        { de: 'robo', t: 'Tenho quinta às 15h e sexta às 16h.\n\nMe manda seu nome que eu já reservo.', h: '14:10' },
        { de: 'cliente', t: 'Camila, pode ser quinta', h: '14:10' },
        { de: 'robo', t: 'Reservado, Camila! ✅\nAvaliação gratuita, quinta às 15h.\n\nA Dra. Marina vai te atender. Até lá!', h: '14:11' }
      ]
    },
    {
      id: 'entrega',
      botao: 'Faz entrega aqui?',
      negocio: 'Pizzaria do Beto',
      inicial: 'B',
      status: 'responde na hora',
      titulo: 'A dúvida repetida de todo dia',
      texto: 'Área de entrega, taxa e tempo são as três perguntas que mais se repetem ' +
             'num delivery. O robô responde as três antes de você abrir o celular.',
      marcador: 'Mesma resposta, cem vezes, sem você digitar',
      falas: [
        { de: 'cliente', t: 'Vocês entregam no Jardim Bela Vista?', h: '19:23' },
        { de: 'robo', t: 'Boa noite! Entregamos sim 🛵\n\n*Jardim Bela Vista*\nTaxa: R$ 6,00\nTempo: cerca de 40 min', h: '19:23' },
        { de: 'robo', t: 'Quer ver o cardápio?', h: '19:23', opcoes: ['Ver cardápio', 'Fazer pedido'] },
        { de: 'cliente', t: 'Ver cardápio', h: '19:24' },
        { de: 'robo', t: '🍕 *MAIS PEDIDAS*\n\nCalabresa G — R$ 52\nMussarela G — R$ 48\nPortuguesa G — R$ 56\nFrango c/ catupiry G — R$ 58\n\nCardápio completo: pizzariadobeto.com.br', h: '19:24' },
        { de: 'cliente', t: 'Uma calabresa grande', h: '19:26' },
        { de: 'robo', t: 'Anotado! 📝\n\nCalabresa G — R$ 52\nEntrega — R$ 6\n*Total: R$ 58*\n\nMe passa o endereço completo?', h: '19:26' },
        { de: 'cliente', t: 'Rua das Acácias 210, apto 42', h: '19:27' },
        { de: 'robo', t: 'Pedido confirmado! ✅\nSai do forno em cerca de 40 min.\n\nO Beto já foi avisado 👨‍🍳', h: '19:27' }
      ]
    }
  ];

  /* ---------------------------------------------------------------------
     Elementos
     --------------------------------------------------------------------- */

  var tela = document.getElementById('z-tela');
  var elCenarios = document.getElementById('z-cenarios');
  var atual = ROTEIROS[0];
  var timers = [];
  var jaComecou = false;

  /* ---------------------------------------------------------------------
     Reprodução
     --------------------------------------------------------------------- */

  function limpar() {
    timers.forEach(clearTimeout);
    timers = [];
    tela.innerHTML = '';
    ultimoFalante = null;
  }

  /* No WhatsApp, *texto* vira negrito. Como o roteiro imita uma conversa de
     verdade, ele usa a mesma marcação — e aqui ela precisa virar negrito, ou
     os asteriscos aparecem crus e a ilusão quebra. O texto é escapado antes,
     por higiene: hoje o roteiro é constante no código, mas um dia pode vir de
     outro lugar. */
  function comNegrito(texto) {
    var seguro = texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return seguro.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  }

  var ultimoFalante = null;

  function bolha(fala) {
    var el = document.createElement('div');
    el.className = 'bolha ' + fala.de;

    /* a etiqueta só aparece quando o lado MUDA: repetida em toda bolha ela
       vira ruído e atrapalha a leitura da conversa */
    if (fala.de !== ultimoFalante) {
      var q = document.createElement('span');
      q.className = 'quem';
      q.textContent = fala.de === 'robo' ? 'Atendimento automático' : 'Cliente';
      el.appendChild(q);
    }
    ultimoFalante = fala.de;

    var txt = document.createElement('span');
    txt.innerHTML = comNegrito(fala.t);
    el.appendChild(txt);

    var hora = document.createElement('span');
    hora.className = 'hora';
    hora.textContent = fala.h;
    el.appendChild(hora);

    tela.appendChild(el);

    if (fala.opcoes) {
      var box = document.createElement('div');
      box.className = 'opcoes';
      fala.opcoes.forEach(function (o) {
        var s = document.createElement('span');
        s.textContent = o;
        box.appendChild(s);
      });
      tela.appendChild(box);
    }

    tela.scrollTop = tela.scrollHeight;
  }

  function digitando() {
    var el = document.createElement('div');
    el.className = 'digitando';
    el.innerHTML = '<i></i><i></i><i></i>';
    tela.appendChild(el);
    tela.scrollTop = tela.scrollHeight;
    return el;
  }

  function tocar(roteiro) {
    limpar();
    atual = roteiro;

    document.getElementById('z-nome').textContent = roteiro.negocio;
    document.getElementById('z-inicial').textContent = roteiro.inicial;
    document.getElementById('z-status').textContent = roteiro.status;
    document.getElementById('z-leg-titulo').textContent = roteiro.titulo;
    document.getElementById('z-leg-texto').textContent = roteiro.texto;
    document.getElementById('z-marcador').textContent = roteiro.marcador;

    /* Sem movimento pedido no sistema: mostra a conversa inteira de uma vez.
       A informação continua toda lá, só não se desenrola. */
    if (semMovimento) {
      roteiro.falas.forEach(bolha);
      return;
    }

    var t = 400;
    roteiro.falas.forEach(function (fala) {
      /* o tempo acompanha o tamanho do texto: mensagem longa demora mais para
         "ser digitada", como aconteceria de verdade */
      var leitura = Math.min(600 + fala.t.length * 12, 2100);

      if (fala.de === 'robo') {
        timers.push(setTimeout(function () {
          var d = digitando();
          timers.push(setTimeout(function () { d.remove(); bolha(fala); }, leitura * 0.55));
        }, t));
        t += leitura;
      } else {
        timers.push(setTimeout(function () { bolha(fala); }, t));
        t += leitura * 0.8;
      }
    });

    /* recomeça sozinha depois de uma pausa, para quem chegou no meio */
    timers.push(setTimeout(function () { tocar(atual); }, t + 6000));
  }

  /* ---------------------------------------------------------------------
     Controles
     --------------------------------------------------------------------- */

  ROTEIROS.forEach(function (r, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cenario' + (i === 0 ? ' is-on' : '');
    b.textContent = r.botao;
    b.addEventListener('click', function () {
      elCenarios.querySelectorAll('.cenario').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      tocar(r);
    });
    elCenarios.appendChild(b);
  });

  document.getElementById('z-repetir').addEventListener('click', function () { tocar(atual); });

  /* Só começa quando a demonstração aparece na tela: se rodasse no carregamento,
     quem chega no topo da página perderia a conversa inteira. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas, obs) {
      if (!entradas[0].isIntersecting || jaComecou) return;
      jaComecou = true;
      obs.disconnect();
      tocar(atual);
    }, { threshold: 0.3 }).observe(tela);
  } else {
    tocar(atual);
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
