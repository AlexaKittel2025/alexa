import type { NextApiRequest, NextApiResponse } from 'next';

// Habilita CORS manualmente
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

const allowCors = (handler: Function) => async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return handler(req, res);
};

export default allowCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Simulação de obtenção das configurações do usuário
    return res.status(200).json({
      userId: id,
      notifications: {
        email: true,
        push: true,
        mentions: true
      },
      privacy: {
        profileVisibility: 'public',
        showActivity: true
      },
      theme: 'light',
      language: 'pt-BR'
    });
  }

  if (req.method === 'PUT') {
    // Lógica de atualização das configurações do usuário
    const updatedSettings = req.body;
    
    // Aqui você normalmente salvaria no banco de dados
    // Simulação de resposta bem-sucedida
    return res.status(200).json({ 
      success: true,
      settings: {
        userId: id,
        ...updatedSettings,
        updatedAt: new Date().toISOString()
      }
    });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}); 