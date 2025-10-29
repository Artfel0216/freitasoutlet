import { PrismaClient } from "@prisma/client";

declare global {
  
  interface GlobalPrisma {
    __prisma?: PrismaClient;
  }
 
  var __prisma: GlobalPrisma["__prisma"];
}

export const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

