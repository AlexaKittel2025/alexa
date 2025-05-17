// Este código opcional é usado para registrar um service worker.
// register() não é chamado por padrão.

// Isso permite que o aplicativo carregue mais rápido nas visitas subsequentes em produção, e fornece
// recursos offline. No entanto, isso também significa que os desenvolvedores (e usuários)
// só verão atualizações implantadas em visitas subsequentes a uma página, depois que todas as
// guias existentes abertas nessa página forem fechadas, pois recursos previamente armazenados em cache
// são atualizados em segundo plano.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] é o endereço de localhost IPv6.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 é considerado localhost para IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // A URL constructor é disponível em todos os navegadores que suportam SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Nosso service worker não funcionará se PUBLIC_URL estiver em uma origem diferente
      // de onde nossa página é servida. Isso pode acontecer se um CDN for usado para
      // servir ativos; veja https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Isso está em execução no localhost. Vamos verificar se um service worker ainda existe ou não.
        checkValidServiceWorker(swUrl, config);

        // Adiciona alguns logs adicionais ao localhost, apontando para desenvolvedores para a
        // documentação de service worker/PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este aplicativo web está sendo servido em cache primeiro por um service worker. ' +
              'Para saber mais, visite https://cra.link/PWA'
          );
        });
      } else {
        // Não é localhost. Apenas registra o service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Neste ponto, o conteúdo pré-cacheado atualizado foi buscado,
              // mas o service worker anterior ainda estará servindo o conteúdo mais antigo
              // até que todas as guias do cliente sejam fechadas.
              console.log(
                'Novo conteúdo disponível e será usado quando todas as ' +
                  'guias desta página forem fechadas. Veja https://cra.link/PWA.'
              );

              // Executa callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Neste ponto, tudo foi pré-cacheado.
              // É o momento perfeito para exibir uma mensagem
              // "Conteúdo está em cache para uso offline."
              console.log('Conteúdo em cache para uso offline.');

              // Executa callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erro durante o registro do service worker:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Verifica se o service worker pode ser encontrado. Se não puder, recarrega a página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Verifica se existe um service worker e que realmente obtemos um arquivo JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Nenhum service worker encontrado. Provavelmente um aplicativo diferente. Recarrega a página.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado. Procede normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Não foi encontrada conexão com a internet. O aplicativo está rodando no modo offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
} 