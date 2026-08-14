# Relatório de QA — Freitas Outlet

**Data do teste:** 14/08/2026
**Ambiente:** `localhost:3000` (Next.js 16.2.10, Turbopack, dev server) · SQLite (`better-sqlite3`) · Stripe teste · PIX
**Método:** Testes HTTP (Invoke-WebRequest/curl) + análise estática do código-fonte. UI visual, console do navegador e responsividade exigem validação manual em navegador.

---

## 1. Resumo Executivo

| Métrica | Valor |
|---|---|
| **Nota de estabilidade** | **3,5 / 10** |
| **Bugs críticos** | 2 |
| **Bugs de alta severidade** | 3 |
| **Bugs de média severidade** | 4 |
| **Bugs de baixa severidade** | 3 |
| **Total de achados** | 12 |

### Verdicto
O site **não está pronto para produção**. O bloqueio é causado por **2 bugs críticos de schema do banco SQLite** que derrubam completamente o cadastro, a recuperação de senha, a verificação de e-mail e o gerenciamento de cupons no admin — todos com HTTP 500. Além disso, o checkout **cria pedidos duplicados** em cliques rápidos (sem idempotência) e o admin de produtos está quebrado (500). O restante do site (loja, categorias, busca, institucionais, rastreio, login/logout, perfil, endereços, fidelidade) funciona corretamente.

---

## 2. Contagem por severidade

| Severidade | Quantidade |
|---|---|
| 🔴 Crítico | 2 |
| 🟠 Alto | 3 |
| 🟡 Médio | 4 |
| 🔵 Baixo | 3 |

---

## 3. Lista detalhada de bugs

### 🔴 CRÍTICO

---

#### BUG 1 — Cadastro e recuperação de senha quebrados (500): tabela `tokens` com schema incompatível

- **[SEVERIDADE]** CRÍTICO
- **[CATEGORIA]** Funcional / Backend (Auth)
- **[PÁGINA/ROTA]** `POST /api/auth/register`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/verify-email`
- **[DESCRIÇÃO]** Todas as rotas que geram ou consomem token de e-mail falham com **HTTP 500**. O erro real é `SqliteError: table tokens has no column named id`. O banco `data/freitasoutlet.db` foi criado com o schema antigo `tokens(token TEXT PRIMARY KEY, email, type, expires_at, created_at)`, mas o código atual (`lib/tokens.ts:5`) roda `CREATE TABLE IF NOT EXISTS tokens (id TEXT PRIMARY KEY, ...)` e depois `INSERT INTO tokens (id, email, ...)`. Como a tabela já existe, o `IF NOT EXISTS` **não migra o schema**, e o `INSERT`/`SELECT` referencia uma coluna `id` inexistente.
- **[PASSO A PASSO]**
  1. Acesse `/cadastro`, preencha nome/e-mail/senha válidos e envie.
  2. O site retorna erro 500 ("Erro ao criar conta") — e o log mostra `table tokens has no column named id`.
  3. Faça `POST /api/auth/forgot-password` com e-mail válido → 500 `{"error":"Erro interno"}`.
- **[COMPORTAMENTO ESPERADO]** O cadastro deve criar o usuário e disparar o e-mail de verificação (ou sucesso direto); o fluxo de "esqueci a senha" deve gerar um token e enviar o link.
- **[SUGESTÃO DE CORREÇÃO]**
  1. Criar uma **migração** (script `db-migrate` ou `ALTER TABLE`) que renomeie `token` para `id` na tabela `tokens` (ou recrie a tabela). Não confiar em `CREATE TABLE IF NOT EXISTS` para evoluir schema.
  2. Alinhar `lib/tokens.ts` e `lib/database.ts` ao schema real do banco.
  3. Opcional: adicionar verificação de schema no boot (`PRAGMA table_info`).

---

#### BUG 2 — Admin de cupons quebrado: tabela `coupons` sem coluna `id`

- **[SEVERIDADE]** CRÍTICO
- **[CATEGORIA]** Funcional / Backend (Admin)
- **[PÁGINA/ROTA]** `POST /api/admin/coupons`, `PUT /api/admin/coupons`, `DELETE /api/admin/coupons`, `GET /api/admin/coupons`
- **[DESCRIÇÃO]** A tabela `coupons` do banco tem `code TEXT PRIMARY KEY` (sem coluna `id`), mas o route (`app/api/admin/coupons/route.ts:45`) faz `INSERT INTO coupons (id, code, ...)`. O erro de `INSERT` é engolido pelo `catch` e retornado como **409 "Cupom já existe"** (mensagem enganosa — o cupom não existe). `PUT` e `DELETE` referenciam `WHERE id = $1` (falham silenciosamente/upsert). O `GET` mapeia `id: r.id` → `undefined` para todos os cupons.
- **[PASSO A PASSO]**
  1. Logar em `/admin/login` (admin).
  2. Ir em `/admin/cupons` → "Novo cupom" → criar `TESTE10` com 10%.
  3. Retorna "Cupom já existe" (409) mesmo sem o cupom existir.
  4. A listagem (GET) traz `coupons: []` ou objetos sem `id` útil.
- **[COMPORTAMENTO ESPERADO]** Criar cupom com sucesso (201), editar e excluir por id/código.
- **[SUGESTÃO DE CORREÇÃO]** Migrar a tabela `coupons` para incluir `id TEXT PRIMARY KEY` (ou usar `code` como identificador em todo o código). Tratar o erro real de `INSERT` (não mascarar com 409).

---

### 🟠 ALTO

---

#### BUG 3 — Checkout PIX cria pedidos duplicados em cliques rápidos (sem idempotência)

- **[SEVERIDADE]** ALTO
- **[CATEGORIA]** Funcional / Financeiro
- **[PÁGINA/ROTA]** `POST /api/checkout` (fluxo PIX em `/checkout`)
- **[DESCRIÇÃO]** Não há proteção de idempotência no servidor. Enviar 3 requisições simultâneas do mesmo carrinho criou **3 pedidos distintos** (`FO-MSSUDS2A-9E24`, `FO-MSSUDS48-A60C`, `FO-MSSUDSBP-9624`). O botão PIX tem `disabled={processing}` no React, mas cliques duplos rápidos podem disparar mais de uma requisição antes do re-render, e o servidor não valida duplicidade (mesmo payload/carrinho).
- **[PASSO A PASSO]**
  1. Adicionar item ao carrinho, ir ao checkout, escolher PIX.
  2. Clicar rapidamente 2–3x em "Gerar PIX" (ou disparar 3 POSTs concorrentes no mesmo body).
  3. Observar criação de N pedidos com o mesmo carrinho.
- **[COMPORTAMENTO ESPERADO]** Apenas **1 pedido** deve ser criado por tentativa de pagamento.
- **[SUGESTÃO DE CORREÇÃO]**
  1. Gerar um `idempotencyKey` no cliente e rejeitar requisições repetidas com a mesma chave (ex.: usar `slug`/hash do carrinho + sessão).
  2. Ou bloquear no servidor: dentro da transação, verificar se já existe pedido `pending` com aquele `cartHash`/produto para o mesmo e-mail antes de inserir.

---

#### BUG 4 — Rate limit contornável via header `x-forwarded-for`

- **[SEVERIDADE]** ALTO
- **[CATEGORIA]** Segurança
- **[PÁGINA/ROTA]** `POST /api/auth/login`, `POST /api/contato`, `POST /api/shipping`, `POST /api/webhook` (qualquer rota que use `lib/rate-limit.ts`)
- **[DESCRIÇÃO]** O rate limit usa `request.headers.get('x-forwarded-for') || 'anonymous'`. Esse header é controlado pelo cliente; um atacante pode **trocar o IP a cada requisição** e nunca ser bloqueado. Confirmado: após ser bloqueado (429) por IP, o teste continuou funcionando usando outro valor no header.
- **[PASSO A PASSO]**
  1. Faça 6 tentativas erradas de login → recebe 429.
  2. Repita o teste trocando o valor de `x-forwarded-for` → volta a funcionar.
- **[COMPORTAMENTO ESPERADO]** O limite deve ser aplicado ao IP real do cliente (tratado como confiável apenas em proxy de borda).
- **[SUGESTÃO DE CORREÇÃO]** Usar o IP do `request.ip`/`remoteAddress` do runtime (e confiar em `x-forwarded-for` **somente** quando atrás de proxy confiável com valor devidamente sanitizado), ou extrair o primeiro IP confiável. Em dev, pode-se manter o header, mas nunca em produção sem `trust proxy`.

---

#### BUG 5 — Admin de produtos retorna 500: dados inconsistentes de `brand`/`category` no banco

- **[SEVERIDADE]** ALTO
- **[CATEGORIA]** Funcional / Backend (Admin) + Integridade de dados
- **[PÁGINA/ROTA]** `GET /api/admin/produtos` (e qualquer operação que liste produtos no admin)
- **[DESCRIÇÃO]** A tabela `products` tem **dados heterogêneos**: alguns registros guardam `brand`/`category` como JSON (`{"id":"nike","name":"Nike",...}`) e outros como **texto puro** (`"Nike"`, `"sneakers-hype-m"`). `rowToStoredProduct` (`lib/admin-products.ts:135`) executa `JSON.parse(row.brand)` → `SyntaxError: Unexpected token 'N', "Nike" is not valid JSON` → **HTTP 500** ao listar produtos no admin.
- **[PASSO A PASSO]**
  1. Logar no `/admin`.
  2. Acessar `/admin/produtos`.
  3. A lista não carrega; a API retorna 500 (log: `SyntaxError ... "Nike" is not valid JSON`).
- **[COMPORTAMENTO ESPERADO]** A lista de produtos deve carregar independentemente de como os dados foram gravados.
- **[SUGESTÃO DE CORREÇÃO]**
  1. Normalizar os dados no banco (migrar as linhas legadas para JSON válido).
  2. Ou tornar a leitura tolerante: `try { JSON.parse(...) } catch { valor puro }`.
  3. Padronizar a escrita (já usa `JSON.stringify` no `upsert`).

---

### 🟡 MÉDIO

---

#### BUG 6 — Páginas de produto/blog/modelo inexistentes retornam HTTP 200 (soft-404)

- **[SEVERIDADE]** MÉDIO
- **[CATEGORIA]** SEO / Funcional
- **[PÁGINA/ROTA]** `/produtos/<slug-inexistente>`, `/blog/<slug-inexistente>`, `/modelos/<slug-inexistente>`
- **[DESCRIÇÃO]** Slugs que não existem renderizam a página de "404" mas com **status HTTP 200** (comportamento do Next.js em streaming). Isso confunde crawlers e prejudica SEO — o conteúdo de 404 é indexado como se fosse uma página válida.
- **[PASSO A PASSO]**
  1. Acesse `/produtos/produto-que-nao-existe`.
  2. A página mostra "Página não encontrada" mas a resposta HTTP é 200.
- **[COMPORTAMENTO ESPERADO]** Resposta **404** para conteúdo inexistente.
- **[SUGESTÃO DE CORREÇÃO]** Verificar se o runtime/versão do Next.js suporta enviar status real de `notFound()` com streaming (usar `notFound()` garantindo `dynamic = 'force-dynamic'`, ou em versões que ainda não suportam, adicionar um retorno explícito de 404 no route handler). Também considerar adicionar `<meta name="robots" content="noindex">` nas páginas not-found (já há `noindex` no HTML).

---

#### BUG 7 — Página "Esqueci a senha" inexistente e sem link no login

- **[SEVERIDADE]** MÉDIO
- **[CATEGORIA]** UX / Funcional
- **[PÁGINA/ROTA]** `/login` → `/esqueci-senha` (404)
- **[DESCRIÇÃO]** A página de login **não tem link "Esqueci minha senha"** e a rota `/esqueci-senha` não existe (retorna 404). A única rota de recuperação real é `/reset-password` (que precisa de token) e a API `/api/auth/forgot-password` (que está quebrada pelo BUG 1). O usuário que esqueceu a senha **não consegue iniciar a recuperação pela interface**.
- **[PASSO A PASSO]**
  1. Acessar `/login`.
  2. Não há nenhum link para recuperação de senha.
  3. Tentar `/esqueci-senha` → 404.
- **[COMPORTAMENTO ESPERADO]** Link "Esqueci minha senha" que leva a um formulário de e-mail → dispara e-mail com link de reset.
- **[SUGESTÃO DE CORREÇÃO]** Criar página `/esqueci-senha` com form que chama `/api/auth/forgot-password` (após corrigir o BUG 1) e adicionar o link na página de login.

---

#### BUG 8 — Imagem quebrada do produto "Chuteira Lotto Air 400"

- **[SEVERIDADE]** MÉDIO
- **[CATEGORIA]** Conteúdo / UI
- **[PÁGINA/ROTA]** `/produtos/...` (produto com imagem `/images/products/catalogo/chuteiras/lotto/air-400/branco-colorido.jpg`)
- **[DESCRIÇÃO]** O produto de exemplo da Lotto referencia a imagem `branco-colorido.jpg`, mas o diretório `public/images/products/catalogo/chuteiras/lotto/air-400/` contém apenas `nikephantom.jpg`. Resultado: quebra de imagem na listagem/detalhe do produto.
- **[PASSO A PASSO]**
  1. Acessar a listagem de chuteiras/futebol.
  2. Observar o card da Lotto Air 400 com imagem ausente (quebrada).
- **[COMPORTAMENTO ESPERADO]** Todas as imagens de produto devem existir e carregar.
- **[SUGESTÃO DE CORREÇÃO]** Adicionar o arquivo `branco-colorido.jpg` (ou apontar a referência em `data/products.ts` para um arquivo existente).

---

#### BUG 9 — Mapeamento de campos inconsistente na API de cupons (camelCase vs snake_case) + mensagem de erro enganosa

- **[SEVERIDADE]** MÉDIO
- **[CATEGORIA]** Usabilidade / API
- **[PÁGINA/ROTA]** `POST /api/admin/coupons`
- **[DESCRIÇÃO]** A API espera `discountValue` (camelCase), mas a UI/consumidores que enviarem `discount_value` recebem 400 "Código e valor são obrigatórios" mesmo com código e valor preenchidos. Além disso, o erro de `INSERT` (BUG 2) é mascarado como 409 "Cupom já existe".
- **[PASSO A PASSO]**
  1. Enviar `{"code":"TESTE10","discount_value":10}` → 400 "Código e valor são obrigatórios".
  2. Enviar `{"code":"TESTE10","discountValue":10}` → 409 "Cupom já existe" (erro real: schema).
- **[COMPORTAMENTO ESPERADO]** Aceitar os dois formatos (ou documentar/validar no front) e retornar mensagens condizentes com o erro real.
- **[SUGESTÃO DE CORREÇÃO]** Unificar contrato (usar zod para validar e normalizar), corrigir o schema (BUG 2) e propagar a mensagem real de erro.

---

### 🔵 BAIXO

---

#### BUG 10 — Webhook Stripe aceita payloads sem assinatura em ambiente de desenvolvimento

- **[SEVERIDADE]** BAIXO
- **[CATEGORIA]** Segurança
- **[PÁGINA/ROTA]** `POST /api/webhook`
- **[DESCRIÇÃO]** Quando `STRIPE_WEBHOOK_SECRET` não está configurado e `NODE_ENV !== 'production'`, o webhook faz `event = JSON.parse(rawBody)` **sem validar assinatura**. Isso permite que qualquer um, em dev, envie eventos falsos (`payment_intent.succeeded` etc.) e altere status de pedidos. Em produção o código bloqueia (500) quando o secret falta — correto, mas o comportamento de dev é frágil.
- **[PASSO A PASSO]**
  1. Em ambiente dev sem secret, `POST /api/webhook` com body `{"type":"payment_intent.succeeded",...}`.
  2. O handler processa sem verificar assinatura.
- **[COMPORTAMENTO ESPERADO]** Exigir `stripe-signature` válida sempre, ou rejeitar em dev com aviso explícito.
- **[SUGESTÃO DE CORREÇÃO]** Sempre exigir o header `stripe-signature` (mesmo em dev, usando o secret de teste), e nunca cair em "parse sem verificação" a menos que explicitamente habilitado por env flag.

---

#### BUG 11 — Requests sem header `Origin` não passam pela checagem de CSRF/Origem

- **[SEVERIDADE]** BAIXO
- **[CATEGORIA]** Segurança
- **[PÁGINA/ROTA]** Todas as rotas protegidas por origem (`proxy.ts:27-41`)
- **[DESCRIÇÃO]** O middleware só bloqueia quando o header `Origin` está presente e é não-autorizado. Requisições **sem** `Origin` (ex.: scripts, `curl`, apps nativos) passam direto. Navegadores sempre enviam `Origin` em POST cross-origin, então o risco real para browsers é baixo, mas o controle é incompleto.
- **[PASSO A PASSO]**
  1. `POST /api/checkout` com `Origin: http://evil.com` → 403 (funciona).
  2. `POST /api/checkout` **sem** `Origin` → 400/processa (não bloqueado por origem).
- **[COMPORTAMENTO ESPERADO]** Política de origem consistente para todas as requisições mutáveis.
- **[SUGESTÃO DE CORREÇÃO]** Decidir explicitamente: para métodos não-idempotentes sem `Origin`, negar (ou permitir apenas se houver session/token CSRF válido). Nunca depender apenas do header `Origin`.

---

#### BUG 12 — `GET /api/shipping` retorna 405 e `GET /api/cep` não existe (rotas com métodos/endpoints divergentes)

- **[SEVERIDADE]** BAIXO
- **[CATEGORIA]** Documentação / API
- **[PÁGINA/ROTA]** `GET /api/shipping` (405), `GET /api/cep` (404), `POST /api/shipping` (funciona)
- **[DESCRIÇÃO]** O front usa `POST /api/shipping` (com `{state, items, subtotal}`) — correto. Porém `GET /api/shipping` retorna 405 e não há rota `/api/cep` (embora o CSP `connect-src` libere `https://viacep.com.br`, sugerindo intenção de uso). Não é bug funcional, mas endpoints "fantasma" confundem integração.
- **[PASSO A PASSO]**
  1. `GET /api/shipping` → 405 Method Not Allowed.
  2. `GET /api/cep?cep=01310100` → 404.
- **[COMPORTAMENTO ESPERADO]** Ou remover referências, ou implementar `GET /api/cep`/validar método no shipping.
- **[SUGESTÃO DE CORREÇÃO]** Implementar `GET /api/cep` (consultar ViaCEP e devolver endereço) se desejado, ou remover do CSP; documentar que shipping usa POST.

---

## 4. Checklist por seção

| Seção | Status | Observações |
|---|---|---|
| Homepage & rotas públicas | ✅ OK | Todas 200; `/categorias` e `/marcas` base 404 (esperado, sem links) |
| Autenticação | ❌ Quebrada | Register/forgot/reset/verify → 500 (BUG 1). Login/me/logout OK |
| Produtos/Catálogo | ⚠️ Parcial | Soft-404 (BUG 6), imagem quebrada (BUG 8); busca sem XSS |
| Blog | ✅ OK | Encoding UTF-8 correto (falso positivo inicial); soft-404 (BUG 6) |
| Carrinho/Favoritos/Comparar | ✅ OK | Páginas 200 |
| Checkout | ⚠️ Risco | PIX OK, validação zod OK, **duplo clique → duplicatas (BUG 3)** |
| Minha Conta/Fidelidade/Pedidos | ✅ OK | Proteção 401/403 correta; endereços, perfil, cancelar/troca funcionam |
| Institucionais | ✅ OK | Todas 200; contato sanitiza XSS |
| Admin | ❌ Quebrado | Login OK; produtos 500 (BUG 5); cupons quebrados (BUG 2); páginas protegidas 307 |
| Segurança | ⚠️ Risco | Rate-limit bypassável (BUG 4); webhook sem assinatura em dev (BUG 10); Origin check incompleto (BUG 11); sem SQL injection; `.env.local` gitignored |

---

## 5. Itens verificados e OK (sem bug)

- **Login/logout:** credenciais corretas → 200 + cookie de sessão; logout 200 (com JSON) + redirect `/`; logout sem Content-Type JSON → 400.
- **`/api/auth/me`:** 200 `{"customer": null}` anônimo; 200 com dados autenticado.
- **Proteção de rotas do cliente:** `/api/cliente/pedidos` 401 anônimo / 200 autenticado; cancelar-pedido e solicitar-troca retornam **403** para pedido de outro e-mail e 400/404 para payload inválido — controle de acesso correto.
- **Endereços:** criar (201), listar, atualizar default — OK.
- **Perfil (PUT `/api/cliente/perfil`):** 200 atualizando nome/telefone.
- **Rastreio de pedido:** 200 e-mail correto, 403 e-mail errado, 404 pedido inexistente.
- **Shipping:** POST com `state` válido → opções de frete (frete grátis > R$299, SEDEX); `state` inválido cai em fallback genérico (29,90) — comportamento de produto, não bug.
- **Validação checkout (zod):** CPF inválido / `lgpdConsent` ausente → 400.
- **Contato:** nome/e-mail/mensagem obrigatórios (400), e-mail inválido (400), XSS sanitizado via `sanitize()`.
- **Newsletter:** e-mail inválido 400, válido 200.
- **Headers de segurança:** CSP, `nosniff`, `X-Frame-Options: SAMEORIGIN`, HSTS, `Referrer-Policy`, `Permissions-Policy` presentes.
- **Busca:** payload com `<script>` **não é refletido** (valor aparece apenas no query-string do estado React Router — sem XSS refletido).
- **SQL injection:** todas as queries usam prepared statements (`db.prepare(...)` + params) — sem vetor encontrado.
- **`robots.txt`:** descreve `/admin/`, `/api/`, `/checkout/`, `/minha-conta/` como `Disallow` — correto.
- **`.env.local`:** ignorado pelo git — sem segredo commitado.
- **Admin login:** senha errada 401, correta 200 + cookie `fo_admin_session`; página `/admin` sem cookie → **307** para `/admin/login`.
- **Encoding:** páginas e blog em UTF-8 válido (o "mojibake" era exibição do console Windows, não do site).

---

## 6. Prioridade de correção sugerida

1. **Imediata (bloqueante):** BUG 1 (schema tokens) e BUG 2 (schema coupons) — sem isso, cadastro e cupons estão mortos.
2. **Alta:** BUG 5 (admin produtos), BUG 3 (duplicidade de pedidos).
3. **Média:** BUG 6 (soft-404), BUG 7 (link esqueci a senha), BUG 8 (imagem), BUG 9 (contrato de cupons).
4. **Baixa:** BUG 10, BUG 11, BUG 12.
5. **Pós-deploy:** BUG 4 (rate-limit com IP confiável).

---

## 7. Limitações do teste

- **Sem navegador headless:** console/network reais, responsividade (375/768/1280/1920), animações, toasts, modais e acessibilidade visual **não foram automatizados** — recomenda-se revisão manual.
- **Dados de teste criados:** usuário `qa.8501@teste.com`, endereço "Av Paulista 1000", pedidos PIX `FO-MSSUCLXI-F548`, `FO-MSSUDS2A-9E24`, `FO-MSSUDS48-A60C`, `FO-MSSUDSBP-9624` — podem ser limpos no banco após os testes.
- Testes de checkout usaram o modo PIX (sem pagamento real via Stripe).
