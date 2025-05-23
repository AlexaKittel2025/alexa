import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Página não encontrada</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">A página que você está procurando não existe.</p>
        <Link 
          href="/"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}