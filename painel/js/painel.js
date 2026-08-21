/* ==========================================================================
   Painel de clientes — protótipo

   Sem framework, sem banco, sem login. Os dados vêm de dados-exemplo.js e
   o que você mexe fica salvo no localStorage DESTE navegador — o suficiente
   para navegar, clicar e dizer o que muda.

   Quando virar produto, três coisas trocam de lugar:
     1. carregar()  ->  busca na API
     2. salvar()    ->  envia para a API
     3. o interruptor do site  ->  chama o Worker que liga e desliga de verdade
   O resto da tela continua igual.
   ========================================================================== */

(function () {
  'use strict';

  var CHAVE = 'jc-painel-proto';
  var DIA = 24 * 60 * 60 * 1000;

  var clientes = [];
  var filtroAtual = 'todos';
  var termoBusca = '';
  var abertoId = null;

  /* ---------------------------------------------------------------------
     Guardar e recuperar
     --------------------------------------------------------------------- */

  function carregar() {
    try {
      var salvo = localStorage.getItem(CHAVE);
      if (salvo) return JSON.parse(salvo);
    } catch (e) { /* modo privado ou dado corrompido: cai no exemplo */ }
    return JSON.parse(JSON.stringify(window.DADOS_EXEMPLO));
  }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(clientes)); }
    catch (e) { /* sem armazenamento: o protótipo segue só na memória */ }
  }

  /* ---------------------------------------------------------------------
     Contas de tempo e situação

     A regra é a mesma da cláusula do contrato: 10 dias de tolerância antes
     da suspensão. Por isso "atrasado" e "suspenso" são estados diferentes —
     um ainda tem site no ar, o outro não.
     --------------------------------------------------------------------- */

  function diasAte(data) {
    var d = new Date(data);
    var hoje = new Date();
    d.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    return Math.round((d - hoje) / DIA);
  }

  function situacao(c) {
    var dias = diasAte(c.assinatura.vence);

    if (c.assinatura.status === 'suspenso') {
      return { chave: 'suspenso', rotulo: 'Suspenso', cor: 'var(--morto)', dias: dias };
    }
    if (dias < 0) {
      return { chave: 'atrasado', rotulo: 'Em atraso', cor: 'var(--critico)', dias: dias };
    }
    if (dias <= 3) {
      return { chave: 'vencendo', rotulo: 'Vence já', cor: 'var(--perigo)', dias: dias };
    }
    if (dias <= 7) {
      return { chave: 'vencendo', rotulo: 'Vencendo', cor: 'var(--aviso)', dias: dias };
    }
    return { chave: 'ativo', rotulo: 'Em dia', cor: 'var(--ok)', dias: dias };
  }

  /* Quanto resta do ciclo, de 0 a 1 — é o preenchimento da barra. */
  function fracaoCiclo(dias) {
    if (dias < 0) return 0;
    return Math.max(0.04, Math.min(dias / 30, 1));
  }

  function textoTempo(s) {
    if (s.chave === 'suspenso') return 'suspenso há ' + Math.abs(s.dias) + ' dias';
    if (s.dias < 0)  return 'venceu há ' + Math.abs(s.dias) + (Math.abs(s.dias) === 1 ? ' dia' : ' dias');
    if (s.dias === 0) return 'vence hoje';
    if (s.dias === 1) return 'resta 1 dia';
    return 'restam ' + s.dias + ' dias';
  }

  function dinheiro(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function dataCurta(d) {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ---------------------------------------------------------------------
     Resumo do topo
     --------------------------------------------------------------------- */

  function pintarResumo() {
    var ativos = 0, vencendo = 0, atrasados = 0, suspensos = 0, mrr = 0, perdido = 0;

    clientes.forEach(function (c) {
      var s = situacao(c);
      if (s.chave === 'suspenso') { suspensos++; perdido += c.plano.valor; return; }
      if (s.chave === 'atrasado') { atrasados++; perdido += c.plano.valor; }
      else if (s.chave === 'vencendo') { vencendo++; }
      else { ativos++; }
      mrr += c.plano.valor;
    });

    texto('kpi-mrr', dinheiro(mrr));
    texto('kpi-mrr-pe', (ativos + vencendo + atrasados) + ' assinaturas ativas');
    texto('kpi-ativos', String(ativos + vencendo));
    texto('kpi-ativos-pe', suspensos ? suspensos + ' suspenso(s) fora da conta' : 'nenhum suspenso');
    texto('kpi-vencendo', String(vencendo));
    texto('kpi-atrasados', String(atrasados));
    texto('kpi-atrasados-pe', atrasados ? dinheiro(perdido) + ' parados' : 'ninguém devendo');

    /* contadores dos filtros */
    var contas = { todos: clientes.length, ativo: ativos, vencendo: vencendo, atrasado: atrasados, suspenso: suspensos };
    document.querySelectorAll('.filtro').forEach(function (b) {
      var n = contas[b.dataset.filtro];
      b.querySelector('span').textContent = n === undefined ? '' : n;
    });
  }

  function texto(id, v) {
    var el = document.getElementById(id);
    if (el) el.textContent = v;
  }

  /* ---------------------------------------------------------------------
     Lista
     --------------------------------------------------------------------- */

  function visiveis() {
    var termo = termoBusca.trim().toLowerCase();
    return clientes.filter(function (c) {
      var s = situacao(c);
      if (filtroAtual !== 'todos' && s.chave !== filtroAtual) return false;
      if (!termo) return true;
      return (c.negocio + ' ' + c.nome + ' ' + c.site.endereco + ' ' + c.ramo)
        .toLowerCase().indexOf(termo) !== -1;
    });
  }

  function pintarLista() {
    var lista = document.getElementById('lista');
    var vazio = document.getElementById('vazio');
    var itens = visiveis();

    lista.innerHTML = '';
    vazio.hidden = itens.length > 0;

    itens.forEach(function (c) {
      var s = situacao(c);
      var fora = !c.site.noAr;

      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'cliente';
      el.style.setProperty('--cor-status', s.cor);
      el.style.setProperty('--linha-status', s.cor);
      el.setAttribute('aria-label', 'Abrir ficha de ' + c.negocio);

      el.innerHTML =
        '<span class="cl-nome">' +
          '<span class="cl-negocio"></span>' +
          '<span class="cl-pessoa"></span>' +
        '</span>' +
        '<span class="cl-site">' +
          '<span class="cl-endereco"></span>' +
          '<span class="cl-noar' + (fora ? ' fora' : '') + '">' + (fora ? 'fora do ar' : 'no ar') + '</span>' +
        '</span>' +
        '<span class="cl-tempo">' +
          '<span class="cl-tempo-txt"></span>' +
          '<span class="cl-barra"><i style="width:' + (fracaoCiclo(s.dias) * 100) + '%"></i></span>' +
        '</span>' +
        '<span class="cl-fim">' +
          '<span class="cl-valor"></span>' +
          '<span class="selo' + (s.chave === 'atrasado' ? ' forte' : '') + '"></span>' +
        '</span>';

      /* textContent em vez de interpolar no HTML: nome de cliente é dado de
         fora, e um dia vem de um formulário */
      el.querySelector('.cl-negocio').textContent = c.negocio;
      el.querySelector('.cl-pessoa').textContent = c.nome;
      el.querySelector('.cl-endereco').textContent = c.site.endereco;
      el.querySelector('.cl-tempo-txt').textContent = textoTempo(s);
      el.querySelector('.cl-valor').textContent = dinheiro(c.plano.valor);
      el.querySelector('.selo').textContent = s.rotulo;

      el.addEventListener('click', function () { abrirFicha(c.id); });
      lista.appendChild(el);
    });
  }

  /* ---------------------------------------------------------------------
     Ficha
     --------------------------------------------------------------------- */

  function acharCliente(id) {
    for (var i = 0; i < clientes.length; i++) if (clientes[i].id === id) return clientes[i];
    return null;
  }

  function abrirFicha(id) {
    var c = acharCliente(id);
    if (!c) return;
    abertoId = id;

    var s = situacao(c);
    var ficha = document.getElementById('ficha');
    ficha.style.setProperty('--cor-status', s.cor);

    texto('f-ramo', c.ramo);
    texto('f-negocio', c.negocio);
    texto('f-nome', c.nome);

    /* situação */
    var box = document.getElementById('f-situacao');
    box.className = 'bloco situacao';
    box.innerHTML =
      '<span class="bloco-rot">Situação da assinatura</span>' +
      '<strong class="situacao-num"></strong>' +
      '<p class="situacao-sub"></p>' +
      '<span class="situacao-barra"><i style="width:' + (fracaoCiclo(s.dias) * 100) + '%"></i></span>';
    box.querySelector('.situacao-num').textContent = textoTempo(s);
    box.querySelector('.situacao-sub').textContent =
      s.chave === 'suspenso'
        ? 'Site fora do ar. Venceu em ' + dataCurta(c.assinatura.vence) + '.'
        : (s.dias < 0 ? 'Venceu em ' : 'Vence em ') + dataCurta(c.assinatura.vence) +
          ' · ' + s.rotulo;

    /* interruptor */
    var sw = document.getElementById('f-switch');
    sw.setAttribute('aria-checked', String(c.site.noAr));
    texto('f-switch-txt', c.site.noAr
      ? 'Visitantes conseguem acessar normalmente.'
      : 'Quem entrar vê a página de site indisponível.');

    /* site */
    texto('f-endereco', c.site.endereco);
    texto('f-tipo', c.site.tipo);
    texto('f-hospedagem', c.site.hospedagem);
    texto('f-publicado', dataCurta(c.site.publicadoEm));

    /* contato */
    texto('f-whats', formatarFone(c.whatsapp));
    texto('f-email', c.email || '—');
    texto('f-cidade', c.cidade);

    /* plano */
    texto('f-plano', c.plano.nome);
    texto('f-valor', dinheiro(c.plano.valor) + ' / mês');
    texto('f-diavenc', String(c.plano.diaVencimento));
    texto('f-inicio', dataCurta(c.assinatura.inicio));

    /* pagamentos */
    var ul = document.getElementById('f-pagamentos');
    ul.innerHTML = '';
    if (!c.pagamentos.length) {
      var li0 = document.createElement('li');
      li0.textContent = 'Nenhum pagamento registrado.';
      ul.appendChild(li0);
    }
    c.pagamentos.slice(0, 5).forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = '<span><span class="pg-data"></span> <span class="pg-meio"></span>' +
                     '<span class="pg-obs"></span></span><span class="pg-valor"></span>';
      li.querySelector('.pg-data').textContent = dataCurta(p.data);
      li.querySelector('.pg-meio').textContent = '· ' + p.meio;
      li.querySelector('.pg-obs').textContent = p.obs || '';
      li.querySelector('.pg-valor').textContent = dinheiro(p.valor);
      ul.appendChild(li);
    });

    /* anotação */
    document.getElementById('f-bloco-nota').hidden = !c.nota;
    texto('f-nota', c.nota || '');

    /* cobrar no WhatsApp, com a mensagem já escrita */
    document.getElementById('f-cobrar').href = linkCobranca(c, s);

    document.getElementById('veu').hidden = false;
    ficha.hidden = false;
    document.getElementById('btn-fechar').focus();

    /* o endereco passa a apontar para este cliente: da para mandar o link
       para si mesmo, recarregar sem perder o lugar e voltar pelo botao do
       navegador */
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  }

  function fecharFicha() {
    document.getElementById('ficha').hidden = true;
    document.getElementById('veu').hidden = true;
    abertoId = null;
    history.replaceState(null, '', location.pathname + location.search);
  }

  function formatarFone(n) {
    if (!n) return '—';
    var m = String(n).match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? '(' + m[1] + ') ' + m[2] + '-' + m[3] : n;
  }

  /* A mensagem muda conforme a situação: cobrar quem está em dia soa mal,
     e avisar com jeitinho quem está suspenso não resolve. */
  function linkCobranca(c, s) {
    var msg;
    if (s.chave === 'suspenso') {
      msg = 'Olá, ' + primeiroNome(c.nome) + '! Aqui é o Jeff. O site da ' + c.negocio +
            ' está fora do ar por causa da mensalidade em aberto. Assim que o pagamento ' +
            'entrar eu recoloco no ar em poucos minutos. Quer que eu mande o Pix?';
    } else if (s.dias < 0) {
      msg = 'Olá, ' + primeiroNome(c.nome) + '! Passando para lembrar da mensalidade do site ' +
            'da ' + c.negocio + ', que venceu dia ' + dataCurta(c.assinatura.vence) +
            '. Posso te mandar o Pix?';
    } else {
      msg = 'Olá, ' + primeiroNome(c.nome) + '! A mensalidade do site da ' + c.negocio +
            ' vence dia ' + dataCurta(c.assinatura.vence) + '. Quer que eu já mande o Pix?';
    }
    return 'https://wa.me/' + c.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  function primeiroNome(n) { return String(n).split(' ')[0]; }

  /* ---------------------------------------------------------------------
     Ações
     --------------------------------------------------------------------- */

  function alternarSite() {
    var c = acharCliente(abertoId);
    if (!c) return;

    var ligando = !c.site.noAr;

    if (!ligando) {
      var ok = confirm(
        'Tirar o site da ' + c.negocio + ' do ar?\n\n' +
        'Quem acessar ' + c.site.endereco + ' vai ver a página de site indisponível. ' +
        'Nada é apagado, e dá para religar a qualquer momento.'
      );
      if (!ok) return;
    }

    c.site.noAr = ligando;
    /* No produto de verdade, é aqui que o painel chama o Worker.
       No protótipo, só muda o dado e redesenha. */
    salvar();
    abrirFicha(abertoId);
    pintarLista();
    avisar(ligando
      ? c.negocio + ': site no ar de novo.'
      : c.negocio + ': site fora do ar.');
  }

  function registrarPagamento() {
    var c = acharCliente(abertoId);
    if (!c) return;

    if (!confirm('Registrar ' + dinheiro(c.plano.valor) + ' recebido de ' + c.negocio +
                 '?\n\nO vencimento vai 30 dias para a frente.')) return;

    c.pagamentos.unshift({
      data: new Date().toISOString(),
      valor: c.plano.valor,
      meio: 'Pix',
      status: 'pago'
    });

    /* o novo vencimento parte do vencimento anterior, não de hoje: quem
       pagou atrasado não ganha dias de brinde, e quem pagou adiantado não
       perde os que já tinha */
    var base = new Date(c.assinatura.vence);
    var hoje = new Date();
    if (base < hoje) base = hoje;
    c.assinatura.vence = new Date(base.getTime() + 30 * DIA).toISOString();

    if (c.assinatura.status === 'suspenso' || c.assinatura.status === 'atrasado') {
      c.assinatura.status = 'ativo';
      c.site.noAr = true;
    }

    salvar();
    abrirFicha(abertoId);
    pintarLista();
    pintarResumo();
    avisar('Pagamento registrado. ' + c.negocio + ' em dia.');
  }

  var toastTimer = null;
  function avisar(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }

  /* ---------------------------------------------------------------------
     Ligações da tela
     --------------------------------------------------------------------- */

  document.getElementById('busca').addEventListener('input', function (e) {
    termoBusca = e.target.value;
    pintarLista();
  });

  document.querySelectorAll('.filtro').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.filtro').forEach(function (o) { o.classList.remove('is-on'); });
      b.classList.add('is-on');
      filtroAtual = b.dataset.filtro;
      pintarLista();
    });
  });

  document.getElementById('btn-fechar').addEventListener('click', fecharFicha);
  document.getElementById('veu').addEventListener('click', fecharFicha);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && abertoId) fecharFicha();
  });

  document.getElementById('f-switch').addEventListener('click', alternarSite);
  document.getElementById('f-baixa').addEventListener('click', registrarPagamento);

  document.getElementById('btn-novo').addEventListener('click', function () {
    avisar('No protótipo o cadastro ainda não abre — diga se quer e eu faço.');
  });

  document.getElementById('btn-recomecar').addEventListener('click', function () {
    if (!confirm('Voltar aos dados de exemplo originais?')) return;
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    clientes = carregar();
    pintarResumo();
    pintarLista();
    avisar('Dados de exemplo restaurados.');
  });

  /* ---------------------------------------------------------------------
     Partida
     --------------------------------------------------------------------- */

  clientes = carregar();
  pintarResumo();
  pintarLista();

  /* abriu com #id no endereco? ja mostra a ficha daquele cliente */
  if (location.hash.length > 1) abrirFicha(decodeURIComponent(location.hash.slice(1)));
})();
