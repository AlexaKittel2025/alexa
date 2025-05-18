'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { FaCrown, FaRandom, FaImage, FaTrophy, FaGem, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PlanoPro() {
  const [user, loading] = useAuthState(auth);
  const [isPro, setIsPro] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Verificar se o usuário já é Pro (simulação)
    if (user) {
      const userIsPro = localStorage.getItem(`user_${user.uid}_isPro`) === 'true';
      setIsPro(userIsPro);
    }
  }, [user]);
  
  const handleAssinar = async () => {
    // Simulação de processamento de pagamento
    if (!user) {
      router.push('/login');
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulação de processamento de pagamento (2 segundos)
    setTimeout(() => {
      // Em produção, isso seria integrado com um sistema de pagamento real
      localStorage.setItem(`user_${user.uid}_isPro`, 'true');
      setIsPro(true);
      setProcessingPayment(false);
    }, 2000);
  };
  
  const handleCancelar = () => {
    // Simulação de cancelamento do plano
    if (user) {
      localStorage.removeItem(`user_${user.uid}_isPro`);
      setIsPro(false);
    }
  };
  
  return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 text-center text-white">
            <div className="flex justify-center mb-4">
              <FaCrown className="text-yellow-300 text-4xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Mentei Pro</h1>
            <p className="text-xl text-purple-100">Desbloqueie recursos exclusivos por apenas R$10,00/mês</p>
          </div>
        </div>
        
        {!isPro ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recursos exclusivos do plano Pro</h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaRandom className="text-purple-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Gerador de mentiras aleatórias</h3>
                    <p className="text-gray-600">Crie mentiras hilariantes com um clique quando estiver sem inspiração.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <FaCrown className="text-yellow-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Badge exclusivo no perfil</h3>
                    <p className="text-gray-600">Mostre a todos que você é um mentiroso profissional com nossa coroa exclusiva.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <FaImage className="text-purple-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Upload de múltiplas imagens</h3>
                    <p className="text-gray-600">Adicione até 5 imagens em suas mentiras para torná-las mais convincentes.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <FaTrophy className="text-purple-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Dobro de pontos no ranking</h3>
                    <p className="text-gray-600">Receba o dobro de pontos por cada reação em suas mentiras.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <FaGem className="text-blue-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Recursos futuros exclusivos</h3>
                    <p className="text-gray-600">Acesso antecipado a novos recursos que serão adicionados à plataforma.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800">Assine agora mesmo!</h2>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-800">R$ 10,00</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Cancele a qualquer momento</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-gray-700">Acesso a todos os recursos Pro</span>
                </div>
                
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </div>
                
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span className="text-gray-700">Cancele quando quiser</span>
                </div>
              </div>
              
              {user ? (
                <button
                  onClick={handleAssinar}
                  disabled={processingPayment}
                  className="w-full py-3 px-4 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                >
                  {processingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      Assinar agora <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              ) : (
                <Link href="/login" className="w-full py-3 px-4 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center">
                  Faça login para assinar <FaArrowRight className="ml-2" />
                </Link>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Ao assinar, você concorda com nossos <Link href="/termos" className="text-purple-600 hover:underline">termos de serviço</Link> e <Link href="/privacidade" className="text-purple-600 hover:underline">política de privacidade</Link>.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center">
                <FaCrown className="text-yellow-500 text-4xl" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Você já é um assinante Pro!</h2>
            <p className="text-gray-600 mb-6">
              Aproveite todos os recursos exclusivos do Mentei Pro.
            </p>
            
            <div className="flex justify-center">
              <Link href="/" className="px-6 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mr-4">
                Voltar para a página inicial
              </Link>
              
              <button
                onClick={handleCancelar}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Cancelar assinatura
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Perguntas frequentes</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Como funciona o pagamento?</h3>
              <p className="text-gray-600">O pagamento é feito mensalmente via cartão de crédito ou PIX. Você pode cancelar a qualquer momento.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">Posso cancelar quando quiser?</h3>
              <p className="text-gray-600">Sim, você pode cancelar sua assinatura a qualquer momento. O acesso aos recursos Pro continuará até o fim do período pago.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800">Como obtenho suporte?</h3>
              <p className="text-gray-600">Assinantes Pro têm acesso a suporte prioritário através do email suporte@mentei.com.br</p>
            </div>
          </div>
        </div>
      </div>
  );
} 