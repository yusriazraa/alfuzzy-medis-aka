// frontend/src/app/screening/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Symptom, PatientInfo, DiagnosisResult } from '@/types';
import { diagnosisApi } from '@/lib/api';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Data Gejala (Sama seperti sebelumnya)
const SYMPTOM_DATA = [
    { name: 'suhu_tinggi', label: 'Demam / Suhu Tinggi', weight: 0.9, category: 'Umum' },
    { name: 'lemas', label: 'Lemas / Tidak Bertenaga', weight: 0.7, category: 'Umum' },
    { name: 'sakit_kepala', label: 'Sakit Kepala', weight: 0.8, category: 'Umum' },
    { name: 'menggigil', label: 'Menggigil', weight: 0.7, category: 'Umum' },
    { name: 'nyeri_otot', label: 'Nyeri Otot', weight: 0.6, category: 'Umum' },
    { name: 'batuk', label: 'Batuk', weight: 0.7, category: 'Pernapasan' },
    { name: 'pilek', label: 'Pilek / Hidung Tersumbat', weight: 0.6, category: 'Pernapasan' },
    { name: 'sakit_tenggorokan', label: 'Sakit Tenggorokan', weight: 0.8, category: 'Pernapasan' },
    { name: 'sesak_napas', label: 'Sesak Napas', weight: 1.0, category: 'Pernapasan' },
    { name: 'mual', label: 'Mual', weight: 0.8, category: 'Pencernaan' },
    { name: 'muntah', label: 'Muntah', weight: 0.9, category: 'Pencernaan' },
    { name: 'sakit_perut', label: 'Sakit Perut', weight: 0.8, category: 'Pencernaan' },
    { name: 'luka_melepuh', label: 'Luka Melepuh', weight: 0.9, category: 'Kulit & Mata' },
    { name: 'gatal_di_kulit', label: 'Gatal-gatal pada Kulit', weight: 0.8, category: 'Kulit & Mata' },
    { name: 'ruam_kulit', label: 'Ruam Kemerahan', weight: 0.7, category: 'Kulit & Mata' },
    { name: 'mata_merah', label: 'Mata Merah', weight: 0.8, category: 'Kulit & Mata' },
    { name: 'luka_mulut', label: 'Sariawan', weight: 0.9, category: 'Mulut' },
    { name: 'nyeri_mulut', label: 'Nyeri di Area Mulut', weight: 0.8, category: 'Mulut' },
];

export default function ScreeningPage() {
    const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: 0, gender: 'Laki-laki' });
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [results, setResults] = useState<DiagnosisResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);

    const symptomCategories = useMemo(() => {
        return SYMPTOM_DATA.reduce((acc, symptom) => {
            (acc[symptom.category] = acc[symptom.category] || []).push(symptom);
            return acc;
        }, {} as Record<string, typeof SYMPTOM_DATA>);
    }, []);

    const handleSymptomCheckedChange = (symptom: Omit<Symptom, 'value' | 'category'>, checked: boolean | 'indeterminate') => {
        if (checked) {
            if (!symptoms.some(s => s.name === symptom.name)) {
                const fullSymptom = SYMPTOM_DATA.find(s => s.name === symptom.name)!;
                setSymptoms(prev => [...prev, { ...fullSymptom, value: 50 }]);
            }
        } else {
            setSymptoms(prev => prev.filter(s => s.name !== symptom.name));
        }
    };

    const handleSliderChange = (symptomName: string, value: number[]) => {
        setSymptoms(prev => prev.map(s => s.name === symptomName ? { ...s, value: value[0] } : s));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        try {
            const response = await diagnosisApi.diagnose(symptoms, patientInfo);
            setResults(response.data.diagnosis);
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error('Diagnosis error:', error);
            alert('Terjadi kesalahan saat melakukan diagnosis. Pastikan server backend berjalan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Screening Kesehatan Mandiri</CardTitle>
                    <CardDescription className="text-center">Isi data diri dan pilih gejala yang dirasakan untuk mendapatkan diagnosis awal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Patient Info */}
                        <fieldset className="space-y-4">
                            <legend className="text-lg font-semibold">Data Diri Santri</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input id="nama" placeholder="Masukkan nama lengkap" value={patientInfo.name} onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="umur">Umur</Label>
                                    <Input id="umur" type="number" placeholder="Contoh: 15" value={patientInfo.age === 0 ? '' : patientInfo.age} onChange={(e) => setPatientInfo({ ...patientInfo, age: parseInt(e.target.value) || 0 })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select value={patientInfo.gender} onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value as 'Laki-laki' | 'Perempuan' })}>
                                        <SelectTrigger id="jenis_kelamin">
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </fieldset>

                        {/* Symptoms */}
                        <fieldset>
                             <legend className="text-lg font-semibold">Gejala yang Dialami</legend>
                            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                {Object.entries(symptomCategories).map(([category, symptomsList], index) => (
                                    <AccordionItem value={`item-${index}`} key={category}>
                                        <AccordionTrigger className="text-base">{category}</AccordionTrigger>
                                        <AccordionContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            {symptomsList.map(symptom => (
                                                <div key={symptom.name} className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={symptom.name} checked={symptoms.some(s => s.name === symptom.name)} onCheckedChange={(checked) => handleSymptomCheckedChange(symptom, checked)} />
                                                        <label htmlFor={symptom.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {symptom.label}
                                                        </label>
                                                    </div>
                                                    {symptoms.some(s => s.name === symptom.name) && (
                                                        <div className="flex items-center space-x-4 pl-6">
                                                            <Slider
                                                                value={[symptoms.find(s => s.name === symptom.name)?.value || 50]}
                                                                onValueChange={(value) => handleSliderChange(symptom.name, value)}
                                                                max={100}
                                                                step={1}
                                                                className="w-[calc(100%-4rem)]"
                                                            />
                                                             <span className="text-sm font-mono text-gray-600 w-12 text-right">{symptoms.find(s => s.name === symptom.name)?.value}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </fieldset>
                        <Button type="submit" className="w-full" disabled={loading || symptoms.length === 0}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Menganalisis...' : 'Mulai Diagnosis'}
                        </Button>
                    </form>

                    {/* Results */}
                    {results && (
                        <div className="mt-8 pt-6 border-t">
                            <h2 className="text-xl font-semibold text-center mb-4">Hasil Diagnosis Awal</h2>
                            {results.length > 0 ? (
                                <div className="space-y-4">
                                    {results.slice(0, 3).map((result) => (
                                        <Card key={result.disease} className={`${result.confidence > 70 ? 'border-primary' : ''}`}>
                                            <CardHeader>
                                                <div className="flex justify-between items-center">
                                                    <CardTitle>{result.disease}</CardTitle>
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ result.severity === 'berat' ? 'bg-red-100 text-red-800' : result.severity === 'sedang' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{result.severity}</span>
                                                </div>
                                                <CardDescription>Tingkat Kepercayaan: {result.confidence.toFixed(1)}%</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">Tidak ada diagnosis yang cocok dengan gejala yang Anda pilih.</p>
                            )}

                             {recommendations.length > 0 && (
                                <Alert className="mt-6">
                                    <AlertTitle className="font-semibold">Rekomendasi</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside space-y-1 mt-2">
                                            {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}