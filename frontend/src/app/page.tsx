'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Stethoscope, ShieldCheck, LineChart, HeartPulse, Cigarette, Dna, LogIn, FileText, Hand } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Kesehatan Santri Terpantau, Hati Pun Tenang
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              AlFuzzy Medis adalah sistem deteksi dini penyakit berbasis logika fuzzy, dirancang khusus untuk menjaga kesehatan santri di lingkungan Pesantren Al-Kautsar 561.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Login Santri / Orang Tua</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/screening">Mulai Screening Awal</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Bagaimana Cara Kerjanya?</h2>
                    <p className="mt-2 text-muted-foreground">Hanya dalam 3 langkah mudah untuk mengetahui kondisi kesehatan Anda.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <LogIn className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">1. Login</h3>
                        <p className="mt-2 text-muted-foreground">Masuk ke akun santri atau orang tua yang sudah terdaftar.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">2. Isi Gejala</h3>
                        <p className="mt-2 text-muted-foreground">Pilih gejala yang dirasakan dan atur tingkat keparahannya.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Stethoscope className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">3. Dapatkan Hasil</h3>
                        <p className="mt-2 text-muted-foreground">Sistem akan memberikan diagnosis awal dan rekomendasi.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Keunggulan Fitur Utama</h2>
              <p className="mt-2 text-muted-foreground">Dirancang untuk kemudahan dan keakuratan deteksi dini.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  <CardTitle>Screening Mandiri</CardTitle>
                </CardHeader>
                <CardContent>Santri dapat melakukan pemeriksaan gejala secara mandiri, kapan saja dan di mana saja.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <LineChart className="w-8 h-8 text-primary" />
                  <CardTitle>Diagnosis Cerdas</CardTitle>
                </CardHeader>
                <CardContent>Hasil diagnosis awal yang cepat dan akurat berkat teknologi logika fuzzy.</CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <HeartPulse className="w-8 h-8 text-primary" />
                  <CardTitle>Riwayat Kesehatan</CardTitle>
                </CardHeader>
                <CardContent>Pantau riwayat pemeriksaan kesehatan santri dengan mudah, dapat diakses oleh orang tua.</CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Detectable Diseases Section */}
        <section className="py-16 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground">Penyakit yang Dapat Dideteksi</h2>
                    <p className="mt-2 text-muted-foreground">Sistem kami mencakup berbagai penyakit umum di lingkungan pesantren.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="text-center">
                        <CardHeader><Cigarette className="mx-auto h-10 w-10 text-primary mb-2" /><CardTitle>Saluran Pernapasan</CardTitle></CardHeader>
                        <CardContent className="text-muted-foreground">ISPA, Faringitis, Common Cold, Parotitis, dan lainnya.</CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><Dna className="mx-auto h-10 w-10 text-primary mb-2" /><CardTitle>Akibat Virus</CardTitle></CardHeader>
                        <CardContent className="text-muted-foreground">Herpes, Konjungtivitis, Influenza, dan lainnya.</CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardHeader><div className="mx-auto h-10 w-10 flex items-center justify-center"><span className="text-4xl">🤚</span></div><CardTitle>Infeksi Kulit</CardTitle></CardHeader>
                        <CardContent className="text-muted-foreground">Dermatitis, Scabies, Stomatitis, dan lainnya.</CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-6 text-center">
                <blockquote className="max-w-3xl mx-auto">
                    <p className="text-2xl font-semibold italic">"Menjaga kesehatan setiap santri adalah prioritas utama kami. AlFuzzy Medis adalah ikhtiar kami dalam memanfaatkan teknologi untuk kebaikan bersama."</p>
                    <footer className="mt-4 text-lg">- Pimpinan Pesantren Al-Kautsar 561</footer>
                </blockquote>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Pertanyaan Umum (FAQ)</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Bagaimana cara kerja sistem ini?</AccordionTrigger>
                <AccordionContent>Sistem ini menggunakan logika fuzzy untuk menganalisis gejala yang Anda masukkan dan memberikan kemungkinan diagnosis penyakit berdasarkan aturan yang telah ditetapkan.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Apakah diagnosis dari sistem ini 100% akurat?</AccordionTrigger>
                <AccordionContent>Tidak. Sistem ini dirancang sebagai alat deteksi dini, bukan pengganti diagnosis medis profesional. Untuk kepastian, selalu konsultasikan dengan petugas kesehatan.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Siapa saja yang dapat melihat data kesehatan saya?</AccordionTrigger>
                <AccordionContent>Data kesehatan Anda hanya dapat diakses oleh Anda sendiri, orang tua/wali yang terdaftar, dan admin kesehatan pesantren yang berwenang.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  );
}
