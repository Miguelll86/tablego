'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gestisce il padding del main in base alla rotta (niente padding quando la sidebar è nascosta)
  useEffect(() => {
    if (!isMounted) return;
    const main = document.querySelector('main');
    if (!main) return;

    const hideRoutes = ['/', '/login'];
    if (hideRoutes.includes(pathname || '')) {
      main.classList.remove('md:pl-16', 'md:pl-56', 'pl-16', 'pl-56');
      (main as HTMLElement).style.transition = '';
    } else {
      main.classList.add('md:pl-16');
    }
  }, [pathname, isMounted]);

  const navigation = [
    { name: t('navigation.dashboard'), href: '/dashboard', icon: '📊' },
    { name: t('navigation.menu'), href: '/menu', icon: '🍽️' },
    { name: t('navigation.tables'), href: '/tables', icon: '🪑' },
    { name: t('navigation.reservations'), href: '/reservations', icon: '📅' },
    { name: t('navigation.orders'), href: '/orders', icon: '📋' },
    { name: t('navigation.settings'), href: '/settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => pathname === href;

  // Gestisci l'espansione al hover
  const handleMouseEnter = () => {
    if (!isMounted) return;
    setIsExpanded(true);
    // Aggiorna il padding del main con animazione rilassata
    const main = document.querySelector('main');
    if (main) {
      main.classList.remove('md:pl-16');
      main.classList.add('md:pl-56');
      main.style.transition = 'padding-left 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    }
  };

  const handleMouseLeave = () => {
    if (!isMounted) return;
    setIsExpanded(false);
    // Ripristina il padding del main con animazione rilassata
    const main = document.querySelector('main');
    if (main) {
      main.classList.remove('md:pl-56');
      main.classList.add('md:pl-16');
      main.style.transition = 'padding-left 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Nascondi la sidebar in home e login
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  // Evita problemi di idratazione
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay per mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar espandibile */}
      <div
        className={`
          fixed left-0 top-0 h-full
          border-r border-white/10
          bg-slate-900/70 backdrop-blur-xl
          transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-30
          ${isOpen ? 'w-64 md:w-72' : 'w-16 md:w-16'}
          md:hover:w-64 lg:hover:w-72
          shadow-2xl
        `}
        style={{ willChange: 'width, transform' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <div className={`transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isExpanded ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
            }`}>
              <Logo size="md" />
            </div>
            {user?.restaurant?.name && (
              <div className={`mt-2 text-center transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: isExpanded ? '50ms' : '0ms' }}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {user.restaurant.name}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium 
                  transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${isActive(item.href)
                    ? 'bg-blue-50/50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'text-gray-300 hover:bg-white/5'
                  }
                  ${isExpanded ? 'opacity-100' : 'opacity-70'}
                `}
                style={{
                  transitionDelay: isExpanded ? `${index * 25}ms` : '0ms'
                }}
              >
                <span className={`text-center transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded ? 'text-lg w-6' : 'text-2xl w-8'
                }`}>{item.icon}</span>
                <span className={`transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: isExpanded ? `${index * 25 + 50}ms` : '0ms' }}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-2 border-t border-white/10">
            <div className="space-y-2">
              <div className={`transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: isExpanded ? '100ms' : '0ms' }}>
                <LanguageSelector />
              </div>
              {user && (
                <div className={`transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                }`} style={{ transitionDelay: isExpanded ? '125ms' : '0ms' }}>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold text-center hover:bg-red-700 transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t('navigation.logout')}</span>
                  </button>
                </div>
              )}
              <div className={`text-xs text-gray-400 text-center transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: isExpanded ? '150ms' : '0ms' }}>
                © 2025 Tablo
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 