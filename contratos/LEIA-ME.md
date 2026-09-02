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

**Sobre o primeiro mês grátis** *(regra decidida em 24/08/2026)*

Os dois contratos dão um mês gratuito, e vale a mesma regra nos dois:
**durante o período gratuito o cancelamento é imediato e sem custo**, sem aviso
prévio e sem permanência mínima, e o serviço fica ativo até o fim do mês que
foi prometido.

Isso existe porque antes as regras se atropelavam: o mês era gratuito, mas o
cancelamento exigia aviso de 30 dias. Quem cancelasse no primeiro dia saía
devendo uma mensalidade — cortesia que vira armadilha, e o cliente só descobre
na hora de sair, que é quando ele conta para os outros.

Na **assinatura** há ainda uma **permanência mínima de 2 meses pagos** depois do
mês gratuito (cláusula 5.2).

**O risco que você assumiu, de olhos abertos:** a permanência mínima só vale
para quem passa do mês gratuito. Quem montar a página, usar 30 dias e sair no
dia 29 não paga nada, e você trabalhou de graça. É o preço de anunciar "mês
grátis" de verdade em vez de fidelidade disfarçada.

Se isso começar a acontecer com frequência, o remédio já está no contrato: a
**taxa de ativação** do item 4.1, hoje zerada. Uma taxa pequena cobre o custo
de montar a página sem tirar a limpeza da promessa.

**No anúncio, as duas informações andam juntas.** O site já mostra "1º mês
grátis — depois, permanência mínima de 2 meses" na mesma linha, no passo 2 do
pedido e na página de serviços. Anunciar só a metade boa e revelar a outra na
assinatura do contrato é propaganda enganosa.

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
  preenchidos. A chave Pix fica em `ferramentas/meus-dados.local.js`,
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

---

## Domínio gerenciado — a conta por trás do item 3.6

*(decidido em 24/08/2026)*

É uma **opção**, não o padrão, e existe nos **dois contratos**: item 3.6 da
assinatura e item 7.6 do projeto. O cliente que quiser `seunegocio.com.br` sem
lidar com registro.br paga **R$ 5/mês a mais** e você cuida de tudo.

**No contrato de projeto há uma amarra a mais:** a opção depende de o cliente
ter contratado a **manutenção mensal** da cláusula 8. Sem ela não existe
mensalidade onde diluir os R$ 5. Se a manutenção acabar, o domínio gerenciado
acaba junto e o custo volta a ser dele (item 7.7).

| | |
|---|---|
| Você recebe | R$ 5 × 12 = **R$ 60/ano** |
| Você paga ao registro.br | **R$ 40/ano** |
| Sobra | **R$ 20/ano por cliente** |

**O ganho não é a margem, são os R$ 20.** É fechar mais venda: dono de negócio
pequeno que precisa criar conta no registro.br, entender boleto e lembrar de
renovar é cliente que trava no meio do caminho.

### O domínio nunca fica no seu nome

Pagar e ser dono são coisas diferentes. O registro.br separa titular de contato
de cobrança, então:

- **titular:** o cliente, com o CPF/CNPJ dele
- **contato técnico e de cobrança:** você

Isso mantém a regra de ouro do `GUIA.md`. Cliente preso a você por causa do
endereço vira ex-cliente que fala mal.

### A exposição que sobra

O acréscimo só começa depois do mês grátis, e o registro só sai depois do
primeiro pagamento confirmado — as duas coisas estão escritas no item 3.6.
Mesmo assim, um cliente que cumpra só a permanência mínima paga **R$ 10** de
domínio, e você gastou R$ 40.

**Perda máxima por cliente: R$ 30.** É pequena e controlável enquanto são
poucos. Se começar a acontecer com frequência, duas saídas, nesta ordem:

1. registrar o domínio só depois da permanência mínima cumprida — nos 3
   primeiros meses a página roda no subdomínio, que a cláusula 3 já prevê;
2. cobrar a taxa de ativação do item 4.1, hoje zerada.

### Na hora de vender

O `MATERIAIS.md` traz a pergunta com os **três caminhos** de endereço, e o
passo 2 do pedido anuncia a opção. Não venda como "domínio grátis": é domínio
incluso na mensalidade, e a diferença aparece no dia em que ele cancelar.
