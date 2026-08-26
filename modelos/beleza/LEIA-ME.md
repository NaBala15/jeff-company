# Ramo BELEZA — estética, manicure e beleza feminina

Três modelos de landing page prontos para a vitrine da agência: **dois simples** e **um premium**.
Todos funcionam sem internet — abra o `index.html` com dois cliques e a página roda.

Para mostrar ao cliente, abra o **`comparativo.html`**: ele exibe os três lado a lado, com a lista
do que o premium tem a mais.

---

## Como este ramo se liga ao site

O conjunto está registrado em `pedido/js/modelos.js`, dentro de `window.CONJUNTOS`, com o id
`beleza`. Quando alguém escreve "manicure", "cabeleireira", "estética" e afins no passo 1 do
formulário, o passo 3 troca as miniaturas desenhadas pelas capturas destas três páginas.

| Vaga no passo 3 | Pasta | Captura |
|---|---|---|
| Simples 1 — R$ 50 | `simples-01-rose/` | `assets/img/modelos/bel-simples-01.webp` |
| Simples 2 — R$ 50 | `simples-02-contraste/` | `assets/img/modelos/bel-simples-02.webp` |
| Premium — R$ 60 | `premium-01-luxo/` | `assets/img/modelos/bel-premium-01.webp` |

**Se você mexer no visual de alguma página, gere a captura de novo**, senão o cartão do
formulário mostra uma versão que não existe mais. O caminho é: abrir a página em 1280×960,
capturar, reduzir para 640×480 e salvar em `.webp` por cima do arquivo antigo.

**A tarja `?demo=1`:** o formulário linka para cá com `?demo=1` no fim do endereço, e a página
cria sozinha um aviso no canto dizendo que nome, preços e depoimentos são fictícios. Na página
entregue ao cliente o endereço nunca tem esse parâmetro, então o aviso não aparece. Não apague
esse trecho do `script.js` — sem ele, quem chega pelo formulário lê os depoimentos inventados
como se fossem de clientes de verdade.

O `robots.txt` já bloqueia `/modelos/` inteiro, então estas páginas não vão para o Google. Por
isso elas **não** levam `<meta name="robots" content="noindex">`: se levassem e você esquecesse
de tirar ao entregar para um cliente, o site dele nunca seria encontrado na busca.

---

## 1. Os três modelos

| Pasta | Negócio de exemplo | Estilo | Paleta | Melhor para |
|---|---|---|---|---|
| `simples-01-rose` | Espaço Camélia — estética facial e corporal | Suave e acolhedor, tipografia serifada, cantos arredondados, foto em arco no topo | Areia `#FDF7F4`, rosé `#C4736F`, café `#3A2E2C`, sálvia `#8FA58C` | Esteticista, massagista, depilação, spa. Público que valoriza acolhimento e calma. |
| `simples-02-contraste` | Estúdio Malva — nail design e manicure | Moderno e escuro, sans condensada em caixa alta, hero assimétrico, tabela em lista | Preto `#141216`, lilás `#B57BFF`, creme `#F7F3FA` | Nail designer, lash designer, sobrancelha, maquiadora. Público jovem, forte no Instagram. |
| `premium-01-luxo` | Casa Serena — estética avançada | Luxo em camadas, serif display, muito respiro, sombras e gradientes | Nude `#F6EFE8`, dourado `#B08D57`, café `#2B211C` | Clínica de estética, estética avançada, protocolo noiva. Ticket alto, precisa parecer sólido. |

### O que o premium tem a mais

Tudo dos simples, com acabamento melhor, e mais sete coisas:

1. Galeria de trabalhos com **lightbox** — a foto abre ampliada, com setas
2. Depoimentos em **carrossel** — setas, bolinhas, teclado e arraste no celular
3. **FAQ em accordion** — perguntas que abrem e fecham
4. **Contador animado** de números, que dispara quando entra na tela
5. **Faixa de chamada** extra no meio da página
6. **Animações de entrada** ao rolar e micro-interações nos botões
7. **Cabeçalho que encolhe** e ganha fundo ao rolar

---

## 2. Personalizar para um cliente novo

### Passo 1 — Copie a pasta
Duplique a pasta do modelo escolhido e renomeie com o nome do cliente.
Exemplo: `simples-01-rose` → `estetica-da-ana`.
**Nunca edite o modelo original** — ele é o seu estoque de vitrine.

### Passo 2 — Troque as cores em `style.css`
Abra o `style.css` e vá até o bloco `:root`, no começo do arquivo. Todas as cores, fontes e raios
do site estão ali. Trocar três ou quatro linhas muda a identidade da página inteira.

```css
:root {
  --areia:      #FDF7F4;   /* fundo da página       */
  --cafe:       #3A2E2C;   /* cor dos textos        */
  --rose:       #C4736F;   /* botões e destaques    */
  --fonte-titulo: Georgia, serif;
}
```

Dica: pegue a cor do letreiro, da fachada ou da logo do cliente e use como cor principal.
Depois de trocar, **confira o contraste** — texto claro sobre fundo claro é o erro mais comum.

### Passo 3 — Procure por `EDITAR:` no `index.html`
Todo dado que muda por cliente tem um comentário `<!-- EDITAR: ... -->` logo acima.
Abra o `index.html` e use **Ctrl + F** procurando por `EDITAR`.

Ordem sugerida:

1. **`<title>`** — nome do negócio + serviço + cidade
2. **`<meta name="description">`** — frase de até 155 caracteres, é o que aparece no Google
3. **Nome do negócio** — cabeçalho, hero, rodapé e `aria-label` do botão de WhatsApp
4. **Frase de impacto do hero** e o parágrafo de apoio
5. **Serviços** — nome, descrição, duração e preço. Pode apagar ou duplicar blocos inteiros
6. **Sobre / diferenciais** — história e os quatro pontos fortes
7. **Horários** e **área de atendimento** (bairros nas pastilhas)
8. **Endereço, referência, telefone e e-mail**
9. **Redes sociais** — trocar `https://instagram.com/` pelo perfil real
10. **Ano do rodapé** e o crédito da agência

**Só no premium, além disso:**

11. **Números da prova social** — o valor aparece em **dois lugares** e os dois
    precisam bater, senão a animação termina num número diferente do que estava escrito:

    ```html
    <div class="numero js-contar" data-alvo="4800" data-sufixo="+">
      <span class="numero__valor">4.800+</span>
    ```

    O número final fica escrito no HTML de propósito: se o JavaScript não rodar,
    o visitante vê o valor certo em vez de um zero.
12. **Depoimentos do carrossel** — cada `<li class="depo">`. Se mudar a quantidade,
    as bolinhas se ajustam sozinhas; só atualize o `aria-label="1 de 5"` de cada slide
13. **Perguntas do FAQ** — cada `<div class="faq__item">`. Ao duplicar um item, troque o
    `aria-controls` e o `id` para um número novo (`faq-7`, `faq-8`...), senão o accordion quebra
14. **Legendas da galeria** — o lightbox lê o atributo `data-legenda` de cada botão

### Passo 4 — Troque o número do WhatsApp
O número aparece em **vários pontos**: menu, hero, seções, rodapé e botão flutuante.
Use **Ctrl + H** (substituir tudo) trocando o número do modelo pelo do cliente.

Formato obrigatório: `https://wa.me/55DDDNUMERO` — sem espaço, parêntese ou traço.

```
Errado:  https://wa.me/(31) 98866-4520
Certo:   https://wa.me/5531988664520
```

Para abrir o WhatsApp já com mensagem pronta, acrescente `?text=` no fim, com o texto
codificado (espaço vira `%20`, acento vira código):

```
https://wa.me/5531988664520?text=Ol%C3%A1%21%20Quero%20agendar.
```

Troque também os links `tel:+55...` do telefone fixo.

### Passo 5 — Substitua os placeholders de imagem
Cada foto é uma `<div class="foto">` com um rótulo dentro dizendo o que vai ali.
O topo de cada `style.css` explica as duas formas. Resumindo:

**Opção A — `background-image` (mais rápido):**

1. Crie a pasta `fotos` dentro da pasta do cliente
2. No HTML, acrescente uma classe própria: `class="foto foto--quadro foto-1"`
3. No fim do CSS:

```css
.foto-1 {
  background-image: url('fotos/limpeza-de-pele.jpg');
  background-size: cover;
  background-position: center;
}
.foto-1 .foto__rotulo { display: none; }
```

**Opção B — `<img>` de verdade (melhor para o Google):**

```html
<img class="foto foto--quadro" src="fotos/limpeza-de-pele.jpg"
     alt="Resultado de limpeza de pele feita no estúdio">
```

Apague o `<span class="foto__rotulo">` e **sempre preencha o `alt`**.
No premium, mantenha o `border-radius` — as fotos são arredondadas.

Cuidado com o peso: no máximo 1600px de largura, salvo em JPG de qualidade média.
Foto de celular direto (5 MB) deixa a página lenta no 4G.

### Passo 6 — Mapa
Cada modelo tem um bloco `<div class="mapa">` reservado, que já funciona como placeholder.
Se o cliente quiser mapa de verdade, substitua o conteúdo pelo `<iframe>` do Google Maps,
mantendo a classe `mapa`.
**Atenção:** o iframe faz requisição externa, então a página deixa de funcionar 100% offline.

---

## 3. Checklist antes de colocar no ar

**Prévia do link (o que aparece no WhatsApp)**
- [ ] O `og:url` e o `og:image` apontam para o **domínio do cliente**, e não
      para jeffcompany.com.br — procure por `EDITAR AO ENTREGAR` no HTML
- [ ] O `preview.jpg` foi **recapturado da página já personalizada**. O que vem
      na pasta é do negócio de exemplo; se ficar, o cliente manda o link dele e
      aparece a página de outro
- [ ] Testado: cole o endereço numa conversa do WhatsApp com você mesmo e veja
      se a imagem e o título aparecem

> Para recapturar: abra a página no computador, deixe a janela em **1200×630**
> e tire um print do topo. Salve como `preview.jpg` na pasta da página. O
> WhatsApp guarda a prévia em cache por algumas horas — se não atualizar na
> hora, é isso, não é erro.

**Conteúdo**
- [ ] Nenhum nome, endereço, preço ou telefone do modelo sobrou na página
- [ ] Buscar por `EDITAR` no HTML e conferir se todos os pontos foram tratados
- [ ] Buscar pelo número de WhatsApp antigo — não pode restar nenhum
- [ ] `<title>` e `<meta name="description">` com o nome real e a cidade
- [ ] Ano do rodapé atualizado

**Dados fictícios — o item que mais dá problema**
- [ ] **Depoimentos substituídos por depoimentos reais e autorizados pelo cliente**
- [ ] **Números da prova social trocados por números verdadeiros** (`data-alvo` no premium)
- [ ] Nota e quantidade de avaliações batendo com o Google do cliente
- [ ] Nenhuma promessa de resultado que o cliente não pode cumprir

> Os modelos vêm com depoimentos e números inventados só para a demonstração da vitrine.
> Publicar isso no site de um cliente real é propaganda enganosa. Há comentários de aviso
> no HTML, nas seções de depoimentos e de números.

**Links e contatos**
- [ ] Clicar no botão flutuante e confirmar que abre a conversa certa
- [ ] Clicar em todos os botões de agendamento (hero, seções, rodapé)
- [ ] Testar os links `tel:` no celular
- [ ] Instagram e Facebook apontando para os perfis reais
- [ ] Todos os links do menu rolam para a seção certa

**Visual e técnico**
- [ ] Testar em 360px, 768px e 1440px
- [ ] Nenhuma rolagem horizontal em nenhum tamanho
- [ ] Menu hambúrguer abre, fecha ao clicar num link e fecha com ESC
- [ ] Nenhum placeholder de foto sobrando
- [ ] Toda foto com `alt` preenchido
- [ ] Contraste legível depois da troca de cores
- [ ] Navegar a página inteira só com Tab, sem ficar preso
- [ ] Abrir o `index.html` com dois cliques, sem internet, e conferir se tudo carrega
- [ ] Console do navegador (F12) sem erros em vermelho

**Só no premium**
- [ ] Lightbox abre, passa foto com as setas e fecha com ESC
- [ ] Carrossel anda pelas setas, pelas bolinhas e arrastando no celular
- [ ] FAQ abre e fecha, e cada pergunta tem `id` e `aria-controls` únicos
- [ ] Contadores animam ao chegar na seção e param no número certo
- [ ] Cabeçalho muda de aparência ao rolar

**Publicação**
- [ ] Enviados: `index.html`, `style.css`, `script.js` e a pasta `fotos`
- [ ] O arquivo principal precisa se chamar exatamente `index.html`
- [ ] Página abrindo pelo domínio final, no celular e no computador
- [ ] Link enviado ao cliente para aprovação antes de divulgar

---

## 4. Notas técnicas

- Nenhum modelo usa framework, biblioteca, CDN, Google Fonts ou ícone externo
- As fontes são as nativas do sistema, declaradas em `:root`
- Os ícones são SVG inline ou caracteres unicode
- Nenhum formulário: todo contato vai por WhatsApp ou telefone
- Todos respeitam `prefers-reduced-motion` — quem configurou isso no sistema não recebe animação
- O `comparativo.html` carrega os três modelos em iframes locais, sem rede

---

Páginas criadas e mantidas por **JeffDev**.
