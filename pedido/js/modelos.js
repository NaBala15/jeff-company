/* ==========================================================================
   Modelos prontos da assinatura

   As miniaturas ainda são DESENHADAS EM CSS, não são capturas — as páginas
   de verdade serão feitas depois. Cada modelo tem um esqueleto próprio, então
   a pessoa já entende a diferença entre eles pela forma, não só pelo nome.

   Quando os modelos existirem, troque `capa` pelo caminho da imagem em
   assets/modelos/ e o resto continua funcionando.

   Os modelos são separados por FORMATO, não por ramo. Um dentista e um
   advogado precisam da mesma coisa: passar confiança e agendar. Uma pizzaria
   e uma loja de roupa também: mostrar o produto e receber pedido. Organizar
   por ramo daria trinta modelos quase iguais.
   ========================================================================== */

window.MODELOS = [
  {
    id: 'vitrine',
    nome: 'Vitrine',
    resumo: 'Foto grande do produto e cardápio ou catálogo logo abaixo.',
    bom_para: 'Quem vende algo que dá vontade de ver',
    inclui: ['Foto de destaque', 'Lista de produtos com preço', 'Botão de pedido', 'Horário e entrega'],
    esqueleto: 'vitrine'
  },
  {
    id: 'agenda',
    nome: 'Agenda',
    resumo: 'Serviços, horários e um botão de agendar que acompanha a rolagem.',
    bom_para: 'Quem trabalha com hora marcada',
    inclui: ['Lista de serviços', 'Horário por dia', 'Agendar no WhatsApp', 'Fotos do espaço'],
    esqueleto: 'agenda'
  },
  {
    id: 'confianca',
    nome: 'Confiança',
    resumo: 'Sóbrio e claro, com espaço para formação, registro e depoimentos.',
    bom_para: 'Quem precisa passar segurança antes de ser contratado',
    inclui: ['Sua apresentação', 'Áreas de atuação', 'Registro profissional', 'Depoimentos'],
    esqueleto: 'confianca'
  },
  {
    id: 'urgencia',
    nome: 'Chamada rápida',
    resumo: 'Telefone gigante na primeira tela. Feito para quem é procurado com pressa.',
    bom_para: 'Quem atende emergência',
    inclui: ['Telefone em destaque', 'Área atendida', 'Atende 24h?', 'Serviços de urgência'],
    esqueleto: 'urgencia'
  },
  {
    id: 'portfolio',
    nome: 'Portfólio',
    resumo: 'Grade com os trabalhos que você já fez, em destaque.',
    bom_para: 'Quem vende pelo que já entregou',
    inclui: ['Grade de trabalhos', 'Antes e depois', 'Sobre você', 'Orçamento no WhatsApp'],
    esqueleto: 'portfolio'
  }
];

/* --------------------------------------------------------------------------
   Sugestão por ramo

   Serve só para ORDENAR e marcar "recomendado". A pessoa continua podendo
   escolher qualquer um — quem conhece o próprio negócio é ela.
   -------------------------------------------------------------------------- */

window.SUGESTOES = [
  { termos: ['restaurante', 'pizzaria', 'lanchonete', 'hamburgueria', 'padaria', 'confeitaria', 'doceria', 'açaí', 'acai', 'marmita', 'delivery', 'food', 'bar', 'pizza', 'sorveteria', 'cafeteria', 'café'], modelo: 'vitrine' },
  { termos: ['loja', 'roupa', 'boutique', 'calçado', 'calcado', 'papelaria', 'pet shop', 'petshop', 'floricultura', 'mercado', 'comércio', 'comercio', 'presente', 'artesanato', 'semijoia', 'cosmético', 'cosmetico'], modelo: 'vitrine' },

  { termos: ['cabeleireiro', 'cabelereiro', 'salão', 'salao', 'barbearia', 'barbeiro', 'estética', 'estetica', 'manicure', 'unha', 'depilação', 'depilacao', 'massagem', 'sobrancelha', 'cílios', 'cilios', 'spa', 'maquiagem'], modelo: 'agenda' },
  { termos: ['dentista', 'odonto', 'clínica', 'clinica', 'fisioterapia', 'psicólogo', 'psicologo', 'psicologia', 'nutricionista', 'nutrição', 'nutricao', 'médico', 'medico', 'consultório', 'consultorio', 'terapeuta', 'veterinário', 'veterinario', 'academia', 'personal', 'pilates'], modelo: 'agenda' },

  { termos: ['advogado', 'advocacia', 'contador', 'contabilidade', 'despachante', 'corretor', 'imobiliária', 'imobiliaria', 'seguro', 'consultoria', 'engenheiro', 'arquiteto', 'financeiro'], modelo: 'confianca' },

  { termos: ['chaveiro', 'encanador', 'eletricista', 'desentupidora', 'guincho', 'borracharia', 'mecânica', 'mecanica', 'oficina', 'auto center', 'autocenter', 'geladeira', 'ar condicionado', 'conserto', 'assistência', 'assistencia', 'dedetizadora', 'dedetização'], modelo: 'urgencia' },

  { termos: ['fotógrafo', 'fotografo', 'fotografia', 'designer', 'design', 'tatuador', 'tatuagem', 'reforma', 'pintor', 'marceneiro', 'serralheria', 'gesso', 'paisagismo', 'decoração', 'decoracao', 'festa', 'buffet', 'confeiteira', 'bolo'], modelo: 'portfolio' }
];

/* A comparação é por PALAVRA INTEIRA, não por pedaço de texto.
   Procurando só o pedaço, "bar" casava dentro de "barbearia" e a barbearia
   recebia o modelo de restaurante. */
function contemPalavra(texto, termo) {
  var limite = /[^a-zà-ÿ0-9]/i;      // qualquer coisa que não seja letra ou número
  var i = texto.indexOf(termo);

  while (i !== -1) {
    var antes  = i === 0 ? '' : texto.charAt(i - 1);
    var depois = texto.charAt(i + termo.length);
    if ((antes === '' || limite.test(antes)) &&
        (depois === '' || limite.test(depois))) return true;
    i = texto.indexOf(termo, i + 1);
  }
  return false;
}

/* Devolve o id do modelo sugerido para o ramo escrito, ou null. */
window.sugerirModelo = function (ramo) {
  var texto = String(ramo || '').toLowerCase().trim();
  if (!texto) return null;

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
