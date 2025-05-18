;

;
import { BellIcon, BookmarkIcon, BriefcaseIcon, CalendarIcon, CameraIcon, ChatAlt2Icon, DotsHorizontalIcon, EmojiHappyIcon, HeartIcon, LinkIcon, LocationMarkerIcon, PaperAirplaneIcon, PencilIcon, PhotographIcon, RefreshIcon, ShareIcon, ShieldCheckIcon, UserAddIcon, UserRemoveIcon, XIcon } from '@heroicons/react/outline';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockPosts, mockUsers } from '../services/mockData';
import { Post as PostType, User, Storyment, ReactionType, JudgementType } from '../types';
import Post from '../components/Post';
import ProfileStats from '../components/ProfileStats';
import ProBadge from '../components/ProBadge';
import { getCurrentUserProStatus } from '../services/userService';import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { Crop } from 'react-image-crop';
import { updateUserInfo } from '../services/userService';
import { useCurrentUser } from '../hooks/useCurrentUser';
import PostsTab from '../components/profile/PostsTab';
import MediaTab from '../components/profile/MediaTab';
import BattlesTab from '../components/profile/BattlesTab';
import AboutTab from '../components/profile/AboutTab';

// Componente de Chat Flutuante
const FloatingChat: React.FC<{
  user: User;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{id: string; text: string; sender: 'user' | 'me'; timestamp: Date}[]>([
    {
      id: '1',
      text: `Olá! Sou ${user.displayName}. Como posso te ajudar?`,
      sender: 'user',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Adicionar mensagem do usuário atual
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date()
    }]);
    
    setMessage('');
    
    // Simular resposta após um pequeno delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Responderemos em breve.',
        sender: 'user',
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  // Rolar para o final quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 flex flex-col h-[60vh] max-h-[500px]">
      {/* Cabeçalho do chat */}
      <div className="bg-primary p-3 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={user.photoURL || "https://via.placeholder.com/40"} 
            alt={user.displayName}
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-medium text-sm">{user.displayName}</h3>
            <p className="text-xs opacity-80">@{user.username}</p>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
          onClick={onClose}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-2 px-3 ${
                msg.sender === 'me' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Área de input */}
      <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <EmojiHappyIcon className="h-5 w-5" />
        </button>
        <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
          <PhotographIcon className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          className="p-2 bg-primary text-white rounded-full hover:bg-opacity-90"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Componente para o modal de seguidores/seguindo
const UserListModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  title: string;
}> = ({ isOpen, onClose, users, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Fechar modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              {title === "Seguidores" 
                ? "Você ainda não tem seguidores." 
                : "Você ainda não segue ninguém."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <li key={user.id} className="py-4">
                  <Link 
                    to={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <img 
                      src={user.photoURL || "https://via.placeholder.com/40"} 
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-primary text-white text-sm rounded-full hover:bg-opacity-90">
                      Seguir
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal para edição de imagem (avatar e capa)
const ImageEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageData: string) => void;
  title: string;
  aspectRatio?: number;
  circularCrop?: boolean;
}> = ({ isOpen, onClose, onSave, title, aspectRatio, circularCrop = false }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const getCroppedImg = () => {
    if (!imageRef.current || !crop.width || !crop.height) return;
    
    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    
    canvas.width = circularCrop ? cropWidth : cropWidth;
    canvas.height = circularCrop ? cropHeight : cropHeight;
    
    if (circularCrop) {
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2,
        0,
        2 * Math.PI
      );
      ctx.clip();
    }
    
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    
    return canvas.toDataURL('image/jpeg');
  };
  
  const handleSave = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      onSave(croppedImage);
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Fechar modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <CameraIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Selecione uma imagem para {title.toLowerCase()}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 cursor-pointer"
            >
              Selecionar imagem
            </label>
          </div>
        ) : (
          <div className="flex-1 overflow-auto flex flex-col items-center">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              circularCrop={circularCrop}
            >
              <img
                src={selectedImage}
                alt="Preview"
                ref={imageRef}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </ReactCrop>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Selecionar outra
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para o modal de nível
const LevelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  level: number;
}> = ({ isOpen, onClose, level }) => {
  // Informações sobre os níveis
  const levelInfo = [
    { level: 1, title: "Iniciante", description: "Você está começando sua jornada como mentiroso. Complete conquistas para subir de nível." },
    { level: 2, title: "Aprendiz", description: "Você já sabe o básico da arte de mentir. Continue criando histórias criativas." },
    { level: 3, title: "Contador de Histórias", description: "Suas mentiras estão ficando mais elaboradas e convincentes." },
    { level: 4, title: "Fabulista", description: "Você já consegue criar histórias complexas que enganam muitas pessoas." },
    { level: 5, title: "Mitômano", description: "Suas mentiras são indistinguíveis da realidade. Você é um mentiroso de alto nível." },
    { level: 10, title: "Lendário", description: "Você é uma lenda viva entre os mentirosos. Suas histórias são referência para todos." },
    { level: 15, title: "Mestre das Ilusões", description: "O mais alto nível. Você transcendeu a arte de mentir." }
  ];

  // Encontrar informações do nível atual ou do nível mais próximo (se não houver informação exata)
  const getCurrentLevelInfo = () => {
    // Tentar encontrar o nível exato
    const exactLevel = levelInfo.find(info => info.level === level);
    if (exactLevel) return exactLevel;

    // Se não encontrar, pegar o nível anterior mais próximo
    const previousLevels = levelInfo.filter(info => info.level < level).sort((a, b) => b.level - a.level);
    if (previousLevels.length > 0) return previousLevels[0];

    // Se nada for encontrado, retornar o nível 1
    return levelInfo[0];
  };

  const currentLevelInfo = getCurrentLevelInfo();
  const nextLevelInfo = levelInfo.find(info => info.level > level);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Seu Nível de Mentiroso
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Fechar modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {level}
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {currentLevelInfo.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentLevelInfo.description}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${Math.min(((level % 5) / 5) * 100, 100)}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {nextLevelInfo ? `Próximo nível: ${nextLevelInfo.title} (Nível ${nextLevelInfo.level})` : "Nível máximo alcançado"}
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Como subir de nível?
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Crie mentiras criativas e originais
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Receba reações de "Quase Acreditei" e "Mentira Épica"
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Vença batalhas de mentiras
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Complete conquistas especiais
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Modal para editar informações pessoais
const PersonalInfoEditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedInfo: {
    bio?: string;
    occupation?: string;
    location?: { city: string; state: string };
  }) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
  const [bio, setBio] = useState(user?.bio || '');
  const [occupation, setOccupation] = useState('Mentiroso Profissional');
  const [city, setCity] = useState(() => {
    return typeof user?.location === 'object' 
      ? (user.location as { city: string; state: string }).city || '' 
      : '';
  });
  const [state, setState] = useState(() => {
    return typeof user?.location === 'object' 
      ? (user.location as { city: string; state: string }).state || '' 
      : '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      bio,
      occupation,
      location: {
        city,
        state
      }
    });
    
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar Informações Pessoais
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Fechar modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                rows={3}
                maxLength={160}
                placeholder="Conte um pouco sobre você..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {bio.length}/160
              </p>
            </div>
            
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ocupação
              </label>
              <input
                type="text"
                id="occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Sua ocupação"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Sua cidade"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Seu estado"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente do Modal de Edição de Perfil
const ProfileEditModal = ({
  isOpen,
  onClose,
  user,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userData: any) => void;
}) => {
  // Estado para cada campo do formulário
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [relationship, setRelationship] = useState('');
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');

      // Tratar location que pode ser string ou objeto
      let locationText = '';
      if (user.location) {
        if (typeof user.location === 'string') {
          locationText = user.location;
        } else {
          const locationObj = user.location as {city: string; state: string};
          locationText = `${locationObj.city || ''}, ${locationObj.state || ''}`.trim();
          // Remover vírgula se só tiver cidade ou estado
          locationText = locationText.replace(/^,\s*/, '').replace(/,\s*$/, '');
        }
      }
      setLocation(locationText);
      
      // Tratar website e telefone
      setWebsite(user.website || '');
      setPhone(user.phone || '');
      
      // Novos campos
      if (user.birthDate) {
        // Formatar data para o formato esperado pelo input type="date" (YYYY-MM-DD)
        const date = new Date(user.birthDate);
        const formattedDate = date.toISOString().split('T')[0];
        setBirthDate(formattedDate);
      }
      
      setGender(user.gender || '');
      setRelationship(user.relationship || '');
      setEducation(user.education || '');
      setOccupation(user.work || '');
      setCompany((user as any).company || '');
    }
  }, [user]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Processar localização
    let locationObj = null;
    if (location) {
      const parts = location.split(',').map(part => part.trim());
      if (parts.length === 2) {
        locationObj = {
          city: parts[0],
          state: parts[1]
        };
      } else {
        locationObj = {
          city: location,
          state: ''
        };
    }
    }
    
    // Processar data de nascimento
    let parsedBirthDate = null;
    if (birthDate) {
      parsedBirthDate = new Date(birthDate).toISOString();
    }
    
    onSave({
      displayName,
      username,
      email,
      bio,
      location: locationObj,
      website,
      phone,
      birthDate: parsedBirthDate,
      gender,
      relationship,
      education,
      work: occupation,
      company: company as any
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Editar Perfil</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="border-b mb-6">
            <div className="px-4 py-2 font-medium border-b-2 border-blue-500 text-blue-500 inline-block">
              Informações Pessoais
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Seu nome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome de usuário
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md"
                    placeholder="Nome de usuário"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="(99) 99999-9999"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Prefiro não informar</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado civil
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Prefiro não informar</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                  <option value="namorando">Namorando</option>
                  <option value="relacionamentoAberto">Em um relacionamento aberto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografia
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  maxLength={160}
                    placeholder="Conte um pouco sobre você"
                  />
                <p className="text-xs text-gray-500 text-right mt-1">
                  Breve descrição para seu perfil. Máximo de 160 caracteres.
                </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Cidade, Estado"
                  />
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    value={website ? website.replace(/^https?:\/\//, '') : ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md"
                    placeholder="www.exemplo.com"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trabalho e Educação</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ocupação
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Sua ocupação atual"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Onde você trabalha"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Educação
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Sua formação educacional"
                    />
                  </div>
                </div>
              </div>
              </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  
  // Usar o novo hook personalizado para gerenciar o usuário
  const { 
    user, 
    loading, 
    error, 
    updateUser, 
    fetchUserData, 
    formatCreatedAt,
    defaultBio 
  } = useCurrentUser();
  
  const [posts, setPosts] = useState<PostType[]>([]);
  const [stories, setStories] = useState<Storyment[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'sobre' | 'midia' | 'batalhas'>('posts');
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [showAvatarEditModal, setShowAvatarEditModal] = useState(false);
  const [showCoverEditModal, setShowCoverEditModal] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{city: string; state: string} | null>(null);
  const [userOccupation, setUserOccupation] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  // Carregar posts do usuário
  useEffect(() => {
    if (user?.id) {
        // Filtrar posts do usuário atual dos mockPosts
      const userPosts = mockPosts.filter(post => post.userId === user.id || post.user_id === user.id);
      
        setPosts(userPosts);
        
        // Verificar status PRO
      getCurrentUserProStatus(user.id).then(proStatus => {
          setIsPro(proStatus);
      });
      
      // Verificar se é o perfil do usuário logado
      setIsCurrentUserProfile(currentUser?.id === user.id);
        
        // Simulação de seguidores e seguindo
        const mockFollowers = mockUsers
        .filter(u => u.id !== user.id)
        .slice(0, user.followers || 0);
        
        const mockFollowing = mockUsers
        .filter(u => u.id !== user.id)
        .slice(0, user.following || 0);
        
        setFollowers(mockFollowers);
        setFollowing(mockFollowing);
      
      // Configurar localização do usuário se disponível
      if (typeof user.location === 'object' && user.location) {
        setUserLocation(user.location);
      } else if (user.city && user.state) {
        setUserLocation({ city: user.city, state: user.state });
      }
      
      // Configurar ocupação do usuário
      setUserOccupation(user.work || null);
    }
  }, [user?.id, currentUser?.id]);

  // Corrigido para usar interfaces adequadas e tipos corretos
  interface ReactionCounts {
    quaseAcreditei: number;
    hahaha: number;
    mentiraEpica: number;
    [key: string]: number;
  }

  interface UserReactionsMap {
    [userId: string]: string;
  }

  interface JudgementCounts {
    crivel: number;
    inventiva: number;
    totalmentePirada: number;
    [key: string]: number;
  }

  interface UserJudgementsMap {
    [userId: string]: string;
  }

  // Função corrigida para usar tipagem adequada
  const handleReaction = (postId: string, reactionType: ReactionType) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const userReactions = { ...post.userReactions };
          const currentUserReaction = userReactions[currentUser?.id || ''];

          // Remove reação anterior se existir
          if (currentUserReaction) {
            post.reactions[currentUserReaction as keyof typeof post.reactions]--;
            delete userReactions[currentUser?.id || ''];
          }

          // Adiciona nova reação se for diferente da anterior
          if (!currentUserReaction || currentUserReaction !== reactionType) {
            post.reactions[reactionType]++;
            userReactions[currentUser?.id || ''] = reactionType;
          }

          return {
            ...post,
            reactions: { ...post.reactions },
            userReactions
          };
        }
        return post;
      });
    });
  };
  
  // Função corrigida para usar tipagem adequada
  const handleJudgement = (postId: string, judgementType: JudgementType) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          const userJudgements = { ...post.userJudgements };
          const currentUserJudgement = userJudgements[currentUser?.id || ''];

          // Remove julgamento anterior se existir
          if (currentUserJudgement) {
            post.judgements[currentUserJudgement as keyof typeof post.judgements]--;
            delete userJudgements[currentUser?.id || ''];
          }

          // Adiciona novo julgamento se for diferente do anterior
          if (!currentUserJudgement || currentUserJudgement !== judgementType) {
            post.judgements[judgementType]++;
            userJudgements[currentUser?.id || ''] = judgementType;
          }

          return {
            ...post,
            judgements: { ...post.judgements },
            userJudgements
          };
        }
        return post;
      });
    });
  };
  
  const handleReport = (postId: string, reason: string) => {
    
    // Em uma aplicação real, aqui seria feita uma chamada à API
    alert(`Denúncia recebida: ${reason}`);
  };

  const handleFollowClick = () => {
    setIsFollowing(prev => !prev);
    
    // Atualizar contadores
    if (isFollowing) {
      if (user?.followers) {
        // Reduzir número de seguidores se já estiver seguindo
        const updatedUser = { ...user, followers: Math.max(0, user.followers - 1) };
        updateUser(updatedUser);
      }
    } else {
      if (user?.followers !== undefined) {
        // Aumentar número de seguidores
        const updatedUser = { ...user, followers: user.followers + 1 };
        updateUser(updatedUser);
      }
    }
    
    // Feedback visual para o usuário
    const action = isFollowing ? 'deixou de seguir' : 'começou a seguir';
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = `Você ${action} @${user?.username}`;
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 2000);
  };

  const handleNotificationToggle = () => {
    // Em uma implementação real, isso seria uma chamada à API
    setIsNotificationsEnabled(prev => !prev);
    
    // Feedback visual para o usuário
    const actionText = isNotificationsEnabled ? 'Notificações desativadas' : 'Notificações ativadas';
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = `${actionText} para @${user?.username}`;
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(toastElement);
    
    // Exibir e esconder a confirmação
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 2000);

  };

  const handleSendMessage = () => {
    // Em vez de redirecionar, mostrar o chat flutuante
    setShowChat(true);
    
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = `Iniciando chat com @${user?.username}`;
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(toastElement);
    
    // Exibir e esconder a confirmação
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
      }, 300);
    }, 2000);

  };
  
  const handleShareProfile = () => {
    // Compartilhar perfil (em uma implementação real, usaria a Web Share API)
    const profileUrl = window.location.href;
    
    // Simulação de compartilhamento
    navigator.clipboard.writeText(profileUrl).then(() => {
      // Feedback visual para o usuário
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = "Link do seu perfil copiado para a área de transferência";
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      document.body.appendChild(toastElement);
      
      // Exibir e esconder a confirmação
      setTimeout(() => {
        toastElement.style.opacity = "1";
      }, 100);
      
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 2000);
    });
    
    setShowOptionsMenu(false);
  };
  
  const handleBlockUser = () => {
    // Em uma implementação real, isso bloquearia o usuário via API
    // Feedback visual para o usuário
    const toastElement = document.createElement("div");
    toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium z-50";
    toastElement.textContent = `@${user?.username} foi bloqueado`;
    toastElement.style.opacity = "0";
    toastElement.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(toastElement);
    
    // Exibir e esconder a confirmação
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 100);
    
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement);
        }
        // Redirecionar para a home após bloquear
        navigate('/');
      }, 300);
    }, 2000);
    
    setShowOptionsMenu(false);
  };
  
  const handleReportUser = () => {
    // Em uma implementação real, abriria um modal de denúncia
    const reason = prompt("Por que você está denunciando este usuário?");
    
    if (reason) {
      // Feedback visual para o usuário
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = "Denúncia enviada com sucesso";
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      document.body.appendChild(toastElement);
      
      // Exibir e esconder a confirmação
      setTimeout(() => {
        toastElement.style.opacity = "1";
      }, 100);
      
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 2000);

    }
    
    setShowOptionsMenu(false);
  };

  const handleAvatarSave = (imageData: string) => {
    handleProfileUpdate({ photoURL: imageData });
    setShowAvatarEditModal(false);
  };
  
  const handleCoverSave = (imageData: string) => {
    handleProfileUpdate({ coverImage: imageData });
    setShowCoverEditModal(false);
  };

  const handlePersonalInfoSave = (updatedInfo: {
    bio?: string;
    occupation?: string;
    location?: { city: string; state: string };
  }) => {
    const updates: Partial<User> = {};
    
    if (updatedInfo.bio !== undefined) {
      updates.bio = updatedInfo.bio;
    }
    
    if (updatedInfo.occupation !== undefined) {
      updates.work = updatedInfo.occupation;
    }
    
    if (updatedInfo.location) {
      updates.location = updatedInfo.location;
    }
    
    handleProfileUpdate(updates);
    setShowPersonalInfoModal(false);
  };

  // Corrigido o tipo de retorno e manipulação do objeto retornado
  const handleProfileUpdate = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {

      // Processar o campo website para garantir formato correto
      if (userData.website && !userData.website.startsWith('http')) {
        userData.website = `https://${userData.website}`;
      }
      
      // Chama a função de atualização
      updateUser(userData);
      
      // Atualizar o estado local com as mudanças
      if (userData.location && typeof userData.location === 'object') {
        setUserLocation(userData.location);
      }
      
      if (userData.work) {
        setUserOccupation(userData.work);
      }
    
      // Feedback visual para o usuário
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = "Perfil atualizado com sucesso!";
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      document.body.appendChild(toastElement);
      
      setTimeout(() => {
        toastElement.style.opacity = "1";
      }, 100);
      
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 2000);
    } catch (error) {

      // Feedback de erro
      const toastElement = document.createElement("div");
      toastElement.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium z-50";
      toastElement.textContent = "Erro ao atualizar perfil. Tente novamente.";
      toastElement.style.opacity = "0";
      toastElement.style.transition = "opacity 0.3s ease-in-out";
      document.body.appendChild(toastElement);
      
      setTimeout(() => {
        toastElement.style.opacity = "1";
      }, 100);
      
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(toastElement)) {
            document.body.removeChild(toastElement);
          }
        }, 300);
      }, 2000);
    }
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPosts(prevSavedPosts => {
      if (prevSavedPosts.includes(postId)) {
        return prevSavedPosts.filter(id => id !== postId);
      } else {
        return [...prevSavedPosts, postId];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Usuário não encontrado</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'O usuário não existe ou não está disponível.'}
          </p>
          <Link 
            to="/" 
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Cabeçalho com capa */}
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative mb-16">
        {/* Imagem de capa personalizada, se disponível */}
        {user.coverImage ? (
          <div className="relative w-full h-full">
            <img
              src={user.coverImage}
              alt="Capa do perfil"
              className="w-full h-full object-cover rounded-t-lg border-4 border-white dark:border-gray-900 shadow-md"
            />
            {isCurrentUserProfile && (
              <button
                onClick={() => setShowCoverEditModal(true)}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all shadow-md flex items-center gap-2 hidden"
                title="Editar imagem de capa"
              >
                <CameraIcon className="h-5 w-5 text-gray-700" />
                <span className="text-gray-700 font-medium">Editar capa</span>
              </button>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isCurrentUserProfile && (
              <button
                onClick={() => setShowCoverEditModal(true)}
                className="px-4 py-2 bg-white bg-opacity-80 rounded-lg hover:bg-opacity-100 transition-all shadow-md flex items-center gap-2"
                title="Adicionar imagem de capa"
              >
                <CameraIcon className="h-5 w-5 text-gray-700" />
                <span className="text-gray-700 font-medium">Adicionar imagem de capa</span>
              </button>
            )}
          </div>
        )}
        
        {/* Foto de perfil (posicionada sobrepondo a capa e o conteúdo) */}
        <div className="absolute -bottom-16 left-6 md:left-8">
          <div className="relative">
            <img 
              src={user.photoURL || user.avatarUrl || user.avatar || "https://via.placeholder.com/150"} 
              alt={`Avatar de ${user.displayName || user.name}`}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md" 
            />
            
            {isCurrentUserProfile && (
              <button
                onClick={() => setShowAvatarEditModal(true)}
                className="absolute bottom-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-all shadow-md"
                title="Editar foto de perfil"
              >
                <CameraIcon className="h-5 w-5 text-gray-700" />
              </button>
            )}
            
            {(user.isPro || user.premium) && (
              <div className="absolute -bottom-2 -right-2">
                <ProBadge size="lg" />
              </div>
            )}
          </div>
        </div>
        
        {/* Botões de ação */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isCurrentUserProfile && (
            <button
              onClick={() => setShowCoverEditModal(true)}
              className="px-4 py-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 flex items-center gap-1 text-sm font-medium"
            >
              <CameraIcon className="h-4 w-4" />
              <span>Editar capa</span>
            </button>
          )}
          
          {!isCurrentUserProfile && (
            <>
              <button 
                onClick={handleFollowClick}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium ${
                  isFollowing 
                    ? 'bg-white text-gray-800 hover:bg-gray-100' 
                    : 'bg-primary text-white hover:bg-opacity-90'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserRemoveIcon className="h-4 w-4" />
                    <span>Seguindo</span>
                  </>
                ) : (
                  <>
                    <UserAddIcon className="h-4 w-4" />
                    <span>Seguir</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
              
        {/* Ações secundárias - na parte inferior direita */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!isCurrentUserProfile && (
            <>
              <button
                onClick={handleNotificationToggle}
                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                title={isNotificationsEnabled ? "Desativar notificações" : "Ativar notificações"}
              >
                {isNotificationsEnabled ? (
                  <BellIcon className="h-5 w-5" />
                ) : (
                  <BellSlashIcon className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={handleSendMessage}
                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                title="Enviar mensagem"
              >
                <ChatAlt2Icon className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowOptionsMenu(prev => !prev)}
                  className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                  title="Mais opções"
                >
                  <DotsHorizontalIcon className="h-5 w-5" />
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleShareProfile}
                      >
                        Compartilhar perfil
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleBlockUser}
                      >
                        Bloquear usuário
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleReportUser}
                      >
                        Denunciar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {isCurrentUserProfile && (
            <>
              <button 
                onClick={handleShareProfile}
                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                title="Compartilhar perfil"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowEditProfileModal(true)}
                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                title="Editar perfil"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowOptionsMenu(prev => !prev)}
                  className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                  title="Mais opções"
                >
                  <DotsHorizontalIcon className="h-5 w-5" />
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          alert("Exportar dados: Esta funcionalidade será implementada em breve.");
                        }}
                      >
                        Exportar meus dados
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          navigate('/settings#privacy');
                        }}
                      >
                        Configurações de privacidade
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          const confirmar = window.confirm("Tem certeza que deseja desativar sua conta?");
                          if (confirmar) {
                            alert("Sua conta foi desativada temporariamente.");
                            navigate('/');
                          }
                        }}
                      >
                        Desativar conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Informações do usuário */}
      <div className="pl-40 md:pl-48 -mt-12 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {user.displayName || user.name}
              {(user.isPro || user.premium) && <ProBadge size="sm" />}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 -mt-1">@{user.username}</p>
          </div>
          {/* Nome de usuário e badge de nível - Removendo esta div */}
            </div>
            
        <div className="-ml-40 mt-2">
          <div className="flex items-center gap-2 mb-2">
            {userLocation && (
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 shadow-sm">
                <LocationMarkerIcon className="h-4 w-4 text-primary" />
                <span>{userLocation.city}, {userLocation.state}</span>
                      </span>
            )}
            
            <button
              onClick={() => setShowLevelModal(true)} 
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-400 text-white text-xs px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              <span>Nível {user.level || 1}</span>
            </button>
              </div>
                
          <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line">
            {user.bio || defaultBio}
          </p>
          
          {/* Estatísticas do usuário */}
          <div className="mt-3 flex gap-4 items-center">
          <button 
            onClick={() => setShowFollowersModal(true)}
              className="text-sm hover:underline"
          >
              <span className="font-semibold text-gray-900 dark:text-white">{user.followers || 0}</span>
              <span className="text-gray-600 dark:text-gray-400"> seguidores</span>
          </button>
          
          <button 
            onClick={() => setShowFollowingModal(true)}
              className="text-sm hover:underline"
          >
              <span className="font-semibold text-gray-900 dark:text-white">{user.following || 0}</span>
              <span className="text-gray-600 dark:text-gray-400"> seguindo</span>
          </button>
          
            <span className="text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{user.postCount || posts.length || 0}</span>
              <span className="text-gray-600 dark:text-gray-400"> posts</span>
            </span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-y-1">
            {userOccupation && (
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mr-4">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{userOccupation}</span>
              </span>
            )}
            
            {user.website && (
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mr-4"
              >
                <LinkIcon className="h-4 w-4" />
                <span>{user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
              </a>
            )}
            
            {user.createdAt && (
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mr-4">
                <CalendarIcon className="h-4 w-4" />
                <span>Ingressou em {formatCreatedAt(user.createdAt)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs de navegação */}
      <div className="border-b dark:border-gray-700 mb-6">
        <div className="flex space-x-4 overflow-x-auto">
          <button 
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'sobre' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('sobre')}
          >
            Sobre
          </button>
          <button
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'midia' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('midia')}
          >
            Mídia
          </button>
          <button 
            className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap
              ${activeTab === 'batalhas' ? 'border-primary text-primary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('batalhas')}
          >
            Batalhas de Mentiras
          </button>
        </div>
      </div>
      
      {/* Conteúdo das tabs */}
      <div className="mt-4">
        {activeTab === 'posts' && (
          <PostsTab 
            userId={user?.id} 
            isCurrentUser={currentUser?.id === user?.id} 
          />
        )}
        {activeTab === 'sobre' && (
          <AboutTab user={user} />
        )}
        {activeTab === 'midia' && (
          <MediaTab 
            userId={user?.id} 
            isCurrentUser={currentUser?.id === user?.id} 
          />
        )}
        {activeTab === 'batalhas' && (
          <BattlesTab 
            userId={user?.id} 
            isCurrentUser={currentUser?.id === user?.id} 
          />
        )}
      </div>
      
      {/* Modais */}
      {showFollowersModal && (
      <UserListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        users={followers}
        title="Seguidores"
      />
      )}
      
      {showFollowingModal && (
      <UserListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        users={following}
        title="Seguindo"
      />
      )}
      
      {showLevelModal && user && (
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
          level={user.level}
        />
      )}
      
      {showAvatarEditModal && (
        <ImageEditModal
          isOpen={showAvatarEditModal}
          onClose={() => setShowAvatarEditModal(false)}
          onSave={handleAvatarSave}
          title="Editar foto de perfil"
          aspectRatio={1}
          circularCrop={true}
        />
      )}
      
      {showCoverEditModal && (
        <ImageEditModal
          isOpen={showCoverEditModal}
          onClose={() => setShowCoverEditModal(false)}
          onSave={handleCoverSave}
          title="Editar imagem de capa"
          aspectRatio={3}
        />
      )}
      
      {showPersonalInfoModal && user && (
      <PersonalInfoEditModal
        isOpen={showPersonalInfoModal}
        onClose={() => setShowPersonalInfoModal(false)}
        user={user}
        onSave={handlePersonalInfoSave}
      />
      )}
      
      {showEditProfileModal && (
      <ProfileEditModal 
        isOpen={showEditProfileModal} 
        onClose={() => setShowEditProfileModal(false)} 
        user={user} 
        onSave={handleProfileUpdate} 
      />
      )}
      
      {showChat && user && (
        <FloatingChat
          user={user}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage; 