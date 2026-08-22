/* ==========================================================================
   Fluxo de pedido

   Regra que orienta tudo aqui: só três campos são obrigatórios — nome,
   WhatsApp e nome do negócio. Todo o resto pode ficar em branco e o pedido
   segue. Formulário que trava por causa de campo vazio não protege ninguém:
   faz a pessoa fechar a aba, e aí você não tem nem os três campos.

   O que sai daqui é uma mensagem de WhatsApp pronta, com tudo que foi
   preenchido. Sem servidor, sem banco, sem custo — e o cliente já cai numa
   conversa onde consegue mandar as fotos em seguida.

   ATENÇÃO: troque SEU_WHATSAPP abaixo pelo seu número.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========  TROQUE AQUI  ==========
     Formato: 55 + DDD + número, tudo junto.
     Para (11) 91234-5678 escreva 5511912345678 */
  var SEU_WHATSAPP = '5511999999999';

  var TOTAL_PASSOS = 5;
  var passoAtual = 0;

  var pedido = {
    plano: '',
    modelo: '',
    materiais: []
  };

  var elProgresso = document.getElementById('progresso');
  var elProgressoI = document.getElementById('progresso-i');
  var elProgressoTxt = document.getElementById('progresso-txt');

  /* ---------------------------------------------------------------------
     Navegação entre passos
     --------------------------------------------------------------------- */

  function irPara(n) {
    /* quem escolheu página personalizada não passa pela escolha de modelo */
    if (n === 3 && pedido.plano === 'personalizada') n = 4;

    if (n === 2 && !validarPasso1()) return;

    document.querySelectorAll('.passo').forEach(function (s) {
      s.classList.toggle('is-on', Number(s.dataset.passo) === n);
    });

    passoAtual = n;
    atualizarProgresso();
    if (n === 5) montarResumo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function atualizarProgresso() {
    elProgresso.hidden = passoAtual === 0;
    if (passoAtual === 0) return;
    elProgressoI.style.width = (passoAtual / TOTAL_PASSOS * 100) + '%';
    elProgressoTxt.textContent = passoAtual + ' de ' + TOTAL_PASSOS;
  }

  /* ---------------------------------------------------------------------
     Validação — só o que realmente impede de começar
     --------------------------------------------------------------------- */

  function validarPasso1() {
    var faltando = [];
    [['c-nome', 'seu nome'], ['c-whats', 'seu WhatsApp'], ['c-negocio', 'o nome do negócio']]
      .forEach(function (par) {
        var el = document.getElementById(par[0]);
        var vazio = !el.value.trim();
        el.classList.toggle('erro', vazio);
        if (vazio) faltando.push(par[1]);
      });

    if (faltando.length) {
      avisar('Falta ' + faltando.join(', ') + '.');
      var primeiro = document.querySelector('.campo input.erro');
      if (primeiro) primeiro.focus();
      return false;
    }
    return true;
  }

  /* ---------------------------------------------------------------------
     Passo 0 — os dois caminhos
     --------------------------------------------------------------------- */

  document.getElementById('caminho-zap').href =
    'https://wa.me/' + SEU_WHATSAPP + '?text=' +
    encodeURIComponent('Olá! Vi o site da Jeff Company e quero criar minha página. Pode me ajudar?');

  document.getElementById('caminho-form').addEventListener('click', function () { irPara(1); });

  /* ---------------------------------------------------------------------
     Passo 1 — ramo, com sugestão de modelo
     --------------------------------------------------------------------- */

  var datalist = document.getElementById('lista-ramos');
  window.RAMOS_COMUNS.forEach(function (r) {
    var o = document.createElement('option');
    o.value = r;
    datalist.appendChild(o);
  });

  var campoRamo = document.getElementById('c-ramo');
  var dicaRamo = document.getElementById('dica-ramo');

  campoRamo.addEventListener('input', function () {
    var id = window.sugerirModelo(campoRamo.value);
    if (!id) { dicaRamo.textContent = ''; return; }
    var m = acharModelo(id);
    dicaRamo.textContent = 'Para esse ramo, o modelo "' + m.nome + '" costuma funcionar melhor.';
  });

  /* máscara leve de telefone: ajuda a digitar, não impede nada */
  document.getElementById('c-whats').addEventListener('input', function (e) {
    var d = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6)      e.target.value = '(' + d.slice(0,2) + ') ' + d.slice(2,7) + '-' + d.slice(7);
    else if (d.length > 2) e.target.value = '(' + d.slice(0,2) + ') ' + d.slice(2);
    else if (d.length)     e.target.value = '(' + d;
  });

  /* ---------------------------------------------------------------------
     Passo 2 — plano
     --------------------------------------------------------------------- */

  document.querySelectorAll('.plano').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.plano').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      pedido.plano = b.dataset.plano;

      /* o passo 3 muda de sentido conforme o plano */
      var t = document.getElementById('t-modelo');
      var s = document.getElementById('s-modelo');
      if (pedido.plano === 'personalizada') {
        t.textContent = 'Tem algum formato que te agrada?';
        s.textContent = 'Sua página será desenhada do zero. Se algum destes formatos ' +
                        'te agrada como ponto de partida, escolha — se não, pule.';
      } else {
        t.textContent = 'Escolha o modelo da sua página';
        s.textContent = 'Cinco formatos. Todos ficam com o seu nome, suas cores e suas ' +
                        'fotos — o que muda é a organização da página.';
      }
    });
  });

  /* Voltar do passo 4 respeita quem pulou a escolha de modelo */
  document.getElementById('voltar-4').addEventListener('click', function () {
    irPara(pedido.plano === 'personalizada' ? 2 : 3);
  });

  /* ---------------------------------------------------------------------
     Passo 3 — modelos
     --------------------------------------------------------------------- */

  function acharModelo(id) {
    for (var i = 0; i < window.MODELOS.length; i++) {
      if (window.MODELOS[i].id === id) return window.MODELOS[i];
    }
    return null;
  }

  /* Miniaturas: cada esqueleto é um desenho diferente, para a diferença
     entre os modelos entrar pelos olhos antes de entrar pela leitura. */
  function miniatura(tipo) {
    var m = { vitrine:
      '<span class="barra"></span><span class="foto"></span>' +
      '<span class="linhas"><span></span><span></span><span></span><span></span></span>',
      agenda:
      '<span class="barra"></span><span class="topo2"><span></span><span></span></span>' +
      '<span class="lista"><span></span><span></span><span></span></span><span class="cta"></span>',
      confianca:
      '<span class="barra"></span><span class="bloco"><span></span><span></span></span>' +
      '<span class="rodape"></span>',
      urgencia:
      '<span class="fone"></span><span class="sub"></span><span class="sub2"></span>',
      portfolio:
      '<span class="barra"></span>' +
      '<span class="grade"><span></span><span></span><span></span><span></span><span></span><span></span></span>'
    };
    return '<span class="mini mini-' + tipo + '">' + (m[tipo] || '') + '</span>';
  }

  function montarModelos() {
    var alvo = document.getElementById('modelos');
    var sugerido = window.sugerirModelo(campoRamo.value);

    /* o sugerido vai para a frente da fila */
    var lista = window.MODELOS.slice();
    if (sugerido) {
      lista.sort(function (a, b) {
        return (b.id === sugerido) - (a.id === sugerido);
      });
    }

    alvo.innerHTML = '';
    lista.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'modelo' + (pedido.modelo === m.id ? ' is-on' : '');
      b.dataset.modelo = m.id;
      b.innerHTML =
        (m.id === sugerido ? '<span class="modelo-rec">Recomendado</span>' : '') +
        miniatura(m.esqueleto) +
        '<span class="modelo-txt">' +
          '<span class="modelo-nome"></span>' +
          '<span class="modelo-resumo"></span>' +
          '<span class="modelo-bom"></span>' +
        '</span>';
      b.querySelector('.modelo-nome').textContent = m.nome;
      b.querySelector('.modelo-resumo').textContent = m.resumo;
      b.querySelector('.modelo-bom').textContent = m.bom_para;

      b.addEventListener('click', function () {
        alvo.querySelectorAll('.modelo').forEach(function (o) { o.classList.remove('is-on'); });
        b.classList.add('is-on');
        pedido.modelo = m.id;
      });

      alvo.appendChild(b);
    });
  }

  /* ---------------------------------------------------------------------
     Passo 5 — resumo e mensagem
     --------------------------------------------------------------------- */

  function valor(id) { return (document.getElementById(id).value || '').trim(); }

  function coletar() {
    pedido.materiais = [];
    document.querySelectorAll('#checks input:checked').forEach(function (c) {
      pedido.materiais.push(c.value);
    });

    var m = pedido.modelo ? acharModelo(pedido.modelo) : null;

    return [
      ['Nome',            valor('c-nome')],
      ['WhatsApp',        valor('c-whats')],
      ['Negócio',         valor('c-negocio')],
      ['Ramo',            valor('c-ramo')],
      ['Cidade',          valor('c-cidade')],
      ['Tipo de página',  pedido.plano === 'assinatura' ? 'Página pronta — assinatura de R$ 50/mês'
                        : pedido.plano === 'personalizada' ? 'Página personalizada — orçamento'
                        : ''],
      ['Modelo escolhido', m ? m.nome : ''],
      ['Serviços',        valor('c-servicos')],
      ['Horário',         valor('c-horario')],
      ['Endereço',        valor('c-endereco')],
      ['Instagram',       valor('c-instagram')],
      ['Mostrar preço',   valor('c-preco')],
      ['Frase de destaque', valor('c-frase')],
      ['Quer também',     valor('c-extras')],
      ['Já tem em mãos',  pedido.materiais.join(', ')]
    ];
  }

  function montarResumo() {
    var alvo = document.getElementById('resumo');
    alvo.innerHTML = '';
    var vazios = 0;

    coletar().forEach(function (par) {
      var linha = document.createElement('div');
      linha.className = 'resumo-linha';
      linha.innerHTML = '<span class="resumo-rot"></span><span class="resumo-val"></span>';
      linha.querySelector('.resumo-rot').textContent = par[0];

      var val = linha.querySelector('.resumo-val');
      if (par[1]) {
        val.textContent = par[1];
      } else {
        val.textContent = 'não informado';
        val.classList.add('vazio');
        vazios++;
      }
      alvo.appendChild(linha);
    });

    document.getElementById('aviso-falta').textContent = vazios
      ? 'Você deixou ' + vazios + ' item(ns) em branco — tudo bem, a gente completa na conversa.'
      : 'Está tudo preenchido. Depois de enviar, mande o logo e as fotos na mesma conversa.';

    document.getElementById('btn-enviar').href =
      'https://wa.me/' + SEU_WHATSAPP + '?text=' + encodeURIComponent(mensagem());
  }

  function mensagem() {
    var linhas = ['*PEDIDO DE PÁGINA — JEFF COMPANY*', ''];
    coletar().forEach(function (par) {
      if (par[1]) linhas.push('*' + par[0] + ':* ' + par[1]);
    });
    linhas.push('', 'Vou mandar o logo e as fotos aqui em seguida.');
    return linhas.join('\n');
  }

  document.getElementById('btn-copiar').addEventListener('click', function () {
    var texto = mensagem();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto)
        .then(function () { avisar('Texto copiado.'); })
        .catch(function () { copiarNaMarra(texto); });
    } else {
      copiarNaMarra(texto);
    }
  });

  /* navegador antigo, ou página aberta sem https: a área de transferência
     moderna não existe, então cai no truque do campo temporário */
  function copiarNaMarra(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); avisar('Texto copiado.'); }
    catch (e) { avisar('Não consegui copiar. Selecione o resumo e copie na mão.'); }
    ta.remove();
  }

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */

  var timer = null;
  function avisar(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(function () { t.classList.remove('is-on'); }, 3400);
  }

  document.querySelectorAll('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () {
      var destino = Number(b.dataset.ir);
      if (destino === 3) montarModelos();      // remonta com a sugestão do ramo
      irPara(destino);
    });
  });

  /* Enter avança em vez de recarregar a página */
  document.querySelectorAll('.campo input').forEach(function (i) {
    i.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var proximo = document.querySelector('.passo.is-on .btn-p');
      if (proximo) proximo.click();
    });
  });

  /* ---------------------------------------------------------------------
     Link direto para um passo: #passo-3 abre já nos modelos.
     Serve para mandar "dá uma olhada nos modelos" pelo WhatsApp sem obrigar
     a pessoa a preencher tudo antes de ver.
     --------------------------------------------------------------------- */
  var pedidoDeInicio = (location.hash.match(/^#passo-([0-5])$/) || [])[1];
  if (pedidoDeInicio) {
    var n = Number(pedidoDeInicio);
    if (n === 3) { pedido.plano = pedido.plano || 'assinatura'; montarModelos(); }
    irPara(n);
  }

  atualizarProgresso();
})();
