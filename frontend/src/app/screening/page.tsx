// frontend/src/app/screening/page.tsx
'use client';

import { useState } from 'react';
import { Symptom, PatientInfo, DiagnosisResult } from '@/types';
import { diagnosisApi } from '@/lib/api';

const AVAILABLE_SYMPTOMS: Omit<Symptom, 'value'>[] = [
  // Gejala Umum
  { name: 'suhu_tinggi', label: 'Demam / Suhu Tinggi', weight: 0.9 },
  { name: 'batuk', label: 'Batuk', weight: 0.7 },
  { name: 'pilek', label: 'Pilek / Hidung Tersumbat', weight: 0.6 },
  { name: 'sakit_kepala', label: 'Sakit Kepala', weight: 0.8 },
  { name: 'lemas', label: 'Lemas / Tidak Bertenaga', weight: 0.7 },
  { name: 'mual', label: 'Mual', weight: 0.8 },
  { name: 'muntah', label: 'Muntah', weight: 0.9 },
  { name: 'sakit_perut', label: 'Sakit Perut', weight: 0.8 },
  { name: 'menggigil', label: 'Menggigil', weight: 0.7 },
  { name: 'nyeri_otot', label: 'Nyeri Otot', weight: 0.6 },
  
  // Gejala Pernapasan
  { name: 'sakit_tenggorokan', label: 'Sakit Tenggorokan', weight: 0.8 },
  { name: 'sesak_napas', label: 'Sesak Napas', weight: 1.0 },
  { name: 'nyeri_menelan', label: 'Nyeri Saat Menelan', weight: 0.7 },
  { name: 'bersin', label: 'Bersin-bersin', weight: 0.5 },
  { name: 'bengkak_pipi', label: 'Bengkak di Pipi/Rahang', weight: 0.9 },
  { name: 'nyeri_rahang', label: 'Nyeri pada Rahang', weight: 0.8 },

  // Gejala Kulit & Mata
  { name: 'luka_melepuh', label: 'Luka Melepuh di Kulit/Mulut', weight: 0.9 },
  { name: 'gatal_di_kulit', label: 'Gatal-gatal pada Kulit', weight: 0.8 },
  { name: 'ruam_kulit', label: 'Ruam Kemerahan', weight: 0.7 },
  { name: 'mata_merah', label: 'Mata Merah', weight: 0.8 },
  { name: 'mata_berair', label: 'Mata Berair', weight: 0.6 },
  { name: 'gatal_mata', label: 'Mata Terasa Gatal', weight: 0.7 },
  { name: 'kotoran_mata', label: 'Ada Kotoran Mata Berlebih', weight: 0.7 },
  { name: 'kulit_kering', label: 'Kulit Kering atau Bersisik', weight: 0.6 },
  { name: 'bengkak_ringan', label: 'Bengkak Ringan pada Kulit', weight: 0.5 },
  { name: 'gatal_malam_hari', label: 'Gatal Hebat di Malam Hari', weight: 1.0 },
  { name: 'bintik_merah', label: 'Bintik-bintik Merah Kecil', weight: 0.8 },
  { name: 'luka_garukan', label: 'Luka Akibat Garukan', weight: 0.7 },

  // Gejala Mulut
  { name: 'luka_mulut', label: 'Luka di Dalam Mulut (Sariawan)', weight: 0.9 },
  { name: 'nyeri_mulut', label: 'Nyeri di Area Mulut', weight: 0.8 },
  { name: 'sulit_makan', label: 'Sulit Makan atau Minum', weight: 0.7 },
  { name: 'gusi_bengkak', label: 'Gusi Bengkak', weight: 0.6 },
  { name: 'buang_air_besar_cair', label: 'Buang Air Besar Cair', weight: 0.8 },
];

export default function ScreeningPage() {
  // ... (state hooks: patientInfo, symptoms, results, loading, recommendations)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: 0, gender: 'Laki-laki' });
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (symptom: Omit<Symptom, 'value'>, isChecked: boolean) => {
    const newSelected = new Set(selectedSymptoms);
    if (isChecked) {
      newSelected.add(symptom.name);
      // Add to symptoms state with default value 50
      setSymptoms([...symptoms, { ...symptom, value: 50 }]);
    } else {
      newSelected.delete(symptom.name);
      // Remove from symptoms state
      setSymptoms(symptoms.filter(s => s.name !== symptom.name));
    }
    setSelectedSymptoms(newSelected);
  };

  const handleSliderChange = (symptomName: string, value: number) => {
    setSymptoms(symptoms.map(s => s.name === symptomName ? { ...s, value } : s));
  };
  
  // ... (handleSubmit function remains the same)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await diagnosisApi.diagnose(symptoms, patientInfo);
      setResults(response.data.diagnosis);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Diagnosis error:', error);
      alert('Terjadi kesalahan saat melakukan diagnosis');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[--foreground] mb-2">
            Screening Kesehatan Mandiri
          </h1>
          <p className="text-gray-600">Pesantren Alkausar 561</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <fieldset className="border p-4 rounded-md border-[--primary]">
            <legend className="text-lg font-semibold text-[--primary] px-2">Informasi Santri</legend>
            {/* ... (input fields for name, age, gender) ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Umur</label>
                <input
                  type="number"
                  value={patientInfo.age === 0 ? '' : patientInfo.age}
                  onChange={(e) => setPatientInfo({...patientInfo, age: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value as 'Laki-laki' | 'Perempuan'})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary]"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </fieldset>
          
          {/* Symptoms */}
          <fieldset className="border p-4 rounded-md border-[--primary]">
            <legend className="text-lg font-semibold text-[--primary] px-2">Gejala yang Dialami</legend>
            <p className="text-sm text-gray-500 mb-4">Pilih gejala yang Anda rasakan, lalu sesuaikan tingkat keparahannya.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
              {AVAILABLE_SYMPTOMS.map((symptom) => (
                <div key={symptom.name}>
                  <div className="flex items-center">
                    <input
                      id={`symptom-${symptom.name}`}
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(symptom, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[--primary] focus:ring-[--primary]"
                    />
                    <label htmlFor={`symptom-${symptom.name}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {symptom.label}
                    </label>
                  </div>
                  {selectedSymptoms.has(symptom.name) && (
                    <div className="flex items-center space-x-3 mt-2">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        defaultValue="50"
                        onChange={(e) => handleSliderChange(symptom.name, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[--primary]"
                      />
                      <span className="text-sm text-gray-600 w-12 text-center">
                        {symptoms.find(s => s.name === symptom.name)?.value || 0}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading || symptoms.length === 0}
            className="w-full bg-[--primary] hover:bg-opacity-90 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
          >
            {loading ? 'Menganalisis...' : 'Mulai Diagnosis'}
          </button>
        </form>

        {/* Results */}
        {results && (
          // ... (Result display section remains the same)
           <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Hasil Diagnosis</h3>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="border-l-4 border-[--accent] rounded-r-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg text-gray-800">{result.disease}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.severity === 'berat' ? 'bg-red-100 text-red-800' :
                      result.severity === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {result.severity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-[--primary] h-2.5 rounded-full" 
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tingkat Kepercayaan: {result.confidence.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>

            {recommendations.length > 0 && (
              <div className="bg-[--secondary] bg-opacity-30 border border-[--secondary] rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Rekomendasi:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}