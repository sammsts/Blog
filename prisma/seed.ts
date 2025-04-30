import { prisma } from '../src/lib/prisma';

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'Bem-vindo ao Blog!',
        content: 'Este é o primeiro post do blog. Aproveite o conteúdo!',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Dicas de desenvolvimento web',
        content: 'Neste post falaremos sobre boas práticas de desenvolvimento...',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Entendendo React e seus hooks',
        content: 'React é uma biblioteca poderosa para construção de interfaces. Vamos explorar os hooks mais utilizados.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Melhores editores de código para devs',
        content: 'VSCode, Sublime, e WebStorm são alguns dos favoritos. Saiba por quê!',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Trabalhando com APIs REST',
        content: 'REST é um padrão muito comum na web. Aprenda como integrar sua aplicação com uma API RESTful.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Introdução ao TypeScript',
        content: 'TypeScript adiciona tipagem ao JavaScript. Descubra os benefícios e como começar.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Organizando seu projeto com Git',
        content: 'Versionamento é essencial. Veja como estruturar seu fluxo com Git e GitHub.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Deploy com Vercel e Netlify',
        content: 'Descubra como hospedar facilmente seus projetos front-end com essas plataformas.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
      {
        title: 'Construindo um blog com Next.js',
        content: 'Veja como criar um blog completo com Next.js, desde rotas até integração com banco de dados.',
        authorId: 'cma4ido370000i9q8w6d6trq7',
      },
    ]    
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
