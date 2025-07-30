// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DiagnosisController } from './controllers/diagnosisController';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers
const diagnosisController = new DiagnosisController();

// Routes
app.post('/api/diagnose', diagnosisController.diagnose.bind(diagnosisController));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Alkausar Health Detection API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});