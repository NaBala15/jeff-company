/* ==========================================================================
   Modelos prontos da assinatura

   São TRÊS, não cinco. Dois formatos simples pela mensalidade normal e um
   modelo completo que custa um pouco mais. Menos opção na tela = menos gente
   travada no passo 3, e menos página para eu manter no ar.

   Os dois simples são separados por FORMATO, não por ramo. Um dentista e um
   personal precisam da mesma coisa: mostrar serviço e marcar horário. Uma
   pizzaria e uma loja de roupa também: mostrar o produto e receber pedido.
   Organizar por ramo daria trinta modelos quase iguais.

   O COMPLETO não é um terceiro formato concorrendo com os outros. É a versão
   mais rica, que serve para qualquer ramo — quem escolhe está pagando pela
   página maior, não por um layout diferente.

   TRÊS VAGAS FIXAS, CONTEÚDO QUE MUDA POR RAMO
   Os três cartões são sempre os mesmos: Simples 1 e Simples 2 pela
   mensalidade normal, Premium um pouco mais caro. O que muda conforme o
   ramo digitado é QUAL página de verdade ocupa cada vaga — ver
   `window.CONJUNTOS` mais abaixo.

   Enquanto um ramo não tem páginas prontas, a vaga continua mostrando a
   miniatura desenhada em CSS e um aviso de que o modelo do ramo está sendo
   finalizado. Nunca mostramos a página de um ramo para o dono de outro: um
   dentista vendo uma obra não compra.
   ========================================================================== */

/* Mensalidade base da assinatura. Trocar aqui muda o passo 2, os cartões do
   passo 3 e o resumo enviado no WhatsApp — não há número solto no código. */
window.MENSALIDADE_BASE = 50;

window.MODELOS = [
  {
    id: 'simples-1',
    nome: 'Simples 1',
    resumo: 'Serviços, horários e um botão de agendar que acompanha a rolagem.',
    bom_para: 'Quem trabalha com hora marcada',
    inclui: ['Lista de serviços', 'Horário por dia', 'Agendar no WhatsApp', 'Fotos do espaço'],
    esqueleto: 'agenda',
    mensalidade: 50
  },
  {
    id: 'simples-2',
    nome: 'Simples 2',
    resumo: 'Foto grande do produto e cardápio ou catálogo logo abaixo.',
    bom_para: 'Quem vende algo que dá vontade de ver',
    inclui: ['Foto de destaque', 'Lista de produtos com preço', 'Botão de pedido', 'Horário e entrega'],
    esqueleto: 'vitrine',
    mensalidade: 50
  },
  {
    id: 'premium',
    nome: 'Premium',
    resumo: 'A página maior: tudo dos outros dois mais galeria, depoimentos, mapa e efeitos ao rolar.',
    bom_para: 'Quem quer peso na primeira impressão',
    inclui: [
      'Tudo que os modelos simples têm',
      'Galeria de fotos do seu trabalho',
      'Depoimentos de clientes',
      'Mapa e como chegar',
      'Perguntas frequentes',
      'Efeitos suaves ao rolar a página'
    ],
    esqueleto: 'completa',
    mensalidade: 60
  }
];

/* --------------------------------------------------------------------------
   Sugestão por ramo

   Serve só para ORDENAR e marcar "recomendado". A pessoa continua podendo
   escolher qualquer um — quem conhece o próprio negócio é ela.

   O modelo completo é sugerido para os ramos de ticket mais alto (advogado,
   contador, clínica, imobiliária, arquiteto). Não é pegadinha: é justamente
   quem mais depende de parecer sólido antes de ser contratado, e para quem
   dez reais a mais no mês não pesa.
   -------------------------------------------------------------------------- */

window.SUGESTOES = [
  /* ---- Vitrine: alimentação, varejo e trabalho que se vende pela imagem ---- */
  { termos: ['restaurante', 'pizzaria', 'lanchonete', 'hamburgueria', 'padaria', 'confeitaria', 'doceria', 'açaí', 'acai', 'marmita', 'delivery', 'food', 'bar', 'pizza', 'sorveteria', 'cafeteria', 'café', 'cafe', 'doce', 'salgado', 'espetinho'], modelo: 'simples-2' },
  { termos: ['loja', 'roupa', 'boutique', 'calçado', 'calcado', 'papelaria', 'pet shop', 'petshop', 'floricultura', 'mercado', 'comércio', 'comercio', 'presente', 'artesanato', 'semijoia', 'cosmético', 'cosmetico'], modelo: 'simples-2' },
  { termos: ['fotógrafo', 'fotografo', 'fotógrafa', 'fotografa', 'fotografia', 'designer', 'design', 'tatuador', 'tatuadora', 'tatuagem', 'reforma', 'pintor', 'marceneiro', 'serralheria', 'gesso', 'paisagismo', 'decoração', 'decoracao', 'festa', 'buffet', 'confeiteira', 'bolo'], modelo: 'simples-2' },

  /* ---- Agenda: beleza, bem-estar e serviço chamado na hora ---- */
  { termos: ['cabeleireiro', 'cabeleireira', 'cabelereiro', 'cabelereira', 'salão', 'salao', 'salões', 'saloes', 'barbearia', 'barbeiro', 'barbeira', 'estética', 'estetica', 'esteticista', 'manicure', 'unha', 'depilação', 'depilacao', 'depiladora', 'massagem', 'massagista', 'sobrancelha', 'cílios', 'cilios', 'spa', 'maquiagem', 'maquiadora', 'corte'], modelo: 'simples-1' },
  { termos: ['fisioterapia', 'fisioterapeuta', 'nutricionista', 'nutrição', 'nutricao', 'terapeuta', 'academia', 'personal', 'pilates', 'crossfit'], modelo: 'simples-1' },
  { termos: ['chaveiro', 'encanador', 'eletricista', 'desentupidora', 'guincho', 'borracharia', 'mecânica', 'mecanica', 'mecânico', 'mecanico', 'funilaria', 'oficina', 'auto center', 'autocenter', 'geladeira', 'ar condicionado', 'refrigeração', 'refrigeracao', 'conserto', 'assistência', 'assistencia', 'dedetizadora', 'dedetização'], modelo: 'simples-1' },

  /* ---- Completa: profissional liberal e saúde ---- */
  { termos: ['advogado', 'advogada', 'advocacia', 'contador', 'contadora', 'contabilidade', 'despachante', 'corretor', 'corretora', 'imobiliária', 'imobiliaria', 'seguro', 'consultoria', 'engenheiro', 'engenheira', 'arquiteto', 'arquiteta', 'financeiro'], modelo: 'premium' },
  { termos: ['dentista', 'odonto', 'odontologia', 'clínica', 'clinica', 'psicólogo', 'psicologo', 'psicóloga', 'psicologa', 'psicologia', 'médico', 'medico', 'médica', 'medica', 'consultório', 'consultorio', 'veterinário', 'veterinario', 'veterinária', 'veterinaria'], modelo: 'premium' }
];

/* ==========================================================================
   CONJUNTOS DE PÁGINAS POR RAMO

   Cada conjunto é um ramo com as três páginas de verdade já construídas.
   Quando o ramo digitado casa com um conjunto, os três cartões do passo 3
   trocam a miniatura desenhada por uma FOTO da página e ganham um link para
   abrir a página inteira.

   Ramo que ainda não tem conjunto continua com a miniatura desenhada. É de
   propósito: mostrar a página de uma construtora para um dentista faz ele
   achar que não é para ele.

   PARA ACRESCENTAR UM RAMO NOVO:
     1. gere as três páginas em modelos/<ramo>/
     2. tire uma captura de cada uma em 1280×960, reduza para 640×480 e
        salve em assets/img/modelos/ como .webp
     3. copie o bloco abaixo, troque termos, textos, imagens e links
   ========================================================================== */

/* Onde as páginas de modelo estão hospedadas.

   Hoje elas moram dentro deste mesmo site, então o caminho é relativo.
   Quando você subir todos os modelos para um endereço próprio — por
   exemplo modelos.jeffcompany.com.br — troque SÓ ESTA LINHA por
   'https://modelos.jeffcompany.com.br/' e todos os links se ajustam. */
window.BASE_MODELOS = '../modelos/';

/* Pasta das capturas usadas nos cartões. */
window.BASE_PREVIAS = '../assets/img/modelos/';

window.CONJUNTOS = [
  {
    id: 'servicos-tecnicos',
    nome: 'Serviços técnicos e reformas',

    /* que ramos digitados caem neste conjunto */
    termos: [
      'reforma', 'reformas', 'pedreiro', 'pintor', 'pintura', 'empreiteiro',
      'construtora', 'construção', 'construcao', 'marceneiro', 'marcenaria',
      'gesso', 'drywall', 'serralheria', 'vidraçaria', 'vidracaria',
      'encanador', 'hidráulica', 'hidraulica', 'eletricista', 'elétrica',
      'eletrica', 'chaveiro', 'desentupidora', 'desentupimento',
      'dedetizadora', 'dedetização', 'dedetizacao',
      'ar condicionado', 'refrigeração', 'refrigeracao', 'climatização',
      'manutenção', 'manutencao', 'assistência técnica', 'assistencia tecnica',
      'arquiteto', 'arquiteta', 'arquitetura', 'design de interiores'
    ],

    paginas: {
      'simples-1': {
        titulo: 'Reforma Certa',
        resumo: 'Visual de obra, serviços em grade com preço e orçamento pelo WhatsApp.',
        bom_para: 'Reforma, pintura e obra com hora marcada',
        imagem: 'st-simples-01.webp',
        link: 'servicos-tecnicos/simples-01-industrial/',
        /* quando o ramo casar com um destes, este é o recomendado */
        termos: ['reforma', 'reformas', 'pedreiro', 'pintor', 'pintura',
                 'empreiteiro', 'construtora', 'construção', 'construcao',
                 'marceneiro', 'marcenaria', 'gesso', 'drywall']
      },
      'simples-2': {
        titulo: 'Pronto 24h',
        resumo: 'Claro e direto, com plantão em destaque e botão de ligar sempre à mão.',
        bom_para: 'Quem é chamado na urgência, a qualquer hora',
        imagem: 'st-simples-02.webp',
        link: 'servicos-tecnicos/simples-02-emergencia/',
        termos: ['encanador', 'eletricista', 'chaveiro', 'desentupidora',
                 'desentupimento', 'dedetizadora', 'ar condicionado',
                 'refrigeração', 'refrigeracao', 'hidráulica', 'hidraulica',
                 'elétrica', 'eletrica', 'manutenção', 'manutencao',
                 'assistência técnica', 'assistencia tecnica']
      },
      'premium': {
        titulo: 'Vertek',
        resumo: 'A página maior: galeria de obras, depoimentos, dúvidas e números.',
        bom_para: 'Serviço de alto padrão, onde a foto vende',
        imagem: 'st-premium-01.webp',
        link: 'servicos-tecnicos/premium-01-elegante/',
        termos: ['arquiteto', 'arquiteta', 'arquitetura', 'design de interiores']
      }
    }
  }
];

/* Devolve o conjunto do ramo escrito, ou null se ainda não existir. */
window.conjuntoDoRamo = function (ramo) {
  var texto = String(ramo || '').toLowerCase().trim();
  if (!texto) return null;

  for (var i = 0; i < window.CONJUNTOS.length; i++) {
    var c = window.CONJUNTOS[i];
    for (var j = 0; j < c.termos.length; j++) {
      if (contemPalavra(texto, c.termos[j])) return c;
    }
  }
  return null;
};

/* A comparação é por PALAVRA INTEIRA, não por pedaço de texto.
   Procurando só o pedaço, "bar" casava dentro de "barbearia" e a barbearia
   recebia o modelo de restaurante.

   Mas palavra inteira pura era rígida demais: quem escrevia "reformas",
   "lojas" ou "bares" não casava com "reforma", "loja" e "bar", e ficava sem
   sugestão nenhuma. Por isso o fim do termo aceita o PLURAL: nada, "s" ou
   "es". Isso resolve o plural inteiro sem precisar duplicar a lista.

   O "es" não é enfeite — é ele que faz "bar" virar "bares" e "corretor"
   virar "corretores". Sem ele, metade dos plurais em consoante ficava de fora.

   Continua seguro: em "barbearia", depois de "bar" vem "b", que não é sufixo
   de plural nem fronteira, então não casa. Em "cortesia", depois de "corte"
   vem "s" mas depois do "s" vem "i", que também não é fronteira. */
function contemPalavra(texto, termo) {
  var limite  = /[^a-zà-ÿ0-9]/i;     // qualquer coisa que não seja letra ou número
  var plurais = ['', 's', 'es'];
  var i = texto.indexOf(termo);

  while (i !== -1) {
    var antes = i === 0 ? '' : texto.charAt(i - 1);

    if (antes === '' || limite.test(antes)) {
      var resto = texto.slice(i + termo.length);

      for (var k = 0; k < plurais.length; k++) {
        if (resto.indexOf(plurais[k]) !== 0) continue;
        var depois = resto.charAt(plurais[k].length);
        if (depois === '' || limite.test(depois)) return true;
      }
    }
    i = texto.indexOf(termo, i + 1);
  }
  return false;
}

/* Devolve o id da vaga sugerida para o ramo escrito, ou null.

   Se o ramo tem conjunto próprio, quem manda é o conjunto: ali sabemos
   exatamente qual das três páginas foi desenhada para aquele ofício.
   A lista genérica de SUGESTÕES só entra quando não há conjunto — ela
   raciocina por formato, e formato é um chute mais grosso do que o ramo. */
window.sugerirModelo = function (ramo) {
  var texto = String(ramo || '').toLowerCase().trim();
  if (!texto) return null;

  var conjunto = window.conjuntoDoRamo(texto);
  if (conjunto) {
    for (var vaga in conjunto.paginas) {
      var termos = conjunto.paginas[vaga].termos || [];
      for (var t = 0; t < termos.length; t++) {
        if (contemPalavra(texto, termos[t])) return vaga;
      }
    }
    /* casou com o conjunto mas com nenhuma vaga em particular:
       melhor não recomendar nada do que recomendar no chute */
    return null;
  }

  for (var i = 0; i < window.SUGESTOES.length; i++) {
    var grupo = window.SUGESTOES[i];
    for (var j = 0; j < grupo.termos.length; j++) {
      if (contemPalavra(texto, grupo.termos[j])) return grupo.modelo;
    }
  }
  return null;
};

/* Ramos oferecidos como atalho no campo — os mais comuns no comércio de
   bairro, que é quem esta assinatura atende. */
window.RAMOS_COMUNS = [
  'Cabeleireiro', 'Barbearia', 'Estética e beleza', 'Manicure',
  'Dentista', 'Clínica', 'Psicólogo', 'Nutricionista', 'Fisioterapia',
  'Restaurante', 'Pizzaria', 'Lanchonete', 'Padaria', 'Confeitaria', 'Açaí',
  'Loja de roupas', 'Pet shop', 'Floricultura', 'Mercado',
  'Advogado', 'Contador', 'Corretor de imóveis',
  'Mecânica', 'Chaveiro', 'Eletricista', 'Encanador', 'Assistência técnica',
  'Fotógrafo', 'Tatuador', 'Reformas', 'Buffet e festas',
  'Academia', 'Personal trainer', 'Pilates'
];
