'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PostHeaderProps {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
}

export default function PostHeader({ user }: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3">
      <Link href={`/perfil/${user.id}`} className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={user.avatar || '/images/avatar-placeholder.jpg'}
            alt={user.username}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium text-sm">{user.username}</span>
      </Link>
      
      <button className="p-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
}