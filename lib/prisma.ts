// Certifique-se de que o PrismaClient use a mesma URL em runtime (override seguro)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    },
  },
});

export { prisma };