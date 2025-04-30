import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPostById, addComment } from '../../src/utils/api';
import Loader from '../../components/Loader';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { id } = router.query;

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  });

  // Mutação para adicionar um comentário
  const mutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ postId, content }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Erro ao enviar comentário');
  
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] }); // Atualiza os comentários do post
    },
  });
  

  // Estado para o conteúdo do comentário
  const [comment, setComment] = useState('');

  if (isLoading) return <Loader />;
  if (!post) return <p className="text-center text-lg text-red-600">Post não encontrado.</p>;

  // Função para lidar com o envio do comentário
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id === 'string' && comment.trim()) {
      mutation.mutate({ postId: id, content: comment });
      setComment('');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (confirm('Tem certeza que deseja deletar este comentário?')) {
      try {
        await fetch(`/api/comments?id=${commentId}`, {
          method: 'DELETE',
        });
  
        queryClient.invalidateQueries({ queryKey: ['post', id] });
      } catch (error) {
        alert('Erro ao deletar comentário');
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-6">{post.content}</p>
        </div>

        <div className="border-t pt-6 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comentários</h2>
          {post.comments.length > 0 ? (
            post.comments.map((comment: any) => (
              <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-gray-800 mb-2">{comment.content}</p>
                <small className="text-gray-600">Por: {comment?.author?.name}</small>
                {session?.user?.email === comment.author?.email && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Deletar
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">Não há comentários para este post.</p>
          )}

          {/* Formulário de comentário */}
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <textarea
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deixe seu comentário..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Comentar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}