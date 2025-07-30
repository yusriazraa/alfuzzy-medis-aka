// frontend/src/app/screening/page.tsx
'use client';

import { useState } from 'react';
import { Symptom, PatientInfo, DiagnosisResult } from '@/types';
import { diagnosisApi } from '@/lib/api';

// Daftar gejala yang tersedia untuk screening
const AVAILABLE_SYMPTOMS: Omit<Symptom, 'value'>[] = [
  { name: 'suhu_tinggi', label: 'Demam/Suhu Tinggi', weight: 0.9 },
  { name: 'batuk', label: 'Batuk', weight: 0.7 },
  { name: 'pilek', label: 'Pilek', weight: 0.6 },
  { name: 'sakit_kepala', label: 'Sakit Kepala', weight: 0.8 },
  { name: 'lemas', label: 'Lemas/Tidak Bertenaga', weight: 0.7 },
  { name: 'mual', label: 'Mual', weight: 0.8 },
  { name: 'muntah', label: 'Muntah', weight: 0.9 },
  { name: 'sakit_perut', label: 'Sakit Perut', weight: 0.8 },
];

export default function ScreeningPage() {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: 0,
    gender: 'Laki-laki'
  });
  
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleSymptomChange = (symptomName: string, value: number) => {
    const existingSymptom = symptoms.find(s => s.name === symptomName);
    const symptomTemplate = AVAILABLE_SYMPTOMS.find(s => s.name === symptomName)!;

    if (existingSymptom) {
      setSymptoms(symptoms.map(s => 
        s.name === symptomName ? { ...s, value } : s
      ));
    } else if (value > 0) {
      setSymptoms([...symptoms, { ...symptomTemplate, value }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengirim data ke backend API untuk diagnosis
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
            <p className="text-sm text-gray-500 mb-4">Geser slider untuk menunjukkan tingkat keparahan gejala (0-100).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {AVAILABLE_SYMPTOMS.map((symptom) => (
                <div key={symptom.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {symptom.label}
                  </label>
                   <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="0"
                      onChange={(e) => handleSymptomChange(symptom.name, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[--primary]"
                    />
                    <span className="text-sm text-gray-600 w-12 text-center">
                      {symptoms.find(s => s.name === symptom.name)?.value || 0}%
                    </span>
                   </div>
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