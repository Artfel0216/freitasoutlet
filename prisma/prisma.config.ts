// Carrega .env e exporta configuração simples para o Prisma CLI.
// Ajuste se seu prisma.config.ts já existir — apenas garanta que a URL seja definida aqui.
import dotenv from "dotenv";
dotenv.config();

export default {
  datasource: {
    db: {
      provider: "sqlite",
      // use DATABASE_URL no .env (ex: DATABASE_URL="file:./dev.db")
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    },
  },
};