export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Teste de Estilos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Card com Classe</h2>
            <p className="text-gray-600 dark:text-gray-400">Este card usa a classe .card do CSS global</p>
            <button className="btn-primary mt-4">Botão Primário</button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-xl font-semibold mb-4">Card com Tailwind Puro</h2>
            <p className="text-gray-600 dark:text-gray-400">Este card usa apenas classes do Tailwind</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md mt-4">Botão Tailwind</button>
          </div>
          
          <div className="card-hover">
            <h2 className="text-xl font-semibold mb-4">Card com Hover</h2>
            <p className="text-gray-600 dark:text-gray-400">Este card tem efeito hover especial</p>
            <button className="btn-gradient mt-4">Botão Gradiente</button>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Testes de Estilos Aplicados</h2>
          <ul className="space-y-2 text-white">
            <li>✓ Tailwind Base Classes: bg-*, text-*, p-*, etc.</li>
            <li>✓ Custom Components: .card, .btn-primary, .btn-gradient</li>
            <li>✓ Dark Mode: Classes dark:*</li>
            <li>✓ Animations: animate-pulse, hover effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
