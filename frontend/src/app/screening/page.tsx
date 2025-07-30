'use client';

import React, { useState, useMemo } from 'react';
import { Symptom, PatientInfo, DiagnosisResult } from '@/types';
import { diagnosisApi } from '@/lib/api';

// --- SVG Component for Interactive Body Map ---
const BodyMap = ({ highlightedParts }: { highlightedParts: Set<string> }) => {
    const isHighlighted = (part: string) => highlightedParts.has(part);
    return (
        <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {/* Body Silhouette */}
            <path d="M100 50 C 110 40, 115 30, 100 20 C 85 30, 90 40, 100 50 Z" fill="#d1d5db" /> {/* Head */}
            <path d="M100 50 L 100 120 L 120 120 L 125 200 L 110 380 L 100 390 L 90 380 L 75 200 L 80 120 L 100 120 Z" fill="#d1d5db" /> {/* Torso & Legs */}
            <path d="M80 120 L 60 200 L 50 180 Z" fill="#d1d5db" /> {/* Left Arm */}
            <path d="M120 120 L 140 200 L 150 180 Z" fill="#d1d5db" /> {/* Right Arm */}

            {/* Highlight Zones */}
            {isHighlighted('head') && <circle cx="100" cy="35" r="20" fill="var(--accent)" opacity="0.7" filter="url(#glow)" />}
            {isHighlighted('throat') && <circle cx="100" cy="65" r="10" fill="var(--accent)" opacity="0.7" filter="url(#glow)" />}
            {isHighlighted('chest') && <circle cx="100" cy="100" r="25" fill="var(--accent)" opacity="0.7" filter="url(#glow)" />}
            {isHighlighted('stomach') && <circle cx="100" cy="150" r="25" fill="var(--accent)" opacity="0.7" filter="url(#glow)" />}
            {isHighlighted('skin') && <rect x="40" y="20" width="120" height="370" fill="var(--accent)" opacity="0.3" rx="20" filter="url(#glow)" />}
            {isHighlighted('eyes') && <>
                <circle cx="93" cy="35" r="5" fill="var(--accent)" opacity="0.9" filter="url(#glow)" />
                <circle cx="107" cy="35" r="5" fill="var(--accent)" opacity="0.9" filter="url(#glow)" />
            </>}
             {isHighlighted('mouth') && <ellipse cx="100" cy="45" rx="10" ry="4" fill="var(--accent)" opacity="0.7" filter="url(#glow)" />}

        </svg>
    );
};


// --- Symptom Data with Categories and Body Parts ---
const SYMPTOM_DATA = [
    // Gejala Umum
    { name: 'suhu_tinggi', label: 'Demam / Suhu Tinggi', weight: 0.9, category: 'Umum', bodyPart: 'head' },
    { name: 'lemas', label: 'Lemas / Tidak Bertenaga', weight: 0.7, category: 'Umum', bodyPart: 'skin' },
    { name: 'sakit_kepala', label: 'Sakit Kepala', weight: 0.8, category: 'Umum', bodyPart: 'head' },
    { name: 'menggigil', label: 'Menggigil', weight: 0.7, category: 'Umum', bodyPart: 'skin' },
    { name: 'nyeri_otot', label: 'Nyeri Otot', weight: 0.6, category: 'Umum', bodyPart: 'skin' },

    // Gejala Pernapasan
    { name: 'batuk', label: 'Batuk', weight: 0.7, category: 'Pernapasan', bodyPart: 'chest' },
    { name: 'pilek', label: 'Pilek / Hidung Tersumbat', weight: 0.6, category: 'Pernapasan', bodyPart: 'head' },
    { name: 'sakit_tenggorokan', label: 'Sakit Tenggorokan', weight: 0.8, category: 'Pernapasan', bodyPart: 'throat' },
    { name: 'sesak_napas', label: 'Sesak Napas', weight: 1.0, category: 'Pernapasan', bodyPart: 'chest' },
    { name: 'nyeri_menelan', label: 'Nyeri Saat Menelan', weight: 0.7, category: 'Pernapasan', bodyPart: 'throat' },
    { name: 'bersin', label: 'Bersin-bersin', weight: 0.5, category: 'Pernapasan', bodyPart: 'head' },
    { name: 'bengkak_pipi', label: 'Bengkak di Pipi/Rahang', weight: 0.9, category: 'Pernapasan', bodyPart: 'head' },
    { name: 'nyeri_rahang', label: 'Nyeri pada Rahang', weight: 0.8, category: 'Pernapasan', bodyPart: 'head' },

    // Gejala Pencernaan
    { name: 'mual', label: 'Mual', weight: 0.8, category: 'Pencernaan', bodyPart: 'stomach' },
    { name: 'muntah', label: 'Muntah', weight: 0.9, category: 'Pencernaan', bodyPart: 'stomach' },
    { name: 'sakit_perut', label: 'Sakit Perut', weight: 0.8, category: 'Pencernaan', bodyPart: 'stomach' },
    { name: 'buang_air_besar_cair', label: 'Buang Air Besar Cair', weight: 0.8, category: 'Pencernaan', bodyPart: 'stomach' },

    // Gejala Kulit & Mata
    { name: 'luka_melepuh', label: 'Luka Melepuh', weight: 0.9, category: 'Kulit & Mata', bodyPart: 'skin' },
    { name: 'gatal_di_kulit', label: 'Gatal-gatal pada Kulit', weight: 0.8, category: 'Kulit & Mata', bodyPart: 'skin' },
    { name: 'ruam_kulit', label: 'Ruam Kemerahan', weight: 0.7, category: 'Kulit & Mata', bodyPart: 'skin' },
    { name: 'mata_merah', label: 'Mata Merah', weight: 0.8, category: 'Kulit & Mata', bodyPart: 'eyes' },
    { name: 'mata_berair', label: 'Mata Berair', weight: 0.6, category: 'Kulit & Mata', bodyPart: 'eyes' },
    { name: 'gatal_mata', label: 'Mata Terasa Gatal', weight: 0.7, category: 'Kulit & Mata', bodyPart: 'eyes' },
    { name: 'kotoran_mata', label: 'Kotoran Mata Berlebih', weight: 0.7, category: 'Kulit & Mata', bodyPart: 'eyes' },
    { name: 'gatal_malam_hari', label: 'Gatal Hebat di Malam Hari', weight: 1.0, category: 'Kulit & Mata', bodyPart: 'skin' },
    
    // Gejala Mulut
    { name: 'luka_mulut', label: 'Sariawan', weight: 0.9, category: 'Mulut', bodyPart: 'mouth' },
    { name: 'nyeri_mulut', label: 'Nyeri di Area Mulut', weight: 0.8, category: 'Mulut', bodyPart: 'mouth' },
    { name: 'sulit_makan', label: 'Sulit Makan atau Minum', weight: 0.7, category: 'Mulut', bodyPart: 'mouth' },
];

export default function ScreeningPage() {
    const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: 0, gender: 'Laki-laki' });
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [results, setResults] = useState<DiagnosisResult[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
    const [activeCategory, setActiveCategory] = useState<string>('Umum');

    const symptomCategories = useMemo(() => {
        return SYMPTOM_DATA.reduce((acc, symptom) => {
            (acc[symptom.category] = acc[symptom.category] || []).push(symptom);
            return acc;
        }, {} as Record<string, typeof SYMPTOM_DATA>);
    }, []);

    const highlightedBodyParts = useMemo(() => {
        const parts = new Set<string>();
        symptoms.forEach(symptom => {
            const data = SYMPTOM_DATA.find(d => d.name === symptom.name);
            if (data?.bodyPart) {
                parts.add(data.bodyPart);
            }
        });
        return parts;
    }, [symptoms]);

    const handleCheckboxChange = (symptom: Omit<Symptom, 'value' | 'category' | 'bodyPart'>, isChecked: boolean) => {
        const newSelected = new Set(selectedSymptoms);
        const fullSymptomData = SYMPTOM_DATA.find(s => s.name === symptom.name)!;

        if (isChecked) {
            newSelected.add(symptom.name);
            if (!symptoms.some(s => s.name === symptom.name)) {
                setSymptoms(prev => [...prev, { ...fullSymptomData, value: 50 }]);
            }
        } else {
            newSelected.delete(symptom.name);
            setSymptoms(prev => prev.filter(s => s.name !== symptom.name));
        }
        setSelectedSymptoms(newSelected);
    };

    const handleSliderChange = (symptomName: string, value: number) => {
        setSymptoms(prev => prev.map(s => s.name === symptomName ? { ...s, value } : s));
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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                    <div className="text-center border-b pb-4">
                        <h1 className="text-2xl font-bold text-[--foreground]">Form Screening Kesehatan</h1>
                        <p className="text-sm text-gray-500">Isi data dan pilih gejala yang dirasakan</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Info */}
                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 mb-2">Data Diri Santri</legend>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="nama" className="block text-xs font-medium text-gray-600">Nama Lengkap</label>
                                    <input type="text" id="nama" value={patientInfo.name} onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-[--primary] focus:ring-[--primary]" required />
                                </div>
                                <div>
                                    <label htmlFor="umur" className="block text-xs font-medium text-gray-600">Umur</label>
                                    <input type="number" id="umur" value={patientInfo.age === 0 ? '' : patientInfo.age} onChange={(e) => setPatientInfo({ ...patientInfo, age: parseInt(e.target.value) || 0 })} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-[--primary] focus:ring-[--primary]" required />
                                </div>
                                <div>
                                    <label htmlFor="jenis_kelamin" className="block text-xs font-medium text-gray-600">Jenis Kelamin</label>
                                    <select id="jenis_kelamin" value={patientInfo.gender} onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value as 'Laki-laki' | 'Perempuan' })} className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-[--primary] focus:ring-[--primary]">
                                        <option>Laki-laki</option>
                                        <option>Perempuan</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        {/* Symptoms */}
                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-700 mb-2">Pilih Gejala</legend>
                            <div className="border border-gray-200 rounded-lg">
                                <div className="flex">
                                    {Object.keys(symptomCategories).map(category => (
                                        <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`flex-1 p-2 text-sm font-medium border-b-2 ${activeCategory === category ? 'border-[--primary] text-[--primary]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                                    {symptomCategories[activeCategory]?.map(symptom => (
                                        <div key={symptom.name}>
                                            <div className="flex items-center">
                                                <input id={`symptom-${symptom.name}`} type="checkbox" checked={selectedSymptoms.has(symptom.name)} onChange={(e) => handleCheckboxChange(symptom, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[--primary] focus:ring-[--primary]" />
                                                <label htmlFor={`symptom-${symptom.name}`} className="ml-3 block text-sm font-medium text-gray-800">{symptom.label}</label>
                                            </div>
                                            {selectedSymptoms.has(symptom.name) && (
                                                <div className="flex items-center space-x-3 mt-1 pl-7">
                                                     <input type="range" min="1" max="100" value={symptoms.find(s => s.name === symptom.name)?.value || 50} onChange={(e) => handleSliderChange(symptom.name, parseInt(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[--primary]" />
                                                    <span className="text-sm text-gray-600 w-12 text-center font-mono">{symptoms.find(s => s.name === symptom.name)?.value || 0}%</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </fieldset>

                        <button type="submit" disabled={loading || symptoms.length === 0} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[--primary] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Menganalisis...
                                </>
                            ) : 'Mulai Diagnosis'}
                        </button>
                    </form>
                </div>

                {/* Right Column: Visualizer & Results */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                    <div className="flex-grow flex items-center justify-center relative">
                        {results ? (
                             <div className="w-full">
                                <h2 className="text-xl font-bold text-center text-[--foreground] mb-4">Hasil Diagnosis</h2>
                                {results.length > 0 ? (
                                    <div className="space-y-4">
                                        {results.slice(0, 3).map((result, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-[--accent]">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-md font-semibold text-gray-800">{result.disease}</h3>
                                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ result.severity === 'berat' ? 'bg-red-100 text-red-800' : result.severity === 'sedang' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{result.severity}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                                                    <div className="bg-[--primary] h-2 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                                                </div>
                                                <p className="text-xs text-right text-gray-600">Tingkat Kepercayaan: {result.confidence.toFixed(1)}%</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600">Tidak ada diagnosis yang cocok dengan gejala yang Anda pilih.</p>
                                )}
                                {recommendations.length > 0 && (
                                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-800 mb-2">Rekomendasi:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                                            {recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                        </ul>
                                    </div>
                                )}
                             </div>
                        ) : (
                           <div className="w-2/3 h-full">
                             <BodyMap highlightedParts={highlightedBodyParts} />
                           </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}