/* ==========================================================================
   MEDIÇÃO DE VISITAS — Cloudflare Web Analytics

   ┌──────────────────────────────────────────────────────────────────────┐
   │  COLE O SEU TOKEN NA LINHA `var TOKEN` LOGO ABAIXO.                   │
   │                                                                      │
   │  Onde pegar: painel da Cloudflare → Analytics & Logs →                │
   │  Web Analytics → Add a site → jeffcompany.com.br.                    │
   │  Ele mostra um trecho com data-cf-beacon='{"token": "abc123..."}'.   │
   │  O que interessa é só o valor do token.                              │
   │                                                                      │
   │  ⚠ AO PREENCHER O TOKEN, ATUALIZE A PÁGINA DE PRIVACIDADE            │
   │    NO MESMO DIA. Ela hoje afirma, por escrito, que o site NÃO tem    │
   │    analytics. A partir do momento em que tiver, aquela frase vira    │
   │    mentira — e política que descreve um site que não existe é pior   │
   │    que política nenhuma.                                             │
   │                                                                      │
   │    O que muda em /privacidade/: a tabela "O que sai do seu           │
   │    navegador" ganha uma linha, e o quadro do resumo e o parágrafo    │
   │    do "não há Google Analytics…" precisam ser reescritos.            │
   └──────────────────────────────────────────────────────────────────────┘

   POR QUE ESTA E NÃO O GOOGLE ANALYTICS

   O Google Analytics grava cookie no navegador do visitante. Cookie de
   medição exige aviso de consentimento — aquele tarja que todo mundo fecha
   sem ler — e obrigaria a página de privacidade a virar um documento bem
   mais pesado.

   A do Cloudflare não usa cookie, não guarda nada no aparelho e não segue
   ninguém entre sites. Ela conta visita, e só. Dá menos informação que o
   Google, e é justamente por isso que não pede consentimento.

   O QUE ELA RESPONDE
   Quantas pessoas entram, em que páginas, de onde vieram, no celular ou no
   computador. O suficiente para você saber se vale continuar escrevendo
   página de serviço — e para descobrir em que passo do pedido a pessoa
   desiste.

   ========================================================================== */

(function () {
  'use strict';

  /* EDITAR: o token do painel da Cloudflare. Enquanto estiver vazio, nada
     é carregado e nenhuma visita é medida. */
  var TOKEN = '';

  /* Sem token, o arquivo termina aqui mesmo. É de propósito: melhor não
     medir nada do que carregar um script de fora que não serve para nada e
     ainda assim aparece na lista de terceiros da política. */
  if (!TOKEN) return;

  /* Localhost e arquivo aberto por duplo clique não contam: senão os seus
     próprios testes viram "visitas" e o número deixa de significar algo. */
  var local = ['localhost', '127.0.0.1', ''];
  if (local.indexOf(location.hostname) !== -1) return;

  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  s.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(s);
})();
