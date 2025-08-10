'use client';

import Logo from './Logo';

interface LogoTextProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  forceWhite?: boolean;
}

export default function LogoText({ size = 'md', showTagline = false, className = '', forceWhite = false }: LogoTextProps) {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className} m-0 p-0`}>
      <Logo size={size} forceWhite={forceWhite} />
      {showTagline && (
        <div className="ml-3">
          <p className={`${taglineSizes[size]} text-gray-300 font-medium`}>
            Smart Restaurant Management
          </p>
        </div>
      )}
    </div>
  );
} 