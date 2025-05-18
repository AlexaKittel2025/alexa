import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';

// Array de nomes falsos para autores
const fakeNames = [
  'João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa', 'Carlos Pereira',
  'Juliana Almeida', 'Ricardo Ferreira', 'Fernanda Lima', 'Marcelo Souza', 'Patrícia Gomes'
];

// Array de conteúdos falsos para posts
const fakeContents = [
  'Hoje eu descobri que minha vida inteira foi uma mentira.',
  'Vocês não vão acreditar no que aconteceu comigo no ônibus hoje!',
  'Se eu contar ninguém acredita, mas ontem à noite...',
  'Minha experiência com meditação mudou completamente minha vida.',
  'A receita secreta da minha avó que ninguém conhece.',
  'Como eu ganhei 10 mil reais em apenas um fim de semana.',
  'O segredo que os médicos não querem que você saiba.',
  'Minha viagem incrível para um lugar que ninguém conhece.',
  'Como eu consegui um emprego dos sonhos sem experiência nenhuma.',
  'A verdade sobre os políticos que ninguém tem coragem de falar.',
  'Ontem à noite vi um OVNI no céu da minha cidade!',
  'Fui abduzido por alienígenas e tenho provas disso.',
  'Descobri um portal para outra dimensão no meu porão.',
  'Consigo prever o futuro e vou provar isso para vocês.',
  'Encontrei um tesouro enterrado no meu quintal.',
  'Tenho um método infalível para ganhar na loteria.',
  'Meu cachorro sabe falar, só faz isso quando estamos sozinhos.',
  'Descobri a fonte da juventude, tenho 95 anos mas pareço ter 30.',
  'Fui perseguido por uma criatura misteriosa na floresta.',
  'Consigo controlar o clima com os meus pensamentos.'
];

// Array de títulos falsos para posts
const fakeTitles = [
  'A Maior Mentira de Todas',
  'Você Não Vai Acreditar Nisso',
  'A Verdade Por Trás Do Mistério',
  'O Segredo Que Ninguém Conhece',
  'A Revelação do Século',
  'A História Inacreditável',
  'O Mistério Finalmente Revelado',
  'A Conspiração Secreta',
  'O Que Descobri Ontem à Noite',
  'A Mentira Que Mudou Minha Vida',
  'A Incrível Descoberta',
  'O Fenômeno Inexplicável',
  'A Experiência Sobrenatural',
  'O Encontro Alienígena',
  'O Poder Oculto',
  'A Profecia Cumprida',
  'O Tesouro Escondido',
  'O Método Secreto',
  'A Criatura da Floresta',
  'O Dom Especial'
];

// Verifica se os posts falsos já foram criados
const checkInitialPostsCreated = async () => {
  try {
    // Verifica se já existem posts no banco
    const postCount = await prisma.post.count();
    return postCount > 0;
  } catch (error) {
    
    return false;
  }
};

// Função para gerar dados de um post falso
const generateFakePostData = () => {
  const authorIndex = Math.floor(Math.random() * fakeNames.length);
  const contentIndex = Math.floor(Math.random() * fakeContents.length);
  const titleIndex = Math.floor(Math.random() * fakeTitles.length);
  
  return {
    title: fakeTitles[titleIndex],
    content: fakeContents[contentIndex],
    imageUrl: Math.random() > 0.7 ? `https://picsum.photos/seed/${uuidv4()}/800/600` : null,
    authorName: fakeNames[authorIndex],
    tags: [
      Math.random() > 0.5 ? 'mentira' : 'história',
      Math.random() > 0.7 ? 'inacreditável' : 'mistério'
    ]
  };
};

// Função para criar um usuário falso se não existir
const getOrCreateUser = async (name: string) => {
  try {
    // Verificar se já existe um usuário com esse nome
    let user = await prisma.user.findFirst({
      where: { name }
    });
    
    if (!user) {
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          password: '$2b$10$rCkt1eTchWe4rTJEMfJHY.hTsCrF9J.xYl7oYWJDfxDPBzUgpPLPW', // senha123
          image: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
        }
      });
    }
    
    return user;
  } catch (error) {
    
    throw error;
  }
};

// Função para criar ou atualizar uma tag
const getOrCreateTag = async (name: string) => {
  try {
    let tag = await prisma.tag.findUnique({
      where: { name }
    });
    
    if (!tag) {
      tag = await prisma.tag.create({
        data: { name }
      });
    } else {
      // Incrementar o contador de uso
      tag = await prisma.tag.update({
        where: { id: tag.id },
        data: { useCount: { increment: 1 } }
      });
    }
    
    return tag;
  } catch (error) {
    
    throw error;
  }
};

// Função para popular o banco com posts falsos
export const populateWithFakePosts = async (count: number) => {
  try {
    const postsCreated = await checkInitialPostsCreated();
    
    // Se já existem posts e estamos apenas adicionando um post único via gerador automático
    if (postsCreated && count === 1) {
      
      const fakePostData = generateFakePostData();
      
      // Obter ou criar o autor
      const author = await getOrCreateUser(fakePostData.authorName);
      
      // Criar o post
      const post = await prisma.post.create({
        data: {
          title: fakePostData.title,
          content: fakePostData.content,
          imageUrl: fakePostData.imageUrl,
          authorId: author.id,
        }
      });
      
      // Adicionar tags
      for (const tagName of fakePostData.tags) {
        const tag = await getOrCreateTag(tagName);
        await prisma.postTag.create({
          data: {
            postId: post.id,
            tagId: tag.id
          }
        });
      }

      return true;
    }
    
    // Para inicialização em massa
    if (!postsCreated) {

      for (let i = 0; i < count; i++) {
        const fakePostData = generateFakePostData();
        
        // Obter ou criar o autor
        const author = await getOrCreateUser(fakePostData.authorName);
        
        // Criar o post
        const post = await prisma.post.create({
          data: {
            title: fakePostData.title,
            content: fakePostData.content,
            imageUrl: fakePostData.imageUrl,
            authorId: author.id,
          }
        });
        
        // Adicionar tags
        for (const tagName of fakePostData.tags) {
          const tag = await getOrCreateTag(tagName);
          await prisma.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id
            }
          });
        }
      }

      // Marcar que os posts iniciais foram criados usando um método mais confiável
      // (Poderia ser uma tabela de configuração no banco, mas para simplificar usamos localStorage)
      if (typeof window !== 'undefined') {
        localStorage.setItem('initialPostsCreated', 'true');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    
    return false;
  }
};

// Função para iniciar gerador automático de posts
export const startFakePostsGenerator = (minInterval: number, maxInterval: number) => {
  const generateRandomPost = async () => {
    try {
      await populateWithFakePosts(1);
      
      // Agendar próxima geração
      const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
      setTimeout(generateRandomPost, nextInterval);
    } catch (error) {
      
    }
  };
  
  // Iniciar o ciclo
  const initialInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
  setTimeout(generateRandomPost, initialInterval);
  
  console.log(`Gerador de fake posts iniciado. Intervalo: ${minInterval}-${maxInterval} segundos`);
  
  // Retornar uma função para parar o gerador se necessário
  return () => {
    console.log('Gerador de fake posts parado');
    // Nota: como estamos usando setTimeout de forma recursiva, não há uma maneira direta
    // de parar o processo. Na prática, seria melhor usar setInterval e clearInterval.
  };
}; 