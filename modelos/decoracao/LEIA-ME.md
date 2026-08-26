# Ramo DECORAÇÃO DE FESTAS E EVENTOS

Três modelos de landing page: **dois simples** e **um premium**.
Todos funcionam sem internet — abra o `index.html` com dois cliques e a página roda.

Para mostrar ao cliente, abra o **`comparativo.html`**: exibe os três lado a lado,
com a lista do que o premium tem a mais.

---

## Os três modelos

| Vaga no passo 3 | Pasta | Negócio de exemplo | Estilo | Captura |
|---|---|---|---|---|
| Simples 1 — R$ 50 | `simples-01-ludico/` | Ateliê Confete | Pastel e lúdico, colagem de fotos sobrepostas no hero, cards em três cores. Lilás, menta e pêssego | `dec-simples-01.webp` |
| Simples 2 — R$ 50 | `simples-02-minimal/` | Estúdio Laço | Minimalista, serifado, serviços em tabela com filetes, muito respiro. Branco, grafite, nude e latão | `dec-simples-02.webp` |
| Premium — R$ 60 | `premium-01-cenografia/` | Cenário Vivo | Verde-mata profundo em camadas, serif display, latão e creme | `dec-premium-01.webp` |

**A quem indicar cada um:**

- **Ateliê Confete** — decoradora de festa infantil, painel de balões, mesa do bolo, locação de cilindros. Público que compara preço de pacote.
- **Estúdio Laço** — decoração de casamento e quinze anos com estética clean, poucas peças bem escolhidas, projeto com croqui.
- **Cenário Vivo** — cenografia e direção de arte, projeto 3D, iluminação cênica e acervo próprio. Ticket alto.

### O que o premium tem a mais

Tudo dos simples, com acabamento melhor, e mais sete coisas: galeria com
**lightbox**, depoimentos em **carrossel**, **perguntas frequentes** em accordion,
**números com contador**, **faixa de chamada** no meio da página, animações de
entrada e **cabeçalho que encolhe** ao rolar.

---

## Este ramo é vizinho do `buffet` — cuidado ao mexer

Decoração e buffet são negócios diferentes: a decoradora vende painel, balões,
arranjos e mobiliário; o buffet vende comida, salão e garçom. Mas as **palavras
são quase as mesmas**. O conjunto `buffet` captura `festa`, `festas`, `eventos`,
`casamento` e `aniversário`.

Por isso o conjunto `decoracao` vem **antes** de `buffet` no array
`window.CONJUNTOS`, e usa só termos que a decoradora escreveria e o buffet não:
`decoração`, `decoradora`, `balão`, `painel de balões`, `cenografia`,
`ambientação`, `croqui`, `mesa do bolo`.

**Se você mexer na ordem dos conjuntos, teste antes de publicar:**

```bash
node -e "global.window={};eval(require('fs').readFileSync('pedido/js/modelos.js','utf8'));['decoracao de festas','baloes','cenografia','buffet','festas','casamento'].forEach(t=>console.log(t,'->',(window.conjuntoDoRamo(t)||{}).id))"
```

O esperado: os três primeiros em `decoracao`, os três últimos em `buffet`.

**Ambiguidade que sobra, e é aceitável:** quem faz decoração e digita só "festas"
cai no buffet. Não dá para resolver pela palavra — os dois ramos usam a mesma.
Quem escreve "decoração de festas", "decoradora" ou "balões" cai certo.

---

## Como este ramo se liga ao site

Registrado em `pedido/js/modelos.js`, em `window.CONJUNTOS`, com o id `decoracao`.

Os termos de cada vaga decidem qual cartão sai recomendado:

| Quem escreve | Recomendado |
|---|---|
| balão, balões, painel de balões, arco de balões, mesa do bolo | Ateliê Confete |
| decoradora, decorador, decoração de festa, mesa versa | Estúdio Laço |
| cenografia, cenógrafo, ambientação, direção de arte, croqui | Cenário Vivo |

**Se você mexer no visual de alguma página, gere a captura de novo**, senão o
cartão do formulário mostra uma versão que não existe mais. Abrir em 1280×960,
capturar, reduzir para 640×480 e salvar em `.webp` por cima do antigo.

> **Cuidado ao gerar captura:** use o navegador em **movimento reduzido**. As
> seções entram com transição de 0,6s e sem isso a captura pega o conteúdo no
> meio do fade — no ramo buffet a primeira captura saiu com o hero em branco por
> causa disso. No Edge/Chrome headless, o parâmetro é
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

```css
:root {
  --nuvem: #F9F7FD;   /* fundo da página     */
  --tinta: #2E2740;   /* cor dos textos      */
  --lilas: #8B6FD1;   /* botões e destaques  */
}
```

Depois de trocar, **confira o contraste** — texto claro sobre fundo claro é o
erro mais comum.

### 3. Procure por `EDITAR:` no `index.html`
Todo dado que muda por cliente tem um comentário `<!-- EDITAR: ... -->` logo
acima. Use **Ctrl + F** procurando por `EDITAR`. Ordem sugerida:

1. `<title>` — nome do ateliê + serviço + cidade
2. `<meta name="description">` — até 155 caracteres, é o que aparece no Google
3. Nome do negócio — cabeçalho, hero, rodapé e `aria-label` do botão de WhatsApp
4. Frase de impacto do hero e o parágrafo de apoio
5. **Serviços e preços** — nome, o que inclui e valor
6. Sobre / diferenciais — história e os quatro pontos fortes
7. Horários de montagem e área de atendimento
8. Endereço, referência, telefone e e-mail
9. Redes sociais — trocar `https://instagram.com/` pelo perfil real
10. Ano do rodapé e o crédito da agência

**Só no premium, além disso:**

11. **Números da prova social** — o valor aparece em **dois lugares** e os dois
    precisam bater, senão a animação termina num número diferente do escrito:

    ```html
    <div class="numero js-contar" data-alvo="620" data-sufixo="+">
      <span class="numero__valor">620+</span>
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
Errado:  https://wa.me/(31) 98472-0613
Certo:   https://wa.me/5531984720613
```

Troque também os links `tel:+55...` do telefone fixo.

### 5. Substitua os placeholders de imagem
Cada foto é uma `<div class="foto">` com um rótulo dentro. O topo de cada
`style.css` explica as duas formas. Resumindo:

```css
.foto-1 {
  background-image: url('fotos/painel-baloes.jpg');
  background-size: cover;
  background-position: center;
}
.foto-1 .foto__rotulo { display: none; }
```

Ou troque a `<div>` por `<img>` de verdade, apagando o rótulo e **sempre**
preenchendo o `alt`. No máximo 1600px de largura, em JPG de qualidade média.

**Atenção neste ramo:** decoração vende pelos olhos. A qualidade da foto importa
mais aqui do que na maioria dos ramos — vale insistir com o cliente por fotos
boas do trabalho dele antes de publicar.

### 6. Mapa
Cada modelo tem um bloco `<div class="mapa">` reservado, que já funciona como
placeholder. Para mapa de verdade, substitua o conteúdo pelo `<iframe>` do Google
Maps mantendo a classe `mapa`. **Atenção:** o iframe faz requisição externa, então
a página deixa de funcionar 100% offline.

---

## Checklist antes de colocar no ar

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
- [ ] Nenhum nome, endereço, preço ou telefone do modelo sobrou
- [ ] Buscar por `EDITAR` no HTML e tratar todos os pontos
- [ ] Buscar pelo número de WhatsApp antigo — não pode restar nenhum
- [ ] `<title>` e `<meta name="description">` com o nome real e a cidade
- [ ] Ano do rodapé atualizado

**Dados fictícios — o item que mais dá problema**
- [ ] **Depoimentos substituídos por reais e autorizados pelo cliente**
- [ ] **Números da prova social trocados por verdadeiros** (`data-alvo` no premium)
- [ ] Nenhuma promessa que o cliente não cumpre (croqui 3D, acervo próprio, equipe na montagem)

**Específico deste ramo**
- [ ] **O que entra e o que não entra no pacote escrito com clareza** — é a maior fonte de briga em decoração
- [ ] Política de montagem e desmontagem confirmada (quem monta, a que horas, quem recolhe)
- [ ] Taxa de deslocamento conferida com a prática real do cliente
- [ ] Se o modelo cita balão biodegradável ou flor de produtor local, confirmar que é verdade

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
