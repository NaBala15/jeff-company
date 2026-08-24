# Ramo CABELEIREIRO

Três modelos de landing page: **dois simples** e **um premium**.
Todos funcionam sem internet — abra o `index.html` com dois cliques e a página roda.

Para mostrar ao cliente, abra o **`comparativo.html`**: exibe os três lado a lado,
com a lista do que o premium tem a mais.

---

## Os três modelos

| Vaga no passo 3 | Pasta | Negócio de exemplo | Estilo | Captura |
|---|---|---|---|---|
| Simples 1 — R$ 50 | `simples-01-natural/` | Salão Raiz | Claro e natural, serifado, foto em arco no topo, oliva e areia | `cab-simples-01.webp` |
| Simples 2 — R$ 50 | `simples-02-noturno/` | Estúdio Trama | Escuro e moderno, sans condensada, cobre sobre preto | `cab-simples-02.webp` |
| Premium — R$ 60 | `premium-01-atelie/` | Casa Anelis | Alto padrão em camadas, serif display, bronze e marfim | `cab-premium-01.webp` |

**A quem indicar cada um:**

- **Salão Raiz** — salão de bairro, corte e cor do dia a dia, clientela de vizinhança.
- **Estúdio Trama** — estúdio de cor, loiro e morena iluminada, público jovem, forte no Instagram.
- **Casa Anelis** — salão de alto padrão, balayage, noiva, ticket alto e hora marcada.

---

## Por que este ramo saiu do conjunto `beleza`

Cabeleireiro estava sendo atendido pelo conjunto `beleza`, cuja premium é uma
clínica de estética. Só que **cabeleireiro não vende limpeza de pele** — vende
corte, cor, escova e tratamento capilar. A cliente que abria os modelos via
serviços que não são dela.

Agora `beleza` cobre estética, unha, sobrancelha, depilação e spa; `cabeleireiro`
tem os próprios três modelos. Os termos `cabeleireiro`, `cabeleireira`, `salão`
e variações foram **removidos do conjunto beleza** — `conjuntoDoRamo` devolve o
primeiro que casa, e beleza vem antes, então deixá-los nos dois faria este ramo
nunca aparecer.

---

## Como este ramo se liga ao site

Registrado em `pedido/js/modelos.js`, em `window.CONJUNTOS`, com o id
`cabeleireiro`.

Os termos de cada vaga decidem qual cartão sai marcado como recomendado:

| Quem escreve | Recomendado |
|---|---|
| cabeleireira, corte feminino, escova, hidratação capilar | Salão Raiz |
| colorista, mechas, luzes, loiro, morena iluminada, coloração | Estúdio Trama |
| balayage, noiva, penteado, progressiva, alisamento | Casa Anelis |

**Se você mexer no visual de alguma página, gere a captura de novo**, senão o
cartão do formulário mostra uma versão que não existe mais. Abrir em 1280×960,
capturar, reduzir para 640×480 e salvar em `.webp` por cima do antigo. O
`node ferramentas/conferir-modelos.js` avisa quando a página mudou depois da captura.

**A tarja `?demo=1`:** o formulário linka para cá com esse parâmetro e a página
cria sozinha o aviso de que nome, preços e depoimentos são fictícios. Na página
entregue ao cliente o endereço nunca tem o parâmetro. Não apague esse trecho do
`script.js`.

O `robots.txt` já bloqueia `/modelos/`, então estas páginas não vão para o Google.
Por isso elas **não** levam `noindex`: se levassem e você esquecesse de tirar ao
entregar para um cliente, o site dele nunca seria encontrado na busca.

---

## Personalizar para um cliente

O caminho é o mesmo dos outros ramos e está detalhado em
`modelos/beleza/LEIA-ME.md`: copiar a pasta, trocar as cores no `:root` do
`style.css`, procurar por `EDITAR` no `index.html`, substituir o WhatsApp com
Ctrl+H, trocar os placeholders de foto e conferir a lista final antes de publicar.

Atenção a três pontos específicos deste ramo:

- **Preço de química varia muito com o comprimento do cabelo.** Os modelos usam
  valor de referência e dizem que cabelo longo tem acréscimo combinado antes.
  Confirme a política do cliente antes de publicar — é a maior fonte de briga
  entre salão e cliente.
- **Teste de mecha aparece como diferencial nas três páginas.** Se o cliente não
  faz teste de mecha, tire o texto. Prometer o que não se cumpre é pior que não
  prometer.
- **A premium tem 5 depoimentos e 4 números inventados.** São os itens que mais
  precisam virar dados reais antes de ir ao ar.

---

## Antes de colocar no ar

Além do checklist geral do `modelos/beleza/LEIA-ME.md`:

- [ ] `node ferramentas/conferir-modelos.js` passando
- [ ] Depoimentos e números trocados por reais e autorizados
- [ ] Política de preço para cabelo longo confirmada com o cliente
- [ ] Texto de teste de mecha conferido com a prática real do salão
- [ ] Captura regerada se o visual mudou

---

Páginas criadas e mantidas por **JeffDev**.
