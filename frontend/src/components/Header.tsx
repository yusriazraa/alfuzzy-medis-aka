// frontend/src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-green-800">
            AlFuzzy Medis
          </Link>
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-green-700">
              Home
            </Link>
            {role ? (
              <>
                <span className="text-gray-700 font-medium">
                  Peran: {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}