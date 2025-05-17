/// <reference lib="webworker" />

// Tipagem para o service worker
declare const self: ServiceWorkerGlobalScope;
export {};

const CACHE_NAME = 'mentei-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Lista de URLs para armazenar em cache antecipadamente
const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Evento de instalação - armazena recursos em cache antecipadamente
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[Service Worker] Erro ao armazenar em cache:', error);
      })
  );
});

// Evento de ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Ativado e controlando');
      return self.clients.claim();
    })
    .catch((error) => {
      console.error('[Service Worker] Erro ao ativar:', error);
    })
  );
});

// Estratégia de cache e rede para solicitações
self.addEventListener('fetch', (event) => {
  // Evitar solicitações não-GET
  if (event.request.method !== 'GET') return;

  // Evitar solicitações de API
  if (event.request.url.includes('/api/')) return;

  // Tratar somente URLs da mesma origem ou configuradas para CORS
  const url = new URL(event.request.url);
  const isFromSameOrigin = url.origin === self.location.origin;
  const isCrossOrigin = urlsToCache.some(item => event.request.url.includes(item));
  
  if (!isFromSameOrigin && !isCrossOrigin) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retornar do cache se encontrado
        if (cachedResponse) {
          return cachedResponse;
        }

        // Caso contrário, buscar da rede
        return fetch(event.request)
          .then((response) => {
            // Não armazenar em cache se não for resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Armazenar em cache para uso futuro
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('[Service Worker] Erro ao armazenar resposta:', error);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Erro de fetch:', error);
            
            // Se a rede falhar, fornecer a página offline
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match(OFFLINE_PAGE);
            }
            
            return new Response('Erro de rede', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Evento de sincronização em segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'post-update') {
    console.log('[Service Worker] Sincronização em segundo plano: post-update');
    // Implementar lógica de sincronização de posts pendentes
  }
});

// Lidar com notificações push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body || 'Nova atualização!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Mentei', options)
  );
});

// Evento de clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((clientList) => {
      // Verificar se já existe uma janela aberta e navegar para ela
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      // Caso contrário, abrir uma nova janela
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
}); 