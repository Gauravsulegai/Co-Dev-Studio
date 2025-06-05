'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div className="text-center mt-20">Loading...</div>;

  if (status === 'authenticated') {
    // Redirect to chat page if already signed in
    router.push('/chat');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to CoDev Studio 🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sign in with Google to collaborate in real-time with your team.
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
