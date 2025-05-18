'use client';

import { useState, useEffect, use } from 'react';
import { collection, query, where, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PostCard from '@/components/Post/PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FaHashtag } from 'react-icons/fa';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

interface Post {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  content: string;
  tags: string[];
  imageUrl: string | null;
  reactions: {
    quaseAcreditei: number;
    hahaha: number;
    mentiraEpica: number;
  };
  createdAt: { toDate: () => Date } | null;
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setLastDoc(null);
    setHasMore(true);
    
    const fetchInitialPosts = async () => {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('tags', 'array-contains', decodedTag),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        
        const snapshot = await getDocs(postsQuery);
        
        if (snapshot.empty) {
          setHasMore(false);
          setLoading(false);
          return;
        }
        
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(lastVisible);
        
        const initialPosts = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            uid: data.authorId,
            displayName: data.authorName,
            photoURL: data.authorPhoto,
            content: data.content,
            tags: data.tags || [],
            imageUrl: data.imageUrl || null,
            reactions: data.reactions || {
              quaseAcreditei: 0,
              hahaha: 0,
              mentiraEpica: 0
            },
            createdAt: data.createdAt
          };
        });
        
        setPosts(initialPosts);
        setHasMore(snapshot.docs.length >= 10);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialPosts();
  }, [decodedTag]);
  
  const handleLoadMore = async () => {
    if (!lastDoc || loading) return;
    
    setLoading(true);
    
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('tags', 'array-contains', decodedTag),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(10)
      );
      
      const snapshot = await getDocs(postsQuery);
      
      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      setLastDoc(lastVisible);
      
      const newPosts = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.authorId,
          displayName: data.authorName,
          photoURL: data.authorPhoto,
          content: data.content,
          tags: data.tags || [],
          imageUrl: data.imageUrl || null,
          reactions: data.reactions || {
            quaseAcreditei: 0,
            hahaha: 0,
            mentiraEpica: 0
          },
          createdAt: data.createdAt
        };
      });
      
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(snapshot.docs.length >= 10);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <div className="bg-purple-100 text-purple-800 p-3 rounded-lg mr-3">
          <FaHashtag size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">#{decodedTag}</h1>
          <p className="text-gray-600">Mentiras com a tag #{decodedTag}</p>
        </div>
      </div>
      
      {loading && posts.length === 0 ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Carregando...
                  </>
                ) : (
                  'Carregar mais'
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">
            Nenhuma mentira encontrada com a tag #{decodedTag}.
          </p>
          <p className="text-gray-600 mt-2">
            Seja o primeiro a compartilhar uma mentira com esta tag!
          </p>
        </div>
      )}
    </div>
  );
} 