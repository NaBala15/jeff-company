# Jeff Company

Site da Jeff Company — criação de sites, automação de WhatsApp e configuração
de Google Meu Negócio para pequenas e médias empresas.

**No ar em:** _(preencher depois de publicar)_

---

## O que é

Página única, escrita à mão em HTML, CSS e JavaScript. Sem framework, sem
biblioteca, sem construtor.

### Elemento central

Um comparador arrastável no topo da página: à esquerda, o site desatualizado
que muitos negócios locais ainda têm; à direita, o que a Jeff Company entrega.
As duas maquetes são **construídas em CSS** — layout, tipografia e cores são
código, não captura de tela, então escalam nitidamente em qualquer tamanho.

A única imagem das maquetes é a foto da pizza (40 KB), porque comida precisa
parecer comida: um desenho em CSS não dá vontade de pedir.

> **Antes de publicar, troque a foto.** O arquivo atual
> (`assets/img/pizza-depois.webp`) foi recortado de uma imagem do Freepik, cuja
> licença gratuita exige atribuição. Baixe uma foto de pizza no
> [Unsplash](https://unsplash.com) ou no [Pexels](https://pexels.com) — as duas
> liberam uso comercial sem atribuição — recorte em quadrado e salve com o
> mesmo nome. Nada mais precisa mudar.

A maquete do cliente usa **laranja, não o lima da marca**. Isso é proposital:
ela representa a marca do cliente, não a nossa. Portfólio em que tudo tem a
mesma cor parece template; marcas distintas mostram trabalho sob medida.

O controle é um `<input type="range">` invisível por cima. Com isso, mouse,
toque e teclado já funcionam sem código extra, e leitor de tela entende o que
é. O arraste escreve apenas em uma variável CSS (`--pos`) usada por um
`clip-path`, então o navegador não recalcula layout nenhum.

---

## Decisões de desempenho

O alvo é celular simples e computador antigo. O que foi feito:

- **Nenhuma biblioteca.** O JavaScript inteiro tem cerca de 6 KB.
- **Nenhum `backdrop-filter`.** É o efeito que mais pesa em GPU fraca.
- **Nenhum listener de scroll.** Tudo que reage à rolagem usa
  `IntersectionObserver`.
- **Só `transform` e `opacity`** em movimento — as duas propriedades que a GPU
  resolve sem repintar a tela.
- **Imagens em WebP** (~35 KB cada), com `loading="lazy"` e dimensões
  declaradas, para o layout não pular durante o carregamento.
- **`prefers-reduced-motion` respeitado** em todas as animações.

`content-visibility: auto` foi testado e **removido de propósito**: ele faz a
altura das seções ser estimada, e numa página de rolagem única isso faz os
links do menu pararem no lugar errado. O ganho não pagava o defeito.

---

## Estrutura

```
index.html                 página principal
css/
  variables.css            cores, fontes, espaçamentos — mude aqui
  base.css                 reset, tipografia, utilitários
  components.css           cabeçalho, botões, cartões, faixa
  sections.css             hero, comparador e demais seções
js/
  main.js                  comparador, menu, formulário, animações
assets/img/cases/          capturas dos projetos (1200×750, .webp)
demo/clinica-norvi/        projeto conceito do portfólio
ferramentas/gerar-og.html  gerador da imagem de compartilhamento
GUIA.md                    o que falta preencher, publicação, preços, MEI
```

---

## Rodar no seu computador

```bash
python -m http.server 5180
```

Depois abra `http://localhost:5180`.

---

## Antes de publicar

Veja a **Parte 1 do [GUIA.md](GUIA.md)** — há uma tabela com todos os dados de
exemplo que precisam ser trocados (WhatsApp, e-mail, domínio, formulário).

---

Desenvolvido por **JeffDev** ✦
