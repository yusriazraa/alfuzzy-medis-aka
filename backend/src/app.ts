// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DiagnosisController } from './controllers/diagnosisController';
import { AdminController } from './controllers/adminController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const diagnosisController = new DiagnosisController();
const adminController = new AdminController();

// --- Routes ---
// Diagnosis
app.post('/api/diagnose', diagnosisController.diagnose.bind(diagnosisController));
app.get('/api/health', (req, res) => res.json({ message: 'API is running!' }));

// Admin - Santri
app.get('/api/admin/santri', adminController.getSantri);
app.post('/api/admin/santri', adminController.addSantri);

// Admin - Fuzzy Rules
app.get('/api/admin/rules', adminController.getRules);
app.put('/api/admin/rules/:id', adminController.updateRule);

// Admin - Riwayat & Edukasi
app.get('/api/admin/riwayat', adminController.getHealthRecords);
app.get('/api/admin/edukasi', adminController.getEducation);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
