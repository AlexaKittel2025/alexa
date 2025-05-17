import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useDarkMode = () => {
  // Inicializar com um valor padrão para evitar erros de hidratação
  const [theme, setTheme] = useState<Theme>('light');
  
  // Detectar preferências de tema somente após a montagem do componente (lado do cliente)
  useEffect(() => {
    // Verificar armazenamento local ou preferências do sistema
    const savedTheme = localStorage.getItem('theme') as Theme;
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Definir tema inicial
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (userPrefersDark) {
      setTheme('dark');
    }
  }, []);

  // Aplicar classes ao elemento HTML quando o tema mudar
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}; 