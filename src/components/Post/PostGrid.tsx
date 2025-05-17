'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaComment } from 'react-icons/fa';

interface PostGridProps {
  posts: Array<{
    id: string;
    image?: string;
    likes: number;
    comments: number;
    content: string;
  }>;
}

export default function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="relative aspect-square bg-gray-100 group overflow-hidden"
        >
          {post.image ? (
            <Image
              src={post.image}
              alt="Post"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100">
              <p className="text-sm text-gray-600 px-2 text-center line-clamp-3">
                {post.content}
              </p>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
            <div className="flex items-center gap-1">
              <FaHeart className="w-5 h-5" />
              <span className="font-medium">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComment className="w-5 h-5" />
              <span className="font-medium">{post.comments}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
