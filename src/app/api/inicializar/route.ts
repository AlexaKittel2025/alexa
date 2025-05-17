import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { populateWithFakePosts } from '@/utils/fakePosts';

export async function GET(req: Request) {
  try {
    // Verificar se há usuários no sistema
    const userCount = await prisma.user.count();
    
    // Criar usuário de teste se não existir nenhum
    if (userCount === 0) {
      console.log('Criando usuário de teste...');
      
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name: 'Usuário Teste',
          email: 'teste@exemplo.com',
          password: hashedPassword,
          image: 'https://i.pravatar.cc/150?u=teste',
        }
      });
      
      console.log('Usuário de teste criado:', user.id);
      
      // Criar estatísticas para o usuário
      await prisma.userStats.create({
        data: {
          userId: user.id,
          totalPontos: 0,
          qtdPosts: 0,
          qtdReacoes: 0
        }
      });
      
      // Criar tags iniciais
      const tagNames = ['mentira', 'história', 'inacreditável', 'mistério', 'engraçado', 'bizarro', 'política', 'tecnologia', 'aliens', 'conspiração'];
      
      for (const tagName of tagNames) {
        await prisma.tag.create({
          data: {
            name: tagName
          }
        });
      }
      
      // Criar posts falsos
      await populateWithFakePosts(10);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso',
      userCount: await prisma.user.count(),
      postCount: await prisma.post.count(),
      tagCount: await prisma.tag.count()
    });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao inicializar banco de dados',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 