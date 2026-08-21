/* ==========================================================================
   Dados de exemplo do painel

   Nada aqui é real. Serve para o protótipo ter cara de painel em uso, com
   clientes em situações diferentes: em dia, vencendo, atrasado, suspenso.

   As datas são calculadas A PARTIR DE HOJE, e não fixas no calendário.
   Assim o protótipo continua fazendo sentido daqui a seis meses, em vez de
   mostrar "vencido há 180 dias" para todo mundo.

   Quando o painel for ligado num banco de verdade, este arquivo sai e a
   mesma estrutura passa a vir da API.
   ========================================================================== */

(function () {
  'use strict';

  var DIA = 24 * 60 * 60 * 1000;

  function emDias(n) {
    return new Date(Date.now() + n * DIA);
  }

  window.DADOS_EXEMPLO = [
    {
      id: 'pizzaria-beto',
      nome: 'Roberto Salles',
      negocio: 'Pizzaria do Beto',
      ramo: 'Restaurante e delivery',
      whatsapp: '5511990001111',
      email: 'contato@pizzariadobeto.com.br',
      cidade: 'Santo André / SP',
      site: {
        endereco: 'pizzariadobeto.jeffcompany.com.br',
        tipo: 'Subdomínio',
        hospedagem: 'Cloudflare Pages',
        noAr: true,
        publicadoEm: emDias(-214)
      },
      plano: { nome: 'Assinatura mensal', valor: 50, diaVencimento: 10 },
      assinatura: { inicio: emDias(-214), vence: emDias(12), status: 'ativo' },
      pagamentos: [
        { data: emDias(-18), valor: 50, meio: 'Pix', status: 'pago' },
        { data: emDias(-48), valor: 50, meio: 'Pix', status: 'pago' },
        { data: emDias(-79), valor: 50, meio: 'Pix', status: 'pago' }
      ],
      nota: 'Pede troca do cardápio toda virada de mês. Já está no combinado.'
    },
    {
      id: 'clinica-norvi',
      nome: 'Marina Aoki',
      negocio: 'Clínica Norvi',
      ramo: 'Odontologia',
      whatsapp: '5511990002222',
      email: 'contato@clinicanorvi.com.br',
      cidade: 'Santo André / SP',
      site: {
        endereco: 'clinicanorvi.com.br',
        tipo: 'Domínio próprio',
        hospedagem: 'Cloudflare Pages',
        noAr: true,
        publicadoEm: emDias(-96)
      },
      plano: { nome: 'Assinatura mensal', valor: 149, diaVencimento: 5 },
      assinatura: { inicio: emDias(-96), vence: emDias(4), status: 'ativo' },
      pagamentos: [
        { data: emDias(-26), valor: 149, meio: 'Cartão', status: 'pago' },
        { data: emDias(-57), valor: 149, meio: 'Cartão', status: 'pago' }
      ],
      nota: 'Domínio no CNPJ da clínica. Renovação do registro.br em março.'
    },
    {
      id: 'bibi-cartomante',
      nome: 'Gabriela Vieira',
      negocio: 'BiBi Cartomante',
      ramo: 'Tarot e Baralho Cigano',
      whatsapp: '5511993677994',
      email: '',
      cidade: 'São Paulo / SP',
      site: {
        endereco: 'bibicartomante.com.br',
        tipo: 'Domínio próprio',
        hospedagem: 'Cloudflare Pages',
        noAr: true,
        publicadoEm: emDias(-23)
      },
      plano: { nome: 'Manutenção mensal', valor: 50, diaVencimento: 15 },
      assinatura: { inicio: emDias(-23), vence: emDias(-3), status: 'atrasado' },
      pagamentos: [
        { data: emDias(-33), valor: 900, meio: 'Pix', status: 'pago', obs: 'Projeto — parcela final' }
      ],
      nota: 'Primeiro mês de manutenção era grátis. Esta é a primeira cobrança.'
    },
    {
      id: 'auto-center-jr',
      nome: 'Júnior Mendes',
      negocio: 'Auto Center JR',
      ramo: 'Oficina mecânica',
      whatsapp: '5511990003333',
      email: 'jr@autocenterjr.com',
      cidade: 'Diadema / SP',
      site: {
        endereco: 'autocenterjr.jeffcompany.com.br',
        tipo: 'Subdomínio',
        hospedagem: 'Cloudflare Pages',
        noAr: false,
        publicadoEm: emDias(-158)
      },
      plano: { nome: 'Assinatura mensal', valor: 50, diaVencimento: 20 },
      assinatura: { inicio: emDias(-158), vence: emDias(-38), status: 'suspenso' },
      pagamentos: [
        { data: emDias(-68), valor: 50, meio: 'Boleto', status: 'pago' },
        { data: emDias(-98), valor: 50, meio: 'Boleto', status: 'pago' }
      ],
      nota: 'Suspenso em ' + emDias(-32).toLocaleDateString('pt-BR') +
            ' após aviso. Arquivos guardados até ' + emDias(58).toLocaleDateString('pt-BR') + '.'
    },
    {
      id: 'studio-lumi',
      nome: 'Priscila Tavares',
      negocio: 'Studio Lumi',
      ramo: 'Estética e beleza',
      whatsapp: '5511990004444',
      email: 'oi@studiolumi.com.br',
      cidade: 'São Bernardo / SP',
      site: {
        endereco: 'studiolumi.jeffcompany.com.br',
        tipo: 'Subdomínio',
        hospedagem: 'Cloudflare Pages',
        noAr: true,
        publicadoEm: emDias(-61)
      },
      plano: { nome: 'Assinatura mensal', valor: 50, diaVencimento: 28 },
      assinatura: { inicio: emDias(-61), vence: emDias(1), status: 'ativo' },
      pagamentos: [
        { data: emDias(-29), valor: 50, meio: 'Pix', status: 'pago' },
        { data: emDias(-60), valor: 400, meio: 'Pix', status: 'pago', obs: 'Taxa de ativação' }
      ],
      nota: ''
    },
    {
      id: 'adv-ramos',
      nome: 'Carla Ramos',
      negocio: 'Ramos Advocacia',
      ramo: 'Advocacia',
      whatsapp: '5511990005555',
      email: 'carla@ramosadv.com.br',
      cidade: 'São Caetano / SP',
      site: {
        endereco: 'ramosadv.com.br',
        tipo: 'Domínio próprio',
        hospedagem: 'Cloudflare Pages',
        noAr: true,
        publicadoEm: emDias(-402)
      },
      plano: { nome: 'Manutenção mensal', valor: 200, diaVencimento: 1 },
      assinatura: { inicio: emDias(-402), vence: emDias(9), status: 'ativo' },
      pagamentos: [
        { data: emDias(-21), valor: 200, meio: 'Pix', status: 'pago' },
        { data: emDias(-52), valor: 200, meio: 'Pix', status: 'pago' },
        { data: emDias(-82), valor: 200, meio: 'Pix', status: 'pago' }
      ],
      nota: 'Cliente mais antigo. Já indicou dois. Tratar muito bem.'
    }
  ];
})();
