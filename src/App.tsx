import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import process from 'process';
import './App.css';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Trending from './pages/Trending';
import Battles from './pages/Battles';
import Chat from './pages/Chat';
import HallOfFame from './pages/HallOfFame';
import TestPage from './pages/TestPage';

// Layout
import AppLayout from './components/layouts/AppLayout';

// Provedores de contexto
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Corrigir o problema com process/browser
window.process = process;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    console.log('App.tsx: Componente inicializado');

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route 
                path="profile/:username" 
                element={<UserProfilePage />} 
              />
              <Route 
                path="user/:userId" 
                element={<UserProfilePage />} 
              />
              <Route path="settings/*" element={<SettingsPage />} />
              <Route path="trending" element={<Trending />} />
              <Route path="battles" element={<Battles />} />
              <Route path="chat" element={<Chat />} />
              <Route path="hall-of-fame" element={<HallOfFame />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
