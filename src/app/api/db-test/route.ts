import { NextResponse } from 'next/server';
import { testDbConnection } from '@/lib/db';

export async function GET() {
  try {
    // Testa a conexão com o banco de dados
    const connectionResult = await testDbConnection();
    
    if (!connectionResult.success) {
      return NextResponse.json(
        { error: connectionResult.error || 'Falha na conexão com o banco de dados PostgreSQL' },
        { status: 500 }
      );
    }

    // Retorna as informações da conexão
    return NextResponse.json({
      success: true,
      message: connectionResult.message,
      version: connectionResult.version,
      timestamp: connectionResult.timestamp
    });
  } catch (error) {
    console.error('Erro ao testar a conexão com o banco de dados:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao testar a conexão com o banco de dados',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 