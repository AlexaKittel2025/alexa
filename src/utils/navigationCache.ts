// Cache para navegação entre páginas
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

class NavigationCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  
  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Limpar entradas expiradas periodicamente
  cleanExpired(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const navigationCache = new NavigationCache();

// Limpar cache expirado a cada minuto
if (typeof window !== 'undefined') {
  setInterval(() => {
    navigationCache.cleanExpired();
  }, 60000);
}

// Hook para usar o cache
export function useNavigationCache(key: string, fetcher: () => Promise<any>, ttl?: number) {
  const cachedData = navigationCache.get(key);
  
  if (cachedData) {
    return { data: cachedData, loading: false, fromCache: true };
  }
  
  // Se não tem cache, buscar dados
  const fetchData = async () => {
    const data = await fetcher();
    navigationCache.set(key, data, ttl);
    return data;
  };
  
  return { fetch: fetchData, loading: !cachedData, fromCache: false };
}