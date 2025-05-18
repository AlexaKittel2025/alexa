import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import { UserDetailsService } from '@/services/UserDetailsService';
import { getToken } from "next-auth/jwt";

// GET - Obter dados do usuário atual
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.JWT_SECRET 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const user = await UserDetailsService.getUserWithDetails(token.id as string);
    return NextResponse.json(user);
  } catch (error) {

    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro ao buscar dados do usuário' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar dados do usuário atual
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.JWT_SECRET 
    });
    
    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Evitar que o usuário altere campos sensíveis
    const allowedFields = {
      name: body.name,
      bio: body.bio,
      photoUrl: body.photoUrl,
      website: body.website,
      location: body.location
    };
    
    const updatedUser = await UserDetailsService.updateUser(
      token.id as string, 
      allowedFields
    );
    
    return NextResponse.json(updatedUser);
  } catch (error) {

    if (error instanceof Error) {
      if (error.message === 'Usuário não encontrado') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'Dados já em uso por outro usuário' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}