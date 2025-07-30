// frontend/src/app/page.tsx
import DiagnosisForm from '@/components/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="text-center py-20 bg-white">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          Pantau kesehatan santri secara cepat dan akurat
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sistem digital untuk screening gejala, diagnosa otomatis dan pencatatan riwayat kesehatan santri di lingkungan pesantren al-kautsar 561.
        </p>
      </section>

      {/* Keunggulan Fitur Utama */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Keunggulan Fitur Utama</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Screening Gejala Mandiri</h3>
              <p className="text-gray-600">Santri dapat memasukkan gejala yang mereka rasakan untuk mendapatkan diagnosis awal secara mandiri.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Diagnosis Otomatis</h3>
              <p className="text-gray-600">Sistem akan memberikan hasil diagnosis berdasarkan logika fuzzy yang telah diatur oleh admin.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-green-700 mb-2">Riwayat Pemeriksaan</h3>
              <p className="text-gray-600">Semua hasil screening akan tersimpan dan dapat diakses kembali oleh santri dan orang tua.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Penyakit yang Dapat Dideteksi */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Penyakit yang Dapat Dideteksi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-lg text-gray-700">Penyakit Saluran Pernapasan</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>ISPA</li>
                <li>Faringitis</li>
                <li>Common Cold</li>
                <li>Parotitis</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-lg text-gray-700">Penyakit Akibat Virus</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Herpes</li>
                <li>Konjungtivitis</li>
                <li>Influenza</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-lg text-gray-700">Penyakit Akibat Infeksi Kulit</h4>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                <li>Dermatitis</li>
                <li>Scabies</li>
                <li>Stomatitis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">FAQ</h2>
          </div>
          <div className="space-y-4">
            <details className="p-4 bg-white rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">Bagaimana cara kerja sistem ini?</summary>
              <p className="mt-2 text-gray-600">Sistem ini menggunakan logika fuzzy untuk menganalisis gejala yang Anda masukkan dan memberikan kemungkinan diagnosis penyakit.</p>
            </details>
            <details className="p-4 bg-white rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">Apakah diagnosis dari sistem ini 100% akurat?</summary>
              <p className="mt-2 text-gray-600">Tidak, sistem ini hanya memberikan diagnosis awal. Untuk diagnosis yang lebih akurat, silakan konsultasikan dengan tenaga medis.</p>
            </details>
            <details className="p-4 bg-white rounded-lg shadow">
              <summary className="font-semibold cursor-pointer">Siapa saja yang dapat melihat data kesehatan saya?</summary>
              <p className="mt-2 text-gray-600">Data kesehatan Anda hanya dapat dilihat oleh Anda sendiri, orang tua/wali, dan admin yang berwenang.</p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}