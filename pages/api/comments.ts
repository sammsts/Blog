import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, postId } = req.body;
    
    try {
      // Criação do comentário no banco de dados
      const comment = await prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          //author: { connect: { email: session?.user?.email } },
        },
      });

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
