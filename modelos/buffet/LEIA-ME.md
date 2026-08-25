# Ramo BUFFET E FESTAS

Três modelos de landing page: **dois simples** e **um premium**.
Todos funcionam sem internet — abra o `index.html` com dois cliques e a página roda.

Para mostrar ao cliente, abra o **`comparativo.html`**: exibe os três lado a lado,
com a lista do que o premium tem a mais.

---

## Os três modelos

| Vaga no passo 3 | Pasta | Negócio de exemplo | Estilo | Captura |
|---|---|---|---|---|
| Simples 1 — R$ 50 | `simples-01-festivo/` | Buffet Girassol | Alegre e arredondado, confete em CSS, cards coloridos. Girassol, coral e azul-céu | `buf-simples-01.webp` |
| Simples 2 — R$ 50 | `simples-02-elegante/` | Casa Aurora Eventos | Claro e serifado, hero dividido 50/50, serviços em lista. Marfim, eucalipto e terracota | `buf-simples-02.webp` |
| Premium — R$ 60 | `premium-01-salao/` | Espaço Vinhedo | Escuro em camadas, serif display, muita profundidade. Ameixa, vinho e champanhe | `buf-premium-01.webp` |

**A quem indicar cada um:**

- **Buffet Girassol** — festa infantil, salão de bairro, recreação e kit festa em casa. Preço por número de convidados, que é como esse público compara.
- **Casa Aurora Eventos** — casamento, quinze anos, formatura e corporativo. Ticket médio, público que visita antes de fechar.
- **Espaço Vinhedo** — casa de festas de alto padrão, com jardim, cerimonial próprio e um evento por dia.

### O que o premium tem a mais

Tudo dos simples, com acabamento melhor, e mais sete coisas: galeria com
**lightbox**, depoimentos em **carrossel**, **perguntas frequentes** em accordion,
**números com contador**, **faixa de chamada** no meio da página, animações de
entrada e **cabeçalho que encolhe** ao rolar.

---

## Por que a pasta se chama `buffet` e não `criativo`

O ramo "Criativo" junta fotógrafo, tatuador e buffet — três negócios que vendem
coisas diferentes. Um fotógrafo que digitasse o ramo dele receberia páginas de
festa, com preço por convidado e cardápio. **Fotógrafo e tatuador precisam de
conjuntos próprios**, com as páginas deles.

---

## Como este ramo se liga ao site

Registrado em `pedido/js/modelos.js`, em `window.CONJUNTOS`, com o id `buffet`.

**A ordem no array importa.** O conjunto `buffet` vem **antes** de `cabeleireiro`
de propósito: `conjuntoDoRamo` devolve o primeiro que casa, e quem escreve
"salão de festas" casaria com o termo "salão" do cabeleireiro se ele viesse
primeiro — e receberia modelos de salão de cabelo. Se mexer na ordem, rode o
teste de roteamento antes de publicar.

Os termos de cada vaga decidem qual cartão sai recomendado:

| Quem escreve | Recomendado |
|---|---|
| aniversário, festa infantil, recreação, kit festa, salgados | Buffet Girassol |
| formatura, confraternização, coffee break, quinze anos, debutante | Casa Aurora |
| casa de festas, salão de festas, espaço de eventos, cerimonial, casamento | Espaço Vinhedo |

**Se você mexer no visual de alguma página, gere a captura de novo**, senão o
cartão do formulário mostra uma versão que não existe mais. Abrir em 1280×960,
capturar, reduzir para 640×480 e salvar em `.webp` por cima do antigo.

> **Cuidado ao gerar captura:** use o navegador em modo de **movimento reduzido**.
> As seções entram com uma transição de 0,6s, e sem isso a captura pega o
> conteúdo no meio do fade — a primeira versão da captura deste ramo saiu com o
> hero em branco por causa disso. No Edge/Chrome headless, o parâmetro é
> `--force-prefers-reduced-motion`.

**A tarja `?demo=1`:** o formulário linka para cá com esse parâmetro e a página
cria sozinha o aviso de que nome, preços e depoimentos são fictícios. Na página
entregue ao cliente o endereço nunca tem o parâmetro. Não apague esse trecho do
`script.js`.

O `robots.txt` já bloqueia `/modelos/`, então estas páginas não vão para o Google.
Por isso elas **não** levam `noindex`: se levassem e você esquecesse de tirar ao
entregar para um cliente, o site dele nunca seria encontrado na busca.

---

## Personalizar para um cliente novo

### 1. Copie a pasta
Duplique a pasta do modelo escolhido e renomeie com o nome do cliente.
**Nunca edite o modelo original** — ele é o seu estoque de vitrine.

### 2. Troque as cores no `:root` do `style.css`
Todas as cores, fontes e raios estão no bloco `:root`, no começo do arquivo.
Trocar três ou quatro linhas muda a identidade da página inteira.

```css
:root {
  --creme: #FFFDF5;   /* fundo da página     */
  --tinta: #33291A;   /* cor dos textos      */
  --sol:   #F2B705;   /* botões e destaques  */
}
```

Depois de trocar, **confira o contraste** — texto claro sobre fundo claro é o
erro mais comum.

### 3. Procure por `EDITAR:` no `index.html`
Todo dado que muda por cliente tem um comentário `<!-- EDITAR: ... -->` logo
acima. Use **Ctrl + F** procurando por `EDITAR`. Ordem sugerida:

1. `<title>` — nome do buffet + serviço + cidade
2. `<meta name="description">` — até 155 caracteres, é o que aparece no Google
3. Nome do negócio — cabeçalho, hero, rodapé e `aria-label` do botão de WhatsApp
4. Frase de impacto do hero e o parágrafo de apoio
5. **Pacotes e preços** — nome, o que inclui, número de convidados e valor
6. Sobre / diferenciais — história e os quatro pontos fortes
7. Horários de festa e área de atendimento
8. Endereço, referência, telefone e e-mail
9. Redes sociais — trocar `https://instagram.com/` pelo perfil real
10. Ano do rodapé e o crédito da agência

**Só no premium, além disso:**

11. **Números da prova social** — o valor aparece em **dois lugares** e os dois
    precisam bater, senão a animação termina num número diferente do escrito:

    ```html
    <div class="numero js-contar" data-alvo="1400" data-sufixo="+">
      <span class="numero__valor">1.400+</span>
    ```

12. **Depoimentos do carrossel** — cada `<li class="depo">`. Mudando a quantidade,
    as bolinhas se ajustam sozinhas; só atualize o `aria-label="1 de 5"`
13. **Perguntas do FAQ** — ao duplicar um item, troque o `aria-controls` e o `id`
    para um número novo (`faq-7`, `faq-8`...), senão o accordion quebra
14. **Legendas da galeria** — o lightbox lê o atributo `data-legenda` de cada botão

### 4. Troque o número do WhatsApp
Aparece em vários pontos: menu, hero, seções, rodapé e botão flutuante.
Use **Ctrl + H** trocando o número do modelo pelo do cliente.

Formato obrigatório: `https://wa.me/55DDDNUMERO` — sem espaço, parêntese ou traço.

```
Errado:  https://wa.me/(11) 96325-8741
Certo:   https://wa.me/5511963258741
```

Troque também os links `tel:+55...` do telefone fixo.

### 5. Substitua os placeholders de imagem
Cada foto é uma `<div class="foto">` com um rótulo dentro. O topo de cada
`style.css` explica as duas formas. Resumindo:

```css
.foto-1 {
  background-image: url('fotos/salao-decorado.jpg');
  background-size: cover;
  background-position: center;
}
.foto-1 .foto__rotulo { display: none; }
```

Ou troque a `<div>` por `<img>` de verdade, apagando o rótulo e **sempre**
preenchendo o `alt`. No máximo 1600px de largura, em JPG de qualidade média.

### 6. Mapa
Cada modelo tem um bloco `<div class="mapa">` reservado, que já funciona como
placeholder. Para mapa de verdade, substitua o conteúdo pelo `<iframe>` do Google
Maps mantendo a classe `mapa`. **Atenção:** o iframe faz requisição externa, então
a página deixa de funcionar 100% offline.

---

## Checklist antes de colocar no ar

**Conteúdo**
- [ ] Nenhum nome, endereço, preço ou telefone do modelo sobrou
- [ ] Buscar por `EDITAR` no HTML e tratar todos os pontos
- [ ] Buscar pelo número de WhatsApp antigo — não pode restar nenhum
- [ ] `<title>` e `<meta name="description">` com o nome real e a cidade
- [ ] Ano do rodapé atualizado

**Dados fictícios — o item que mais dá problema**
- [ ] **Depoimentos substituídos por reais e autorizados pelo cliente**
- [ ] **Números da prova social trocados por verdadeiros** (`data-alvo` no premium)
- [ ] Nenhuma promessa que o cliente não cumpre (plano B para chuva, cerimonial incluso, capacidade)

**Específico deste ramo**
- [ ] **Preço por convidado conferido**, e o que entra e o que não entra escrito com clareza — é a maior fonte de briga entre buffet e cliente
- [ ] Política de sinal e cancelamento confirmada com o cliente
- [ ] Capacidade do salão conferida com o alvará real
- [ ] Cardápio para restrição alimentar só anunciado se o cliente realmente faz

**Links e contatos**
- [ ] Botão flutuante abre a conversa certa
- [ ] Todos os botões de orçamento testados
- [ ] Links `tel:` testados no celular
- [ ] Instagram e Facebook apontando para os perfis reais
- [ ] Todos os links do menu rolam para a seção certa

**Visual e técnico**
- [ ] Testado em 360px, 768px e 1440px
- [ ] Nenhuma rolagem horizontal em nenhum tamanho
- [ ] Menu hambúrguer abre, fecha ao clicar num link e fecha com ESC
- [ ] Nenhum placeholder de foto sobrando
- [ ] Toda foto com `alt` preenchido
- [ ] Contraste legível depois da troca de cores
- [ ] Navegar a página inteira só com Tab, sem ficar preso
- [ ] Abrir o `index.html` com dois cliques, sem internet
- [ ] Console (F12) sem erros em vermelho
- [ ] `node ferramentas/conferir-modelos.js` passando

**Só no premium**
- [ ] Lightbox abre, passa foto com as setas e fecha com ESC
- [ ] Carrossel anda pelas setas, pelas bolinhas e arrastando no celular
- [ ] FAQ abre e fecha, com `id` e `aria-controls` únicos
- [ ] Contadores animam e param no número certo
- [ ] Cabeçalho muda de aparência ao rolar

---

Páginas criadas e mantidas por **JeffDev**.
