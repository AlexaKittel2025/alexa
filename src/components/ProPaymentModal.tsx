;

;
import { ClipboardIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';interface ProPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProPaymentModal: React.FC<ProPaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText("mentei-app@exemplo.com");
    alert("Chave PIX copiada para a área de transferência!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <XIcon className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Torne-se PRO!</h2>
          <p className="text-gray-600 dark:text-gray-300">Desbloqueie recursos exclusivos por apenas R$10,00/mês</p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2 text-center dark:text-white">Pagamento via PIX</h3>
          <div className="flex justify-center mb-3">
            <div className="bg-white p-3 rounded-lg inline-block">
              <img src="https://via.placeholder.com/150x150?text=QR+Code" alt="QR Code PIX" className="w-32 h-32" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ou copie a chave PIX:</p>
            <div className="flex items-center justify-center">
              <input 
                type="text" 
                value="mentei-app@exemplo.com" 
                readOnly 
                className="text-sm border rounded py-1 px-2 bg-gray-50 dark:bg-gray-600 dark:text-white w-48"
              />
              <button 
                className="ml-2 p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                onClick={handleCopyPix}
              >
                <ClipboardIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Após o pagamento, envie o comprovante para <strong>suporte@mentei.app</strong> para ativação
        </p>
        
        <div className="flex justify-center">
          <button 
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-md text-gray-800 dark:text-white font-medium"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProPaymentModal; 