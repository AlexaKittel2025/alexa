import React from 'react';
import { Link } from 'react-router-dom';

interface UserProfileLinkProps {
  userId: string | undefined;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const UserProfileLink: React.FC<UserProfileLinkProps> = ({ userId = '', children, className = '', onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Link to={`/user/${userId}`} className={className} onClick={onClick ? handleClick : undefined}>
      {children}
    </Link>
  );
};

export default UserProfileLink; 