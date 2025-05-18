'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { FaHashtag, FaFire } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface TagInfo {
  name: string;
  count: number;
}

export default function ExplorarTags() {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Em uma implementação real, seria necessário uma coleção especial para tags
        // ou uma função de agregação para contar a frequência de tags
        // Este é um exemplo simplificado
        const tagsQuery = query(
          collection(db, 'tags'),
          orderBy('count', 'desc'),
          limit(50)
        );
        
        const snapshot = await getDocs(tagsQuery);
        
        if (!snapshot.empty) {
          const tagsData = snapshot.docs.map(doc => ({
            name: doc.id,
            count: doc.data().count || 0
          }));
          
          setTags(tagsData);
        } else {
          // Dados de exemplo caso não existam tags no banco ainda
          setTags([
            { name: 'engraçado', count: 42 },
            { name: 'política', count: 35 },
            { name: 'absurdo', count: 28 },
            { name: 'tecnologia', count: 24 },
            { name: 'esportes', count: 21 },
            { name: 'relacionamento', count: 18 },
            { name: 'trabalho', count: 16 },
            { name: 'faculdade', count: 15 },
            { name: 'cinema', count: 13 },
            { name: 'comida', count: 11 },
            { name: 'música', count: 10 },
            { name: 'trânsito', count: 9 },
            { name: 'família', count: 8 },
            { name: 'viagem', count: 7 },
            { name: 'saúde', count: 6 },
          ]);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
  }, []);
  
  // Função para determinar o tamanho da tag baseado na frequência
  const getTagSize = (count: number) => {
    if (count > 30) return 'text-xl';
    if (count > 20) return 'text-lg';
    if (count > 10) return 'text-base';
    return 'text-sm';
  };
  
  // Função para determinar cor da tag baseado na frequência
  const getTagColor = (count: number) => {
    if (count > 30) return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    if (count > 20) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    if (count > 10) return 'bg-green-100 text-green-800 hover:bg-green-200';
    return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Explorar Tags</h1>
        <p className="text-gray-600">Descubra mentiras por assunto e temas populares</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : tags.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFire className="text-amber-500 mr-2" />
            Tags Populares
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <Link
                key={tag.name}
                href={`/tag/${tag.name}`}
                className={`${getTagColor(tag.count)} ${getTagSize(tag.count)} px-3 py-1.5 rounded-full flex items-center transition-colors`}
              >
                <FaHashtag className="mr-1 opacity-70" />
                {tag.name}
                <span className="ml-1.5 bg-white bg-opacity-30 text-xs px-1.5 py-0.5 rounded-full">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">
            Nenhuma tag encontrada ainda.
          </p>
          <p className="text-gray-600 mt-2">
            Seja o primeiro a criar postagens e adicionar tags!
          </p>
        </div>
      )}
      
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">O que são tags?</h2>
        <p className="text-gray-700 mb-3">
          Tags são palavras-chave que categorizam suas mentiras por temas e assuntos, 
          facilitando para outros usuários encontrarem conteúdo que lhes interesse.
        </p>
        <p className="text-gray-700">
          Ao criar uma mentira, você pode adicionar até 5 tags diferentes, separadas por espaço.
          Basta incluí-las no campo apropriado ou digitá-las com # no texto da sua mentira.
        </p>
      </div>
    </div>
  );
} 