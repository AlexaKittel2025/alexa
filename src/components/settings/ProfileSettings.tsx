import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../services/userApi';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { Camera } from '@heroicons/react/24/outline';

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
  
  // Estados para upload de imagem
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.photoURL || currentUser?.photoURL || '');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(user?.coverImage || currentUser?.coverImage || '');
  
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
      setAvatarPreview(currentUser.photoURL || '');
      setCoverPreview(currentUser.coverImage || '');
    }
  }, [currentUser]);

  // Funções de manipulação de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setMessage('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('A imagem deve ter no máximo 5MB.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(reader.result as string);
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'avatar' | 'cover') => {
    if (type === 'avatar') {
      setAvatarFile(null);
      setAvatarPreview(user?.photoURL || '');
    } else {
      setCoverFile(null);
      setCoverPreview(user?.coverImage || '');
    }
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      let newAvatarUrl = user.photoURL;
      let newCoverUrl = user.coverImage;
      
      // Upload de imagens se houver arquivos selecionados
      if (avatarFile) {
        // Para demonstração, vamos salvar como base64 no localStorage
        newAvatarUrl = avatarPreview;
      }
      
      if (coverFile) {
        // Para demonstração, vamos salvar como base64 no localStorage
        newCoverUrl = coverPreview;
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
        education,
        photoURL: newAvatarUrl,
        coverImage: newCoverUrl
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

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Foto de perfil
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={avatarPreview || user?.avatar || '/images/avatar-placeholder.jpg'}
                    alt="Avatar preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'avatar')}
                      className="hidden"
                    />
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(user?.photoURL || '');
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagem de capa
              </label>
              <div className="mt-2">
                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {(coverPreview || user?.coverImage) && (
                    <img
                      src={coverPreview || user?.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer hover:bg-opacity-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'cover')}
                      className="hidden"
                    />
                    <div className="text-white text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2" />
                      <span>{coverPreview || user?.coverImage ? 'Alterar capa' : 'Adicionar capa'}</span>
                    </div>
                  </label>
                </div>
                {coverFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(user?.coverImage || '');
                    }}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    Remover capa
                  </button>
                )}
              </div>
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