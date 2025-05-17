'use client';

import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-purple-800 dark:text-purple-400 mb-2">
            Entrar no Mentei
          </h1>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            A rede social de mentiras engraçadas
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative">
            <Link 
              href="/"
              className="absolute left-4 top-4 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center text-sm"
            >
              <FaArrowLeft className="mr-1" />
              <span>Voltar</span>
            </Link>
            <LoginForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}