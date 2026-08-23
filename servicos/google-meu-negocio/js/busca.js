/* ==========================================================================
   A busca do Google, com e sem perfil

   Os dois estados usam os MESMOS concorrentes, na mesma ordem. Só muda o que
   acontece com o negócio do cliente: no "antes" ele não está na lista; no
   "depois" ele está em primeiro, com foto, nota e botões.

   Manter os concorrentes idênticos é proposital — se eles mudassem junto, a
   comparação perderia o sentido e pareceria truque.
   ========================================================================== */

(function () {
  'use strict';

  var MEU = {
    nome: 'Barbearia Dom Marcos',
    nota: '4,9',
    avaliacoes: 128,
    meta: 'Barbearia · R. das Acácias, 210',
    aberto: true,
    fecha: 'Fecha às 20h'
  };

  var CONCORRENTES = [
    { nome: 'Barbearia Style',  nota: '4,7', avaliacoes: 89,  meta: 'Barbearia · Av. Portugal, 1130', aberto: true,  fecha: 'Fecha às 19h' },
    { nome: 'Corte & Cia',      nota: '4,5', avaliacoes: 203, meta: 'Barbearia · R. Oratório, 45',    aberto: true,  fecha: 'Fecha às 20h' },
    { nome: 'Barber King',      nota: '4,8', avaliacoes: 156, meta: 'Barbearia · R. Cel. Oliveira, 8', aberto: false, fecha: 'Abre amanhã às 9h' }
  ];

  var ESTADOS = {
    antes: {
      rot: 'Sem o perfil configurado',
      titulo: 'Você não está na lista',
      texto: 'A pessoa procurou barbearia no seu bairro e recebeu três opções. ' +
             'Nenhuma é a sua. Não é que ela escolheu o concorrente — ela nem soube que você existe.',
      ganhos: [
        ['No mapa', 'não aparece'],
        ['Botão de rota', 'não existe'],
        ['Avaliações', 'nenhuma visível'],
        ['Horário', 'ninguém sabe']
      ]
    },
    depois: {
      rot: 'Com o perfil configurado',
      titulo: 'Primeiro da lista, com tudo à mão',
      texto: 'Mesma busca, mesmos concorrentes. Agora você aparece com foto, nota, ' +
             'horário e três botões: ligar, traçar rota e abrir seu site. A pessoa ' +
             'decide sem sair do Google.',
      ganhos: [
        ['No mapa', 'com destaque'],
        ['Botão de rota', 'leva até a porta'],
        ['Avaliações', '128 visíveis, nota 4,9'],
        ['Horário', 'aberto agora, fecha 20h']
      ]
    }
  };

  var lista = document.getElementById('g-lista');
  var mapa = document.getElementById('g-mapa');

  /* ---------------------------------------------------------------------
     Desenho
     --------------------------------------------------------------------- */

  function estrelas(nota) {
    var cheias = Math.round(parseFloat(String(nota).replace(',', '.')));
    return '★★★★★'.slice(0, cheias) + '☆☆☆☆☆'.slice(0, 5 - cheias);
  }

  function item(dados, destaque) {
    var el = document.createElement('div');
    el.className = 'g-item' + (destaque ? ' destaque' : '');

    var foto = document.createElement('span');
    foto.className = 'g-foto' + (destaque ? ' cheia' : '');
    if (!destaque) foto.textContent = '';
    el.appendChild(foto);

    var info = document.createElement('div');
    info.className = 'g-info';

    var nome = document.createElement('div');
    nome.className = 'g-nome';
    nome.textContent = dados.nome;
    info.appendChild(nome);

    var nota = document.createElement('div');
    nota.className = 'g-nota';
    nota.innerHTML = '<span class="estrelas"></span><span class="n"></span>';
    nota.querySelector('.estrelas').textContent = estrelas(dados.nota);
    nota.querySelector('.n').textContent = dados.nota + ' (' + dados.avaliacoes + ')';
    info.appendChild(nota);

    var meta = document.createElement('div');
    meta.className = 'g-meta';
    meta.innerHTML = '<span class="' + (dados.aberto ? 'g-aberto' : 'g-fechado') + '"></span><span class="resto"></span>';
    meta.querySelector('span').textContent = dados.aberto ? 'Aberto' : 'Fechado';
    meta.querySelector('.resto').textContent = ' · ' + dados.fecha + ' · ' + dados.meta;
    info.appendChild(meta);

    if (destaque) {
      var bts = document.createElement('div');
      bts.className = 'g-botoes';
      ['Ligar', 'Como chegar', 'Site'].forEach(function (t) {
        var s = document.createElement('span');
        s.textContent = t;
        bts.appendChild(s);
      });
      info.appendChild(bts);
    }

    el.appendChild(info);
    return el;
  }

  function pinos(comMeu) {
    mapa.innerHTML = '';
    var pos = [[22, 30], [58, 22], [76, 58]];
    pos.forEach(function (p) {
      var i = document.createElement('span');
      i.className = 'g-pino';
      i.style.left = p[0] + '%';
      i.style.top = p[1] + '%';
      mapa.appendChild(i);
    });
    if (comMeu) {
      var meu = document.createElement('span');
      meu.className = 'g-pino meu';
      meu.style.left = '42%';
      meu.style.top = '48%';
      mapa.appendChild(meu);
    }
  }

  function pintar(estado) {
    var e = ESTADOS[estado];
    lista.innerHTML = '';
    pinos(estado === 'depois');

    if (estado === 'depois') lista.appendChild(item(MEU, true));

    CONCORRENTES.forEach(function (c) { lista.appendChild(item(c, false)); });

    if (estado === 'antes') {
      var aviso = document.createElement('div');
      aviso.className = 'g-ausente';
      aviso.innerHTML = '<b></b><span></span>';
      aviso.querySelector('b').textContent = 'A Barbearia Dom Marcos não aparece aqui';
      aviso.querySelector('span').textContent =
        'Sem perfil no Google, o negócio não entra na busca por região nem no mapa — ' +
        'mesmo estando a duas quadras de quem procurou.';
      lista.appendChild(aviso);
    }

    document.getElementById('g-rot').textContent = e.rot;
    document.getElementById('g-titulo').textContent = e.titulo;
    document.getElementById('g-texto').textContent = e.texto;

    var box = document.getElementById('g-ganhos');
    box.innerHTML = '';
    e.ganhos.forEach(function (g) {
      var d = document.createElement('div');
      d.className = 'ganho';
      d.innerHTML = '<b></b><span></span>';
      d.querySelector('b').textContent = g[0];
      d.querySelector('span').textContent = g[1];
      box.appendChild(d);
    });
  }

  /* ---------------------------------------------------------------------
     Interruptor
     --------------------------------------------------------------------- */

  document.querySelectorAll('#g-chave button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('#g-chave button').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      pintar(b.dataset.estado);
    });
  });

  pintar('antes');

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
