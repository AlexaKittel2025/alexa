import * as Ably from 'ably';

// Função para obter cliente Ably
export function getAblyClient() {
  // Usa autenticação por token para maior segurança
  return new Ably.Realtime.Promise({
    authUrl: '/api/ably-token',
    authMethod: 'GET'
  });
}

// Cliente simulado para quando o Ably não estiver disponível
function createMockAblyClient() {
  return {
    channels: {
      get: () => ({
        subscribe: () => {},
        unsubscribe: () => {},
        publish: () => Promise.resolve(),
        presence: {
          enter: () => {},
          leave: () => {}
        }
      })
    },
    close: () => {}
  };
}

/**
 * Hook personalizado para se inscrever em um canal do Ably
 * @param channelName Nome do canal para se inscrever
 * @param eventName Nome do evento para escutar
 * @param onMessage Função de callback para quando uma mensagem é recebida
 */
export function useChannel(
  channelName: string, 
  eventName: string, 
  onMessage: (message: Ably.Types.Message) => void
) {
  useEffect(() => {
    // Verificar se estamos no lado do cliente
    if (typeof window === 'undefined') return;

    // Verificar se a API key existe
    if (!getApiKey()) {
      
      return;
    }
    
    try {
      // Inicializar o cliente Ably
      const ably = getAblyClient();
      const channel = ably.channels.get(channelName);

      // Inscrever-se no canal
      channel.subscribe(eventName, (message) => {
        onMessage(message);
      });

      // Limpeza ao desmontar
      return () => {
        channel.unsubscribe(eventName);
        ably.close();
      };
    } catch (error) {
      
    }
  }, [channelName, eventName, onMessage]);
}

/**
 * Publica uma mensagem em um canal
 * @param channelName Nome do canal para publicar
 * @param eventName Nome do evento a ser publicado
 * @param data Dados da mensagem
 */
export async function publishMessage(
  channelName: string, 
  eventName: string, 
  data: any
) {
  if (!getApiKey()) {
    
    return false;
  }
  
  try {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
    ably.close();
    return true;
  } catch (error) {
    
    return false;
  }
}

/**
 * Criar um canal de presença para um chat especifico
 * @param channelName Nome do canal
 * @param userData Dados do usuário
 */
export function createPresenceChannel(
  channelName: string, 
  userData: any
) {
  if (!getApiKey()) {
    
    return {
      channel: null,
      leave: () => {}
    };
  }
  
  try {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);
    
    // Entrar no canal com dados do usuário
    channel.presence.enter(userData);
    
    return {
      channel,
      leave: () => {
        try {
          channel.presence.leave();
          ably.close();
        } catch (error) {
          
        }
      }
    };
  } catch (error) {
    
    return {
      channel: null,
      leave: () => {}
    };
  }
} 