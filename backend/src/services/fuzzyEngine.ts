// backend/src/services/fuzzyEngine.ts
import { db, DiseaseRule } from '../database';

export interface Symptom {
  name: string;
  value: number; // 0-100 (intensitas gejala)
  weight: number; // 0-1 (bobot kepentingan)
  duration?: number; // durasi dalam hari (opsional)
  frequency?: 'rare' | 'occasional' | 'frequent' | 'constant'; // frekuensi kejadian
}

export interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: string;
  matchedSymptoms: string[];
  unmatchedSymptoms: string[];
  riskFactors: string[];
  recommendations: string[];
}

export class FuzzyLogicEngine {
  private diseases: DiseaseRule[] = [];

  constructor() {
    this.loadRules();
  }

  public loadRules(): void {
    console.log("Memuat ulang aturan fuzzy dari database...");
    this.diseases = [...db.diseaseRules];
  }

  // Fungsi membership yang lebih halus dengan overlap yang lebih baik
  private membershipFunction(value: number, type: 'low' | 'medium' | 'high'): number {
    // Gunakan fungsi trapezoid/triangular yang lebih smooth
    switch (type) {
      case 'low':
        if (value <= 20) return 1;
        if (value <= 40) return (40 - value) / 20;
        return 0;
      
      case 'medium':
        if (value <= 20) return 0;
        if (value <= 40) return (value - 20) / 20;
        if (value <= 60) return 1;
        if (value <= 80) return (80 - value) / 20;
        return 0;
      
      case 'high':
        if (value <= 60) return 0;
        if (value <= 80) return (value - 60) / 20;
        return 1;
    }
  }

  // Fungsi untuk menghitung membership berdasarkan frekuensi
  private frequencyMembership(frequency: string): number {
    const frequencyMap = {
      'rare': 0.2,
      'occasional': 0.5,
      'frequent': 0.8,
      'constant': 1.0
    };
    return frequencyMap[frequency as keyof typeof frequencyMap] || 0.5;
  }

  // Fungsi untuk menghitung faktor durasi
  private durationFactor(duration: number): number {
    if (duration <= 1) return 0.3; // akut/baru
    if (duration <= 7) return 0.6; // subakut
    if (duration <= 30) return 0.8; // kronik ringan
    return 1.0; // kronik berat
  }

  // Normalisasi bobot agar total = 1
  private normalizeWeights(symptoms: Symptom[]): Symptom[] {
    const totalWeight = symptoms.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) return symptoms;
    
    return symptoms.map(symptom => ({
      ...symptom,
      weight: symptom.weight / totalWeight
    }));
  }

  // Fuzzy AND operation (minimum)
  private fuzzyAnd(values: number[]): number {
    return Math.min(...values);
  }

  // Fuzzy OR operation (maximum)
  private fuzzyOr(values: number[]): number {
    return Math.max(...values);
  }

  // Hitung confidence score yang lebih sophisticated
  private calculateConfidence(
    disease: DiseaseRule,
    symptoms: Symptom[],
    matchedScores: number[]
  ): number {
    const normalizedSymptoms = this.normalizeWeights(symptoms);
    
    // 1. Coverage factor - seberapa banyak gejala penyakit yang cocok
    const coverageFactor = matchedScores.length / disease.symptoms.length;
    
    // 2. Intensity factor - rata-rata intensitas yang di-weight
    const intensityFactor = matchedScores.reduce((sum, score, index) => {
      const symptom = normalizedSymptoms.find(s => 
        disease.symptoms.includes(s.name)
      );
      return sum + (score * (symptom?.weight || 1));
    }, 0) / matchedScores.length;
    
    // 3. Specificity factor - gejala yang spesifik untuk penyakit ini
    const specificityFactor = this.calculateSpecificity(disease, symptoms);
    
    // 4. Penalty untuk gejala yang tidak cocok
    const unmatchedPenalty = Math.max(0, 1 - (disease.symptoms.length - matchedScores.length) * 0.1);
    
    // Kombinasi faktor dengan bobot
    const confidence = (
      coverageFactor * 0.3 +
      intensityFactor * 0.4 +
      specificityFactor * 0.2 +
      unmatchedPenalty * 0.1
    ) * 100;
    
    return Math.min(confidence, 100);
  }

  // Hitung spesifisitas gejala untuk penyakit
  private calculateSpecificity(disease: DiseaseRule, symptoms: Symptom[]): number {
    let specificityScore = 0;
    let totalSymptoms = 0;
    
    symptoms.forEach(symptom => {
      // Hitung berapa penyakit lain yang memiliki gejala ini
      const diseaseCount = this.diseases.filter(d => 
        d.symptoms.includes(symptom.name)
      ).length;
      
      if (diseaseCount > 0) {
        // Semakin sedikit penyakit yang memiliki gejala ini, semakin spesifik
        const specificity = 1 / diseaseCount;
        specificityScore += specificity * symptom.weight;
        totalSymptoms++;
      }
    });
    
    return totalSymptoms > 0 ? specificityScore / totalSymptoms : 0;
  }

  // Implementasi Fuzzy Inference System yang lebih canggih
  public diagnose(symptoms: Symptom[]): DiagnosisResult[] {
    if (!symptoms.length) return [];
    
    const normalizedSymptoms = this.normalizeWeights(symptoms);
    const results: DiagnosisResult[] = [];

    this.diseases.forEach(disease => {
      const matchedSymptoms: string[] = [];
      const unmatchedSymptoms: string[] = [];
      const matchedScores: number[] = [];
      let totalFuzzyScore = 0;

      // Evaluasi setiap gejala penyakit
      disease.symptoms.forEach(diseaseSymptom => {
        const userSymptom = normalizedSymptoms.find(s => s.name === diseaseSymptom);
        
        if (userSymptom) {
          matchedSymptoms.push(diseaseSymptom);
          
          // Hitung membership untuk setiap tingkat
          const lowMembership = this.membershipFunction(userSymptom.value, 'low');
          const mediumMembership = this.membershipFunction(userSymptom.value, 'medium');
          const highMembership = this.membershipFunction(userSymptom.value, 'high');
          
          // Faktor tambahan
          const frequencyFactor = userSymptom.frequency ? 
            this.frequencyMembership(userSymptom.frequency) : 1;
          const durationFactor = userSymptom.duration ? 
            this.durationFactor(userSymptom.duration) : 1;
          
          // Skor gabungan dengan fuzzy rules
          let symptomScore = 0;
          
          // Rule 1: Jika intensitas tinggi DAN frekuensi tinggi -> confidence tinggi
          if (highMembership > 0.7 && frequencyFactor > 0.7) {
            symptomScore = this.fuzzyAnd([highMembership, frequencyFactor]) * 1.0;
          }
          // Rule 2: Jika intensitas medium DAN durasi lama -> confidence medium-tinggi
          else if (mediumMembership > 0.5 && durationFactor > 0.6) {
            symptomScore = this.fuzzyAnd([mediumMembership, durationFactor]) * 0.8;
          }
          // Rule 3: Default fuzzy inference
          else {
            symptomScore = (
              lowMembership * 0.2 + 
              mediumMembership * 0.5 + 
              highMembership * 0.8
            ) * frequencyFactor * durationFactor;
          }
          
          // Apply weight dan akumulasi
          const weightedScore = symptomScore * userSymptom.weight;
          totalFuzzyScore += weightedScore;
          matchedScores.push(weightedScore);
          
        } else {
          unmatchedSymptoms.push(diseaseSymptom);
        }
      });

      // Hanya proses jika ada gejala yang cocok
      if (matchedSymptoms.length > 0) {
        const confidence = this.calculateConfidence(disease, normalizedSymptoms, matchedScores);
        
        // Filter hasil dengan threshold minimum
        if (confidence >= 10) { // Threshold 10% untuk mengurangi noise
          results.push({
            disease: disease.name,
            confidence: parseFloat(confidence.toFixed(2)),
            severity: disease.severity,
            matchedSymptoms,
            unmatchedSymptoms,
            riskFactors: this.getRiskFactors(disease, normalizedSymptoms),
            recommendations: this.getRecommendations(disease, confidence)
          });
        }
      }
    });

    // Sort berdasarkan confidence dan kemudian berdasarkan jumlah gejala yang cocok
    return results.sort((a, b) => {
      if (Math.abs(a.confidence - b.confidence) < 5) {
        // Jika confidence hampir sama, prioritaskan yang lebih banyak gejala cocok
        return b.matchedSymptoms.length - a.matchedSymptoms.length;
      }
      return b.confidence - a.confidence;
    });
  }

  // Identifikasi faktor risiko tambahan
  private getRiskFactors(disease: DiseaseRule, symptoms: Symptom[]): string[] {
    const riskFactors: string[] = [];
    
    // Contoh logic untuk faktor risiko
    symptoms.forEach(symptom => {
      if (symptom.value > 80) {
        riskFactors.push(`Gejala ${symptom.name} dengan intensitas sangat tinggi`);
      }
      if (symptom.duration && symptom.duration > 30) {
        riskFactors.push(`Gejala ${symptom.name} berlangsung kronik (>30 hari)`);
      }
    });
    
    return riskFactors;
  }

  // Generate rekomendasi berdasarkan confidence
  private getRecommendations(disease: DiseaseRule, confidence: number): string[] {
    const recommendations: string[] = [];
    
    if (confidence > 80) {
      recommendations.push("Segera konsultasi dengan dokter spesialis");
      recommendations.push("Lakukan pemeriksaan penunjang jika diperlukan");
    } else if (confidence > 60) {
      recommendations.push("Konsultasi dengan dokter umum");
      recommendations.push("Monitor perkembangan gejala");
    } else if (confidence > 40) {
      recommendations.push("Observasi gejala lebih lanjut");
      recommendations.push("Konsultasi jika gejala memburuk");
    } else {
      recommendations.push("Istirahat yang cukup dan pola hidup sehat");
      recommendations.push("Konsultasi jika gejala berlanjut");
    }
    
    return recommendations;
  }

  // Method untuk debugging dan tuning
  public debugDiagnosis(symptoms: Symptom[], diseaseName?: string): any {
    const results = this.diagnose(symptoms);
    
    if (diseaseName) {
      const specificResult = results.find(r => r.disease === diseaseName);
      return {
        disease: diseaseName,
        result: specificResult,
        allResults: results.slice(0, 3), // Top 3 untuk perbandingan
        symptomAnalysis: symptoms.map(s => ({
          name: s.name,
          value: s.value,
          weight: s.weight,
          memberships: {
            low: this.membershipFunction(s.value, 'low'),
            medium: this.membershipFunction(s.value, 'medium'),
            high: this.membershipFunction(s.value, 'high')
          }
        }))
      };
    }
    
    return results;
  }
}