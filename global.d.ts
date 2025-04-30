import { PrismaClient } from '@prisma/client';

// Declaração global para o prisma
declare global {
  var prisma: PrismaClient | undefined;
}

export {}; // Isso impede a criação de escopo global acidentalmente
