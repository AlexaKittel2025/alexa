/**
 * Sistema de permissões para garantir isolamento de dados entre usuários
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export interface UserPermission {
  userId: string;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  isOwner: boolean;
}

/**
 * Verifica se o usuário atual é o proprietário do recurso
 */
export async function isResourceOwner(
  request: NextRequest,
  resourceOwnerId: string
): Promise<boolean> {
  const token = await getToken({ 
    req: request,
    secret: process.env.JWT_SECRET 
  });
  
  if (!token || !token.id) {
    return false;
  }
  
  return token.id === resourceOwnerId;
}

/**
 * Obtém as permissões do usuário para um recurso específico
 */
export async function getUserPermissions(
  request: NextRequest,
  resourceOwnerId: string
): Promise<UserPermission> {
  const token = await getToken({ 
    req: request,
    secret: process.env.JWT_SECRET 
  });
  
  if (!token || !token.id) {
    return {
      userId: '',
      canEdit: false,
      canDelete: false,
      canView: true, // Recursos públicos podem ser visualizados
      isOwner: false
    };
  }
  
  const isOwner = token.id === resourceOwnerId;
  
  return {
    userId: token.id as string,
    canEdit: isOwner,
    canDelete: isOwner,
    canView: true,
    isOwner: isOwner
  };
}

/**
 * Verifica se o usuário está autenticado
 */
export async function requireAuth(request: NextRequest): Promise<string | null> {
  const token = await getToken({ 
    req: request,
    secret: process.env.JWT_SECRET 
  });
  
  if (!token || !token.id) {
    return null;
  }
  
  return token.id as string;
}

/**
 * Verifica se o usuário tem permissão para editar o recurso
 */
export async function canEditResource(
  request: NextRequest,
  resourceOwnerId: string
): Promise<boolean> {
  const permissions = await getUserPermissions(request, resourceOwnerId);
  return permissions.canEdit;
}

/**
 * Verifica se o usuário tem permissão para deletar o recurso
 */
export async function canDeleteResource(
  request: NextRequest,
  resourceOwnerId: string
): Promise<boolean> {
  const permissions = await getUserPermissions(request, resourceOwnerId);
  return permissions.canDelete;
}

/**
 * Obtém o ID do usuário atual da sessão
 */
export async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  const token = await getToken({ 
    req: request,
    secret: process.env.JWT_SECRET 
  });
  
  return token?.id as string | null;
}

/**
 * Validação de parâmetros de rotas para prevenir acesso não autorizado
 */
export function sanitizeRouteParams(params: any): { [key: string]: string } {
  const sanitized: { [key: string]: string } = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      // Remove caracteres especiais que possam ser usados para SQL injection
      sanitized[key] = value.replace(/[^\w-]/g, '');
    }
  }
  
  return sanitized;
}