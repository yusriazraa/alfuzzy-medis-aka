// backend/src/controllers/diagnosisController.ts
import { Request, Response } from 'express';
import { FuzzyLogicEngine, Symptom } from '../services/fuzzyEngine';

export class DiagnosisController {
  private fuzzyEngine: FuzzyLogicEngine;

  constructor() {
    this.fuzzyEngine = new FuzzyLogicEngine();
  }

  public async diagnose(req: Request, res: Response): Promise<void> {
    try {
      const { symptoms, patientInfo } = req.body;

      if (!symptoms || !Array.isArray(symptoms)) {
        res.status(400).json({ error: 'Gejala tidak valid' });
        return;
      }

      const results = this.fuzzyEngine.diagnose(symptoms as Symptom[]);

      res.json({
        success: true,
        data: {
          patientInfo,
          diagnosis: results,
          timestamp: new Date().toISOString(),
          recommendations: this.generateRecommendations(results)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations: string[] = [];
    
    if (results.length > 0) {
      const topResult = results[0];
      
      if (topResult.confidence > 70) {
        recommendations.push(`Segera konsultasi dengan petugas kesehatan pesantren`);
        recommendations.push(`Istirahat yang cukup dan minum air putih`);
      } else if (topResult.confidence > 40) {
        recommendations.push(`Pantau perkembangan gejala`);
        recommendations.push(`Jaga kebersihan dan pola makan`);
      } else {
        recommendations.push(`Gejala masih ringan, tetap jaga kesehatan`);
      }
    }

    return recommendations;
  }
}