// Este script é injetado no HTML para evitar flash de tema incorreto
// Ele define o tema (claro/escuro) antes do React renderizar

(function() {
  // Verificar preferência salva
  const savedTheme = localStorage.getItem('theme');
  
  // Verificar preferência do sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Aplicar tema salvo ou preferência do sistema
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();