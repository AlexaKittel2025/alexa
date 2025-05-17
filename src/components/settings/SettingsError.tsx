import React from 'react';
import NotFoundContent from '../NotFoundContent';

const SettingsError: React.FC = () => {
  return (
    <NotFoundContent 
      title="Configuração não encontrada"
      message="Esta seção de configurações não existe ou ainda não foi implementada."
      backLink="/settings/profile"
      backText="Ir para Configurações de Perfil"
    />
  );
};

export default SettingsError; 