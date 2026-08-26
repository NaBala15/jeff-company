# Modelos de página, por ramo

Cada pasta aqui é um **ramo** com três landing pages prontas — duas simples
(R$ 50/mês) e uma premium (R$ 60/mês) — mais o `comparativo.html`, que é a
página que você abre com o cliente para ele escolher.

| Ramo | Pasta | Simples 1 | Simples 2 | Premium |
|---|---|---|---|---|
| Barbearia | `barbearia/` | Urbana | Clássica | Nobre |
| Beleza | `beleza/` | Suave | Contraste | Luxo |
| Buffet e festas | `buffet/` | Festivo | Elegante | Salão |
| Cabeleireiro | `cabeleireiro/` | Natural | Noturno | Ateliê |
| Decoração de festas | `decoracao/` | Lúdico | Minimal | Cenografia |
| Serviços técnicos | `servicos-tecnicos/` | Reforma Certa | Pronto 24h | Vertek |

---

## O comparativo é padronizado

Os seis `comparativo.html` são **iguais em estrutura, tamanho e estilo**. Só
muda o conteúdo. Isso é de propósito: o cliente que vê dois ramos diferentes
reconhece a mesma página, e você não mantém seis leiautes.

O padrão tem, nesta ordem:

1. **Topo** com o nome do ramo e a dica de rolar dentro da janela
2. **Título e explicação** — o que muda de um modelo para outro
3. **Faixa de condições** — preço, mês grátis, permanência, o que está incluso
4. **Os três modelos lado a lado**, cada um com prévia ao vivo e preço
5. **O que o premium tem a mais** — as sete diferenças, com a explicação do
   porquê dos R$ 10
6. **Chamada final** para o WhatsApp
7. **Rodapé**

### Detalhes que não devem mudar

- **Paleta da Jeff Company**: preto `#0A0B09` e lima `#C7F53F`. As páginas de
  modelo têm cada uma a sua cor; o comparativo é sempre da agência.
- **Prévia ao vivo, não captura.** O iframe é renderizado a 320% e reduzido por
  `transform: scale(.3125)`. O resultado dá exatamente 100% da janela em
  qualquer tela — com largura fixa em pixels, a prévia corta a coluna da
  direita, que é o que o cliente quer ver.
- **O premium se destaca** por borda lima, sombra e preço em lima. Não invente
  outro jeito: a diferença tem que entrar pelos olhos antes da leitura.
- **`noindex`** no comparativo. É página de venda, aberta por link, e as
  prévias são de negócios fictícios.
- **Os links das prévias levam `?demo=1`**, que liga o aviso de exemplo dentro
  da página do modelo.

---

## Para acrescentar um ramo novo

1. Gere as três páginas em `modelos/<ramo>/`
2. Capture cada uma em 1280×960, reduza para 640×480 e salve em
   `assets/img/modelos/` como `.webp`
3. **Copie o `comparativo.html` de qualquer ramo existente** e troque: título,
   descrição, nome do ramo no topo e no rodapé, os três blocos `<article>`
   (nome, negócio de exemplo, pasta e resumo) e o nome do premium no
   `<h2>O que o modelo … tem a mais</h2>`. A faixa de condições e a lista das
   sete diferenças ficam como estão.
4. Registre o conjunto em `pedido/js/modelos.js`, dentro de `window.CONJUNTOS`

### Cuidado com a ordem dos ramos no registro

`conjuntoDoRamo()` devolve o **primeiro** conjunto cujo termo casar. Se um termo
aparecer em dois conjuntos, o que estiver primeiro na lista vence e o outro
nunca aparece.

Já aconteceu: "salão" e "barbearia" estavam em `beleza`, e por isso os conjuntos
`cabeleireiro` e `barbearia` nasceram invisíveis. A correção foi tirar os termos
do conjunto mais genérico. Ao acrescentar um ramo, **confira se algum termo dele
já existe em outro** antes de publicar.

---

## Onde isso aparece para o cliente

**O comparativo É o passo 3 do `/pedido/`.** Quando o ramo digitado tem
conjunto, o "Continuar" do passo 2 leva a pessoa para cá — na mesma aba, como
um passo de verdade. Cada cartão ganha o botão *"Escolher este modelo"*, que
devolve para o passo 4 com a escolha já feita.

O que o formulário já tinha preenchido fica guardado no navegador (chave
`jc-pedido`) e volta sozinho. A memória é apagada quando o pedido é enviado,
para o próximo visitante do mesmo aparelho não abrir o formulário com os dados
de outra pessoa.

A página tem **dois usos, e sabe em qual está**:

| Aberta | Como se comporta |
|---|---|
| Com `?pedido=1` | Barra "Passo 3 de 5", botões de escolher, sem a chamada de WhatsApp |
| Direto, sem parâmetro | Vitrine de venda: sem os botões, terminando no WhatsApp |

Ramo sem conjunto não tem comparativo para onde mandar, então o passo 3
continua sendo os cartões desenhados dentro do formulário, com o aviso de que
as páginas daquele ramo estão sendo finalizadas — nunca a página de outro ramo.

---

*JeffDev · Jeff Company*
