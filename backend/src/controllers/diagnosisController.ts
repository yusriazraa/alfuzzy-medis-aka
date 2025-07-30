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
      
      if (topResult.severity === 'berat' && topResult.confidence > 50) {
        recommendations.push(`Gejala mengindikasikan kondisi serius. Segera hubungi petugas kesehatan pesantren secepatnya!`);
        recommendations.push(`Hindari kontak dengan santri lain untuk mencegah penularan.`);
      } else if (topResult.confidence > 70) {
        recommendations.push(`Segera konsultasi dengan petugas kesehatan pesantren untuk pemeriksaan lebih lanjut.`);
        recommendations.push(`Perbanyak istirahat dan minum air putih yang cukup.`);
      } else if (topResult.confidence > 40) {
        recommendations.push(`Pantau terus perkembangan gejala Anda.`);
        recommendations.push(`Jaga kebersihan diri dan lingkungan, serta pastikan asupan makanan bergizi.`);
      } else {
        recommendations.push(`Gejala yang Anda rasakan masih tergolong ringan. Tetap jaga kesehatan dan pola hidup sehat.`);
      }
    } else {
      recommendations.push(`Tidak ada diagnosis yang cocok dengan gejala Anda. Tetap pantau kesehatan.`);
    }

    return recommendations;
  }
}