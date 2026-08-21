# Painel de clientes — protótipo

Para abrir: rode `python -m http.server 5180` na pasta do projeto e acesse
`http://localhost:5180/painel/`.

---

## O que isto é

Um protótipo navegável. **Nada aqui é real:** os seis clientes são inventados e
os dados ficam salvos só no seu navegador (`localStorage`). Serve para você
clicar, ver na tela e dizer o que muda antes de eu construir a versão de
verdade.

O botão **Recomeçar do zero**, na faixa amarela do topo, devolve tudo aos dados
originais.

---

## O que já dá para fazer

| Ação | Onde |
|---|---|
| Ver quanto entra por mês, quantos estão ativos, quem está vencendo e quem deve | Cartões do topo |
| Filtrar por situação | Botões abaixo dos cartões |
| Buscar por nome, negócio ou endereço do site | Campo de busca |
| Ver o tempo exato que resta na assinatura | Barra colorida em cada linha |
| Abrir a ficha completa do cliente | Clicar na linha |
| **Ligar e desligar o site** | Interruptor na ficha |
| Cobrar no WhatsApp com a mensagem já escrita | Botão no rodapé da ficha |
| Registrar um pagamento e empurrar o vencimento | Botão no rodapé da ficha |
| Mandar link direto para um cliente | O endereço vira `#id-do-cliente` |

---

## As cores querem dizer algo

| Cor | Situação |
|---|---|
| Verde | Mais de 7 dias até vencer |
| Amarelo | Vence em 4 a 7 dias |
| Laranja | Vence em até 3 dias |
| Vermelho | Já venceu, site ainda no ar |
| Cinza | Suspenso, site fora do ar |

**Atrasado e suspenso são coisas diferentes de propósito.** O contrato dá
10 dias de tolerância antes de tirar o site do ar. Quem está em vermelho ainda
tem site funcionando e só precisa de um empurrão; quem está em cinza já foi
cortado e precisa pagar para voltar.

---

## Três detalhes que valem reparar

**A mensagem de cobrança muda conforme a situação.** Quem está para vencer
recebe um lembrete gentil; quem está suspenso recebe um aviso dizendo que o
site volta em minutos assim que pagar. Cobrar todo mundo com o mesmo texto é
o jeito rápido de soar mal.

**Registrar pagamento soma 30 dias ao vencimento anterior, não a hoje.** Quem
pagou atrasado não ganha dias de brinde, e quem pagou adiantado não perde os
que já tinha.

**Desligar pede confirmação, ligar não.** Errar o clique e derrubar o site de
um cliente é caro; errar e religar não é.

---

## O que falta para virar produto

O protótipo é a tela. Falta o que está por baixo dela:

1. **Banco de dados** — hoje é `localStorage`, que vive só neste navegador.
   Para acessar do celular precisa de banco de verdade (Cloudflare D1).
2. **Login** — hoje qualquer um que abrir o endereço vê tudo.
   Cloudflare Access resolve sem programar autenticação.
3. **O interruptor ligado de verdade** — hoje ele só muda o dado na tela.
   Precisa do Worker na frente dos sites, e isso depende da decisão de
   hospedagem (veja `HOSPEDAGEM.md`).
4. **Cadastro de cliente** — o botão "Novo cliente" ainda não abre formulário.
5. **Asaas**, quando fizer sentido — aí o "pagou / não pagou" para de ser
   digitado na mão e passa a chegar sozinho.

Quando isso for construído, três funções trocam de lugar no `painel.js`:
`carregar()`, `salvar()` e o trecho do interruptor. **O resto da tela continua
igual** — foi escrito pensando nisso.
