<div align="center">

# 🛍️ Freitas Outlet

**O luxo mais acessível, em um só lugar.**

Plataforma completa de e-commerce multimarcas premium: Nike, Adidas, Gucci, Alexander McQueen, Hugo Boss e muito mais — com catálogo 3D, checkout com cartão e Pix, clube de fidelidade, painel administrativo e otimização para SEO/PWA.

![Versão](https://img.shields.io/badge/versão-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.10-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Licença](https://img.shields.io/badge/licença-PRIVATE-red)

[▶️ Ver demonstração ao vivo](https://freitasoutlet.com.br)

</div>

---

## 📋 Índice

- [Visão Geral & Recursos](#-visão-geral--recursos)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Instalação e Execução Local](#-instalação-e-execução-local)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Instruções de Deploy](#-instruções-de-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 👀 Visão Geral & Recursos

### O problema que resolve

Vender moda e calçados premium online exige muito mais que um catálogo: é preciso **visualização rica dos produtos, checkout confiável com múltiplos meios de pagamento, controle de estoque em tempo real, pós-venda com rastreio e trocas, e uma gestão administrativa completa**. O Freitas Outlet entrega tudo isso em uma única aplicação, com foco em performance, segurança e experiência de compra.

### Funcionalidades principais

#### 👤 Cliente
- **Catálogo multimarcas** com filtros por categoria, marca, tamanho e preço, ordenação e paginação
- **Busca** com sugestões em tempo real (`useDebounce`)
- **Páginas de produto** com galeria, variações de cor/tamanho, estoque por grade e visualização **3D** do produto (three.js)
- **Favoritos** (wishlist) e **produtos visualizados recentemente**, persistidos no navegador
- **Comparador de produtos**
- **Quiz de recomendação** para ajudar na escolha do modelo ideal
- **Avaliações e comentários** de clientes
- **Aviso de disponibilidade** ("avise-me quando chegar")
- **Blog** com guias, cuidados com tênis e conteúdo streetwear
- **Guia de medidas**, FAQ, política de trocas e páginas institucionais
- **Clube de fidelidade** com pontos e recompensas
- **Minha conta**: perfil, endereços, histórico de pedidos, rastreio, cancelamento e solicitação de troca

#### 💳 Checkout & Pagamento
- **Cartão de crédito** via Stripe (Payment Intent) com validação de antifraude
- **Pix** com geração de QR Code e status de confirmação
- **Cupons de desconto** com regras de validade e uso
- **Cálculo de frete por CEP**
- **Idempotência** e proteção contra duplicidade de pedidos
- **Webhook do Stripe** (payment_intent.succeeded e charge.refunded) com atualização automática de estoque, pontos e e-mails

#### 🛠️ Painel Administrativo (`/admin`)
- Dashboard com **estatísticas** de vendas, receita e ticket médio
- Gestão de **produtos** (criação, edição, imagens com upload, estoque) e **marcas**
- Gestão de **cupons** e **ofertas/flash sales**
- Gestão de **pedidos** (visualização e atualização de status), **clientes** e **devoluções/trocas**
- Editor de **posts do blog**
- Login administrativo protegido por senha

#### ⚙️ Técnico & Qualidade
- **PWA**: service worker com suporte offline, manifest e ícones
- **SEO**: sitemap, robots.txt, Open Graph, Twitter Cards e URLs canônicas
- **Segurança**: CSP, headers de segurança, rate limiting por IP, validação com zod e controle de sessão
- **Monitoramento** com Sentry (erros em tempo real)
- **Dupla camada de banco**: SQLite local (dev) e Neon PostgreSQL (produção)
- **Testes automatizados** (Vitest) e verificação completa com um único comando

---

## 🧰 Tecnologias Utilizadas

| Categoria | Tecnologias |
|---|---|
| **Frontend** | [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript 5 · three.js + @react-three/fiber/drei (3D) · Framer Motion |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com) · PostCSS |
| **Backend & API** | Next.js Route Handlers (App Router) · Server Actions internas · Zod (validação) |
| **Banco de Dados** | better-sqlite3 (local/dev) · Neon PostgreSQL via `@neondatabase/serverless` (produção) |
| **Pagamentos** | Stripe (cartão + webhooks) · Geração de Pix com QR Code |
| **Autenticação** | Sessões via cookie (bcryptjs) · JWT (opcional) · senha admin |
| **Email** | Nodemailer (SMTP) |
| **Monitoramento** | Sentry (`@sentry/nextjs`) |
| **Hospedagem/Infra** | Vercel (deploy principal) · Docker + Docker Compose · Node.js 20 |

---

## 📁 Estrutura de Pastas

```
freitasoutlet/
├── src/
│   ├── app/                  # Rotas e páginas (App Router) + API routes
│   │   ├── api/              #   Endpoints REST (webhook, admin, auth, checkout...)
│   │   ├── admin/            #   Painel administrativo
│   │   ├── produtos/         #   Páginas de listagem e detalhe do produto
│   │   ├── checkout/         #   Fluxo de checkout
│   │   └── ...               #   Demais páginas (login, carrinho, minha-conta, blog...)
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── ui/               #   Design system (botões, inputs, modais)
│   │   ├── admin/            #   Componentes do painel admin
│   │   ├── product/          #   Cards, galeria, timer de ofertas
│   │   ├── checkout/         #   Componentes de pagamento/frete
│   │   └── 3d/               #   Visualizador 3D de produtos
│   ├── context/              # Contextos globais (carrinho, comparador, fidelidade)
│   ├── hooks/                # Hooks customizados (useDebounce)
│   ├── lib/                  # Lógica de negócio: db, stripe, pix, auth, estoque,
│   │                         #   frete, cupons, fidelidade, rate-limit, validações...
│   ├── data/                 # Dados estáticos (produtos, marcas, categorias, blog)
│   └── types/                # Tipos TypeScript compartilhados
├── public/                   # Arquivos estáticos (imagens, fonts, manifest.json, sw.js)
├── scripts/                  # Scripts de banco (init-db, migrate-to-sqlite)
├── __tests__/                # Testes com Vitest
├── docs/                     # Documentação complementar
├── .env.example              # Modelo de variáveis de ambiente
├── next.config.ts            # Configuração do Next.js + headers + Sentry
├── sentry.client.config.ts   # Configuração do Sentry (client)
├── sentry.server.config.ts   # Configuração do Sentry (server)
├── vercel.json               # Configuração de deploy na Vercel
├── Dockerfile                # Build standalone para produção
├── docker-compose.yml        # Orquestração local com Docker
├── vitest.config.ts          # Configuração dos testes
└── tsconfig.json             # Configuração do TypeScript
```

> **Legenda:** `src/app/api/**/route.ts` são as rotas de API (handlers HTTP); `src/lib/` concentra toda a lógica de negócio reutilizável entre páginas e APIs.

---

## 🚀 Instalação e Execução Local

### Pré-requisitos

| Software | Versão mínima |
|---|---|
| [Node.js](https://nodejs.org) | **20.9+** (Node 22 LTS recomendado) |
| [npm](https://www.npmjs.com) | 10+ (incluído com o Node.js) |
| Git | 2.x |
| Docker (opcional) | 24+ — apenas para rodar via containers |

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Artfel0216/freitasoutlet.git
cd freitasoutlet

# 2. Instale as dependências
npm ci

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# → Edite o .env.local e preencha ao menos as variáveis obrigatórias

# 4. Inicialize o banco de dados (SQLite local com dados de exemplo)
npm run init-db

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. As alterações nos arquivos são refletidas automaticamente (hot reload).

> 💡 **Modo Docker:** alternativamente, rode `docker compose up -d --build` para subir a aplicação em um container. O banco SQLite é persistido em um volume (`/app/data`).

---

## 🔐 Variáveis de Ambiente

Copie o `.env.example` para `.env.local` e preencha os valores. Tabela completa:

| Variável | Descrição | Obrigatória |
|---|---|---|
| `NODE_ENV` | Ambiente da aplicação (`development`, `production`, `test`) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site, sem barra no final | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública do Stripe | ✅ |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Segredo do webhook do Stripe | ✅ |
| `DATABASE_URL` | DSN do Neon PostgreSQL (produção). Vazio = SQLite local | 🔶 (produção) |
| `STORE_PIX_KEY` | CPF/CNPJ do recebedor Pix (somente números) | 🔶 |
| `STORE_NAME` | Nome do recebedor do Pix | 🔶 |
| `SMTP_HOST` | Servidor SMTP para envio de e-mails | 🔶 |
| `SMTP_PORT` | Porta do SMTP (padrão `587`) | 🔶 |
| `SMTP_USER` | Usuário do SMTP | 🔶 |
| `SMTP_PASS` | Senha do SMTP | 🔶 |
| `EMAIL_FROM` | Remetente dos e-mails (padrão `noreply@freitasoutlet.com.br`) | ❌ |
| `CONTACT_EMAIL` | E-mail de contato/recebimento | ❌ |
| `SESSION_SECRET` | Chave secreta da sessão (`openssl rand -hex 32`) | ✅ |
| `SESSION_DURATION_HOURS` | Duração da sessão do cliente em horas (padrão `24`) | ❌ |
| `ADMIN_PASSWORD` | Senha de acesso ao painel `/admin` | ✅ |
| `JWT_SECRET` | Chave secreta JWT opcional | ❌ |
| `TRUST_PROXY` | `true` apenas se atrás de proxy confiável (Vercel, Nginx, Cloudflare) | ❌ |
| `SENTRY_DSN` | DSN do Sentry para monitoramento de erros | ❌ |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Integração de build do Sentry (sourcemaps desabilitados) | ❌ |
| `NEXT_PUBLIC_GA_ID` | Measurement ID do Google Analytics | ❌ |
| `LOG_LEVEL` | Nível de log: `debug` \| `info` \| `warn` \| `error` | ❌ |

> **✅ = obrigatória** para o funcionamento completo · **🔶 = necessária** para o recurso correspondente (pagamento, e-mail, banco em produção) · **❌ = opcional**

⚠️ **Nunca** versione arquivos `.env.*` reais. Variáveis `NEXT_PUBLIC_*` são expostas ao navegador.

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (hot reload) |
| `npm run build` | Gera o build otimizado de produção |
| `npm run start` | Executa o build de produção (após `npm run build`) |
| `npm run lint` | Executa o ESLint em todo o código |
| `npm run typecheck` | Valida os tipos TypeScript (`tsc --noEmit`) |
| `npm test` | Executa os testes com Vitest (modo watch) |
| `npm run verify` | Validação completa: lint → typecheck → test → build |
| `npm run init-db` | Inicializa o banco SQLite com schema e dados de exemplo |
| `npm run migrate` | Migra dados para o SQLite |
| `npm run docker:build` | Constrói a imagem Docker |
| `npm run docker:up` | Sobe a aplicação via Docker Compose |

---

## ☁️ Instruções de Deploy

### Opção A — Vercel (recomendada)

O projeto está 100% preparado para a Vercel (arquivo `vercel.json`, build estático + headers de cache).

```bash
# 1. Instale a CLI e faça login
npm i -g vercel
vercel login

# 2. Faça o preview
vercel

# 3. Deploy em produção
vercel --prod
```

Ou, pelo painel: **vercel.com/new** → importar o repositório → a Vercel detecta Next.js automaticamente → configurar as variáveis de ambiente → **Deploy**.

Após o deploy:
1. Configure o **webhook do Stripe** para `https://SEU-DOMINIO/api/webhook` (eventos: `payment_intent.succeeded` e `charge.refunded`)
2. Defina `DATABASE_URL` (Neon PostgreSQL) e `TRUST_PROXY=true`
3. Aponte o domínio em **Settings → Domains**

### Opção B — Docker

```bash
# Build e execução
docker compose up -d --build

# Ou manualmente
docker build -t freitasoutlet .
docker run -p 3000:3000 --env-file .env.local freitasoutlet
```

A imagem usa o **output standalone** do Next.js com usuário não-`root` e volume para persistência do SQLite em `/app/data`.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto e crie uma branch: `git checkout -b feature/minha-feature`
2. Faça suas alterações seguindo o padrão do código (TypeScript estrito, componentes em `src/components`, lógica em `src/lib`)
3. Rode as verificações antes de enviar: `npm run verify`
4. Abra um **Pull Request** descrevendo o que foi alterado e o motivo

> Siga os guias de boas práticas de Next.js e mantenha a cobertura de testes ao adicionar novas funcionalidades.

---

## 📄 Licença

Projeto **privado** — todos os direitos reservados. Não está licenciado para uso ou distribuição pública sem autorização prévia.

Para abrir o código, adicione um arquivo `LICENSE` (ex.: MIT) na raiz do repositório e atualize esta seção.

---

<div align="center">

**Freitas Outlet** — O luxo mais acessível, em um só lugar. 🛍️

</div>
