import * as Ably from 'ably';
import { useEffect } from 'react';

// Configurar o cliente Ably - Verificando a existência da API key
const getApiKey = () => {
  // Se não estiver no navegador, retorna null para evitar erros de SSR
  if (typeof window === 'undefined') return null;
  
  const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
  
  // Validação da API key para evitar erros de inicialização
  if (!apiKey || apiKey === 'sua-chave-ably-aqui') {
    console.warn('Ably API key não encontrada ou inválida. O chat em tempo real não funcionará.');
    return null;
  }
  
  return apiKey;
};

// Função para obter cliente Ably com tratamento de erro
export function getAblyClient() {
  const apiKey = getApiKey();
  
  // Se não houver API key, retorna um cliente simulado para evitar erros
  if (!apiKey) {
    return createMockAblyClient();
  }
  
  try {
    return new Ably.Realtime.Promise({ key: apiKey, clientId: 'mentei-app' });
  } catch (error) {
    console.error('Erro ao inicializar o cliente Ably:', error);
    return createMockAblyClient();
  }
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
      console.warn(`Canal ${channelName} não foi ativado: API key do Ably não encontrada.`);
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
      console.error(`Erro ao se conectar ao canal ${channelName}:`, error);
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
    console.warn(`Mensagem não enviada ao canal ${channelName}: API key do Ably não encontrada.`);
    return false;
  }
  
  try {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
    ably.close();
    return true;
  } catch (error) {
    console.error(`Erro ao publicar mensagem no canal ${channelName}:`, error);
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
    console.warn(`Canal de presença ${channelName} não foi criado: API key do Ably não encontrada.`);
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
          console.error(`Erro ao sair do canal ${channelName}:`, error);
        }
      }
    };
  } catch (error) {
    console.error(`Erro ao criar canal de presença ${channelName}:`, error);
    return {
      channel: null,
      leave: () => {}
    };
  }
} 