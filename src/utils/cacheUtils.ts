// Cache com expiração para dados no localStorage
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class CacheManager {
  private static defaultTTL = 5 * 60 * 1000; // 5 minutos por padrão

  // Salvar item no cache
  static set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      
      // Se o localStorage estiver cheio, limpar items expirados
      this.clearExpired();
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
      } catch (retryError) {
        
      }
    }
  }

  // Obter item do cache
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Verificar se o item expirou
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      
      return null;
    }
  }

  // Remover item do cache
  static remove(key: string): void {
    localStorage.removeItem(`cache_${key}`);
  }

  // Limpar todos os items do cache
  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Limpar items expirados
  static clearExpired(): void {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem<any> = JSON.parse(item);
            if (now - cacheItem.timestamp > cacheItem.ttl) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Se não conseguir fazer parse, remover o item
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Cache para requisições de API
  static async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    // Tentar obter do cache primeiro
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Se não estiver no cache, buscar
    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

// Hook personalizado para React
import { useState, useEffect } from 'react';

export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const result = await CacheManager.fetchWithCache(key, fetcher, ttl);
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [key]);

  const refresh = async () => {
    CacheManager.remove(key);
    setLoading(true);
    try {
      const result = await CacheManager.fetchWithCache(key, fetcher, ttl);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}