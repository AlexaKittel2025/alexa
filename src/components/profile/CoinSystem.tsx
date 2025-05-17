'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { FaCoins, FaHistory, FaArrowUp, FaArrowDown, FaTrophy, FaHeart, FaLaugh, FaCheckCircle } from 'react-icons/fa';

interface Transaction {
  id: string;
  type: 'gain' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
}

interface CoinSystemProps {
  userId: string;
}

export default function CoinSystem({ userId }: CoinSystemProps) {
  const [user] = useAuthState(auth);
  const [coins, setCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  
  const isCurrentUser = user?.uid === userId;
  
  useEffect(() => {
    fetchCoinData();
  }, [userId]);
  
  const fetchCoinData = async () => {
    try {
      setLoading(true);
      
      // Em um app real, buscaríamos do Firebase
      // Aqui estamos simulando com dados fictícios para demonstração
      
      // Simular busca de saldo
      const userDoc = {
        coins: Math.floor(Math.random() * 1000) + 100
      };
      
      setCoins(userDoc.coins);
      
      // Simular transações
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'gain',
          amount: 50,
          description: 'Mentira recebeu 10 reações',
          timestamp: new Date(Date.now() - 86400000) // Ontem
        },
        {
          id: '2',
          type: 'gain',
          amount: 100,
          description: 'Conquista desbloqueada: Mentiroso Nível 10',
          timestamp: new Date(Date.now() - 172800000) // 2 dias atrás
        },
        {
          id: '3',
          type: 'spend',
          amount: 150,
          description: 'Compra de emblema: Rei da Mentira',
          timestamp: new Date(Date.now() - 259200000) // 3 dias atrás
        },
        {
          id: '4',
          type: 'gain',
          amount: 20,
          description: 'Bônus diário de login',
          timestamp: new Date(Date.now() - 345600000) // 4 dias atrás
        },
        {
          id: '5',
          type: 'gain',
          amount: 200,
          description: 'Venceu 5 batalhas de mentiras',
          timestamp: new Date(Date.now() - 432000000) // 5 dias atrás
        },
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao buscar dados de moedas:', error);
      setLoading(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Sistema de Moedas</h2>
        <div className="flex justify-center items-center py-6">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-purple-800 flex items-center">
        <FaCoins className="text-yellow-500 mr-2" />
        Sistema de Moedas
      </h2>
      
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-lg shadow-md text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-purple-100">Seu saldo</h3>
            <div className="flex items-center mt-2">
              <FaCoins className="text-yellow-300 mr-2 text-2xl" />
              <span className="text-3xl font-bold">{coins}</span>
            </div>
          </div>
          
          {isCurrentUser && (
            <button 
              onClick={() => setShowTransactions(!showTransactions)}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center"
            >
              <FaHistory className="mr-2" />
              <span>Histórico</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Como ganhar moedas</h3>
        <ul className="space-y-3">
          <li className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <FaHeart className="text-green-600" />
            </div>
            <div>
              <p className="font-medium">Receba reações</p>
              <p className="text-sm text-gray-600">+2 moedas por "Quase Acreditei", +1 por "Hahaha", +5 por "Mentira Épica"</p>
            </div>
          </li>
          
          <li className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <FaTrophy className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Complete conquistas</p>
              <p className="text-sm text-gray-600">+50 a +500 moedas dependendo da dificuldade</p>
            </div>
          </li>
          
          <li className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <FaLaugh className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Vença batalhas de mentiras</p>
              <p className="text-sm text-gray-600">+10 moedas por vitória</p>
            </div>
          </li>
          
          <li className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <FaCheckCircle className="text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Faça login diariamente</p>
              <p className="text-sm text-gray-600">+5 moedas por dia (bônus crescente por dias consecutivos)</p>
            </div>
          </li>
        </ul>
      </div>
      
      {showTransactions && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FaHistory className="mr-2 text-gray-600" />
            Histórico de Transações
          </h3>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'gain' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="flex items-center justify-end">
                        {transaction.type === 'gain' ? (
                          <FaArrowUp className="mr-1" />
                        ) : (
                          <FaArrowDown className="mr-1" />
                        )}
                        {transaction.amount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 