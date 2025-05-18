'use client';

import { useState, useRef } from 'react';
import { FaImage, FaTimes, FaRandom, FaSurprise, FaCrown, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { onPostCreated, checkAchievements } from '@/lib/gamification';
import { triggerGamificationEvent } from '@/components/GamificationNotification';

// Constante para limite de caracteres
const MAX_CHAR_LIMIT = 1000;

const tags = [
  'alien', 'ex', 'vida rica', 'trabalho', 'família', 'viagem', 'comida', 'celebridade', 'política', 'outro',
  'surreal', 'escola', 'festa', 'encontro', 'universidade', 'animal', 'amigos', 'infância', 'hospital', 'tecnologia'
];

// Templates para gerar mentiras aleatórias
const lieTemplates = [
  "Ontem eu estava {lugar} quando de repente vi {celebridade} {fazendo_algo}!",
  "Não vão acreditar! Acabei de {verbo} um/uma {substantivo} que {ação_incrível}.",
  "Na minha viagem para {lugar_exótico}, {acontecimento_improvável}.",
  "Meu/Minha {parente} me contou que {história_absurda}.",
  "Vocês sabiam que {fato_falso}? Acabei de descobrir isso!",
  "Hoje no trabalho, {situação_impossível} e todo mundo {reação}.",
  "Quando eu era criança, {mentira_de_infância}.",
  "Semana passada {evento_incrível} e ninguém acredita em mim!",
  "Acabei de inventar {invenção_absurda} que {benefício_impossível}.",
  "Sabia que meu vizinho é {profissão_inusitada} e {fato_sobre_vizinho}?"
];

export default function CreatePostForm() {
  const { user } = useAuth();
  
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isFakePostMode, setIsFakePostMode] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [showProModal, setShowProModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Simulação - Em produção, isso viria do banco de dados
  const isPro = false; // Atualizar para usar dados da sessão quando disponível
  
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se há conteúdo válido
    if (isFakePostMode) {
      if (!image || !imageCaption.trim()) return;
    } else {
      if (!content.trim()) return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = null;
      
      // Se houver uma imagem, fazer upload através de uma API
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        // Obter token do localStorage
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        
        // Adicionar token se disponível
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers,
          body: formData
        });
        
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          imageUrl = data.url;
        } else {
          throw new Error('Falha ao fazer upload da imagem');
        }
      }
      
      // Preparar dados do post
      const postData = {
        title: isFakePostMode ? imageCaption.substring(0, 50) : content.substring(0, 50),
        content: isFakePostMode ? imageCaption : content,
        imageUrl,
        tags: selectedTags
      };
      
      // Obter token do localStorage
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Adicionar token se disponível
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Enviar para a API
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers,
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar postagem');
      }
      
      // Limpar o formulário
      setContent('');
      setImageCaption('');
      setSelectedTags([]);
      clearImage();
      setIsFakePostMode(false);
      
      // Se foi um usuário anônimo, salvar o nome no localStorage
      if (!user && guestName) {
        localStorage.setItem('guestName', guestName);
      }
      
      // Atualizar gamificação
      if (user) {
        onPostCreated(user.id);
        const unlockedAchievements = checkAchievements(user.id);
        unlockedAchievements.forEach(achievement => {
          triggerGamificationEvent('achievement', achievement);
        });
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar uma mentira aleatória
  const generateRandomLie = () => {
    const template = lieTemplates[Math.floor(Math.random() * lieTemplates.length)];
    // Substituir espaços reservados por conteúdo aleatório (simplificado)
    let generatedLie = template
      .replace('{lugar}', ['no shopping', 'na praia', 'no parque', 'no supermercado'][Math.floor(Math.random() * 4)])
      .replace('{celebridade}', ['Neymar', 'Anitta', 'Roberto Carlos', 'Lady Gaga'][Math.floor(Math.random() * 4)])
      .replace('{fazendo_algo}', ['comendo pipoca', 'cantando karaokê', 'dançando', 'comprando pão'][Math.floor(Math.random() * 4)])
      .replace('{verbo}', ['encontrar', 'descobrir', 'comprar', 'ganhar'][Math.floor(Math.random() * 4)])
      .replace('{substantivo}', ['cachorro', 'relógio', 'carro', 'livro'][Math.floor(Math.random() * 4)])
      .replace('{ação_incrível}', ['fala português', 'brilha no escuro', 'prevê o futuro', 'cozinha sozinho'][Math.floor(Math.random() * 4)])
      .replace('{lugar_exótico}', ['Marte', 'Bali', 'Atlântida', 'Himalaia'][Math.floor(Math.random() * 4)])
      .replace('{acontecimento_improvável}', ['encontrei um tesouro', 'fui abduzido', 'conheci meu clone', 'virei celebridade local'][Math.floor(Math.random() * 4)])
      .replace('{parente}', ['avó', 'tio', 'prima', 'sobrinho'][Math.floor(Math.random() * 4)])
      .replace('{história_absurda}', ['ele foi astronauta secreto', 'nossa família descende de reis', 'temos um fantasma em casa', 'ela inventou o brigadeiro'][Math.floor(Math.random() * 4)])
      .replace('{fato_falso}', ['bananas são radioativas', 'dormir com meias aumenta QI', 'girafas não existiam até 1800', 'Shakespeare era brasileiro'][Math.floor(Math.random() * 4)])
      .replace('{situação_impossível}', ['o computador começou a flutuar', 'meu chefe virou um gato', 'o tempo parou por 10 segundos', 'todos começaram a cantar sincronizados'][Math.floor(Math.random() * 4)])
      .replace('{reação}', ['aplaudiu', 'desmaiou', 'tirou foto', 'fingiu que era normal'][Math.floor(Math.random() * 4)])
      .replace('{mentira_de_infância}', ['tinha um dragão de estimação', 'falava com plantas', 'inventei uma língua nova', 'fui criado por lobos por um dia'][Math.floor(Math.random() * 4)])
      .replace('{evento_incrível}', ['ganhei na loteria duas vezes', 'previ um terremoto', 'encontrei meu sósia', 'descobri um novo elemento químico no meu quintal'][Math.floor(Math.random() * 4)])
      .replace('{invenção_absurda}', ['um chapéu tradutor', 'meias que não somem na lavagem', 'um detector de mentiras portátil', 'café que não esfria'][Math.floor(Math.random() * 4)])
      .replace('{benefício_impossível}', ['faz você voar', 'resolve qualquer problema matemático', 'traduz o que animais falam', 'rejuvenesce 10 anos'][Math.floor(Math.random() * 4)])
      .replace('{profissão_inusitada}', ['caçador de fantasmas', 'provador de travesseiros', 'tradutor de extraterrestres', 'contador de estrelas'][Math.floor(Math.random() * 4)])
      .replace('{fato_sobre_vizinho}', ['tem uma coleção de 500 abacaxis', 'dorme de olhos abertos', 'já escalou o Everest 3 vezes', 'é primo distante da realeza'][Math.floor(Math.random() * 4)]);
    
    setContent(generatedLie);
  };

  const toggleFakePostMode = () => {
    if (!isPro && !isFakePostMode) {
      setShowProModal(true);
      return;
    }
    
    setIsFakePostMode(!isFakePostMode);
    setContent('');
    clearImage();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {!user && !guestName && (
        <div className="mb-4">
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
            Seu nome (opcional)
          </label>
          <input
            type="text"
            id="guestName"
            placeholder="Como quer ser chamado?"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isFakePostMode ? (
          <div className="mb-3">
            <textarea
              placeholder="Conte uma mentira incrível..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={MAX_CHAR_LIMIT}
            />
            <div className="text-right text-xs text-gray-500">
              {content.length}/{MAX_CHAR_LIMIT} caracteres
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagem da mentira
              </label>
              <div className="flex items-center justify-center w-full">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legenda da imagem
              </label>
              <textarea
                placeholder="Explique sua mentira visual..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                value={imageCaption}
                onChange={e => setImageCaption(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (máximo 3)
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTags.includes(tag)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              type="button"
              onClick={generateRandomLie}
              className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
              disabled={isFakePostMode}
            >
              <FaRandom className="mr-1" /> Gerar mentira
            </button>
            <button
              type="button"
              onClick={toggleFakePostMode}
              className={`flex items-center px-3 py-2 rounded-lg ${
                isFakePostMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <FaImage className="mr-1" />
              {isFakePostMode ? 'Modo texto' : 'Modo imagem'}
              {!isPro && !isFakePostMode && <FaLock className="ml-1 text-xs" />}
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Publicar mentira'}
          </button>
        </div>
      </form>

      {/* Modal para usuários free tentando acessar funcionalidades pro */}
      {showProModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <FaCrown className="text-yellow-500 mr-2" /> Recurso Premium
              </h3>
              <button
                onClick={() => setShowProModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-4">
              O modo de postagem com imagens é uma funcionalidade premium. Atualize para a versão Pro para desbloquear esse e outros recursos exclusivos!
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowProModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Agora não
              </button>
              <Link
                href="/pro"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Ver planos Pro
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}