# Onde hospedar os sites — Vercel ou Cloudflare

Documento para decidir com calma. Consultado em 20/08/2026.

---

## O problema que precisa ser resolvido

A Vercel **não permite uso comercial no plano gratuito**. Não é interpretação
minha, está na documentação deles (atualizada em 29/07/2026):

> Commercial usage is defined as any Deployment that is used for the purpose of
> financial gain of **anyone** involved in **any part of the production** of the
> project, including a paid employee or consultant writing the code.

E entre os exemplos listados:

> - Receiving payment to create, update, or host the site
> - Advertising the sale of a product or service

Traduzindo para o seu caso:

| O que você pretende fazer | É comercial pelos termos? |
|---|---|
| Hospedar o site da pizzaria e cobrar R$ 50/mês | **Sim** — "receber pagamento para hospedar" |
| Fazer um site cobrando e hospedar de graça | **Sim** — "receber pagamento para criar" |
| O site da própria Jeff Company | **Sim** — "anunciar a venda de um serviço" |
| Sites de estudo, sem cobrar nada | Não |

O DevClub V2 é caso de fronteira: você não cobrou por ele, mas usou para
conseguir uma vaga. Baixo risco, mas está na zona cinzenta.

**O que acontece na prática se descumprir:** a conta é pausada. Não é multa,
é o site saindo do ar. Com 15 clientes pagantes, todos caem de uma vez, e você
descobre pelo WhatsApp deles.

---

## As duas saídas, lado a lado

| | **Vercel Pro** | **Cloudflare Pages** |
|---|---|---|
| Custo | **US$ 20/mês** (~R$ 110) | **R$ 0** |
| Uso comercial | Permitido | Permitido |
| Banda | 1 TB/mês | Ilimitada |
| Cartão de crédito | Obrigatório | Não pede |
| Sites (projetos) | Ilimitados | Ilimitados |
| Domínios por projeto | Ilimitados | Ilimitados |
| Deploy pelo GitHub | Sim | Sim |
| Ligar/desligar site pelo painel | Dá, com Edge Middleware | Dá, com Workers |
| Custo do ligar/desligar | Incluso no Pro | 100 mil requisições/dia grátis |
| Banco de dados para o painel | Pago à parte | D1 grátis: 5 GB, 5 milhões de leituras/dia |
| Login do painel | Você constrói | Cloudflare Access grátis até 50 pessoas |
| Você já sabe usar | **Sim** | Não, mas é parecido |

---

## O que isso significa no seu bolso

A conta abaixo usa **R$ 50**, que é o piso: é o preço dos modelos Simples 1 e
Simples 2. Quem escolhe o modelo **Premium** paga R$ 60, então o cenário real
tende a ficar acima desta tabela. Calcular pelo piso é de propósito — se o
negócio fecha no pior caso, fecha em qualquer caso.

| Clientes | Receita | Vercel Pro | Sobra | Cloudflare | Sobra |
|---|---|---|---|---|---|
| 1 | R$ 50 | R$ 110 | **−R$ 60** | R$ 0 | R$ 50 |
| 3 | R$ 150 | R$ 110 | R$ 40 | R$ 0 | R$ 150 |
| 10 | R$ 500 | R$ 110 | R$ 390 | R$ 0 | R$ 500 |
| 30 | R$ 1.500 | R$ 110 | R$ 1.390 | R$ 0 | R$ 1.500 |

O ponto que importa é a primeira linha. No começo, quando você tem um ou dois
clientes, R$ 110 fixos por mês é o que decide se o negócio anda ou trava. E o
dólar sobe sozinho, sem te avisar.

---

## O trabalho de migrar

É menor do que parece, porque os dois publicam direto do GitHub.

1. Criar conta em [dash.cloudflare.com](https://dash.cloudflare.com) — grátis, sem cartão
2. *Workers & Pages* → *Create* → *Pages* → *Connect to Git*
3. Autorizar o GitHub e escolher o repositório
4. Como o site é HTML puro, não tem build: deixe o comando vazio e a pasta como `/`
5. *Save and Deploy* — em cerca de 1 minuto sai um endereço `.pages.dev`
6. Apontar o domínio: *Custom domains* → *Set up a domain*

**Uma tarde de trabalho**, contando com a curva de aprendizado. Depois disso é
igual à Vercel: `git push` e o site atualiza sozinho.

Uma vantagem colateral: se você transferir o domínio para a Cloudflare, o DNS
fica no mesmo painel da hospedagem. Um lugar só em vez de dois.

---

## O que muda no dia a dia

**Fica igual:** publicar com `git push`, domínio próprio, HTTPS automático,
velocidade (os dois têm CDN global).

**Fica melhor:**
- Banda ilimitada em vez de teto de 1 TB
- Workers e banco D1 no mesmo free tier — é o que viabiliza o painel e o
  botão de ligar/desligar sem servidor pago
- Cloudflare Access dá login no painel sem você programar autenticação

**Fica pior:**
- Você já conhece o painel da Vercel e vai aprender outro
- A Vercel tem previews de branch mais bem acabados (você não usa hoje)
- A documentação da Cloudflare é mais densa

---

## Recomendação

**Cloudflare Pages.** Três motivos, em ordem de peso:

1. **É grátis e permite comercial.** Resolve o problema sem custo fixo, que é
   exatamente o que um negócio começando precisa.
2. **É o que viabiliza o painel que você quer.** O botão de ligar e desligar o
   site do cliente precisa de alguma coisa rodando na frente dos sites.
   Workers + KV fazem isso dentro do free tier. Na Vercel, mesmo pagando Pro,
   você ainda precisaria de banco de dados à parte.
3. **O modelo de subdomínio combina.** `cliente.jeffcompany.com.br` com
   roteamento por Worker é o caminho natural lá.

O caso em que a Vercel ganharia é se você já tivesse dez clientes pagando e não
quisesse parar para migrar. Não é a sua situação — é justamente a hora de
mudar, enquanto o único site a migrar é o seu.

---

## Como o desligar vai funcionar

Para registro, quando chegarmos lá:

```
visitante  →  Worker  →  consulta a chave do cliente
                         │
                         ├── "ativo"     →  entrega o site
                         └── "suspenso"  →  entrega a página de site indisponível
```

O painel só escreve nessa chave. O site sai do ar em segundos e volta igual de
rápido, sem apagar nada — que é exatamente o que a cláusula 7.2 do contrato de
assinatura promete ao cliente.

**Detalhe de custo:** o Worker só precisa rodar na página em si, não nas
imagens e arquivos. Assim uma visita gasta 1 requisição em vez de 12, e as
100 mil por dia do free tier viram um teto que você não alcança tão cedo.

---

## Fontes

- [Vercel — Fair Use Guidelines, seção Commercial usage](https://vercel.com/docs/limits/fair-use-guidelines)
- [Vercel — Hobby Plan](https://vercel.com/docs/plans/hobby)
- [Cloudflare — Workers, limites do plano gratuito](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare — Pages, preços](https://developers.cloudflare.com/pages/functions/pricing/)
