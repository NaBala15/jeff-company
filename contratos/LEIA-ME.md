# Como usar esta pasta

Cinco documentos e uma ferramenta que os preenche para você.

---

## Os documentos

| Arquivo | O que é | Quando usar |
|---|---|---|
| `POLITICA.md` | Regras gerais da Jeff Company | Mandar junto com **todo** contrato. É citada dentro deles |
| `01-contrato-projeto.md` | Contrato de criação de site | Quando o cliente **compra** o site |
| `02-termo-entrega.md` | Entrega, aceite e quitação | Na entrega, junto com o pagamento final |
| `03-termo-cancelamento.md` | Encerramento do projeto | Se o projeto for cancelado |
| `04-contrato-assinatura.md` | Plano mensal com página inclusa | Quando o cliente **não compra**, apenas assina |

> **Os contratos 01 e 04 nunca são usados juntos.** No 01 o cliente vira dono do
> site. No 04 ele usa a página enquanto pagar. São modelos de negócio opostos.

---

## O plano de assinatura, em uma página

É o modelo da "página grátis": você adapta um modelo pronto, entrega no mesmo
dia, hospeda em subdomínio seu e cobra só a mensalidade.

**O que o contrato 04 protege, e por que cada ponto existe:**

| Cláusula | O que garante |
|---|---|
| 2.1 e 2.2 | Deixa escrito que é **modelo adaptado**, não projeto exclusivo. Sem isso, o cliente pede redesenho achando que tem direito |
| 3.2 e 3.3 | O subdomínio é **seu**, cedido em uso. Ele não vai embora com o cliente |
| 3.4 | O cliente reconhece que subdomínio **rende menos no Google**. É honestidade — e é o que abre a porta do upgrade |
| 3.5 | O caminho para domínio próprio já está escrito, com o preço da configuração |
| 6.3 e 6.4 | Alterações **por escrito** e em até 5 dias úteis. Não é atendimento imediato |
| 8.2 e 8.3 | Como a página está no seu domínio, você pode remover conteúdo problemático na hora |
| 10 | O cliente pode **comprar** a página em vez de simplesmente perdê-la ao sair |

**A cláusula 6 é a mais importante deste contrato.** Não é o preço que quebra
esse modelo, é o atendimento: com 40 clientes, "2 alterações por mês" viram 80
pedidos chegando no seu WhatsApp. O prazo de 5 dias úteis e o pedido por escrito
são o que transformam isso em algo administrável.

**Sobre o primeiro mês grátis:** a Política dá um mês de manutenção gratuito
depois de um site **pago**. No plano de assinatura, cobrar a primeira
mensalidade já na publicação faz diferença — página grátis somada a mês grátis
são 60 dias sem receber nada, e atrai quem nunca ia pagar. Por isso o item 4.3
está escrito assim.

---

## O jeito fácil: o gerador

Abra a pasta do projeto no terminal e rode:

```bash
python -m http.server 5180
```

Depois abra no navegador:

```
http://localhost:5180/ferramentas/gerar-contrato.html
```

O gerador lê o documento escolhido, encontra sozinho todos os campos e monta um
formulário. Você preenche, confere na tela e clica em **Imprimir / salvar PDF**
— no destino da impressão, escolha "Salvar como PDF".

**Três coisas que ele faz por você:**

- Campos que ainda faltam ficam **marcados em amarelo** no documento, para você
  não enviar contrato com buraco
- Seus dados fixos (razão social, CNPJ, WhatsApp, e-mail, cidade) já vêm
  preenchidos. Endereço e chave Pix ficam em `ferramentas/meus-dados.local.js`,
  que **não vai para o GitHub**. O que você digitar fica **salvo no navegador** — no próximo
  contrato só os dados do cliente mudam
- Se você editar qualquer arquivo `.md`, o formulário acompanha sozinho

Nada é enviado para lugar nenhum. Tudo fica no seu computador.

*Se abrir o gerador com duplo clique em vez do servidor, o navegador bloqueia a
leitura dos arquivos da pasta. Nesse caso aparece um botão para escolher o
arquivo `.md` na mão, e funciona igual.*

---

## O jeito manual

Abra o `.md` em qualquer editor e procure pelo sinal **«**. Tudo que estiver
entre `«` e `»` é campo para preencher. Use `Ctrl + F` e busque por `«`.

---

## O fluxo de uma venda, do começo ao fim

1. Cliente chama → você conversa e entende o que ele precisa
2. Você manda a **proposta** (o modelo está na Parte 9 do `GUIA.md`)
3. Cliente aceita → você gera o **contrato 01** e manda junto com a `POLITICA.md`
4. Cliente assina e paga os 50% → **agora** você começa
5. Você entrega → gera o **termo 02**, cliente confere e paga os 50% restantes
6. Primeiro mês de manutenção grátis → depois entra a mensalidade

Se algo der errado no meio do caminho, o **termo 03** encerra formalmente.

---

## Antes de usar pela primeira vez

- [ ] Abra o gerador e preencha **seus** dados uma vez (eles ficam salvos)
- [ ] Defina o valor da mensalidade e substitua no `POLITICA.md`
- [ ] Escreva sua cidade no campo do foro
- [ ] Se for usar o contrato 04, decida a taxa de ativação e a fidelidade —
      leia a nota dentro da cláusula 4 antes

---

## Uma observação honesta

Estes documentos foram escritos para cobrir as situações que mais aparecem em
projeto de site: cliente que some, cliente que não paga, cliente que pede
mudança sem fim, e briga sobre quem é dono do quê.

Eles não substituem um advogado. Para contratos de valor mais alto, ou se algum
cliente pedir alterações nas cláusulas, vale pagar uma consulta — costuma custar
menos que o problema que evita.

Atenção especial em três pontos, que são os mais sensíveis:

- **Retenção de valores no cancelamento** (cláusula 12 da Política)
- **Suspensão do site por falta de pagamento** (cláusula 3 da Política)
- **Direitos autorais e licença de uso** (cláusula 14 da Política)

Quando o contratante é pessoa física ou microempresa consumidora final, aplica-se
também o Código de Defesa do Consumidor, que limita cláusulas muito desfavoráveis
a ele. Foi por isso que a retenção no cancelamento ficou escalonada por etapa, em
vez de reter tudo sempre.
