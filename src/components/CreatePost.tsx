;

;
import { BadgeCheckIcon, CurrencyDollarIcon, LockClosedIcon, SparklesIcon, TagIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';import ProPaymentModal from './ProPaymentModal';

interface CreatePostProps {
  onSubmit: (content: string, imageURL?: string, tags?: string[]) => void;
  onGeneratePost: () => void;
  isPro: boolean;
  onOpenModal?: () => void;
}

const TAGS = [
  'alien', 'ex', 'vidarica', 'politico', 'trabalho', 
  'familia', 'pet', 'amigos', 'escola', 'tecnologia',
  'viagem', 'famoso', 'esporte', 'comida', 'festa'
];

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit, onGeneratePost, isPro, onOpenModal }) => {
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState<string | undefined>();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showTagsSelector, setShowTagsSelector] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showProTooltip, setShowProTooltip] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showProPaymentModal, setShowProPaymentModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSubmit(content, imageURL, tags);
    
    // Limpar o formulário
    setContent('');
    setImageURL(undefined);
    setTags([]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Em uma implementação real, isso seria feito através de upload para um serviço de armazenamento
      // Por enquanto, usamos URL.createObjectURL para simular
      const objectUrl = URL.createObjectURL(file);
      setImageURL(objectUrl);
    }
  };
  
  const handleRemoveImage = () => {
    setImageURL(undefined);
  };

  const handleCreativityButtonClick = () => {
    if (isPro && onGeneratePost) {
      onGeneratePost();
    } else {
      setShowProModal(true);
    }
  };

  const handleShowProModal = () => {
    if (!isPro) {
      setShowProModal(true);
    }
  };

  const handleOpenProPayment = () => {
    setShowProModal(false);
    setShowProPaymentModal(true);
  };

  // Se temos onOpenModal como prop, vamos usar apenas um componente simplificado que abre o modal
  if (onOpenModal) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div 
          className="cursor-pointer p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
          onClick={onOpenModal}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0"></div>
            <div className="ml-3 flex-grow">Qual é a mentira de hoje?</div>
          </div>
        </div>
        
        <div className="flex justify-between mt-3">
          <div className="flex space-x-2">
            <button
              className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={onOpenModal}
            >
              <PhotographIcon className="w-5 h-5" />
              <span>Foto</span>
            </button>
            
            <button
              className="flex items-center space-x-1 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={onOpenModal}
            >
              <TagIcon className="w-5 h-5" />
              <span>Tags</span>
            </button>
          </div>
          
          <button
            className="flex items-center space-x-1 px-3 py-1.5 text-white bg-primary hover:bg-opacity-90 rounded-md"
            onClick={onOpenModal}
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Criar Mentira</span>
          </button>
        </div>
      </div>
    );
  }
  
  // Caso contrário, mantemos o componente existente com o formulário completo
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Criar Mentira</h2>
      
      <form onSubmit={handleSubmit} role="form">
        <div className="mb-3">
          <label htmlFor="post-content" className="sr-only">Conteúdo da mentira</label>
          <textarea
            id="post-content"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder="Qual é a mentira de hoje?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {/* Prévia da imagem */}
        {imageURL && (
          <div className="relative mb-3 inline-block">
            <img 
              src={imageURL} 
              alt="Prévia da imagem selecionada para o post" 
              className="max-h-40 rounded-lg border border-gray-300 dark:border-gray-600"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              aria-label="Remover imagem"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="text-gray-800 dark:text-gray-200 mr-1">#{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  aria-label="Remover tag"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            {/* Upload de imagem */}
            <label htmlFor="image-upload" className="cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Adicionar imagem">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <span role="img" aria-label="Adicionar imagem">🖼️</span>
            </label>
            
            {/* Emoji picker button */}
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Adicionar emoji"
            >
              <span role="img" aria-label="Adicionar emoji">😊</span>
            </button>
            
            {/* Tag input */}
            <div className="relative">
              <label htmlFor="tag-input" className="sr-only">Adicionar tag</label>
              <input
                id="tag-input"
                type="text"
                placeholder="Tag"
                className="p-2 pl-6 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <span className="absolute left-2 top-2.5 text-gray-500 dark:text-gray-400">#</span>
              <button
                type="button"
                onClick={handleAddTag}
                className="absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Adicionar tag"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onGeneratePost}
              className={`px-4 py-2 rounded-md text-white ${
                isPro
                  ? 'bg-secondary hover:bg-opacity-90'
                  : 'bg-gray-400 cursor-help'
              }`}
              title={isPro ? 'Gerar uma mentira aleatória' : 'Recurso disponível apenas para usuários PRO'}
            >
              🤖 Gerar
            </button>
            
            <button
              type="submit"
              disabled={!content.trim()}
              className={`px-4 py-2 rounded-md text-white ${
                content.trim()
                  ? 'bg-primary hover:bg-opacity-90'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Publicar
            </button>
          </div>
        </div>
      </form>

      {/* Modal de Assinatura PRO */}
      {showProModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowProModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Torne-se PRO!</h2>
              <p className="text-gray-600 dark:text-gray-300">Desbloqueie recursos exclusivos por apenas R$10,00/mês</p>
            </div>
            
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Gerador de mentiras com IA</li>
              <li>Sem limite de postagens diárias</li>
              <li>Acesso a batalhas exclusivas</li>
              <li>Página de perfil personalizada</li>
              <li>Badge PRO exclusivo</li>
            </ul>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setShowProModal(false)}
              >
                Fechar
              </button>
              <button 
                className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded"
                onClick={handleOpenProPayment}
              >
                Assinar PRO
              </button>
            </div>
          </div>
        </div>
      )}

      <ProPaymentModal 
        isOpen={showProPaymentModal} 
        onClose={() => setShowProPaymentModal(false)} 
      />
    </div>
  );
};

export default CreatePost; 