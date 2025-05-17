import React from 'react';

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

const ProBadge: React.FC<ProBadgeProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1'
  };
  
  return (
    <div className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg flex items-center justify-center ${sizeClasses[size]}`}>
      <span className="mr-0.5">⭐</span>
      <span>PRO</span>
    </div>
  );
};

export default ProBadge; 