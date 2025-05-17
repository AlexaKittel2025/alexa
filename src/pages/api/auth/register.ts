import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Redirecionar para o endpoint correto
  res.redirect(307, '/api/users/register');
} 