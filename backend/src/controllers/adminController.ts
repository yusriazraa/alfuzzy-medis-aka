// backend/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { db } from '../database';
import { FuzzyLogicEngine } from '../services/fuzzyEngine';

// Instance engine untuk reload rules
const fuzzyEngine = new FuzzyLogicEngine();

export class AdminController {
    // --- Santri ---
    getSantri(req: Request, res: Response) { res.json(db.santri); }
    addSantri(req: Request, res: Response) {
        const newSantri = { id: Date.now(), ...req.body };
        db.santri.push(newSantri);
        res.status(201).json(newSantri);
    }
    // ... (fungsi update dan delete santri)

    // --- Fuzzy Rules ---
    getRules(req: Request, res: Response) { res.json(db.diseaseRules); }
    updateRule(req: Request, res: Response) {
        const { id } = req.params;
        const index = db.diseaseRules.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            db.diseaseRules[index] = { ...db.diseaseRules[index], ...req.body };
            fuzzyEngine.loadRules(); // Penting: Muat ulang aturan setelah diubah
            res.json(db.diseaseRules[index]);
        } else {
            res.status(404).json({ message: 'Rule not found' });
        }
    }
    // ... (fungsi add dan delete rule)

    // --- Riwayat Kesehatan ---
    getHealthRecords(req: Request, res: Response) { res.json(db.healthRecords); }

    // --- Edukasi ---
    getEducation(req: Request, res: Response) { res.json(db.education); }
    // ... (fungsi CRUD lainnya untuk edukasi)
}
