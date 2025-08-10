'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  forceWhite?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', forceWhite = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const sizeClasses = {
    xs: 'w-16 h-16',   // 64px
    sm: 'w-24 h-24',   // 96px
    md: 'w-32 h-32',   // 128px
    lg: 'w-48 h-48',   // 192px
    xl: 'w-64 h-64'    // 256px
  } as const;

  if (!isMounted) {
    return <div className={`${sizeClasses[size]} ${className}`} />;
  }

  // Se forceWhite è true, usa sempre il logo bianco con ombra per visibilità
  // Altrimenti usa il logo adattivo per tema chiaro/scuro
  const logoClasses = forceWhite 
    ? `${sizeClasses[size]} ${className} object-contain filter brightness-0 invert drop-shadow-2xl m-0 p-0 block`
    : `${sizeClasses[size]} ${className} object-contain filter brightness-0 dark:brightness-0 dark:invert m-0 p-0 block`;

  const logoStyle = forceWhite ? {
    filter: 'brightness(0) invert(1)',
    dropShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.5)',
    WebkitFilter: 'brightness(0) invert(1) drop-shadow(0 25px 50px -12px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.5))'
  } : {};

  // Allinea xl a 256px anche via style
  const inlineSizeStyle = size === 'xl' ? { width: 256, height: 256, ...logoStyle } : logoStyle;

  return (
    <Image
      src="/logo.svg"
      alt="Tablo Logo"
      width={size === 'xl' ? 256 : 400}
      height={size === 'xl' ? 256 : 400}
      className={logoClasses}
      style={inlineSizeStyle}
      priority
    />
  );
};

export default Logo; 