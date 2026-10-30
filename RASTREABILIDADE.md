# Matriz de Rastreabilidade — Desafio × Entregas

Cruzamento entre os requisitos do case de avaliação e as entregas deste repositório.

Legenda: ✅ Atende · 🟡 Parcial · ❌ Não atende

---

## A) "O que será avaliado" (13 critérios)

| # | Critério do desafio | Status | Onde está / Como foi atendido |
|---|---|---|---|
| 1 | Elenca e trabalha problemas de negócio (subdomínios) | ✅ | `02 - Subdomínios DDD` + [doc §2](./VISAO-DE-ARQUITETURA.md): Core/Supporting/Generic com decisão de sourcing. |
| 2 | Conhecimento do TOGAF ADM | ✅ | `01 - Visão (Fase A)`, `07 - Roadmap (Fases E/F)`; doc §9 justifica o ADM. |
| 3 | Motivos do uso de guias/abordagens/frameworks | ✅ | doc §9 "Por que estes frameworks". |
| 4 | Adaptabilidade ao cenário do teste | ✅ | Recomendação condicionada ao banco em silos + Microservices obrigatório; decisão de não comprar core fechado. |
| 5 | Classificação das capacidades top-level | ✅ | `03 - Mapa de Capacidades` + doc §3 (Diferenciação/Competitividade/Comoditizadas). |
| 6 | Mapeamento de requisitos e classificações | ✅ | doc §5 (R1–R6, tipo + prioridade MoSCoW). |
| 7 | Funcionalidades que emergiram do levantamento | ✅ | doc §6 (KYC, Identity, Accounts, Payments, Ledger, Rewards, Fraud, Notification). |
| 8 | Padrões de decomposição de microservices | ✅ | `06 - Arquitetura Alvo` + doc §7 (decompose by subdomain, bounded context = service, database-per-service, event-driven). |
| 9 | Estilos arquiteturais (impactados pela Visão) | ✅ | doc §7 (Microservices, Event-Driven, API-led/BFF, Build-vs-Buy). |
| 10 | Arquitetura Alvo e arquiteturas intermediárias | ✅ | `06` (TO-BE) + `07` (AS-IS → Transições → TO-BE); doc §8. |
| 11 | Conceito de Building Blocks | ✅ | doc §7 (Platform/Product/Compliance BBs). |
| 12 | Value Chain / Value Stream | ✅ | `04 - Value Chain` (agrupamentos funcionais) + `05 - Value Stream` (interoperabilidade). |
| 13 | Clareza, concisão e foco em valor | ✅ | Sumário executivo em tabela, frase-resumo, artefatos visuais, README com galeria. |

## B) Diferenciais (4)

| # | Diferencial | Status | Onde está |
|---|---|---|---|
| 1 | Documentar os possíveis processos | ✅ | `04 - Value Chain` e `05 - Value Stream`; `02` usa business process. |
| 2 | Vincular ao padrão **estratégico** do DDD | ✅ | `02 - Subdomínios DDD` (Core/Supporting/Generic) + doc §2. |
| 3 | Conhecer o padrão **tático** do DDD | ✅ | `08 - DDD Tático`: Aggregate Root, Entities, Value Objects, Domain Events, Repository, Domain Service no bounded context "Conta de Pagamentos". |
| 4 | Domínio da indústria bancária | ✅ | Pix/SPI/BACEN, Ledger, KYC/AML, float, portfólio de crédito (CDC, consignado, garantias). |

## C) Artefatos esperados (4)

| Artefato pedido | Status | Entrega |
|---|---|---|
| Mapa de problemas de negócio (subdomínios) | ✅ | `02-mapa-de-problemas-de-negocio-subdominios-ddd` |
| Mapa de capacidades e classificações | ✅ | `03-mapa-de-capacidades-de-negocio` |
| Fluxos de valor e interoperabilidade das funcionalidades | ✅ | `05-value-stream-realizar-um-pagamento` |
| Cadeia de valor com agrupamentos funcionais | ✅ | `04-cadeia-de-valor-value-chain` |

## D) Itens narrativos explícitos do enunciado

| Pedido no case | Status | Entrega |
|---|---|---|
| Recomendar qual produto habilitar + justificativa | ✅ | Conta de Pagamentos (doc §1, com lastro). |
| Responder sobre aquisição de Core Bancário | ✅ | Não comprar core fechado; compor capacidades (doc §1–2). |
| Preservar o estilo Microservices | ✅ | Requisito R3 + `06 - Arquitetura Alvo`. |
| Visão TO-BE + plano de migração | ✅ | `06` e `07`; doc §8 (Strangler Fig). |
| Lastrear as tomadas de decisão | ✅ | Coluna "Lastro" no sumário + doc §9. |

---

## Resumo

| Bloco | Cobertura |
|---|---|
| Critérios de avaliação (A) | 13/13 ✅ |
| Diferenciais (B) | 4/4 ✅ |
| Artefatos esperados (C) | 4/4 ✅ |
| Itens narrativos (D) | 5/5 ✅ |

**Status geral: 100% dos requisitos atendidos.**
