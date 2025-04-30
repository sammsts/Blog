import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const { content, postId } = req.body;
    
    try {
      const comment = await prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { email: session?.user?.email } },
        },
      });

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao adicionar comentário', error: (error as Error).message });
    }
  } else if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, authOptions);

    const { id } = req.query;

    if (!session) return res.status(401).json({ message: 'Não autorizado' });
    if (typeof id !== 'string') return res.status(400).json({ message: 'ID inválido' });

    try {
      const comment = await prisma.comment.findUnique({
        where: { id: parseInt(id) },
        include: { author: true }
      });

      if (!comment) return res.status(404).json({ message: 'Comentário não encontrado' });

      // Garante que o usuário só pode deletar o próprio comentário
      if (comment.author.email !== session.user?.email) {
        return res.status(403).json({ message: 'Você não tem permissão para deletar este comentário' });
      }

      await prisma.comment.delete({ where: { id: comment.id } });

      return res.status(200).json({ message: 'Comentário deletado com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar comentário', error: (error as Error).message });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
