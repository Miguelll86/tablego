'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoText from '../components/LogoText';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondi Gradient con Dissolvenza */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-red-900 to-orange-900 animate-fade-in-out"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 animate-fade-in-out-delayed"></div>

      {/* Header */}
      <header className="relative z-10 px-1 py-2">
        <div className="w-full flex justify-between items-center min-h-[120px]">
          <Link href="/">
            <LogoText size="xl" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-white/80 hover:text-white transition-colors border-b-2 border-white">
              {t('landing.about') || 'Chi siamo'}
            </Link>
            <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
              {t('landing.pricing') || 'Prezzi'}
            </Link>
            {!isAuthenticated ? (
              <>
                <Link href="/register" className="text-white/80 hover:text-white transition-colors">
                  {t('landing.register') || 'Registrati'}
                </Link>
                <Link href="/login" className="text-white/80 hover:text-white transition-colors">
                  {t('landing.login') || 'Accedi'}
                </Link>
                <Link href="/demo-request" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all text-sm">
                  {t('landing.tryFree') || 'Prova Gratis'}
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all">
                {t('navigation.dashboard') || 'Dashboard'}
              </Link>
            )}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-wide text-center">
              Chi Siamo
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
              {/* Storia */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">La Nostra Storia</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Tablo nasce dalla passione per l'innovazione nel settore della ristorazione. 
                  Fondata nel 2024, la nostra missione è quella di rivoluzionare la gestione 
                  dei ristoranti attraverso tecnologie all'avanguardia.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Partendo dalle esigenze reali dei ristoratori italiani, abbiamo sviluppato 
                  una piattaforma completa che semplifica ogni aspetto della gestione quotidiana.
                </p>
              </div>

              {/* Missione */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">La Nostra Missione</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Vogliamo che ogni ristorante possa concentrarsi su quello che sa fare meglio: 
                  creare esperienze culinarie straordinarie per i propri clienti.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Tablo elimina la complessità della gestione amministrativa, permettendo ai 
                  ristoratori di dedicare più tempo alla loro passione: la cucina.
                </p>
              </div>

              {/* Valori */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">I Nostri Valori</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>Innovazione:</strong> Tecnologie all'avanguardia per risultati eccellenti
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>Semplicità:</strong> Interfacce intuitive per tutti i livelli di esperienza
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>Supporto:</strong> Assistenza dedicata per ogni esigenza
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    <strong>Qualità:</strong> Soluzioni affidabili e testate sul campo
                  </li>
                </ul>
              </div>

              {/* Team */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Il Nostro Team</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Siamo un team di sviluppatori, designer e esperti del settore 
                  ristorativo che condividono la stessa visione.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Ogni giorno lavoriamo per migliorare Tablo, ascoltando i feedback 
                  dei nostri clienti e implementando nuove funzionalità.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-bold text-white mb-6">
                Pronto a Rivoluzionare il Tuo Ristorante?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/demo-request" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all text-lg"
                >
                  Prova Gratis 7 Giorni
                </Link>
                <Link 
                  href="/register" 
                  className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-lg font-bold hover:bg-white/20 transition-all text-lg border border-white/20"
                >
                  Registrati Ora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
