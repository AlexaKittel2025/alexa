'use client';

import { FaComment } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PrivateChatButtonProps {
  userId: string;
  username: string;
  className?: string;
}

export default function PrivateChatButton({ userId, username, className = '' }: PrivateChatButtonProps) {
  const router = useRouter();

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navegar para o chat e definir a conversa
    router.push(`/chat?user=${userId}`);
  };

  return (
    <button
      onClick={handleChat}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${className}`}
      title={`Enviar mensagem para @${username}`}
    >
      <FaComment className="text-sm" />
      <span className="text-sm font-medium">Mensagem</span>
    </button>
  );
}