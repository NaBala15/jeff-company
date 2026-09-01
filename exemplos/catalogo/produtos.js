/* ==========================================================================

   COZINHA DA VILA — O CARDÁPIO INTEIRO ESTÁ AQUI
   Criado por JEFF COMPANY · JeffDev

   ESTE É O ÚNICO ARQUIVO QUE O DONO DO NEGÓCIO PRECISA MEXER.

   Para mudar preço:      troque o número em `preco`.
   Para tirar do ar:      mude `ativo` para false (não precisa apagar nada).
   Para marcar novidade:  `selo: 'Novo'` — vale qualquer palavra curta.
   Para acrescentar item: copie um bloco inteiro, de { até }, e edite.

   Regras que não podem ser quebradas, senão o pedido erra a conta:
   · `id` não se repete e não muda depois de publicado;
   · `preco` é número, com ponto e não vírgula: 24.90, nunca "24,90";
   · `categoria` tem que ser um dos `id` da lista CATEGORIAS aqui em cima.

   ========================================================================== */

/* EDITAR: as categorias e a ordem em que aparecem */
window.CATEGORIAS = [
  { id: 'todos',    nome: 'Tudo' },
  { id: 'marmitas', nome: 'Marmitas' },
  { id: 'pratos',   nome: 'Pratos do dia' },
  { id: 'porcoes',  nome: 'Porções' },
  { id: 'doces',    nome: 'Doces' },
  { id: 'bebidas',  nome: 'Bebidas' }
];

/* EDITAR: os produtos */
window.PRODUTOS = [

  /* ---------------------------------------------------------- marmitas */
  {
    id: 'mar-01',
    nome: 'Marmita tradicional',
    categoria: 'marmitas',
    preco: 22.90,
    descricao: 'Arroz, feijão, bife acebolado, batata frita e salada do dia.',
    foto: 'fotos/marmita-tradicional.webp',
    alt: 'Marmita com arroz, feijão, bife acebolado e batata',
    selo: 'Mais pedida',
    ativo: true
  },
  {
    id: 'mar-02',
    nome: 'Marmita frango grelhado',
    categoria: 'marmitas',
    preco: 21.90,
    descricao: 'Arroz, feijão, filé de frango grelhado, legumes no vapor e salada.',
    foto: 'fotos/marmita-frango.webp',
    alt: 'Marmita com frango grelhado e legumes',
    selo: '',
    ativo: true
  },
  {
    id: 'mar-03',
    nome: 'Marmita vegetariana',
    categoria: 'marmitas',
    preco: 20.90,
    descricao: 'Arroz integral, feijão, abobrinha recheada, farofa de couve e salada.',
    foto: 'fotos/marmita-vegetariana.webp',
    alt: 'Marmita vegetariana com abobrinha recheada e arroz integral',
    selo: 'Sem carne',
    ativo: true
  },
  {
    id: 'mar-04',
    nome: 'Marmita família (2 pessoas)',
    categoria: 'marmitas',
    preco: 39.90,
    descricao: 'Porção dobrada do prato do dia, em embalagem grande. Serve dois.',
    foto: 'fotos/marmita-familia.webp',
    alt: 'Embalagem grande de comida para duas pessoas',
    selo: '',
    ativo: true
  },

  /* ------------------------------------------------------------ pratos */
  {
    id: 'pra-01',
    nome: 'Feijoada da casa',
    categoria: 'pratos',
    preco: 32.90,
    descricao: 'Servida às quartas e sábados, com couve, farofa, laranja e arroz.',
    foto: 'fotos/feijoada.webp',
    alt: 'Prato de feijoada com couve, farofa e laranja',
    selo: 'Quarta e sábado',
    ativo: true
  },
  {
    id: 'pra-02',
    nome: 'Parmegiana de frango',
    categoria: 'pratos',
    preco: 34.90,
    descricao: 'Filé empanado com molho e queijo, arroz e fritas. Serve bem uma pessoa.',
    foto: 'fotos/parmegiana.webp',
    alt: 'Filé à parmegiana com arroz e batata frita',
    selo: '',
    ativo: true
  },
  {
    id: 'pra-03',
    nome: 'Strogonoff de carne',
    categoria: 'pratos',
    preco: 31.90,
    descricao: 'Com arroz branco e batata palha feita na hora.',
    foto: 'fotos/strogonoff.webp',
    alt: 'Strogonoff de carne com arroz e batata palha',
    selo: '',
    ativo: true
  },

  /* ----------------------------------------------------------- porções */
  {
    id: 'por-01',
    nome: 'Porção de fritas',
    categoria: 'porcoes',
    preco: 18.00,
    descricao: 'Batata frita crocante com sal e alecrim. Serve duas pessoas.',
    foto: 'fotos/fritas.webp',
    alt: 'Porção de batata frita',
    selo: '',
    ativo: true
  },
  {
    id: 'por-02',
    nome: 'Bolinho de feijoada (6 un.)',
    categoria: 'porcoes',
    preco: 24.00,
    descricao: 'Recheado com feijoada desfiada, empanado e frito na hora.',
    foto: 'fotos/bolinho.webp',
    alt: 'Bolinhos fritos servidos em prato',
    selo: 'Novo',
    ativo: true
  },

  /* ------------------------------------------------------------- doces */
  {
    id: 'doc-01',
    nome: 'Pudim de leite',
    categoria: 'doces',
    preco: 9.90,
    descricao: 'Fatia generosa, com calda de caramelo. Feito todo dia de manhã.',
    foto: 'fotos/pudim.webp',
    alt: 'Fatia de pudim de leite com calda',
    selo: '',
    ativo: true
  },
  {
    id: 'doc-02',
    nome: 'Bolo de fubá com goiabada',
    categoria: 'doces',
    preco: 8.50,
    descricao: 'Fatia de bolo caseiro, ainda morno quando sai às 15h.',
    foto: 'fotos/bolo-fuba.webp',
    alt: 'Fatia de bolo de fubá com goiabada',
    selo: '',
    ativo: true
  },

  /* ----------------------------------------------------------- bebidas */
  {
    id: 'beb-01',
    nome: 'Suco natural 500 ml',
    categoria: 'bebidas',
    preco: 8.00,
    descricao: 'Laranja, maracujá, abacaxi com hortelã ou limão.',
    foto: 'fotos/suco.webp',
    alt: 'Copo de suco natural',
    selo: '',
    ativo: true
  },
  {
    id: 'beb-02',
    nome: 'Refrigerante lata',
    categoria: 'bebidas',
    preco: 6.00,
    descricao: 'Coca-Cola, Guaraná ou Sprite, sempre gelados.',
    foto: 'fotos/refrigerante.webp',
    alt: 'Latas de refrigerante geladas',
    selo: '',
    ativo: true
  }
];

/* EDITAR: número do WhatsApp que recebe os pedidos, taxa e pedido mínimo.
   O número vai no formato 55 + DDD + telefone, só dígitos. */
window.LOJA = {
  whatsapp: '5515998877665',
  nome: 'Cozinha da Vila',
  taxaEntrega: 8.00,
  pedidoMinimo: 25.00
};
