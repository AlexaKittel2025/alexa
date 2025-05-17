import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../services/userApi';

interface ProfileSettingsProps {
  currentUser: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ currentUser }) => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estados para informações do perfil
  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [location, setLocation] = useState<string>(user?.location?.city ? `${user.location.city}, ${user.location.state}` : '');
  const [website, setWebsite] = useState<string>(user?.website || '');
  const [relationship, setRelationship] = useState<string>(user?.relationship || '');
  const [work, setWork] = useState<string>(user?.work || '');
  const [education, setEducation] = useState<string>(user?.education || '');
  
  // Carregar dados iniciais
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location?.city ? `${currentUser.location.city}, ${currentUser.location.state}` : '');
      setWebsite(currentUser.website || '');
      setRelationship(currentUser.relationship || '');
      setWork(currentUser.work || '');
      setEducation(currentUser.education || '');
    }
  }, [currentUser]);
  
  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar dados do perfil para salvar
      const [city, state] = location.split(',').map(s => s.trim());
      const profileData = {
        ...user,
        displayName,
        bio,
        location: {
          city: city || '',
          state: state || ''
        },
        website,
        relationship,
        work,
        education
      };
      
      // Chamar API para salvar configurações
      const updatedUser = await userApi.updateProfile(user.id, profileData);
      
      // Atualizar o usuário no contexto e localStorage
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setMessage('Perfil atualizado com sucesso!');
        
        // Limpar a mensagem após alguns segundos
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage('Erro ao salvar o perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.includes('sucesso') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Nome de exibição */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome de exibição
              </label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Localização */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Localização
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cidade, Estado"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Status de relacionamento */}
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status de relacionamento
              </label>
              <input
                type="text"
                name="relationship"
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Trabalho */}
            <div>
              <label htmlFor="work" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Trabalho
              </label>
              <input
                type="text"
                name="work"
                id="work"
                value={work}
                onChange={(e) => setWork(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Educação */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Educação
              </label>
              <input
                type="text"
                name="education"
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 