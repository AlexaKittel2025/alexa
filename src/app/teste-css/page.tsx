'use client';

export default function TesteCSSPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-purple-600">Teste de CSS e Tailwind</h1>
      
      <div className="space-y-8">
        {/* Teste básico de Tailwind */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Classes Tailwind Básicas</h2>
          <div className="flex gap-4">
            <div className="p-4 bg-blue-500 text-white rounded">Blue Box</div>
            <div className="p-4 bg-red-500 text-white rounded">Red Box</div>
            <div className="p-4 bg-green-500 text-white rounded">Green Box</div>
          </div>
        </section>

        {/* Teste de classes customizadas */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Classes Customizadas</h2>
          <div className="space-y-4">
            <button className="btn btn-primary">Botão Primário</button>
            <button className="btn btn-secondary">Botão Secundário</button>
            <button className="btn btn-gradient">Botão Gradiente</button>
            <button className="btn btn-outline">Botão Outline</button>
          </div>
        </section>

        {/* Teste de cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards e Containers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="text-lg font-medium mb-2">Card Normal</h3>
              <p>Conteúdo do card com classe .card</p>
            </div>
            <div className="card card-hover">
              <h3 className="text-lg font-medium mb-2">Card com Hover</h3>
              <p>Este card tem efeito hover</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
              <h3 className="text-lg font-medium mb-2">Card Tailwind</h3>
              <p>Card usando apenas Tailwind</p>
            </div>
          </div>
        </section>

        {/* Teste de dark mode */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Dark Mode</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-900 dark:text-gray-100">
              Este texto muda de cor no dark mode
            </p>
          </div>
        </section>

        {/* Teste de formulários */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Formulários</h2>
          <div className="max-w-md">
            <label className="form-label">Exemplo de Input</label>
            <input type="text" className="form-input" placeholder="Digite algo..." />
          </div>
        </section>

        {/* Teste de navegação */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Navegação</h2>
          <nav className="flex gap-2">
            <a href="#" className="nav-link">Link Normal</a>
            <a href="#" className="nav-link-active">Link Ativo</a>
          </nav>
        </section>
      </div>
    </div>
  );
}