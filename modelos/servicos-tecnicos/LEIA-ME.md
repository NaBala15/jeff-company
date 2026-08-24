# Modelos — Serviços técnicos e reformas

**Material proprietário da Jeff Company.** Criado por JeffDev para uso da
agência. Ver a seção *De quem são estes modelos* no fim deste arquivo.

Três landing pages prontas para vender a donos de negócio de reforma,
manutenção e assistência técnica. Cada uma abre com duplo clique no
`index.html`, sem internet, sem instalar nada.

Abra o `comparativo.html` para ver as três lado a lado antes de escolher.

---

## Os três modelos

| Pasta | Negócio fictício | Estilo | Cores | Para quem vender |
|---|---|---|---|---|
| `simples-01-industrial` | Reforma Certa | Robusto, hero cortado na diagonal, serviços em grade | Amarelo de obra `#FFC107` + grafite `#1A1A1C` | Pedreiro, empreiteiro, reforma residencial, pintor |
| `simples-02-emergencia` | Pronto 24h | Claro e urgente, hero centrado, serviços em linhas | Azul `#0B5FD0` + laranja de alerta `#FF6B00` | Encanador, eletricista, chaveiro, desentupidora, plantão 24h |
| `premium-01-elegante` | Vertek Reformas | Sofisticado escuro, serifada nos títulos, galeria e depoimentos | Cobre `#C8873E` + carvão `#121114` + creme | Reforma de alto padrão, arquitetura, marcenaria, ticket alto |

**Seções que os três têm:** cabeçalho com menu (vira sanduíche no celular),
hero com botão de WhatsApp, serviços com preço, sobre/diferenciais, horário e
área de atendimento, contato com endereço + telefone + espaço de mapa, rodapé
e botão flutuante de WhatsApp.

**O premium tem, além disso:** galeria de obras com foto ampliada (lightbox),
carrossel de depoimentos, sanfona de dúvidas frequentes, números que contam
sozinhos ao aparecer na tela, faixa de chamada no meio da página, cabeçalho
que muda de aparência ao rolar e animações de entrada mais elaboradas.

---

## Antes de tudo: o aviso dos dados fictícios

**Todos os nomes, telefones, endereços, e-mails, preços, prazos, números e
depoimentos das três páginas são inventados.**

Isso vale principalmente para o modelo premium, que tem quatro depoimentos
assinados por "Marina C.", "Rodrigo A.", "Helena V." e "Paulo M.". **Essas
pessoas não existem.** Publicar depoimento inventado é propaganda enganosa
pelo Código de Defesa do Consumidor, e é o tipo de coisa que destrói a
reputação do seu cliente e a sua junto.

O mesmo vale para os números da seção de estatísticas ("214 obras entregues",
"98% entregues no prazo"). Só entram no ar se o cliente conseguir comprovar.

Cada arquivo tem esse aviso escrito no topo do `<body>`. Ele não aparece na
tela — é um comentário de código, para você lembrar na hora de editar.

---

## Como personalizar, passo a passo

### 1. Copie a pasta

Nunca edite o modelo original. Copie a pasta inteira e renomeie:

```bash
cp -r simples-01-industrial cliente-reforma-do-joao
```

Assim o modelo continua limpo para o próximo cliente.

### 2. Troque as cores no `:root`

Abra o `style.css`. Nas primeiras 60 linhas está o bloco `:root`, que é onde
todas as cores, fontes, tamanhos e arredondamentos ficam guardados. Mude ali
e a página inteira muda junto — não é preciso caçar cor no meio do arquivo.

```css
:root {
  --cor-marca: #FFC107;         /* a cor principal do cliente */
  --cor-marca-escura: #D9A106;  /* a mesma, um pouco mais escura, para o hover */
  ...
}
```

Regra prática ao trocar: a cor de marca precisa ter contraste suficiente com o
texto que fica em cima dela. Se você puser um amarelo claro com texto branco,
ninguém lê. Teste em [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/)
— a nota mínima é AA.

### 3. Troque os textos marcados com `EDITAR:`

Abra o `index.html` e procure por `EDITAR:` (Ctrl+F). Cada ocorrência marca
uma informação que precisa virar o dado real do cliente:

- título da aba e descrição do Google (as duas primeiras)
- nome do negócio, no cabeçalho e no rodapé
- frase principal do hero
- **todos os links de WhatsApp** — o formato é `https://wa.me/55DDDNUMERO`
  (exemplo: `https://wa.me/5511987654321`), sem espaço, sem traço, sem
  parêntese. O `?text=` depois do número é a mensagem que já vem escrita
  quando a pessoa abre a conversa
- telefone nos links `tel:`
- lista de serviços, descrições e preços
- história da empresa e diferenciais
- horários e bairros atendidos
- endereço, e-mail, CNPJ

No premium, procure também pelos comentários de depoimento e pelos
`data-alvo` dos números.

### 4. Coloque as fotos

Cada bloco cinza com uma etiqueta dentro (`FOTO — equipe em obra`) é o lugar
de uma foto. Para trocar:

1. crie uma pasta `fotos/` dentro da pasta do cliente
2. no HTML, apague a linha `<span class="imagem-rotulo">...</span>`
3. troque a `<div class="... imagem-espaco">` por:

```html
<img src="fotos/equipe.jpg" alt="Equipe da empresa trabalhando na obra"
     width="900" height="1200" loading="lazy">
```

O `alt` não é enfeite: é o que o Google lê e o que a pessoa cega ouve.
Descreva a foto em uma frase.

O `width` e o `height` precisam bater com o tamanho real do arquivo. É isso
que impede a página de "pular" enquanto carrega.

**Tamanho das fotos:** salve com no máximo 1600px de largura e em `.webp` ou
`.jpg` com qualidade 80. Foto de 5 MB direto da câmera trava o celular do
visitante.

### 5. Coloque o mapa

No HTML procure por `mapa-espaco`. Apague aquela `<div>` inteira e cole no
lugar o código que o Google Maps dá em **Compartilhar → Incorporar um mapa**.
Deixe o iframe com `width="100%"`.

Se preferir não usar iframe (fica mais leve), troque por um link:

```html
<a class="botao botao-primario" href="https://maps.google.com/?q=ENDERECO+COMPLETO"
   target="_blank" rel="noopener">Ver no Google Maps</a>
```

### 6. Teste antes de entregar

Abra o `index.html` com duplo clique e confira a lista do próximo tópico.

---

## Checklist antes de publicar

Marque um por um. Leva dez minutos e evita o cliente descobrindo o erro antes
de você.

**Dados**
- [ ] Nenhum `EDITAR:` sobrou com informação de exemplo
- [ ] Todos os links de WhatsApp abrem no número certo, com o DDD e o 55 na frente
- [ ] Os links `tel:` ligam para o número certo
- [ ] Endereço, CEP, e-mail e CNPJ conferidos com o cliente
- [ ] Preços e prazos confirmados por escrito com o cliente
- [ ] No premium: depoimentos reais, com autorização de quem escreveu
- [ ] No premium: números que a empresa consegue comprovar
- [ ] Ano do rodapé aparecendo (o script preenche sozinho)

**Aparência**
- [ ] Testado no celular de verdade, não só encolhendo a janela do computador
- [ ] Menu sanduíche abre, fecha e os links rolam para a seção certa
- [ ] Nenhum texto encostando na borda ou saindo da tela
- [ ] Fotos no lugar dos blocos cinzas, todas com `alt` escrito
- [ ] Botão flutuante de WhatsApp não está cobrindo texto importante

**Funcionamento (premium)**
- [ ] Galeria abre a foto ampliada, passa com as setas e fecha com Esc
- [ ] Carrossel de depoimentos gira pelos botões, pelas bolinhas e arrastando
- [ ] Sanfona de dúvidas abre e fecha
- [ ] Números contam ao chegar na seção

**Técnico**
- [ ] Título da aba e descrição do Google escritos (aparecem no resultado de busca)
- [ ] Testado no Chrome e no navegador do celular
- [ ] Nenhum erro vermelho no console (F12 → Console)
- [ ] Fotos otimizadas — a página inteira abaixo de 1,5 MB

**Depois de publicar**
- [ ] Google Meu Negócio do cliente apontando para o site
- [ ] Link do site na bio do Instagram e no WhatsApp Business
- [ ] Um teste de ponta a ponta: entrar pelo celular, clicar no WhatsApp e ver
      a mensagem chegando no aparelho do cliente

---

## Detalhes técnicos, para referência

- **Zero dependência externa.** Nenhum framework, nenhuma biblioteca, nenhum
  CDN, nenhuma fonte do Google, nenhum ícone baixado. As páginas funcionam sem
  internet. Os ícones são SVG escritos dentro do próprio HTML.
- **Fontes nativas.** Arial Black no industrial, Trebuchet MS no emergência,
  Georgia no elegante. Já existem em qualquer computador e celular, então
  carregam instantaneamente e não custam requisição nenhuma.
- **Sem ouvir o scroll.** Onde a página reage à rolagem, quem avisa é o
  `IntersectionObserver` — o navegador chama quando o elemento entra na tela,
  em vez de o código perguntar a cada pixel. É o que faz a página não travar
  em celular fraco.
- **`prefers-reduced-motion` respeitado.** Quem marcou "reduzir movimento" no
  sistema recebe a página sem animação nenhuma.
- **Rede de segurança de 4 segundos.** Se por qualquer motivo as animações não
  dispararem, um temporizador mostra tudo assim mesmo. A página nunca fica em
  branco.
- **Teclado funciona em tudo.** Menu, sanfona, carrossel e galeria são
  navegáveis por Tab, Enter e setas. A janela da foto ampliada prende o foco
  dentro dela e devolve para o lugar certo ao fechar.
- **Testado em 360px, 768px e 1440px.**

---

## Onde publicar

Ver o `HOSPEDAGEM.md` na raiz do projeto Jeff Company. Resumo: **Cloudflare
Pages** — grátis, permite uso comercial e não pede cartão. A Vercel proíbe uso
comercial no plano gratuito, e site de cliente pago se encaixa na proibição.

---

## De quem são estes modelos

Estes três modelos são **propriedade da Jeff Company**, criados por JeffDev.
Não são modelo comprado, nem template de banco de imagens: são o seu
estoque de trabalho.

Na prática isso significa:

| Você pode | Você não quer |
|---|---|
| Usar o mesmo modelo em quantos clientes quiser | Entregar a pasta do modelo em si para o cliente |
| Personalizar, cortar e reescrever à vontade | Deixar o cliente revender ou repassar o modelo |
| Usar as capturas de tela no seu portfólio | Publicar o modelo com os dados fictícios |

**O que o cliente contrata é o site pronto dele**, personalizado e no ar —
não o modelo. É a mesma lógica do contrato de assinatura: ele paga pelo
resultado no ar, e o código-fonte continua sendo seu até que vocês combinem
outra coisa por escrito. Se algum cliente pedir o código, isso é uma
negociação à parte, com valor à parte.

### Onde a autoria está registrada

Em quatro lugares, sem precisar de nada além dos próprios arquivos:

1. **Comentário no topo de cada arquivo** — `index.html`, `style.css` e
   `script.js` dos três modelos, e também no `comparativo.html`.
2. **`<meta name="author" content="Jeff Company">`** no cabeçalho de cada
   página. É a forma padrão da web de dizer quem escreveu, e buscadores leem.
3. **`<meta name="generator">`** dizendo qual modelo deu origem à página.
4. **Este arquivo.**

Nada disso aparece na tela do visitante. Autoria fica no código; a página
continua sendo do cliente aos olhos de quem visita.

### O crédito visível no rodapé

Os três modelos já vêm com o crédito **ligado**: o último parágrafo do
rodapé diz *"Site desenvolvido por Jeff Company"*, e o nome leva direto para
o seu WhatsApp.

Isso é aquisição de cliente, não vaidade. Rodapé de cliente é de onde vem
boa parte do primeiro trabalho de uma agência nova: quem gostou do site
desce até o fim para descobrir quem fez.

**Combine com o cliente antes de publicar.** A maioria não se importa, mas
existe quem não queira — e descobrir isso depois do site no ar é desgaste
à toa. Se o cliente não quiser, é só apagar o bloco marcado com
`EDITAR: crédito da agência` no fim do `index.html`.

Se você usar o crédito como moeda de troca — desconto para quem deixa —
deixe isso **escrito no contrato**, e não combinado no WhatsApp.

O crédito tem estilo próprio (`.credito-agencia`, no fim do `style.css` de
cada modelo), com a cor de destaque do modelo no seu nome. Discreto: menor
que o texto do rodapé e mais apagado que a linha de CNPJ.

---

## Como estes modelos entram no formulário de pedido

No passo 3 de `/pedido/` a pessoa escolhe entre três vagas fixas:

| Vaga | Preço | Página neste ramo |
|---|---|---|
| Simples 1 | R$ 50/mês | Reforma Certa |
| Simples 2 | R$ 50/mês | Pronto 24h |
| Premium | R$ 60/mês | Vertek |

As vagas são sempre as mesmas; o que muda conforme o **ramo digitado** é qual
página ocupa cada vaga. Quem escreve "encanador" vê estas três páginas, com a
Simples 2 marcada como recomendada. Quem escreve "cabeleireiro" continua vendo
as miniaturas desenhadas, porque esse ramo ainda não tem páginas prontas —
mostrar uma obra para um salão faria a pessoa achar que não é para ela.

O cartão carrega uma **imagem estática** de 640×480 em WebP (14 a 16 KB), e não
a página embutida. Três páginas dentro de janelas fariam o celular do
visitante carregar quatro sites de uma vez só para escolher um. Quem quiser ver
por dentro clica em **"Ver a página inteira"**, que abre em outra aba.

### Link direto para os modelos de um ramo

```
/pedido/?ramo=encanador#passo-3
```

Abre o formulário já no passo 3, com o ramo preenchido e as páginas certas na
tela. É o link para responder "e no meu caso, como fica?" no WhatsApp sem a
pessoa precisar digitar nada.

### O aviso de modelo de exemplo

Quando o endereço tem `?demo=1` — que é como o formulário linka para cá —
aparece um quadro no canto inferior esquerdo avisando que nome, fotos, preços e
depoimentos são fictícios, com link para o seu WhatsApp. Na página entregue ao
cliente o endereço nunca tem `?demo=1`, então o aviso nem é criado.

Isso existe por um motivo prático: a página Premium tem quatro depoimentos e
quatro números inventados. Sem o aviso, quem chega pelo formulário leria
aquilo como cliente de verdade — e aí você estaria vendendo com prova falsa.

### Por que o modelo NÃO tem `noindex`

De propósito. A pasta do modelo é copiada para virar o site do cliente — se
um `noindex` viajasse junto, o site dele nasceria invisível no Google e
ninguém perceberia por meses.

Quem mantém os modelos fora das buscas é o **`robots.txt` da raiz do site**
(`Disallow: /modelos/`), que não é copiado junto, mais o `rel="nofollow"` nos
links do formulário. Se você subir os modelos para outro endereço, leve essa
regra no `robots.txt` de lá.

### Para acrescentar um ramo novo

1. Gere as três páginas em `modelos/<ramo>/`
2. Capture cada uma em **1280×960**, reduza para **640×480** e salve em
   `assets/img/modelos/` como `.webp` com qualidade 80
3. Copie o bloco de `window.CONJUNTOS` em `pedido/js/modelos.js`, trocando
   termos, textos, imagens e links
4. Copie o bloco do aviso `?demo=1` do `script.js` e do `style.css` de
   qualquer um destes três modelos

**Onde os modelos ficam hospedados** está numa linha só:
`window.BASE_MODELOS`, no começo de `pedido/js/modelos.js`. Hoje aponta para
dentro deste mesmo site. Quando você subir todos os modelos para um endereço
próprio, troque só essa linha e todos os links se ajustam.

---

*JeffDev · Jeff Company*
