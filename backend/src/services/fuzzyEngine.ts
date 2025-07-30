// backend/src/services/fuzzyEngine.ts
export interface Symptom {
  name: string;
  value: number; // 0-100
  weight: number; // bobot kepentingan
}

export interface Disease {
  name: string;
  symptoms: string[];
  severity: 'ringan' | 'sedang' | 'berat';
}

export class FuzzyLogicEngine {
  private diseases: Disease[] = [
    {
      name: 'Demam',
      symptoms: ['suhu_tinggi', 'lemas', 'sakit_kepala', 'menggigil'],
      severity: 'sedang'
    },
    {
      name: 'Flu',
      symptoms: ['batuk', 'pilek', 'sakit_tenggorokan', 'lemas'],
      severity: 'ringan'
    },
    {
      name: 'Diare',
      symptoms: ['mual', 'muntah', 'sakit_perut', 'buang_air_besar_cair'],
      severity: 'sedang'
    }
  ];

  // Fungsi membership untuk gejala
  private membershipFunction(value: number, type: 'low' | 'medium' | 'high'): number {
    switch (type) {
      case 'low':
        return value <= 30 ? 1 : value <= 50 ? (50 - value) / 20 : 0;
      case 'medium':
        return value <= 30 ? 0 : value <= 50 ? (value - 30) / 20 : 
               value <= 70 ? 1 : value <= 90 ? (90 - value) / 20 : 0;
      case 'high':
        return value <= 70 ? 0 : value <= 90 ? (value - 70) / 20 : 1;
      default:
        return 0;
    }
  }

  // Hitung tingkat kemungkinan penyakit
  public diagnose(symptoms: Symptom[]): { disease: string; confidence: number; severity: string }[] {
    const results: { disease: string; confidence: number; severity: string }[] = [];

    this.diseases.forEach(disease => {
      let totalScore = 0;
      let matchedSymptoms = 0;

      disease.symptoms.forEach(diseaseSymptom => {
        const userSymptom = symptoms.find(s => s.name === diseaseSymptom);
        if (userSymptom) {
          // Hitung fuzzy membership
          const lowMembership = this.membershipFunction(userSymptom.value, 'low');
          const mediumMembership = this.membershipFunction(userSymptom.value, 'medium');
          const highMembership = this.membershipFunction(userSymptom.value, 'high');

          // Weighted score berdasarkan tingkat keparahan
          const score = (lowMembership * 0.3 + mediumMembership * 0.6 + highMembership * 1.0) * userSymptom.weight;
          totalScore += score;
          matchedSymptoms++;
        }
      });

      if (matchedSymptoms > 0) {
        const confidence = (totalScore / disease.symptoms.length) * 100;
        results.push({
          disease: disease.name,
          confidence: Math.min(confidence, 100),
          severity: disease.severity
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }
}