'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if it's a ChunkLoadError
    if (error.message?.includes('ChunkLoadError') || error.message?.includes('Loading chunk')) {
      // Clear cache and reload the page
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar a aplicação.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Recarregar página
        </button>
      </div>
    </div>
  );
}