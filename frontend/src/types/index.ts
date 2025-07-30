// frontend/src/types/index.ts
export interface Symptom {
  name: string;
  value: number;
  weight: number;
  label: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  santriId?: string;
}

export interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    patientInfo: PatientInfo;
    diagnosis: DiagnosisResult[];
    timestamp: string;
    recommendations: string[];
  };
}