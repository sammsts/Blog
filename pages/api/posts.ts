import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  // Verifique o método da requisição
  if (req.method === 'GET') {
    const { id } = req.query;  // Obtém o ID da query string

    // Busca o post pelo ID
    try {
      if (typeof id !== 'string') {
        const posts = await prisma.post.findMany({
          include: {
            author: true,
            comments: true,
          },
        });
        return res.json(posts);
      }

      const post = await prisma.post.findUnique({
        where: {
          id: id,
        },
        include: {
          author: true,
          comments: true,
        },
      });

      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado' });
      }

      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar o post', error: error?.message });
    }
  }

  if (req.method === 'POST') {
    if (!session) return res.status(401).json({ message: 'Não autorizado' });

    const { title, content } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: session?.user?.email } },
      },
    });

    return res.status(201).json(post);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Método ${req.method} não permitido`);
}
