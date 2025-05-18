import { NextRequest, NextResponse } from 'next/server';
import * as Ably from 'ably/promises';

export async function GET(req: NextRequest) {
  try {
    // Obter o ID do cliente da query, se disponível
    const clientId = req.nextUrl.searchParams.get('clientId') || 'anonymous-' + Math.random().toString(36).substring(2, 15);
    
    // Inicializar o cliente Ably
    const apiKey = process.env.ABLY_API_KEY;
    
    if (!apiKey) {
      
      return NextResponse.json(
        { error: 'Configuração incompleta do servidor' },
        { status: 500 }
      );
    }
    
    const client = new Ably.Rest(apiKey);
    
    // Gerar um token com o clientId
    const tokenRequestData = await client.auth.createTokenRequest({ clientId });
    
    // Retornar o token para o cliente
    return NextResponse.json(tokenRequestData);
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Falha ao gerar token' },
      { status: 500 }
    );
  }
} 