// frontend/src/app/dashboard/admin/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { Users, BrainCircuit, BookHeart, History } from 'lucide-react';

const navItems = [
    { href: '/dashboard/admin/santri', icon: Users, label: 'Data Santri' },
    { href: '/dashboard/admin/rules', icon: BrainCircuit, label: 'Rules Fuzzy' },
    { href: '/dashboard/admin/riwayat', icon: History, label: 'Riwayat Kesehatan' },
    { href: '/dashboard/admin/edukasi', icon: BookHeart, label: 'Konten Edukasi' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container mx-auto p-4 grid lg:grid-cols-5 gap-8">
            <aside className="lg:col-span-1">
                <nav className="space-y-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100">
                            <item.icon className="mr-3 h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="lg:col-span-4">
                {children}
            </main>
        </div>
    );
}
