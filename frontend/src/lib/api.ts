// frontend/src/lib/api.ts
import axios from 'axios';
import { Symptom, PatientInfo, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const diagnosisApi = {
  diagnose: async (symptoms: Symptom[], patientInfo: PatientInfo): Promise<ApiResponse> => {
    const response = await api.post('/api/diagnose', {
      symptoms,
      patientInfo
    });
    return response.data;
  },
  
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  }
};