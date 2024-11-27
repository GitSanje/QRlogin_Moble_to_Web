'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

export default function Profile() {
  const router = useRouter();
  const { session, logout } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Profile</h2>
        </div>
        <div className="mt-8 space-y-6">
          {session.profilePic && (
            <img
              src={`data:image/png;base64,${session.profilePic}`}
              alt="Profile"
              className="mx-auto h-24 w-24 rounded-full"
            />
          )}
          <div className="text-center">
            <p className="text-xl font-semibold">{session.username}</p>
            <p className="text-gray-600">{session.email}</p>
          </div>
          <div>
            <button
              onClick={logout}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

