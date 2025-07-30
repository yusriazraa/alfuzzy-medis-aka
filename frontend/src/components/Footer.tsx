// frontend/src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2024 AlFuzzy Medis - Pesantren Al-Kautsar 561. Semua Hak Cipta Dilindungi.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-green-400">Facebook</a>
          <a href="#" className="hover:text-green-400">Instagram</a>
          <a href="#" className="hover:text-green-400">Website</a>
        </div>
      </div>
    </footer>
  );
}