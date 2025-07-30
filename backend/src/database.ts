// backend/src/database.ts

// Tipe Data
export interface Santri {
    id: number;
    name: string;
    age: number;
    gender: 'Laki-laki' | 'Perempuan';
    class: string;
}

export interface DiseaseRule {
    id: number;
    name: string;
    symptoms: string[];
    severity: 'ringan' | 'sedang' | 'berat';
}

export interface HealthRecord {
    id: number;
    santriName: string;
    diagnosis: string;
    confidence: number;
    timestamp: string;
}

export interface EducationContent {
    id: number;
    title: string;
    content: string;
    category: string;
}

// In-Memory Database
let santriData: Santri[] = [
    { id: 1, name: 'Ahmad Yusuf', age: 15, gender: 'Laki-laki', class: 'IX A' },
    { id: 2, name: 'Fatimah Azzahra', age: 16, gender: 'Perempuan', class: 'X B' },
];

let diseaseRulesData: DiseaseRule[] = [
    { id: 1, name: 'ISPA', symptoms: ['batuk', 'pilek', 'sakit_tenggorokan', 'sesak_napas', 'suhu_tinggi'], severity: 'sedang' },
    { id: 2, name: 'Common Cold', symptoms: ['pilek', 'bersin', 'batuk', 'sakit_tenggorokan'], severity: 'ringan' },
    { id: 3, name: 'Scabies (Kudis)', symptoms: ['gatal_malam_hari', 'ruam_kulit', 'bintik_merah', 'luka_garukan'], severity: 'sedang' },
];

let healthRecordsData: HealthRecord[] = [
    { id: 1, santriName: 'Ahmad Yusuf', diagnosis: 'Common Cold', confidence: 85.5, timestamp: new Date().toISOString() },
];

let educationData: EducationContent[] = [
    { id: 1, title: 'Pentingnya Cuci Tangan', content: 'Mencuci tangan dengan sabun adalah cara termudah untuk mencegah penyebaran kuman...', category: 'Kebersihan' },
    { id: 2, title: 'Gizi Seimbang untuk Santri', content: 'Asupan gizi yang seimbang penting untuk menjaga energi dan konsentrasi saat belajar...', category: 'Gizi' },
];

// Ekspor data dan fungsi untuk memanipulasinya
export const db = {
    santri: santriData,
    diseaseRules: diseaseRulesData,
    healthRecords: healthRecordsData,
    education: educationData,
};
