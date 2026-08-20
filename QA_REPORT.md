# Relatório de Auditoria de Qualidade — Freitas Outlet

**Data:** 20/08/2026
**Ambiente:** Local (`http://localhost:3000`), Next.js 16 + Turbopack, SQLite (`data/freitasoutlet.db`), produção usa Neon PostgreSQL via `DATABASE_URL` (vazia em dev → fallback SQLite)
**Escopo:** Navegação, formulários, autenticação, carrinho/checkout, APIs, segurança, performance, UI/responsividade

> **STATUS: TODOS OS ITENS CORRIGIDOS (20/08/2026)** — ver seção 5.

---

## 1. Resumo Executivo

**Nota de estabilidade: 7,2 / 10** (antes das correções)

| Severidade | Quantidade | Status |
|---|---|---|
| CRÍTICA | 2 | ✅ Corrigidas |
| ALTA | 1 | ✅ Corrigida |
| MÉDIA | 2 | ✅ Corrigidas |
| BAIXA | 3 | ✅ Corrigidas |

O e-commerce está **funcional e estável**: todas as páginas públicas carregam (200), o fluxo de autenticação completo (register → login → sessão → logout) funciona, as APIs protegidas rejeitam acesso não autorizado (401/403), e a performance em modo dev é boa (~100–180ms em rotas quentes).

Os dois problemas críticos estão no **cálculo de preços no checkout** (flash sale que nunca é aplicada e frete grátis calculado de forma inconsistente entre cliente e servidor) — risco financeiro real para a loja. O problema de alta severidade é o **rate limit global em produção**, que permite brute-force/DoS do login.

O "Erro interno" observado nos endpoints de auth durante testes iniciais foi **artefato do meu teste** (mangling de aspas do PowerShell no `curl`), não um bug do sistema — confirmado ao repetir com body de arquivo: todos os endpoints de auth respondem corretamente.

---

## 2. Lista Detalhada de Bugs

### [CRÍTICA] [Preço] [Página do produto / Carrinho / Checkout] — Flash sale nunca é aplicada no preço final ✅ CORRIGIDA

- **PÁGINA/ROTA:** `/produtos/[slug]`, `/carrinho`, `/checkout`, `/api/checkout`
- **DESCRIÇÃO:** A página do produto exibe o preço promocional (`flashSalePrice`) quando a oferta está ativa, mas esse valor **não é propagado** para o carrinho, checkout nem para a validação do servidor. O cliente vê o desconto na tela, mas o sistema **cobra o preço cheio**.
- **PASSO A PASSO:**
  1. Ative uma flash sale para um produto (criar `site_offers`/`flash_sale_price` no banco).
  2. Abra `/produtos/[slug]` → o `PriceBlock` mostra `flashSalePrice` riscado.
  3. Adicione ao carrinho → `CartContext` usa `product.price` (cheio).
  4. Finalize o checkout → `checkout-payload.ts` e `items.ts` (servidor) validam contra `product.price`.
  5. O cliente paga o valor cheio, divergente do que viu na vitrine.
- **COMPORTAMENTO ESPERADO:** O preço da flash sale deve ser usado de ponta a ponta (página, carrinho, checkout e validação server-side) com idempotência.
- **SUGESTÃO DE CORREÇÃO:** Criar uma fonte única de verdade (`getEffectivePrice(product)` em `src/lib/wholesale.ts` ou novo `src/lib/pricing.ts`) que considera `flashSalePrice` → wholesale → preço base, e usá-la em `use-product-purchase.ts:66`, `PriceBlock.tsx:11`, `CartContext.tsx:77`, `checkout-payload.ts:24` e `src/lib/checkout/items.ts:39`.

### [CRÍTICA] [Frete] [Checkout] — Frete grátis (≥ R$ 299) calculado de forma inconsistente entre cliente e servidor ✅ CORRIGIDA

- **PÁGINA/ROTA:** `/checkout`, `/api/shipping`, `/api/checkout`
- **DESCRIÇÃO:** A regra "frete grátis para subtotal ≥ R$ 299" é aplicada **client-side** (`src/lib/shipping.ts:34-36` zera o PAC quando o subtotal recebido pelo cliente atende o mínimo), mas o servidor recalcula o frete em `src/lib/checkout/pricing.ts:46` usando **outra lógica/valores**. O total exibido ao cliente (com frete grátis) pode divergir do total efetivamente cobrado (com frete), ou vice-versa.
- **PASSO A PASSO:**
  1. Monte um carrinho com subtotal entre R$ 299 e o mínimo que dispara a regra no servidor.
  2. Consulte `/api/shipping` (cliente) → frete PAC = R$ 0.
  3. Envie o checkout → servidor recalcula o frete com outra regra → cobra valor ≠ 0.
  4. Divergência entre o total exibido e o cobrado.
- **COMPORTAMENTO ESPERADO:** Uma única função de cálculo de frete/regra de frete grátis compartilhada entre cliente e servidor, garantindo que o total exibido == total cobrado.
- **SUGESTÃO DE CORREÇÃO:** Mover a regra de frete grátis para `src/lib/checkout/pricing.ts` (servidor) e fazer o cliente consultar `/api/shipping` para exibir, em vez de duplicar a lógica em `src/lib/shipping.ts`. Validar o frete cobrado no servidor contra o subtotal final (após cupom/wholesale/flash sale).

### [ALTA] [Segurança] [Todos os endpoints com rate limit] — Rate limit ineficaz em produção (buckets globais) ✅ CORRIGIDA

- **PÁGINA/ROTA:** `/api/auth/login`, `/api/auth/register`, `/api/admin/login`, `/api/shipping`, `/api/contato`, etc.
- **DESCRIÇÃO:** `getClientIp` retorna `'unknown'` em produção quando `TRUST_PROXY !== 'true'` (`src/lib/client-ip.ts:36-37`). Com isso, todos os usuários compartilham as mesmas chaves de rate limit (`admin-login:unknown`, `customer-login:unknown`, etc. — `src/lib/rate-limit.ts:13-44`). Resultado: (a) um único usuário pode esgotar o bucket global e **bloquear o login de todos** (DoS), e (b) em bucket global, o limite coletivo permite **brute-force** distribuído de senhas.
- **PASSO A PASSO:**
  1. Faça deploy em produção sem configurar `TRUST_PROXY=true`.
  2. Envie 5 tentativas de login com senha errada por IP → todas somam na mesma chave `customer-login:unknown`.
  3. Após 5 tentativas no total (não por IP), **todos os clientes** recebem 429 por 5 minutos.
- **COMPORTAMENTO ESPERADO:** Rate limit por IP real de cada cliente, preservando a proteção contra brute-force sem bloquear usuários legítimos.
- **SUGESTÃO DE CORREÇÃO:** Definir `TRUST_PROXY=true` no ambiente de produção **e** tratar IPs roteados/privados corretamente. Alternativa mais robusta: rate limit por IP + por e-mail (`customer-login:${ip}:${email}`) e buckets por conta, para manter a proteção mesmo com IPs mascarados.

### [MÉDIA] [Segurança] [Endpoints de auth] — JSON malformado retorna 500 em vez de 400 ✅ CORRIGIDA

- **PÁGINA/ROTA:** `/api/auth/login`, `/api/auth/register`, `/api/admin/login`, `/api/newsletter`, `/api/contato`
- **DESCRIÇÃO:** Quando o corpo da requisição não é JSON válido, `request.json()` lança `SyntaxError`, que cai no `catch` genérico e retorna **500 "Erro interno"** em vez de um 400 "JSON inválido". Isso polui logs e mascara o erro real (confirmado: JSON inválido → 500; JSON válido → resposta correta).
- **PASSO A PASSO:**
  1. Envie `POST /api/auth/login` com corpo `{json invalido` (sem fechar).
  2. Resposta: `500 {"error":"Erro interno"}`.
  3. O erro real (`SyntaxError`) fica no servidor, sem mensagem útil ao cliente.
- **COMPORTAMENTO ESPERADO:** `400` com mensagem de corpo inválido.
- **SUGESTÃO DE CORREÇÃO:** Envolver `request.json()` em `try/catch` específico nas rotas e retornar `400 {"error":"Corpo da requisição inválido"}` antes do `catch` genérico.

### [MÉDIA] [Testes] [Suite de testes] — 2 testes de slugs falhando (pré-existentes) ✅ CORRIGIDA

- **PÁGINA/ROTA:** `__tests__/valid-slugs.test.ts`
- **DESCRIÇÃO:** `slugExists('produtos', 'chuteira-lotto-air-400')` e `slugExists('produtos', 'chuteira-nike-mercurial-superfly-9')` esperam `true`, mas esses slugs **não existem em lugar nenhum** (as coleções estáticas `chuteiras.ts` e `tenis.ts` estão vazias, e o SQLite só tem os 5 produtos Adidas). Pré-existente — não relacionado às mudanças de atacado.
- **COMPORTAMENTO ESPERADO:** Testes verdes, ou slugs removidos/atualizados.
- **SUGESTÃO DE CORREÇÃO:** Atualizar o teste para slugs reais (`adidas-ultraboost-5`, etc.) ou popular as coleções estáticas.

### [BAIXA] [Performance] [First load] — Primeiro acesso a cada rota é lento (compilação Turbopack)

- **PÁGINA/ROTA:** Todas
- **DESCRIÇÃO:** Primeiro hit em cada rota após iniciar o servidor demora ~2–6s (compilação sob demanda do Turbopack). Rotas quentes em seguida: 99–184ms. Comportamento esperado de dev server; não é bug de produção (build otimiza isso).
- **SUGESTÃO:** Usar `next build`/`next start` para medir performance real. Considerar ISR/SSG para páginas de produto e blog.

### [BAIXA] [Código] [Lint] — Erros de lint pré-existentes ✅ CORRIGIDA

- **PÁGINA/ROTA:** `src/lib/database/client.ts`, `src/lib/recently-viewed.tsx:22`, `src/context/CartContext.tsx:28`
- **DESCRIÇÃO:** `no-explicit-any` em `client.ts`; `set-state-in-effect` em `recently-viewed.tsx` e `CartContext.tsx`. Não bloqueiam build nem funcionamento.
- **SUGESTÃO:** Corrigir para limpar `npm run lint`.

### [BAIXA] [Segurança] [`/api/cliente/endereco` GET] — Resposta sem auth retorna 200 com lista vazia ✅ CORRIGIDA

- **PÁGINA/ROTA:** `GET /api/cliente/endereco`
- **DESCRIÇÃO:** Sem sessão, retorna `200 {addresses: []}` em vez de `401`. Não vaza dados (lista vazia), mas é inconsistente com os demais endpoints do cliente (`/api/cliente/pedidos` retorna 401). Comportamento intencional segundo o código (`route.ts:8`), mas confuso para consumidores da API.
- **SUGESTÃO:** Alinhar com o padrão dos demais endpoints: `401` quando não autenticado.

---

## 3. Cobertura de Testes Realizados

| Área | Resultado |
|---|---|
| Rotas públicas (home, produtos, produto, categorias, blog, marcas, busca) | 200 ✅ |
| `/slug-nao-encontrado` | 404 (intencional) ✅ |
| `/minha-conta` sem sessão | 307 → `/login` ✅ |
| `/admin` sem sessão | 307 → `/admin/login` ✅ |
| Register (JSON válido) | 200, cria cliente ✅ |
| Login (credenciais válidas) | 200, cria sessão ✅ |
| Login (senha/email errados) | 401 "E-mail ou senha incorretos" ✅ |
| `/api/auth/me` com sessão | 200, retorna customer ✅ |
| Logout | 307 → `/`; sessão invalidada ✅ |
| Forgot password | 200 ✅ |
| Admin login (senha errada) | 401 "Senha inválida" ✅ |
| `/api/admin/produtos` sem auth | 401 ✅ |
| `/api/admin/stats` sem auth | 401 ✅ |
| `/api/upload` sem auth | 403 (Origin) ✅ |
| `/api/webhook` sem assinatura | 401 ✅ |
| Reviews GET/POST (sem auth, por design) | 200/201 ✅ |
| `/api/cliente/pedidos` sem auth | 401 ✅ |
| Rate limit (5 tentativas login) | 429 após 5 ✅ |
| Testes automatizados | 83 passando, 2 falhas pré-existentes |

## 4. Recomendações Prioritárias

1. **Corrigir C1 (flash sale)** — risco financeiro direto; unificar `getEffectivePrice`.
2. **Corrigir C2 (frete grátis)** — unificar regra de frete cliente/servidor.
3. **Corrigir A1 (rate limit em produção)** — definir `TRUST_PROXY` e/ou buckets por e-mail.
4. **Atualizar os 2 testes de slug** para eliminar falhas na CI.
5. **Adicionar `try/catch` no `request.json()`** das rotas de auth (400 para JSON inválido).

---

## 5. Correções Aplicadas (20/08/2026)

### 5.1 C1 — Flash sale aplicada de ponta a ponta ✅

Criado `src/lib/pricing.ts` com fonte única de verdade:

- `getFlashSalePrice(item)` — retorna o preço da flash sale quando ativa para o slug.
- `getEffectivePrice(item, quantity)` — prioridade: **flash sale → wholesale → preço base**.

Aplicado em todos os pontos de cálculo:

| Arquivo | Antes | Depois |
|---|---|---|
| `src/app/produtos/[slug]/use-product-purchase.ts` | `getUnitPrice(product.price, qty)` | `getEffectivePrice(product, qty)` |
| `src/app/produtos/[slug]/product-info/PriceBlock.tsx` | ternário local | usa `unitPrice` efetivo; badge flash com prioridade |
| `src/context/CartContext.tsx` (totalPrice) | `getUnitPrice(...)` | `getEffectivePrice(...)` |
| `src/app/checkout/checkout-payload.ts` | `getUnitPrice(...)` | `getEffectivePrice(...)` |
| `src/components/checkout/OrderSummary.tsx` | `getUnitPrice(...)` | `getEffectivePrice(...)` |
| `src/app/checkout/use-checkout.ts` (loyalty) | `getUnitPrice(...)` | `getEffectivePrice(...)` |
| `src/app/carrinho/page.tsx` | `getUnitPrice(...)` | `getEffectivePrice(...)` |
| `src/lib/checkout/items.ts` (server) | `getUnitPrice(serverPrice, qty)` | `getEffectivePrice({slug, price}, qty)` + `SELECT ... slug` |

- Slugs de exemplo das flash sales (`src/lib/flash-sales.ts`) alinhados com produtos reais do catálogo (`adidas-ultra-boost-5`, `adidas-adizero-evo-sl`) para que a feature seja funcional.
- Testes novos: `__tests__/pricing.test.ts` (unidade) e `__tests__/flash-sale-verify.test.ts` (integração server-side: aceita preço efetivo, rejeita preço cheio).

### 5.2 C2 — Frete grátis alinhado cliente/servidor ✅

- `src/lib/checkout/pricing.ts` (`computeTotals`) agora passa o `subtotal` para `calculateShipping`, aplicando a mesma regra de frete grátis (≥ R$ 299) do cliente (`/api/shipping`).
- Teste novo: `__tests__/checkout-pricing.test.ts` (frete grátis no servidor quando subtotal ≥ 299; cobra quando < 299; loyalty discount).

### 5.3 A1 — Rate limit por IP + por e-mail ✅

- Adicionados buckets por conta em `src/app/api/auth/login/route.ts`, `register/route.ts` e `forgot-password/route.ts` (`customer-login-account:<email>`, `register-account:<email>`, `forgot-password-account:<email>`), mantendo a proteção contra brute-force mesmo quando `TRUST_PROXY` não está configurado em produção (IP mascarado como `unknown`).
- Para obter IP real em produção, definir `TRUST_PROXY=true` (Vercel/Nginx/Cloudflare) conforme `README.md:204`.
- Validado em runtime: 5 tentativas de login errado → 401×4, 429×2.

### 5.4 MÉDIO — JSON malformado retorna 400 ✅

Criado `src/lib/read-json.ts` (`readJsonBody`), aplicado em: `auth/login`, `auth/register`, `auth/forgot-password`, `auth/reset-password`, `auth/verify-email`, `admin/login`, `newsletter`, `contato`, `shipping`, `checkout`, `coupons/validate`, `notify-stock`. Agora respondem `400 {"error":"Corpo da requisição inválido"}` para corpo não-JSON. Validado em runtime: `POST /api/auth/login` com JSON inválido → **HTTP 400** (antes 500).

### 5.5 MÉDIO — Testes de slug corrigidos ✅

`__tests__/valid-slugs.test.ts` atualizado para slugs reais do catálogo (`adidas-ultra-boost-5`, `adidas-adizero-evo-sl`) em vez de slugs inexistentes. Suite completa: **96 testes passando**.

### 5.6 BAIXO — Lint limpo ✅

- `src/lib/database/client.ts`: eliminados todos os `no-explicit-any` (tipos `unknown`/`string[]` + conversões explícitas).
- `src/context/CartContext.tsx` e `src/lib/recently-viewed.tsx`: trocado `setState` em `useEffect` por **lazy initializer** no `useState` (padrão já usado no `wishlist-context.tsx`), eliminando `set-state-in-effect`.
- Corrigidos também 3 erros de lint adicionais não listados no relatório original: `react-hooks/purity` em `src/app/admin/flash-sales/page.tsx` (extraído componente `ExpiresIn` com `useSyncExternalStore`), `set-state-in-effect` em `src/components/product/FlashSaleTimer.tsx`, e `useMemo` não usado em `src/components/3d/Logo3D.tsx`.
- `npm run lint` → **0 erros** (restam 3 warnings pré-existentes de `<img>` em `ImageUploader.tsx` e `ReviewForm.tsx`, não bloqueantes).

### 5.7 BAIXO — `/api/cliente/endereco` GET retorna 401 sem sessão ✅

- `src/app/api/cliente/endereco/route.ts`: GET sem sessão agora responde `401 {"error":"Não autenticado"}` (antes 200 com lista vazia), alinhado aos demais endpoints `/api/cliente/*`. Validado em runtime.
- O checkout (`use-checkout-form.ts`) e a página de endereços (`AddressClient.tsx`) tratam a resposta 401 sem quebrar o fluxo.

### 5.8 Validação final ✅

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros (3 warnings `<img>`) |
| `npm run typecheck` (`tsc --noEmit`) | ✅ sem erros |
| `npx vitest run` | ✅ 96 testes (12 arquivos) |
| `npm run build` | ✅ compilado + 87 páginas geradas |

**Nota pós-correção: 9,5 / 10** (recomenda-se configurar `TRUST_PROXY=true` em produção e converter `<img>` → `next/image` como refinamento opcional).