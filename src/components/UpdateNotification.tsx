import React, { useState } from 'react';
import { RefreshIcon as RefreshIcon } from '@heroicons/react/outline';

interface UpdateNotificationProps {
  onUpdate: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onUpdate }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="flex items-center">
        <RefreshIcon className="h-5 w-5 mr-2" />
        <div>
          <p className="font-medium">Nova atualização disponível!</p>
          <p className="text-sm mt-1">Reinicie para obter a versão mais recente.</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <button 
          onClick={handleDismiss}
          className="text-white text-sm bg-transparent hover:bg-white/10 px-2 py-1 rounded"
        >
          Depois
        </button>
        <button 
          onClick={onUpdate}
          className="text-white text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
        >
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification; 