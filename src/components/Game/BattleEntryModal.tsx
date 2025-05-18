'use client';

import { useState } from 'react';
import { FaTimes, FaFire, FaInfoCircle } from 'react-icons/fa';

interface BattleEntryModalProps {
  onClose: () => void;
  onSubmit: (content: string, imageUrl?: string) => void;
}

export default function BattleEntryModal({ 
  onClose, 
  onSubmit
}: BattleEntryModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Por favor, escreva sua mentira!');
      return;
    }

    if (content.length < 10) {
      setError('Sua mentira deve ter pelo menos 10 caracteres!');
      return;
    }

    if (content.length > 500) {
      setError('Sua mentira não pode ter mais de 500 caracteres!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
      onClose();
    } catch (error) {
      setError('Erro ao enviar sua mentira. Tente novamente!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaFire className="text-orange-500 mr-2" />
            Participar da Batalha
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Regras */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2" />
            Regras da Batalha
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Você só pode participar 1 vez por batalha</li>
            <li>• Escreva a mentira mais criativa e absurda que conseguir</li>
            <li>• Sua mentira competirá com outra aleatória</li>
            <li>• Outros usuários votarão na melhor mentira</li>
            <li>• Batalhas são decididas pelos votos</li>
          </ul>
        </div>

        {/* Campo de texto */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Escreva sua mentira épica:
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            placeholder="Ex: Ontem eu salvei o mundo de uma invasão alienígena usando apenas um clips e um elástico..."
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {content.length}/500 caracteres
            </span>
            {error && (
              <span className="text-xs text-red-500">{error}</span>
            )}
          </div>
          
          {/* Campo de URL da imagem */}
          <label className="block text-gray-700 font-medium mb-2 mt-4">
            URL da imagem (opcional):
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <FaFire className="mr-2" />
                Apostar na Batalha
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}