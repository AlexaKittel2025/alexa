'use client';

import { useState, useEffect } from 'react';
import { FaBrain, FaCheck, FaClock, FaSmile, FaTimesCircle } from 'react-icons/fa';

interface QuizQuestion {
  id: number;
  statements: [string, string];
  correctIndex: number;
}

export default function TesteVerdade() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Gerar perguntas de teste
    const generatedQuestions = generateQuizQuestions();
    setQuestions(generatedQuestions);
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    // Timer para cada pergunta
    if (timeLeft <= 0 || selectedAnswer !== null) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
      
      if (timeLeft === 1) {
        // Tempo acabou, selecionar automaticamente uma resposta errada
        handleAnswer(Math.random() > 0.5 ? 0 : 1);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, selectedAnswer]);
  
  useEffect(() => {
    // Resetar timer quando muda a pergunta
    setTimeLeft(15);
  }, [currentQuestionIndex]);
  
  const generateQuizQuestions = (): QuizQuestion[] => {
    // Em um app real, estas perguntas viriam do banco de dados
    return [
      {
        id: 1,
        statements: [
          "Árvores conseguem se comunicar umas com as outras através de sinais químicos subterrâneos.",
          "Árvores produzem oxigênio apenas durante o dia, à noite elas consomem oxigênio igual aos humanos."
        ],
        correctIndex: 0 // A primeira é verdadeira, a segunda é mais implausível
      },
      {
        id: 2,
        statements: [
          "Pessoas usam apenas 10% do cérebro e poderiam desenvolver superpoderes se usassem mais.",
          "O cérebro humano pode criar falsas memórias que parecem completamente reais."
        ],
        correctIndex: 1 // A segunda é verdadeira, a primeira é um mito
      },
      {
        id: 3,
        statements: [
          "Água bebida em jejum é absorvida pelo corpo em apenas 7 segundos.",
          "Beber água gelada após refeições gordurosas pode solidificar os óleos e dificultar a digestão."
        ],
        correctIndex: 0 // Ambas são mitos, mas a primeira parece mais plausível
      },
      {
        id: 4,
        statements: [
          "Deixar o celular carregando durante a noite pode causar explosões na bateria.",
          "Usar o celular durante tempestades aumenta o risco de ser atingido por raios."
        ],
        correctIndex: 1 // Ambas são exageradas, mas a segunda é mais plausível
      },
      {
        id: 5,
        statements: [
          "Engolir chiclete faz com que ele fique no seu estômago por 7 anos.",
          "Os humanos engolem aproximadamente 8 aranhas durante o sono ao longo da vida."
        ],
        correctIndex: 0 // Ambas são falsas, mas a primeira parece mais plausível
      },
    ];
  };
  
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    // Verificar se a resposta está correta
    const isCorrect = index === questions[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Avançar para a próxima pergunta após um delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Fim do teste
        setShowResult(true);
      }
    }, 1500);
  };
  
  const resetQuiz = () => {
    // Gerar novas perguntas para um novo teste
    const newQuestions = generateQuizQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(15);
  };
  
  const getMentirosoScore = () => {
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 80) return { text: "Detector de Mentiras Profissional", emoji: "🕵️", percentage: 95 };
    if (percentage >= 60) return { text: "Bom em Detectar Mentiras", emoji: "🧐", percentage: 75 };
    if (percentage >= 40) return { text: "Mentiroso Nato", emoji: "🤥", percentage: 60 };
    if (percentage >= 20) return { text: "Ingênuo", emoji: "😇", percentage: 30 };
    return { text: "Extremamente Crédulo", emoji: "🤯", percentage: 10 };
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Teste de Verdade</h2>
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (showResult) {
    const result = getMentirosoScore();
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800 text-center">Resultado do Teste</h2>
        
        <div className="text-center py-6">
          <div className="text-7xl mb-4">{result.emoji}</div>
          <h3 className="text-2xl font-bold text-purple-700 mb-2">
            Você é {result.percentage}% {result.text}
          </h3>
          <p className="text-gray-600 mb-6">
            Você acertou {score} de {questions.length} questões!
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-purple-600 h-4 rounded-full" 
              style={{ width: `${result.percentage}%` }}
            ></div>
          </div>
          
          <p className="text-gray-700 mb-8">
            {result.percentage >= 60 
              ? "Você tem um olhar aguçado para distinguir o que é verdade do que é mentira. Seria um ótimo detector de fake news!"
              : "Você tende a acreditar facilmente no que ouve. Cuidado com as fake news por aí!"}
          </p>
          
          <button 
            onClick={resetQuiz}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2 text-purple-800 text-center">
        Teste de Verdade <FaBrain className="text-purple-600 inline ml-2" />
      </h2>
      
      <p className="text-center text-gray-600 mb-6">
        Qual destas afirmações parece mais plausível?
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </span>
        <span className={`flex items-center text-sm ${
          timeLeft <= 5 ? 'text-red-500' : 'text-gray-500'
        }`}>
          <FaClock className="mr-1" /> {timeLeft}s
        </span>
      </div>
      
      <div className="space-y-4 mb-6">
        {currentQuestion.statements.map((statement, index) => (
          <div 
            key={index}
            onClick={() => handleAnswer(index)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedAnswer === null
                ? 'border-purple-200 hover:border-purple-400'
                : selectedAnswer === index
                  ? index === currentQuestion.correctIndex
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : index === currentQuestion.correctIndex && selectedAnswer !== null
                    ? 'border-green-500 bg-green-50 opacity-70'
                    : 'border-gray-300 opacity-50'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {selectedAnswer !== null && (
                  index === currentQuestion.correctIndex
                    ? <FaCheck className="text-green-500" />
                    : selectedAnswer === index
                      ? <FaTimesCircle className="text-red-500" />
                      : null
                )}
              </div>
              <p className="text-gray-800">{statement}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Clique na afirmação que você acha mais plausível</p>
      </div>
    </div>
  );
} 