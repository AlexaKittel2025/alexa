'use client';

import { useState } from 'react';
import { 
  FaWhatsapp, 
  FaFacebook, 
  FaTwitter, 
  FaCopy, 
  FaShareAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface ShareOptionsProps {
  postId: string;
  content: string;
  location?: { city: string; state: string } | null;
}

export default function ShareOptions({ postId, content, location }: ShareOptionsProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // URL base do site (substitua pelo seu domínio em produção)
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://mentei.app';
    
  const postUrl = `${baseUrl}/post/${postId}`;
  
  // Texto para compartilhamento
  const shareText = content.length > 100 
    ? content.substring(0, 97) + '...' 
    : content;
  
  const encodedText = encodeURIComponent(`🤥 Mentei: "${shareText}" - Confira essa mentira em:`);
  const encodedUrl = encodeURIComponent(postUrl);
  
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} - ${postUrl}`);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareToStory = () => {
    // Aqui seria a implementação para compartilhar em stories
    // Em uma app real, integraria com APIs específicas
    alert('Compartilhamento em stories disponível em breve!');
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 py-1 px-2 rounded-full hover:bg-purple-50"
        aria-label="Compartilhar"
      >
        <FaShareAlt />
        <span className="text-sm">Compartilhar</span>
      </button>
      
      {location && (
        <div className="text-xs flex items-center text-gray-500 mt-1">
          <FaMapMarkerAlt className="mr-1" size={10} />
          <span>{location.city}-{location.state}</span>
        </div>
      )}
      
      {showOptions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-3 w-52 z-10">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Compartilhar via:</h4>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              <FaWhatsapp />
              <span className="text-sm">WhatsApp</span>
            </a>
            
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <FaFacebook />
              <span className="text-sm">Facebook</span>
            </a>
            
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200"
            >
              <FaTwitter />
              <span className="text-sm">Twitter</span>
            </a>
            
            <button
              onClick={shareToStory}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
            >
              <FaShareAlt />
              <span className="text-sm">Story</span>
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FaCopy />
              <span className="text-sm">{copied ? 'Copiado!' : 'Copiar link'}</span>
            </button>
          </div>
          
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
        </div>
      )}
    </div>
  );
} 