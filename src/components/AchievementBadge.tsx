import React from 'react';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  withDetails?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md',
  withDetails = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div className="flex items-center">
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center ${withDetails ? 'mr-3' : ''}`}
        title={withDetails ? undefined : `${achievement.title}: ${achievement.description}`}
      >
        <span role="img" aria-label={achievement.title}>
          {achievement.icon}
        </span>
      </div>
      
      {withDetails && (
        <div>
          <h3 className="font-bold text-lg">{achievement.title}</h3>
          <p className="text-gray-600 text-sm">{achievement.description}</p>
          {achievement.earnedAt && (
            <p className="text-gray-500 text-xs mt-1">
              Conquistado em {new Date(achievement.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementBadge; 