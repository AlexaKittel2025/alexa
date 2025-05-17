// Utilidades para manipulação de usuários

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }
  return null;
};

export const isOwnProfile = (username: string): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.username === username;
};

export const getUserProfileLink = (username: string): string => {
  if (isOwnProfile(username)) {
    return '/meu-perfil';
  }
  return `/usuario/${username}`;
};