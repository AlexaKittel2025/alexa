'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  { label: 'Pesquisar', href: '/search', icon: FaSearch },
  { label: 'Explorar', href: '/explorar', icon: FaMagic },
  { label: 'Batalhas', href: '/batalhas', icon: FaSmile, activeIcon: FaSmile },
  { label: 'Criar', href: '/nova-mentira', icon: FaPlus },
  { label: 'Notificações', href: '/notificacoes', icon: FaHeart, activeIcon: FaHeart },
  { label: 'Mensagens', href: '/chat', icon: FaComment },
  { label: 'Perfil', href: '/perfil', icon: FaUser, activeIcon: FaUser },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 w-[72px] lg:w-[244px] xl:w-[275px] h-full bg-white border-r border-gray-200">
      <div className="flex flex-col h-full px-3 py-7">
        {/* Logo */}
        <div className="px-3 mb-7">
          <Link href="/">
            <h1 className="text-2xl font-bold hidden lg:block">Mentei</h1>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center lg:hidden">
              <span className="text-white font-bold">M</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${
                      isActive ? 'text-gray-900' : 'text-gray-700 group-hover:scale-105'
                    }`} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Settings */}
        <div className="space-y-1">
          <Link
            href="/perfil"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/images/avatar-placeholder.jpg"
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block">
              <p className="font-medium text-sm">Meu Perfil</p>
              <p className="text-xs text-gray-500">@usuario</p>
            </div>
          </Link>
          
          <button className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 w-full">
            <FaSignOutAlt className="w-6 h-6 text-gray-700" />
            <span className="hidden lg:block">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
