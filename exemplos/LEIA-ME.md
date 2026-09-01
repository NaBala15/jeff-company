# Páginas de exemplo — Jeff Company

Hoje mora aqui **uma** página: `catalogo/`, a **Cozinha da Vila** — marmitaria
fictícia em Sorocaba, exemplo do formato **catálogo com pedido no WhatsApp**.

> O exemplo de **site institucional** que ficava aqui (Marino Contabilidade)
> virou modelo de verdade: mudou para
> `modelos/institucional/premium-01-contabil/`. Se algum link antigo apontar
> para `exemplos/institucional/`, é dali que ele tem que passar a apontar.

---

## Por que o catálogo não virou ramo

Os ramos de `modelos/` são páginas prontas da assinatura, de R$ 50 e R$ 60.
Catálogo com carrinho **não cabe nesse preço**: o cliente escolhe os itens, o
site soma o pedido e monta a mensagem sozinho. Isso é feito sob medida.

Cuidado para não confundir os dois, porque é fácil e custa dinheiro:

| | Lista de produtos | Catálogo com carrinho |
|---|---|---|
| Onde está | Modelo **Simples 2**, em qualquer ramo | Só aqui, sob medida |
| O que faz | Foto, descrição, preço e botão de pedir | Soma o pedido e monta a mensagem |
| Quanto custa | R$ 50/mês | Orçamento |

Quem se resolve com a primeira **não deve ser empurrado para a segunda**.

---

## Os dois usos desta página

### 1. Na seção "Que tipo de página o seu negócio precisa"

Em `/servicos/sites/`, o tipo "Catálogo com pedido" abre esta página numa
janela, e a lista de blocos ao lado rola até cada seção.

**Quem manda nos nomes das seções é `servicos/sites/js/tipos.js`.** Os `id`
`bloco-topo`, `bloco-categorias`, `bloco-cardapio`, `bloco-pedido`,
`bloco-entrega` e `bloco-duvidas` são um contrato com aquele arquivo:
renomeou um aqui, acerte lá — senão o botão para de rolar e **falha calado**.

### 2. Como passo 3 do pedido

Quem digita um ramo que vende produto (pizzaria, padaria, loja) ganha no
passo 1 a pergunta **"quer catálogo com pedido?"**. Respondendo que sim:

1. o passo 2 marca **Página personalizada** e apaga a página pronta;
2. o passo 3 abre esta página com `?pedido=1`;
3. aparece a barra preta no topo, com o caminho de volta para
   `../../pedido/?catalogo=1#passo-4`.

O que a pessoa preencheu fica guardado no aparelho dela (`jc-pedido`) e volta
sozinho. A resposta do catálogo entra na mensagem de WhatsApp que chega para
você.

Aberta sem `?pedido=1`, a barra não existe e a página é só o exemplo.

Quem responde "não precisa" segue o caminho normal: página pronta de R$ 50 ou
personalizada, como sempre foi.

---

## Editar

**Não mexa no `index.html` para trocar produto.** O cardápio inteiro está em
`produtos.js` — preço, foto, descrição, categoria, selo e o `ativo` que tira
um item do ar sem apagar nada. É o único arquivo que o dono do negócio precisa
abrir; as regras estão comentadas no começo dele.

O número do WhatsApp, a taxa de entrega e o pedido mínimo estão no fim, em
`window.LOJA`.

---

## Fotos

Geradas no ComfyUI e convertidas para WebP **no tamanho em que aparecem na
tela** — a foto de produto é desenhada com uns 260px de largura, guardar
1184px era peso morto.

Peso total: **833 KB** com as 16 fotos. No carregamento inicial é bem menos —
o resto é `loading="lazy"`. O teto combinado é 1,5 MB por página.

O `<img>` entra **dentro** do container `.foto`, nunca no lugar dele, e vai
sempre com `width` e `height` declarados: sem isso a página pula quando cada
foto chega.

---

## Dados fictícios

Cozinha da Vila não existe. Nome, pratos, preços, endereço, telefone e
depoimentos são inventados, e o arquivo diz isso num aviso no topo.

Por isso `/exemplos/` está bloqueado no `robots.txt`: indexada, apareceria no
Google como empresa de verdade.

**Não há `noindex` na página** — de propósito, e pelo mesmo motivo dos
modelos: se a pasta for copiada para virar o site de um cliente, o `noindex`
viajaria junto e deixaria o site real dele invisível no Google.

---

Jeff Company · JeffDev
