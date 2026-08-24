# Ramo BARBEARIA

Três modelos de landing page: **dois simples** e **um premium**.
Todos funcionam sem internet — abra o `index.html` com dois cliques e a página roda.

---

## A premium deste ramo foi igualada às outras

Quando a barbearia entrou na vitrine, o `premium-01-nobre` era uma página bonita
mas **entregava menos que a premium de beleza pelo mesmo R$ 60**. Isso foi
corrigido: as seis coisas que faltavam foram acrescentadas.

| Recurso | Estado |
|---|---|
| Galeria com lightbox (foto abre ampliada, com setas e ESC) | acrescentado |
| Depoimentos em carrossel (setas, bolinhas, teclado e arraste) | acrescentado — passaram de 3 para 5 |
| Perguntas frequentes em accordion | seção nova, 6 perguntas |
| Números com contador animado | seção nova, 4 números |
| Faixa de chamada no meio da página | acrescentada, entre a galeria e o clube |
| Cabeçalho que encolhe ao rolar | acrescentado |

Agora o R$ 60 significa a mesma coisa em barbearia e em beleza.

**Armadilha que apareceu nessa mudança, para quem for igualar outro ramo:** o
script foi aproveitado da premium de beleza, e as duas páginas usavam nomes de
classe diferentes para a mesma coisa. O menu aberto é `esta-aberto` aqui e
`aberto` lá; a revelação ao rolar é `esta-visivel` aqui e `visivel` lá. Com o
script trocado e o CSS não, o menu não abria e **a página inteira ficava
invisível** — hero, títulos e botões todos em `opacity: 0`. Ao transplantar
script entre modelos, confira uma a uma as classes que ele manipula contra o CSS
de destino:

```bash
grep -o "classList\.[a-z]*('[a-z-]*')" script.js | grep -o "'[a-z-]*'" | tr -d "'" | sort -u
```

Cada nome que sair daí precisa existir no `style.css` da mesma pasta.

---

## Os três modelos

| Vaga no passo 3 | Pasta | Negócio de exemplo | Estilo | Captura |
|---|---|---|---|---|
| Simples 1 — R$ 50 | `simples-01-urbana/` | Corte Bruto | Urbano e pesado, faixa rolante, tipografia condensada gigante, sombras sólidas | `bar-simples-01.webp` |
| Simples 2 — R$ 50 | `simples-02-classica/` | Barbearia Dom Aurélio | Clássico e quente, serifado, cardápio com linha pontilhada | `bar-simples-02.webp` |
| Premium — R$ 60 | `premium-01-nobre/` | Nobre Barber Club | Escuro e dourado, mosaico de fotos, selo de anos de casa | `bar-premium-01.webp` |

**A quem indicar cada um:**

- **Corte Bruto** — barbearia de rua, degradê e freestyle, público jovem, forte no Instagram, atendimento por ordem de chegada.
- **Dom Aurélio** — barbearia tradicional de bairro, clientela fiel, apelo em "desde 19XX", tesoura e navalha.
- **Nobre Barber Club** — barbearia de ticket alto, com bar, hora marcada e pacote de noivo.

---

## Como este ramo se liga ao site

Registrado em `pedido/js/modelos.js`, em `window.CONJUNTOS`, com o id `barbearia`.

Os termos genéricos — "barbearia", "barbeiro" — ficam só no nível do conjunto e
**não** em nenhuma vaga. É de propósito: a palavra "barbearia" não diz se a casa
é de rua ou tradicional, então nenhum cartão sai marcado como recomendado e a
pessoa compara os três. Inventar uma recomendação sem base seria pior que não dar
nenhuma. Quem escreve algo mais específico — "degradê", "navalha", "barber club" —
recebe a indicação.

**Barbearia saiu do conjunto `beleza`.** Os termos `barbearia`, `barbeiro` e
`barbeira` estavam lá e foram removidos: `conjuntoDoRamo` devolve o primeiro
conjunto que casa, e `beleza` vem antes, então a barbearia nunca apareceria.

**Se você mexer no visual de alguma página, gere a captura de novo**, senão o
cartão do formulário mostra uma versão que não existe mais. Abrir em 1280×960,
capturar, reduzir para 640×480 e salvar em `.webp` por cima do arquivo antigo.
O `node ferramentas/conferir-modelos.js` avisa quando a página mudou depois da
captura.

**A tarja `?demo=1`:** o formulário linka para cá com esse parâmetro e a página
cria sozinha o aviso de que nome, preços e depoimentos são fictícios. Na página
entregue ao cliente o endereço nunca tem o parâmetro, então o aviso não aparece.
Não apague esse trecho do `script.js`.

O `robots.txt` já bloqueia `/modelos/`, então estas páginas não vão para o
Google. Por isso elas **não** levam `noindex`: se levassem e você esquecesse de
tirar ao entregar para um cliente, o site dele nunca seria encontrado na busca.

---

## Personalizar para um cliente

O caminho é o mesmo dos outros ramos e está detalhado em
`modelos/beleza/LEIA-ME.md`: copiar a pasta, trocar as cores no `:root` do
`style.css`, procurar por `EDITAR` no `index.html`, substituir o WhatsApp em
todos os pontos com Ctrl+H, trocar os placeholders de foto e conferir a lista
final antes de publicar.

Só neste ramo, atenção a dois pontos:

- **Preços de barbearia mudam muito por região.** Os valores nos modelos são de
  bairro de capital. Confirme com o cliente antes de publicar.
- **A faixa rolante do Corte Bruto** (`simples-01-urbana`) tem textos curtos
  próprios no topo e no rodapé. São dois blocos separados no HTML, com o
  conteúdo repetido duas vezes cada — a repetição é o que faz a faixa girar sem
  buraco. Se trocar o texto, troque nas duas cópias.

---

## Antes de colocar no ar

Além do checklist geral do `modelos/beleza/LEIA-ME.md`:

- [ ] `node ferramentas/conferir-modelos.js` passando
- [ ] Depoimentos e números trocados por reais e autorizados
- [ ] Preços conferidos com o cliente
- [ ] Faixa rolante com o texto do negócio, nas duas cópias
- [ ] Captura regerada se o visual mudou

---

Páginas criadas e mantidas por **JeffDev**.
