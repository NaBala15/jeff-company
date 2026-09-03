# Guia da Jeff Company

Tudo que falta para o site sair do seu computador e virar empresa.
Leia na ordem. Cada passo tem o que fazer, onde fazer e quanto custa.

---

## Parte 1 — O que falta preencher no site

Estes são os pontos que estão com dado de exemplo. Enquanto não trocar,
o site funciona, mas ninguém consegue falar com você.

| O quê | Onde está | Trocar por |
|---|---|---|
| ~~Número do WhatsApp~~ | ✅ Preenchido em 23/08: (11) 99709-7050 — aparece em `index.html` (3x), `pedido/js/pedido.js` e nas 3 páginas de `servicos/` (2x cada) | — |
| ~~Instagram~~ | ✅ Preenchido em 24/08: instagram.com/jeff_dev015 | — |
| ~~Domínio~~ | ✅ Registrado em 24/08: **jeffcompany.com.br** (registro.br, no CNPJ) | — |
| ~~Envio do formulário~~ | ✅ Preenchido em 24/08: Formspree `xbgrewzy` | — |
| ~~CNPJ~~ | ✅ Preenchido em 24/08: 58.064.996/0001-89 — rodapé, dados do Google e gerador de contratos | — |
| **E-mail** | ainda não existe: `contato@jeffcompany.com.br` | Criar o redirecionamento (Parte 4) |
| Cidade e estado | `index.html` — no bloco de dados do Google, `São Paulo` / `SP` | A sua cidade, se não for essa |
| ~~Link da BiBi~~ | ✅ Preenchido em 23/08: bibi-cartomante.vercel.app | — |

**Dica para achar rápido:** abra o `index.html` no editor e aperte `Ctrl + F`.

---

## Parte 2 — Publicar o site (grátis)

Você precisa de duas contas, as duas gratuitas: **GitHub** (guarda o código) e
**Cloudflare Pages** (deixa o site no ar). As duas você já tem.

> **Por que Cloudflare e não Vercel:** o plano gratuito da Vercel **proíbe uso
> comercial**, e site de cliente pago se encaixa na proibição. O detalhe está
> no `HOSPEDAGEM.md`.

### 2.1 Criar o repositório

1. Entre em [github.com/new](https://github.com/new)
2. Nome sugerido: `jeff-company`
3. Marque **Public**
4. **Não** marque nenhuma das caixas de "Initialize this repository"
5. Clique em *Create repository*

### 2.2 Enviar o código

Na pasta do projeto, rode (já deixei o repositório local pronto, veja a Parte 9):

```bash
git remote add origin https://github.com/NaBala15/jeff-company.git
```

```bash
git push -u origin main
```

### 2.3 Colocar no ar

1. Entre em [vercel.com](https://vercel.com) e faça login **com a conta do GitHub**
2. *Add New* → *Project* → escolha `jeff-company` → *Import*
3. Não mexa em nada nas configurações. Clique em **Deploy**
4. Em cerca de 30 segundos o site está no ar em `jeff-company.vercel.app`

A partir daí, todo `git push` atualiza o site sozinho.

---

## Parte 3 — Domínio próprio

O endereço `.pages.dev` funciona, mas passa a impressão de amador para quem
vai te pagar. Um domínio `.com.br` resolve isso.

> ✅ **Já feito em 24/08/2026:** `jeffcompany.com.br` registrado no registro.br,
> no CNPJ 58.064.996/0001-89, com validade até 24/08/2027. **Anote a renovação
> no calendário** — domínio que vence derruba o site e o e-mail no mesmo dia.

**Onde:** [registro.br](https://registro.br) — é o órgão oficial do Brasil,
não é revendedor, e sai mais barato.

**Custo:** cerca de **R$ 40 por ano**.

**Exige CNPJ?** Não. Dá para registrar com CPF.

**Sugestões de nome:** `jeffcompany.com.br`, `jeffcompany.dev.br`

### Ligando o domínio na Cloudflare

1. Na Cloudflare: *Add a site* → digite `jeffcompany.com.br` → plano **Free**
2. A Cloudflare mostra dois servidores de nome (algo como `xxx.ns.cloudflare.com`)
3. No registro.br: *Painel* → seu domínio → *Alterar servidores DNS* → cole os dois
4. Leva de 15 minutos a algumas horas para propagar
5. Depois, em *Workers & Pages* → seu projeto → *Custom domains* → *Set up a domain*

Mudar o servidor DNS no registro.br entrega a **zona inteira** para a
Cloudflare. É isso que você quer: domínio, site e e-mail passam a ser
configurados num painel só.

> **Regra de ouro:** o domínio dos SEUS CLIENTES sempre fica no nome DELES,
> com o CPF/CNPJ deles. Nunca registre no seu nome. Se um dia vocês se
> separarem, o cliente que fica preso a você vira um cliente que fala mal de
> você. Cobrar o serviço de configurar é legítimo; ser dono do endereço dele
> não é.

---

## Parte 4 — E-mail profissional

`jeffdev2010@gmail.com` numa proposta de R$ 2.000 derruba a proposta.

Criar `contato@jeffcompany.com.br` são **duas coisas diferentes**, e quase todo
mundo só descobre isso no meio do caminho:

1. **Receber** no endereço novo — fácil e grátis.
2. **Responder** a partir dele — precisa de um servidor de saída, que o
   encaminhamento grátis não fornece.

### Passo 0 — levar o DNS para a Cloudflare (obrigatório)

O Email Routing **só funciona se o domínio usar o DNS da Cloudflare**. Isso é
o mesmo passo da Parte 3, então faça uma vez e serve para o site também.

Para conferir em que pé você está, veja os servidores de nome do domínio. Se
aparecer `a.auto.dns.br` e `b.auto.dns.br`, ainda está no DNS automático do
registro.br e o passo não foi feito.

### Passo 1 — receber (grátis, uns 10 minutos)

1. No painel da Cloudflare: **Compute** → **Email Service** → **Email Routing**
2. **Onboard Domain** → escolha `jeffcompany.com.br`
3. Revise os registros DNS que ela vai criar sozinha → **Done**
4. Em *Destination addresses*, cadastre o seu Gmail e **confirme o e-mail que
   a Cloudflare manda** — sem confirmar, nada é entregue
5. Em *Routing rules*, crie `contato@jeffcompany.com.br` → seu Gmail

Os registros MX levam de 5 a 15 minutos para valer. Depois disso, tudo que
chegar em `contato@` cai na sua caixa de sempre.

### Passo 2 — responder como `contato@`

O Email Routing **só recebe e encaminha**. Ele não dá servidor de saída, então
se você responder pelo Gmail o cliente vê o seu endereço pessoal. Duas saídas:

| | **Zoho Mail (plano Free)** | **Gmail + relé de envio** |
|---|---|---|
| O que é | Caixa de verdade em `contato@` | Continua tudo no seu Gmail |
| Custo | Grátis, até 5 usuários | Grátis nos planos iniciais |
| Como usa | Webmail e app do Zoho | Gmail: *Configurações* → *Contas e importação* → *Enviar e-mail como* |
| Pega | **Não tem IMAP/POP no grátis** — só pelo site e pelo app deles | Depende de um terceiro serviço, com limite de envios |
| Atenção | Substitui a Cloudflare no e-mail: o MX aponta para o Zoho, não dá para usar os dois | Mantém a Cloudflare recebendo |

**A recomendação:** faça o Passo 1 hoje e pare por aí. O endereço passa a
existir, o site deixa de mentir e nada se perde. O Passo 2 só importa no dia
em que você for mandar uma proposta — e aí você decide com calma.

**Regra que vale para sempre:** confira a caixa de spam na primeira semana.
Domínio recém-registrado não tem histórico, e provedor desconfia de novato.

**Opção paga:** Google Workspace, cerca de R$ 30 por mês por usuário. Resolve
receber e enviar de uma vez, com o Gmail que você já sabe usar. Só vale quando
o faturamento estiver constante.

---

## Parte 5 — Fazer o formulário funcionar

Hoje o formulário valida os campos, mas não envia nada — e avisa isso na tela.
Para receber de verdade:

1. Crie conta em [formspree.io](https://formspree.io) (o plano grátis aceita
   50 mensagens por mês, mais que suficiente no começo)
2. *New Form* → dê um nome → copie o endereço que aparece, algo como
   `https://formspree.io/f/xyzabcd`
3. ✅ **Já feito em 24/08:** o formulário aponta para `xbgrewzy`.
   Para trocar no futuro, procure `formspree.io/f/` no `index.html`.
   *(instrução original, se precisar refazer:)* procure por `SEU_CODIGO_AQUI` e troque a linha inteira do
   `action` por esse endereço
4. Envie um teste. A primeira mensagem pede confirmação no seu e-mail

---

## Parte 5b — Saber quantas pessoas entram no site

✅ **Ligado em 02/09/2026.** Cloudflare Web Analytics, no **automatic setup** —
ligado pelo painel, sem script no código.

Onde ver: painel da Cloudflare → **Analytics & Logs** → **Web Analytics**.
Os números aparecem algumas horas depois de ligar.

**Por que essa e não o Google Analytics.** A do Google grava cookie, e cookie
de medição obriga aviso de consentimento — aquela tarja que todo mundo fecha
sem ler. A da Cloudflare não usa cookie, não guarda nada no aparelho do
visitante e não segue ninguém entre sites. Dá menos detalhe, e é de graça sem
limite de visitas.

**O que ela responde:** quantas pessoas entram, em que páginas, de onde vieram,
celular ou computador. Serve para você saber se vale continuar escrevendo
página de serviço, e para descobrir em que passo do pedido a pessoa desiste.

### Por que não há nenhum arquivo de analytics no projeto

Porque o automatic setup injeta a medição na saída da Cloudflare, e não no
código. Vantagem: vale para o site inteiro, inclusive os comparativos de
modelo. Desvantagem: **não dá para saber que ela existe lendo o repositório** —
por isso está escrito aqui e na página de privacidade.

Existiu por algumas horas um `js/analytics.js`, para o caso de o automático não
aparecer. Foi apagado ao ligar o automático: com os dois, cada visita contaria
em dobro.

### O que já foi ajustado junto

A `/privacidade/` afirmava por escrito que o site não tinha analytics. Foi
atualizada no mesmo dia: a tabela "O que sai do seu navegador" ganhou a linha
da Cloudflare Web Analytics, com a base legal (legítimo interesse) e a
explicação de que ela não grava cookie — que é o motivo de o site continuar
sem aviso de cookies.

**Se um dia entrar qualquer outro script de terceiro** (pixel, chat, mapa de
calor), a mesma tabela muda no mesmo dia.

---

## Parte 6 — MEI: o CNPJ da Jeff Company

Você **pode** trabalhar como pessoa física, mas sem CNPJ você não emite nota
fiscal — e empresa que precisa lançar a despesa na contabilidade não fecha com
quem não emite nota. É o que separa "o rapaz que faz site" de "a empresa que
contratamos".

**O que é:** Microempreendedor Individual. CNPJ simplificado.

**Onde:** [gov.br/mei](https://www.gov.br/mei) — **abertura gratuita**.
Nenhum site que cobra para abrir MEI é oficial.

**Custo mensal:** cerca de **R$ 76** (valor de 2026, o DAS). Esse valor já
inclui sua contribuição ao INSS — ou seja, você passa a contar tempo de
aposentadoria e ganha direito a auxílio-doença.

**Limite de faturamento:** R$ 81 mil por ano.

**Ocupação para escolher no cadastro:**
*"Programador de sistemas de computador (independente)"* ou
*"Desenvolvedor de programas de computador sob encomenda"*.

**Depois de aberto:**
- Baixe o app **MEI** para pagar o DAS todo mês (atrase e vira dívida ativa)
- Emita nota pelo sistema da prefeitura da sua cidade (procure "NFS-e" + nome da cidade)
- Faça a declaração anual (DASN-SIMEI) até 31 de maio de cada ano

---

## Parte 7 — Google Meu Negócio da própria Jeff Company

Você vende esse serviço. Ter o seu próprio configurado é a sua melhor
demonstração — e ainda traz cliente da sua região.

**O passo a passo completo, com os seus dados já preenchidos, está em
[`GOOGLE-MEU-NEGOCIO.md`](GOOGLE-MEU-NEGOCIO.md).**

Antes de abrir o cadastro, leia a primeira seção daquele arquivo. Resumo do
que importa:

- **Negócio só remoto não é elegível.** A regra do Google exige local físico
  que o cliente visita, ou deslocamento até o cliente. Se hoje você faz tudo
  por WhatsApp, a saída é passar a visitar cliente de verdade — não é mentir
  no cadastro.
- **Nunca invente endereço.** Suspensão por endereço falso pega a conta Google
  inteira e é difícil de reverter.
- **O nome é só `Jeff Company`.** Escrever "Jeff Company — Criação de Sites em
  São Paulo" para aparecer mais é motivo de suspensão.
- Trabalhando de casa, marque que **não** há local para visita e defina a
  área de atendimento. O endereço fica oculto do público.

---

## Parte 8 — Quanto cobrar

Estas são faixas praticadas no mercado brasileiro para quem está começando
(2026). Pesquise o que cobram na sua região antes de fechar sua tabela.

| Serviço | Faixa inicial | Depois de 5–10 projetos |
|---|---|---|
| Landing page (1 página) | R$ 600 – R$ 1.200 | R$ 1.500 – R$ 3.000 |
| Site institucional (4–6 seções) | R$ 1.200 – R$ 2.500 | R$ 3.000 – R$ 6.000 |
| Catálogo com pedido no WhatsApp | R$ 1.500 – R$ 3.000 | R$ 4.000+ |
| Google Meu Negócio (configuração) | R$ 250 – R$ 500 | R$ 600 – R$ 900 |
| Automação de WhatsApp | R$ 500 – R$ 1.500 | R$ 2.000+ |
| Manutenção mensal | R$ 100 – R$ 300/mês | R$ 400 – R$ 800/mês |

### Quanto cobrar para o cliente da assinatura COMPRAR a página

A cláusula 10 do contrato de assinatura deixa o cliente comprar a página a
qualquer momento e ficar com ela para sempre, encerrando a mensalidade. O
`«VALOR DE AQUISICAO»` é preenchido por cliente, no gerador.

**Faixa: 10 a 12 mensalidades.** Na base de R$ 50, isso dá **R$ 500 a R$ 600**.
No modelo Premium de R$ 60, **R$ 600 a R$ 720**.

Por que essa faixa, e não outra:

- **Abaixo de 10 mensalidades**, sai barato demais. O cliente compra no
  primeiro mês, você recebe uma vez e perde a receita recorrente — que é
  justamente o que sustenta o mês em que você não fecha venda nova.
- **Acima de 12**, ninguém compra. A cláusula vira enfeite no contrato, e você
  perde a saída digna que ela existe para dar.

**Lembre do desconto da 10.2:** metade de tudo que ele já pagou de mensalidade
é abatida. Com aquisição de R$ 600, a conta anda assim:

| Ele compra no… | Já pagou | Abate 50% | Ele paga |
|---|---|---|---|
| 1º mês | R$ 50 | R$ 25 | R$ 575 |
| 6º mês | R$ 300 | R$ 150 | R$ 450 |
| 12º mês | R$ 600 | R$ 300 | R$ 300 |
| 24º mês | R$ 1.200 | R$ 600 | **R$ 0** |

A partir do 24º mês o desconto zera o preço e **para ali** — é o que a frase
"limitado ao próprio valor de aquisição" garante. Sem ela, a conta ficaria
negativa e, lido ao pé da letra, você deveria dinheiro ao cliente.

Dois anos pagando e a página vira dele de graça é justo: ele já te pagou
R$ 1.200 por uma página que você vende a R$ 600.

**O que a compra NÃO leva** (item 10.4): o subdomínio continua seu. Ele precisa
registrar domínio próprio. Sem isso, você hospedaria de graça e para sempre o
site de alguém que parou de pagar.

---

**Cinco regras que valem mais que a tabela:**

1. **50% na aprovação, 50% na entrega.** Sem exceção, nem para amigo. Quem não
   paga a entrada não valoriza o trabalho e some no meio.
2. **Nunca dê preço na primeira mensagem.** Pergunte primeiro o que a pessoa
   vende, para quem, e o que ela espera que aconteça. Preço sem contexto vira
   comparação com o primo que faz por R$ 300.
3. **Cobre por valor, não por hora.** Você não vende 20 horas de código. Você
   vende um canal que traz cliente. Se o cliente fatura R$ 30 mil por mês, um
   site de R$ 2.000 é barato.
4. **A manutenção mensal é o que te sustenta.** Projeto único é montanha-russa:
   um mês R$ 5 mil, no outro zero. Dez clientes de manutenção a R$ 200 são
   R$ 2.000 todo dia 5, independente de fechar venda nova.
5. **Duas rodadas de ajuste incluídas, a terceira é orçada.** Escreva isso na
   proposta. É o que impede o projeto de virar reforma sem fim.

---

## Parte 9 — Proposta comercial

Depois da conversa, mande um PDF de uma página. Estrutura:

```
JEFF COMPANY
Proposta para [nome do cliente] — [data]

O QUE ENTENDI
[2 ou 3 linhas repetindo o problema que a pessoa te contou.
 Isso sozinho já ganha metade das propostas: mostra que você ouviu.]

O QUE VOU ENTREGAR
· Site de X seções: [liste as seções]
· Adaptado para celular, tablet e computador
· Botão de WhatsApp em todas as seções
· Configuração de domínio e publicação
· Preparado para aparecer no Google
· Treinamento de 30 minutos na entrega

O QUE NÃO ESTÁ INCLUÍDO
· Produção de fotos e textos (você me envia)
· Loja com carrinho e pagamento online
· Custo do domínio (cerca de R$ 40/ano, no seu nome)

PRAZO
X dias úteis a partir do recebimento do material.

INVESTIMENTO
R$ X.XXX — 50% para iniciar, 50% na entrega.
Pix, transferência ou cartão em até 3x.

INCLUÍDO APÓS A ENTREGA
Duas rodadas de ajuste e 30 dias de suporte para correções.

Proposta válida por 15 dias.
Jeff Company · CNPJ XX.XXX.XXX/0001-XX
contato@jeffcompany.com.br · (11) 99709-7050
```

A seção **"O que NÃO está incluído"** é a mais importante do documento. É ela
que evita a frase "ah, mas eu achei que o blog vinha junto" três semanas depois.

---

## Parte 10 — Contrato

Para projetos acima de R$ 1.000, sempre. Não precisa de advogado nem de
reconhecimento de firma: um documento assinado (pode ser digital) já vale.

Precisa conter:

- Nome completo, CPF/CNPJ e endereço das duas partes
- Descrição exata do que será entregue (cole a lista da proposta)
- Prazo, e o que acontece se o cliente atrasar o envio do material
- Valor, forma e datas de pagamento
- Quantas rodadas de ajuste estão incluídas
- Quem é dono do quê: **o cliente é dono do conteúdo e do domínio; você
  mantém o direito de mostrar o trabalho no seu portfólio**
- Como cancelar: se o cliente desistir depois de começar, a entrada não volta
- Multa por atraso de pagamento (2% + juros de 1% ao mês é o usual)

Modelos gratuitos: procure por "contrato de prestação de serviços de
desenvolvimento de site modelo".

---

## Parte 11 — Os primeiros clientes

Você tem três projetos no portfólio. Isso basta para começar. O que funciona
de verdade, em ordem de retorno:

1. **Olhe ao redor primeiro.** A padaria, o petshop, o salão, o dentista da sua
   rua. Procure cada um no Google. Os que não têm site — ou têm um de 2014 —
   são a sua lista. Você já tem o argumento pronto: o comparador do seu site.

2. **Faça um antes/depois de verdade.** Escolha um negócio da sua região,
   monte uma versão nova da página dele (2 horas de trabalho) e mande no
   WhatsApp: *"Fiz uma versão do site da sua loja, sem compromisso. Quer ver?"*
   A taxa de resposta disso é absurdamente maior que a de qualquer mensagem
   fria.

3. **Peça indicação assim que entregar.** No dia da entrega, com o cliente
   satisfeito: *"Você conhece mais alguém que precisa disso?"*. É o momento de
   maior chance de um sim em todo o relacionamento.

4. **Grupos de bairro e associações comerciais.** Grupo de WhatsApp de
   comerciantes da região vale mais que anúncio pago no começo.

5. **Publique o processo, não o resultado.** Post de "site pronto" ninguém
   liga. Post de "esse restaurante não aparecia no Google; veja o que mudei"
   as pessoas leem — e o dono do restaurante vizinho também.

**Anúncio pago fica para depois.** Sem saber ainda quem é seu cliente ideal e
o que ele responde, você só vai pagar para aprender caro.

---

## Parte 12 — Cinco coisas que derrubam freelancer iniciante

1. **Aceitar tudo.** "Faz um app também?" — se você não sabe, diga que não faz.
   Entregar mal uma coisa apaga o crédito de tudo que entregou bem.
2. **Trabalhar sem entrada.** É o erro mais caro e o mais comum.
3. **Não escrever o combinado.** Combinação por áudio no WhatsApp não existe
   quando dá briga. Sempre confirme por escrito, mesmo que seja uma mensagem.
4. **Sumir depois da entrega.** O cliente que você mantém vale cinco que você
   prospecta. Mande uma mensagem em 30 dias perguntando como está indo.
5. **Cobrar barato demais para "pegar experiência".** Preço baixo atrai o pior
   tipo de cliente: o que exige mais, confia menos e nunca indica ninguém. Se
   quiser fazer barato no começo, dê desconto explícito e com prazo —
   *"valor de primeiro projeto, esse mês"* — em vez de rebaixar sua tabela.

---

## Anexo — Manutenção do site

**Trocar cores:** tudo em `css/variables.css`. Mude `--lime` e a página inteira
acompanha.

**Trocar textos:** direto no `index.html`.

**Adicionar um projeto no portfólio:** copie um bloco `<article class="case">`
inteiro e troque o conteúdo. Se for o segundo, quarto, sexto, adicione
`case-inverso` na classe, para alternar o lado da imagem.

**Adicionar a captura de um projeto novo:** salve a imagem em
`assets/img/cases/` com 1200×750 pixels, no formato `.webp`. Se ainda não
tiver a captura, o quadro mostra um aviso discreto no lugar — não quebra.

**Regerar a imagem de compartilhamento:** edite `ferramentas/gerar-og.html`,
abra no navegador e tire um print de 1200×630. Salve em
`assets/img/og-jeff-company.jpg`.

**"Alterei o site e nada mudou" — leia isto antes de se desesperar.**

Na maioria das vezes o arquivo está certo e o problema é o **cache do
navegador**: ele guardou o CSS antigo e continua usando. Duas coisas resolvem:

1. **Para conferir na hora:** aperte `Ctrl + Shift + R` (ou `Ctrl + F5`). Isso
   ignora o cache e baixa tudo de novo.
2. **Para resolver de vez:** no `index.html`, os arquivos de css e js terminam
   com `?v=2026-08-20`. Sempre que você mexer em algum deles, **troque essa
   data** nas cinco linhas. O navegador passa a enxergar outro arquivo e baixa
   a versão nova sozinho.

O passo 2 é o que importa de verdade nos sites dos seus clientes. Sem ele, você
troca o preço no site da pizzaria, manda para o dono conferir, e ele jura que
não mudou nada — porque o navegador dele está mostrando a versão guardada. Você
perde a tarde tentando explicar, e ele fica achando que você não entregou.

**Ver o site no seu computador antes de publicar:** abra o terminal na pasta e
rode:

```bash
python -m http.server 5180
```

Depois abra `http://localhost:5180` no navegador.
