'use client';

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Conta</h2>
          <div className="space-y-4">
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Editar perfil
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Alterar senha
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Configurações de privacidade
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Preferências</h2>
          <div className="space-y-4">
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Notificações
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Tema e exibição
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Idioma
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Sobre</h2>
          <div className="space-y-4">
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Central de ajuda
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Termos de uso
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 rounded">
              Política de privacidade
            </button>
          </div>
        </div>
        
        <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-medium">
          Sair
        </button>
      </div>
    </div>
  );
}