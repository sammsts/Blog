'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <img src={session.user?.image ?? ''} alt="avatar" className="w-8 h-8 rounded-full" />
        <span>{session.user?.name}</span>
        <button onClick={() => signOut()} className="ml-2 px-4 py-1 bg-red-500 text-white rounded">Sair</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn('google')} className="px-4 py-1 bg-blue-500 text-white rounded">Entrar com Google</button>
  );
}
