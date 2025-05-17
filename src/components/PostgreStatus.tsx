'use client';

import React, { useEffect, useState } from 'react';

type PostgreStatusState = 'loading' | 'connected' | 'error';

const PostgreStatus: React.FC = () => {
  const [status, setStatus] = useState<PostgreStatusState>('loading');
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('loading');
        
        const response = await fetch('/api/db-test');
        const data = await response.json();
        
        if (data.error) {
          setStatus('error');
          setError(data.error);
        } else {
          setStatus('connected');
          setVersion(data.version);
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    checkConnection();
  }, []);

  const statusColors = {
    loading: 'bg-yellow-500',
    connected: 'bg-green-500',
    error: 'bg-red-500'
  };

  const statusMessages = {
    loading: 'Conectando...',
    connected: 'Conectado',
    error: 'Erro na conexão'
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">🐘</span>
          Status do PostgreSQL
        </h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${statusColors[status]} mr-2`}></div>
          <span className="text-sm font-medium">{statusMessages[status]}</span>
        </div>
      </div>
      
      {status === 'connected' && version && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="mb-1"><span className="font-medium">Versão:</span> {version}</p>
          <p className="text-green-600">
            Banco de dados PostgreSQL está conectado e funcionando corretamente.
          </p>
        </div>
      )}
      
      {status === 'error' && error && (
        <div className="mt-2 text-sm text-red-600">
          <p className="font-medium mb-1">Erro:</p>
          <p className="bg-red-50 p-2 rounded border border-red-200 overflow-auto">
            {error}
          </p>
          <p className="mt-2">
            Verifique se as variáveis de ambiente para PostgreSQL estão configuradas corretamente.
          </p>
        </div>
      )}
      
      {status === 'loading' && (
        <div className="animate-pulse mt-2 flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostgreStatus; 