'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaMapMarkerAlt, FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';
import Link from 'next/link';

interface User {
  id: string;
  displayName: string;
  photoURL: string | null;
  location?: {
    city: string;
    state: string;
    neighborhood?: string;
  };
  score: number;
}

interface LocationRanking {
  [locationKey: string]: User[];
}

export default function LocalRanking() {
  const [rankings, setRankings] = useState<LocationRanking>({});
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchLocalRankings();
  }, []);
  
  const fetchLocalRankings = async () => {
    try {
      setIsLoading(true);
      
      // Em um app real, você usaria geolocalização ou seleção do usuário
      // para determinar as localizações relevantes
      
      const usersQuery = query(
        collection(db, 'users'),
        where('location', '!=', null),
        orderBy('location'),
        orderBy('score', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(usersQuery);
      
      const locationMap: LocationRanking = {};
      const locations: string[] = [];
      
      snapshot.docs.forEach(doc => {
        const userData = doc.data() as Omit<User, 'id'>;
        const user: User = {
          id: doc.id,
          ...userData,
          score: userData.score || 0
        };
        
        if (user.location) {
          // Criar chaves para cidade e bairro (se disponível)
          const cityKey = `${user.location.city}-${user.location.state}`;
          if (!locationMap[cityKey]) {
            locationMap[cityKey] = [];
            locations.push(cityKey);
          }
          
          // Adicionar usuário ao ranking da cidade
          if (locationMap[cityKey].length < 10) {
            locationMap[cityKey].push(user);
          }
          
          // Se tiver bairro, adicionar ao ranking do bairro também
          if (user.location.neighborhood) {
            const neighborhoodKey = `${user.location.neighborhood}, ${user.location.city}-${user.location.state}`;
            if (!locationMap[neighborhoodKey]) {
              locationMap[neighborhoodKey] = [];
              locations.push(neighborhoodKey);
            }
            
            if (locationMap[neighborhoodKey].length < 10) {
              locationMap[neighborhoodKey].push(user);
            }
          }
        }
      });
      
      setRankings(locationMap);
      setAvailableLocations(locations);
      
      // Selecionar a primeira localização como padrão
      if (locations.length > 0 && !selectedLocation) {
        setSelectedLocation(locations[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar rankings locais:', error);
      setIsLoading(false);
    }
  };
  
  // Função auxiliar para renderizar ícone de posição
  const renderPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <FaCrown className="text-yellow-500" size={18} />;
      case 1:
        return <FaTrophy className="text-gray-400" size={18} />;
      case 2:
        return <FaMedal className="text-yellow-700" size={18} />;
      default:
        return <span className="text-gray-500 font-medium">{position + 1}</span>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Ranking da sua região</h2>
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (availableLocations.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-purple-800">Ranking da sua região</h2>
        <p className="text-center text-gray-600 py-4">
          Não temos rankings locais disponíveis no momento.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-purple-800 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-purple-600" />
        Ranking da sua região
      </h2>
      
      <div className="mb-6">
        <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">
          Selecione a localização:
        </label>
        <select
          id="location-select"
          value={selectedLocation || ''}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {availableLocations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
      
      {selectedLocation && rankings[selectedLocation] && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Os maiores mentirosos de {selectedLocation}
          </h3>
          
          <div className="space-y-3">
            {rankings[selectedLocation].map((user, index) => (
              <Link
                key={user.id}
                href={`/perfil/${user.id}`}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-purple-50 transition-colors"
              >
                <div className="w-8 mr-3 flex justify-center">
                  {renderPositionIcon(index)}
                </div>
                
                <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center mr-3 overflow-hidden">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-lg font-semibold text-purple-700">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{user.displayName}</h4>
                  {user.location?.neighborhood && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaMapMarkerAlt className="mr-1" size={10} />
                      {user.location.neighborhood}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center text-purple-700 font-semibold">
                  <span>{user.score}</span>
                  <span className="text-xs ml-1">pts</span>
                </div>
              </Link>
            ))}
            
            {rankings[selectedLocation].length === 0 && (
              <p className="text-center text-gray-600 py-4">
                Nenhum mentiroso encontrado nesta região.
              </p>
            )}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            Atualize seu perfil com sua localização para aparecer no ranking local!
          </p>
        </div>
      )}
    </div>
  );
} 