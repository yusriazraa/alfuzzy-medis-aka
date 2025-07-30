// frontend/src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Dummy components for different roles
const AdminDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dasbor Admin</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="#" className="p-4 bg-blue-100 rounded hover:bg-blue-200">Manajemen Data Santri</Link>
      <Link href="#" className="p-4 bg-blue-100 rounded hover:bg-blue-200">Manajemen Rules Fuzzy</Link>
      <Link href="#" className="p-4 bg-blue-100 rounded hover:bg-blue-200">Riwayat Kesehatan Santri</Link>
      <Link href="#" className="p-4 bg-blue-100 rounded hover:bg-blue-200">Manajemen Konten Edukasi</Link>
    </div>
  </div>
);

const SantriDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dasbor Santri</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="/screening" className="p-4 bg-green-100 rounded hover:bg-green-200">Screening Kesehatan</Link>
      <Link href="/riwayat" className="p-4 bg-green-100 rounded hover:bg-green-200">Riwayat Kesehatan</Link>
      <Link href="/edukasi" className="p-4 bg-green-100 rounded hover:bg-green-200">Edukasi Kesehatan</Link>
    </div>
  </div>
);

const OrangTuaDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dasbor Orang Tua</h2>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href="/riwayat-anak" className="p-4 bg-yellow-100 rounded hover:bg-yellow-200">Lihat Riwayat Kesehatan Santri</Link>
      <Link href="/edukasi" className="p-4 bg-yellow-100 rounded hover:bg-yellow-200">Edukasi Kesehatan</Link>
    </div>
  </div>
);

export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {!role ? (
          <p>Silakan login terlebih dahulu.</p>
        ) : role === 'admin' ? (
          <AdminDashboard />
        ) : role === 'santri' ? (
          <SantriDashboard />
        ) : (
          <OrangTuaDashboard />
        )}
      </div>
    </div>
  );
}