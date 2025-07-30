// frontend/src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BrainCircuit, History, BookHeart, FileText, Stethoscope, HeartPulse } from 'lucide-react';

// --- Komponen Dasbor Admin ---
const AdminDashboard = () => {
    const adminFeatures = [
        {
            href: '/dashboard/admin/santri',
            icon: Users,
            title: 'Manajemen Data Santri',
            description: 'Tambah, edit, dan kelola data semua santri di pesantren.'
        },
        {
            href: '/dashboard/admin/rules',
            icon: BrainCircuit,
            title: 'Manajemen Rules Fuzzy',
            description: 'Atur gejala dan aturan penyakit untuk meningkatkan akurasi diagnosis.'
        },
        {
            href: '/dashboard/admin/riwayat',
            icon: History,
            title: 'Riwayat Kesehatan',
            description: 'Lihat semua riwayat hasil screening kesehatan para santri.'
        },
        {
            href: '/dashboard/admin/edukasi',
            icon: BookHeart,
            title: 'Manajemen Konten Edukasi',
            description: 'Publikasikan artikel dan informasi kesehatan untuk santri.'
        }
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-2 text-center">Dasbor Admin</h2>
            <p className="text-center text-muted-foreground mb-6">Pilih salah satu menu di bawah untuk memulai.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminFeatures.map((feature) => (
                    <Link href={feature.href} key={feature.title} className="block hover:shadow-lg transition-shadow rounded-lg">
                        <Card className="h-full hover:border-primary">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <feature.icon className="w-8 h-8 text-primary" />
                                <div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};


// --- Komponen Dasbor Santri ---
const SantriDashboard = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Dasbor Santri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/screening" className="block"><Card className="p-6 text-center hover:bg-gray-50"><Stethoscope className="mx-auto mb-2 h-8 w-8 text-primary" />Screening Kesehatan</Card></Link>
            <Link href="/riwayat" className="block"><Card className="p-6 text-center hover:bg-gray-50"><History className="mx-auto mb-2 h-8 w-8 text-primary" />Riwayat Kesehatan</Card></Link>
            <Link href="/edukasi" className="block"><Card className="p-6 text-center hover:bg-gray-50"><BookHeart className="mx-auto mb-2 h-8 w-8 text-primary" />Edukasi Kesehatan</Card></Link>
        </div>
    </div>
);

// --- Komponen Dasbor Orang Tua ---
const OrangTuaDashboard = () => (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-center">Dasbor Orang Tua</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/riwayat-anak" className="block"><Card className="p-6 text-center hover:bg-gray-50"><HeartPulse className="mx-auto mb-2 h-8 w-8 text-primary" />Riwayat Kesehatan Anak</Card></Link>
            <Link href="/edukasi" className="block"><Card className="p-6 text-center hover:bg-gray-50"><BookHeart className="mx-auto mb-2 h-8 w-8 text-primary" />Edukasi Kesehatan</Card></Link>
        </div>
    </div>
);

export default function DashboardPage() {
    const { role } = useAuth();

    const renderDashboard = () => {
        switch (role) {
            case 'admin':
                return <AdminDashboard />;
            case 'santri':
                return <SantriDashboard />;
            case 'orangtua':
                return <OrangTuaDashboard />;
            default:
                return <p className="text-center">Silakan login untuk mengakses dasbor.</p>;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {renderDashboard()}
        </div>
    );
}
