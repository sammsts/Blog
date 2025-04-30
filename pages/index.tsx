'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/utils/api';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import AuthButton from '../components/AuthButton';
import Loader from '../components/Loader';

export default function Home() {
  const { data: session, status } = useSession();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    enabled: status === 'authenticated', // só busca se autenticado
  });

  if (status === 'loading') return <Loader />;

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-12">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Por favor, faça login para acessar o blog
        </h1>
        <AuthButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
          <AuthButton />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
              <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/post/${post.id}`}>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">{post.content}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
