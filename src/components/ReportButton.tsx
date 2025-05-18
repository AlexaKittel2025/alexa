;

;
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';interface ReportButtonProps {
  postId: string;
  onReport: (postId: string, reason: string) => void;
}

const REPORT_REASONS = [
  'Mentira perigosa',
  'Zoou demais',
  'Fake news séria',
  'Conteúdo ofensivo',
  'Quebra as regras da comunidade'
];

const ReportButton: React.FC<ReportButtonProps> = ({ postId, onReport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleReport = () => {
    if (reason) {
      onReport(postId, reason);
      setIsModalOpen(false);
      setReason('');
    }
  };

  return (
    <>
      <button
        className="flex items-center text-gray-500 hover:text-red-500"
        onClick={() => setIsModalOpen(true)}
      >
        <ExclamationCircleIcon className="h-5 w-5 mr-1" />
        <span>Denunciar</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Denunciar Mentira</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Fechar modal"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Por que você está denunciando esta mentira?
            </p>
            
            <div className="space-y-3 mb-6">
              {REPORT_REASONS.map((reportReason, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    value={reportReason}
                    checked={reason === reportReason}
                    onChange={() => setReason(reportReason)}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-200">{reportReason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleReport}
                disabled={!reason}
              >
                Denunciar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton; 