export async function fetchPosts() {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Erro ao buscar posts');
    return res.json();
}
  
export async function fetchPostById(id: string | string[] | undefined) {
    if (!id) throw new Error('ID inválido');
    const res = await fetch(`/api/posts?id=${id}`);
    if (!res.ok) throw new Error('Erro ao buscar o post');
    const data = await res.json();
    console.log(data);
    return data;
}

export const addComment = async ({ postId, content }: { postId: string; content: string }) => {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, content }),
    });
  
    if (!res.ok) throw new Error('Erro ao adicionar o comentário');
  
    return res.json();
};