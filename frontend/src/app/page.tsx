// frontend/src/app/page.tsx
import DiagnosisForm from '@/components/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <DiagnosisForm />
    </main>
  );
}