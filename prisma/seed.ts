const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'Bem-vindo ao Blog!',
        content: 'Este é o primeiro post do blog. Aproveite o conteúdo!',
        authorId: 'cma39mse10000i9y47gcofz3q', // substitua pelo ID de um usuário válido
      },
      {
        title: 'Dicas de desenvolvimento web',
        content: 'Neste post falaremos sobre boas práticas de desenvolvimento...',
        authorId: 'cma39mse10000i9y47gcofz3q',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
