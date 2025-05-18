'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import {
  FaHome,
  FaSearch,
  FaBell,
  FaComment,
  FaUser,
  FaCog,
  FaBars,
  FaHeart,
  FaBookmark,
  FaPlus,
  FaSmile,
  FaMagic,
  FaSignOutAlt
} from 'react-icons/fa';

const menuItems = [
  { label: 'Início', href: '/', icon: FaHome, activeIcon: FaHome },
  { label: 'Explorar', href: '/explorar', icon: FaMagic },
  { label: 'Batalhas', href: '/batalhas', icon: FaSmile, activeIcon: FaSmile },
  { label: 'Criar', href: '/nova-mentira', icon: FaPlus },
  { label: 'Notificações', href: '/notificacoes', icon: FaHeart, activeIcon: FaHeart },
  { label: 'Mensagens', href: '/chat', icon: FaComment },
  { label: 'Configurações', href: '/configuracoes', icon: FaCog, activeIcon: FaCog },
];

// Memoized menu item component
const MenuItem = memo(({ item, isActive }: { item: typeof menuItems[0]; isActive: boolean }) => {
  const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
  
  return (
    <li key={item.href}>
      <Link
        href={item.href}
        className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
        prefetch={true}
      >
        <Icon className="w-6 h-6" />
        <span className="hidden lg:block">{item.label}</span>
      </Link>
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

const OptimizedSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    avatar: '/images/avatar-placeholder.jpg',
    username: 'usuario',
    id: 'user-1'
  });

  useEffect(() => {
    const loadUserProfile = () => {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setUserProfile({
            avatar: profile.avatar || '/images/avatar-placeholder.jpg',
            username: profile.username || 'usuario',
            id: profile.id || 'user-1'
          });
        } catch (error) {
          
        }
      }
    };

    loadUserProfile();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile') {
        loadUserProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const handleProfileUpdate = () => {
      loadUserProfile();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 w-[72px] lg:w-[244px] xl:w-[275px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full px-3 py-7">
        {/* Logo */}
        <div className="px-3 mb-7">
          <Link href="/" prefetch={true}>
            <h1 className="text-2xl font-bold hidden lg:block text-gray-900 dark:text-white transition-colors">Mentei</h1>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center lg:hidden">
              <span className="text-white font-bold">M</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <MenuItem 
                key={item.href} 
                item={item} 
                isActive={pathname === item.href} 
              />
            ))}
          </ul>
        </nav>

        {/* User Profile & Settings */}
        <div className="space-y-1">
          <Link
            href="/meu-perfil"
            prefetch={true}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {userProfile.avatar.startsWith('data:') || userProfile.avatar.startsWith('http') ? (
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={userProfile.avatar}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="hidden lg:block">
              <p className="font-medium text-sm text-gray-900 dark:text-white">Meu Perfil</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{userProfile.username}</p>
            </div>
          </Link>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 w-full"
          >
            <FaSignOutAlt className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <span className="hidden lg:block text-gray-900 dark:text-white">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default memo(OptimizedSidebar);