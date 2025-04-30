import { PrismaClient } from '@prisma/client';

// Atribuindo a variável prisma, verificando se já existe no global
const prisma = globalThis.prisma || new PrismaClient();

// Atribuindo ao global apenas em ambientes de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
