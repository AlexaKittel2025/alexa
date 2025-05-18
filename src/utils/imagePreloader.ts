// Pré-carregamento de imagens para melhorar performance
class ImagePreloader {
  private cache: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private isPreloading = false;
  
  // Pré-carregar uma imagem
  preload(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.add(src);
        resolve();
      };
      
      img.onerror = reject;
      img.src = src;
    });
  }
  
  // Pré-carregar múltiplas imagens
  async preloadMultiple(sources: string[]): Promise<void> {
    const promises = sources
      .filter(src => !this.cache.has(src))
      .map(src => this.preload(src));
    
    await Promise.allSettled(promises);
  }
  
  // Adicionar imagens à fila de pré-carregamento
  addToQueue(sources: string[]) {
    this.preloadQueue.push(...sources.filter(src => !this.cache.has(src)));
    this.processQueue();
  }
  
  // Processar fila de pré-carregamento
  private async processQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return;
    }
    
    this.isPreloading = true;
    
    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, 3); // Processar 3 imagens por vez
      await this.preloadMultiple(batch);
    }
    
    this.isPreloading = false;
  }
  
  // Verificar se uma imagem está no cache
  isCached(src: string): boolean {
    return this.cache.has(src);
  }
  
  // Limpar cache
  clearCache() {
    this.cache.clear();
  }
}

export const imagePreloader = new ImagePreloader();

// Hook para pré-carregar imagens próximas
export function useImagePreloader(currentIndex: number, images: string[]) {
  // Pré-carregar próximas 3 imagens
  const nextImages = images.slice(currentIndex + 1, currentIndex + 4);
  
  if (nextImages.length > 0) {
    imagePreloader.addToQueue(nextImages);
  }
  
  // Pré-carregar imagens anteriores se voltando
  const prevImages = images.slice(Math.max(0, currentIndex - 2), currentIndex);
  
  if (prevImages.length > 0) {
    imagePreloader.addToQueue(prevImages);
  }
}