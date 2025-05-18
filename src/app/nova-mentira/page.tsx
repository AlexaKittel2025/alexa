'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaImage, FaTimesCircle, FaTags, FaExclamationTriangle } from 'react-icons/fa';
import AuthCheck from '@/components/Auth/AuthCheck';
import { v4 as uuidv4 } from 'uuid';
import { savePostDraft, loadPostDraft, clearPostDraft } from '@/utils/persistenceUtils';

const MAX_CHAR_LIMIT = 1000;
const MAX_TAG_LIMIT = 5;

export default function NovaMentira() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnonymousWarning, setShowAnonymousWarning] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  
  // Para usuários não autenticados
  const [guestName, setGuestName] = useState('');
  
  useEffect(() => {
    // Recuperar nome de convidado do localStorage se existir
    const savedName = localStorage.getItem('guestName');
    if (savedName) {
      setGuestName(savedName);
    }
    
    // Mostrar aviso para usuários não autenticados
    if (!loading && !user) {
      setShowAnonymousWarning(true);
    }
    
    // Carregar rascunho salvo
    const draft = loadPostDraft();
    if (draft) {
      setContent(draft.content);
      setTags(draft.tags);
      if (draft.imagePreview) {
        setImagePreview(draft.imagePreview);
      }
    }
  }, [user, loading]);
  
  // Auto-save do rascunho
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (content || tags.length > 0) {
        savePostDraft({
          content,
          tags,
          imagePreview: imagePreview || undefined,
          savedAt: new Date().toISOString()
        });
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }
    }, 1000); // Auto-save após 1 segundo de inatividade
    
    return () => clearTimeout(saveTimer);
  }, [content, tags, imagePreview]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (newContent.length <= MAX_CHAR_LIMIT) {
      setContent(newContent);
      
      // Extrair tags do conteúdo (palavras que começam com #)
      const contentTags = newContent.match(/#(\w+)/g)?.map(tag => tag.substring(1));
      if (contentTags && contentTags.length > 0) {
        const uniqueTags = [...new Set([...tags, ...contentTags])];
        if (uniqueTags.length <= MAX_TAG_LIMIT) {
          setTags(uniqueTags);
        }
      }
    }
  };
  
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < MAX_TAG_LIMIT) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Verificar tamanho da imagem (limite de 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    if (!content.trim()) {
      setError('Escreva sua mentira antes de publicar');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let imageUrl = null;
      
      // Upload da imagem se existir
      if (image) {
        const storageRef = ref(storage, `posts/${uuidv4()}_${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        // Esperar upload completar
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            () => {},
            (error) => {
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }
      
      // Criando o documento da postagem
      const postData = {
        content: content.trim(),
        authorId: user?.uid || 'anonymous',
        authorName: user?.displayName || guestName || 'Anônimo',
        authorPhoto: user?.photoURL || null,
        createdAt: serverTimestamp(),
        tags: tags,
        imageUrl: imageUrl,
        reactions: {
          quaseAcreditei: 0,
          hahaha: 0,
          mentiraEpica: 0
        }
      };
      
      const docRef = await addDoc(collection(db, 'posts'), postData);
      
      // Incrementar contador de posts para usuários autenticados
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          postCount: increment(1)
        });
      }
      
      // Salvando o nome do convidado no localStorage se não for usuário autenticado
      if (!user && guestName) {
        localStorage.setItem('guestName', guestName);
      }
      
      // Atualizar contagem de tags
      for (const tag of tags) {
        try {
          const tagRef = doc(db, 'tags', tag);
          await updateDoc(tagRef, {
            count: increment(1)
          });
        } catch (error) {
          // Se o documento da tag não existir, criar
          await setDoc(doc(db, 'tags', tag), { count: 1 });
        }
      }
      
      // Limpar rascunho após publicação bem-sucedida
      clearPostDraft();
      
      router.push('/');
    } catch (error) {
      
      setError('Ocorreu um erro ao publicar sua mentira. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
  );
  
  return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-700 text-white p-4">
            <h1 className="text-xl font-bold">Nova Mentira</h1>
            <p className="text-sm text-purple-200">Compartilhe uma mentira engraçada e criativa</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {showAnonymousWarning && !user && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-700">
                    Você não está logado. Sua mentira será postada como anônima e você não poderá editá-la depois.
                  </p>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Seu nome (opcional)"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full sm:w-auto px-3 py-1.5 text-sm border border-yellow-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <textarea
                placeholder="Conta uma mentira aí..."
                value={content}
                onChange={handleContentChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[150px]"
                required
              ></textarea>
              <div className="mt-1 flex justify-between">
                <span className={`text-xs text-green-500 ${draftSaved ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  Rascunho salvo
                </span>
                <span className={`text-xs ${content.length > MAX_CHAR_LIMIT * 0.8 ? (content.length > MAX_CHAR_LIMIT * 0.95 ? 'text-red-500' : 'text-yellow-500') : 'text-gray-500'}`}>
                  {content.length}/{MAX_CHAR_LIMIT}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FaTags className="text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <span className="ml-auto text-xs text-gray-500">{tags.length}/{MAX_TAG_LIMIT}</span>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <div key={tag} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <FaTimesCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex">
                <input
                  type="text"
                  placeholder="Adicione tags separadas por espaço (ex: engraçado política)"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={tags.length >= MAX_TAG_LIMIT}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length >= MAX_TAG_LIMIT}
                  className="bg-purple-600 text-white px-3 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Dica: Você também pode adicionar tags no texto usando #hashtag
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaImage className="text-gray-500 mr-2" />
                <label className="text-sm font-medium text-gray-700">Imagem (opcional)</label>
              </div>
              
              {imagePreview ? (
                <div className="relative border border-gray-300 rounded-md overflow-hidden mb-2">
                  <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                  >
                    <FaTimesCircle size={20} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <FaImage className="text-gray-400 text-3xl mb-2" />
                    <span className="text-sm text-gray-500">Clique para fazer upload de uma imagem</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF (max. 5MB)</span>
                  </label>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publicando...
                  </>
                ) : (
                  'Publicar Mentira'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
} 