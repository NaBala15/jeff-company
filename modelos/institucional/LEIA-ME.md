# Institucional — modelos da Jeff Company

Ramo para quem **vende confiança antes de vender o serviço**: escritório,
consultório, clínica. Não é um ofício como barbearia — é um formato.

| Vaga | Pasta | Negócio de exemplo | Mensalidade |
|---|---|---|---|
| Simples 1 | `simples-01-juridico/` | Bertoldi & Salles Advocacia | R$ 50 |
| Simples 2 | `simples-02-cuidado/` | Espaço Vivo — psicologia | R$ 50 |
| Premium | `premium-01-contabil/` | Marino Contabilidade | R$ 60 |

Todos os negócios são fictícios. Cada arquivo diz isso num aviso no topo, e a
tarja de `?demo=1` repete na tela.

---

## A regra do ramo: conselho profissional manda mais que marketing

Este é o único ramo em que **o cliente pode ser multado pelo próprio site**.

- **OAB** (Provimento 205/2021): advogado não anuncia preço, não promete
  resultado e não usa depoimento de cliente como propaganda.
- **CFP** (Resolução 011/2018) e **CFM**: psicólogo e médico também não podem
  usar depoimento de paciente, garantir resultado nem fazer sensacionalismo.

Por isso:

- no **Sóbrio** (advocacia), a seção que nos outros ramos é "o que dizem os
  clientes" virou **"como funciona"** — informa sem infringir;
- no **Acolhedor** (psicologia), virou **"dúvidas"**;
- no **Premium**, os depoimentos e a faixa de preço **existem** — porque
  contador, corretor, consultor e engenheiro podem usar. Ao montar para
  advogado, psicólogo, médico ou dentista, **desligue essas duas seções**.

Isso está escrito também dentro de cada arquivo, na seção correspondente, e
resumido na nota do `comparativo.html`. Se um cliente insistir, avise: quem
responde no conselho é ele.

---

## O que o Premium tem a mais

Sete coisas que os dois simples não têm. É o que justifica os R$ 10:

1. Linha do tempo do negócio (marcos por ano)
2. Serviços com faixa de preço em cada um
3. Equipe com foto e registro profissional
4. Depoimentos de clientes
5. Números que sobem na tela quando aparecem
6. Perguntas frequentes em sanfona
7. Faixa de chamada no meio da página

Se acrescentar algo ao Premium, **acrescente também na lista do
`comparativo.html`** — é ali que o cliente lê por que custa mais.

---

## Os `id` do Premium são um contrato

`premium-01-contabil/index.html` tem seções com `id="bloco-*"`
(`bloco-topo`, `bloco-sobre`, `bloco-servicos`, `bloco-equipe`,
`bloco-provas`, `bloco-duvidas`, `bloco-contato`).

Essa página também alimenta a seção **"Que tipo de página o seu negócio
precisa"**, em `/servicos/sites/`, onde a lista de blocos ao lado rola a
janela até cada seção. Quem manda nesses nomes é `servicos/sites/js/tipos.js`.

**Renomear um `id` aqui quebra aquilo lá, e falha calado** — sem erro nenhum
na tela. Mexeu num, acerte o outro.

Os dois simples usam `id` normais (`inicio`, `servicos`, `sobre`, `contato`)
porque não alimentam aquela seção.

---

## Termos que caem neste ramo

Estão em `pedido/js/modelos.js`, no conjunto `institucional`: advocacia,
contabilidade, corretor, imobiliária, seguros, consultoria, engenharia,
psicologia, terapia, odontologia, clínica, consultório, médico, veterinário,
nutricionista.

**`arquiteto`, `arquiteta` e `design de interiores` NÃO estão aqui** — são de
`servicos-tecnicos`, que vem antes na lista. Como `conjuntoDoRamo` devolve o
**primeiro** conjunto que casa, repetir um termo aqui faria ele nunca chegar
neste ramo. É a mesma armadilha que já deixou `cabeleireiro` e `barbearia`
invisíveis uma vez.

---

## Fotos

Geradas no ComfyUI e convertidas para WebP no tamanho em que aparecem na tela.

| Página | Peso total |
|---|---|
| Sóbrio | 134 KB |
| Acolhedor | 215 KB |
| Institucional Completo | 232 KB |

O teto combinado é 1,5 MB por página.

Para gerar de novo, com o ComfyUI aberto na porta 8000:

```bash
python ferramentas/fotos_institucional.py tudo
```

Depois de trocar qualquer foto, **recapture as prévias** e suba o
`window.VERSAO_PREVIAS` no `pedido/js/modelos.js` — senão quem já visitou
continua vendo a captura antiga.

**Cuidado ao converter em lote:** o `preview.jpg` de cada pasta é a prévia do
link no WhatsApp. Ele fica **JPG** (o WhatsApp não lê WebP na prévia) e em
1200×630. Um laço que pegue todo `.jpg` da pasta leva ele junto — já
aconteceu aqui.

---

Jeff Company · JeffDev
