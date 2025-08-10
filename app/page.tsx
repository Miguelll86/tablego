'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './hooks/useLanguage';
import LogoText from './components/LogoText';
import LanguageSelector from './components/LanguageSelector';
import { getWhatsAppUrl, getPhoneUrl, getEmailUrl } from './lib/config';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  type Particle = { id: number; left: number; top: number; delay: number; duration: number };
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Genera particelle solo sul client dopo il mount per evitare mismatch di idratazione
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    }));
    setParticles(generated);
  }, []);

  const whatsappMessage = "Ciao! Sono interessato a Tablo per il mio locale. Vorrei maggiori informazioni.";
  const emailSubject = "Interesse per Tablo";
  const emailBody = "Ciao, sono interessato a Tablo per il mio locale. Vorrei ricevere maggiori informazioni e un preventivo personalizzato.";

  // Le particelle sono generate in useEffect per evitare mismatch SSR/CSR

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sfondi Gradient con Dissolvenza */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-red-900 to-orange-900 animate-fade-in-out"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 animate-fade-in-out-delayed"></div>
      {/* Sfondo Dinamico */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-3 py-2">
        <div className="w-full flex justify-between items-center min-h-[72px]">
          <LogoText size="xl" forceWhite={true} />
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
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

      {/* Hero Section - Design Minimale */}
      <section className="relative z-10 px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <h1 className="text-12xl md:text-18xl font-black text-white mb-8 leading-tight tracking-wide drop-shadow-2xl">
              Gestisci il tuo locale in modo semplice e intelligente
            </h1>
            
            <p className="text-2xl md:text-4xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
              <strong className="text-white">{t('landing.heroSubtitle')}</strong>
            </p>

            {/* Social Proof Minimale */}
            <div className="flex justify-center items-center space-x-8 mb-12 text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⭐</span>
                <span>{t('landing.socialProof')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">🚀</span>
                <span>{t('landing.socialProofSetup')}</span>
              </div>
            </div>

            {/* CTA Principale - Solo Prova Gratis */}
            {!isAuthenticated ? (
              <div className="mb-12">
                <Link href="/demo-request" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    {t('landing.tryFree')} 7 Giorni
                  </div>
                </Link>
              </div>
            ) : (
              <div className="mb-12">
                <Link href="/dashboard" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                    {t('navigation.dashboard')}
                  </div>
                </Link>
              </div>
            )}

            {/* Garanzie Reali */}
            <div className="text-gray-400 text-base">
              {!isAuthenticated ? (
                <>
                  <span className="text-green-400">✓</span> Setup in 2 minuti • <span className="text-green-400">✓</span> Nessun abbonamento • <span className="text-green-400">✓</span> Supporto incluso
                </>
              ) : (
                <>
                  <span className="text-green-400">✓</span> Benvenuto • <span className="text-green-400">✓</span> Accesso completo • <span className="text-green-400">✓</span> Supporto incluso
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problema - Soluzione - Design Minimale */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Problema */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">Le Sfide Attuali</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                I ristoratori italiani affrontano sfide quotidiane che limitano la crescita:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Perdita di ricavi per menu non ottimizzati</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Gestione manuale che consuma tempo prezioso</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Esperienza cliente compromessa da attese</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Costi elevati per abbonamenti mensili</span>
                </li>
              </ul>
            </div>

            {/* Soluzione */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
              <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">La Soluzione Tablo</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Una piattaforma completa che risolve tutti i problemi con tecnologie AI avanzate:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>AI che ottimizza automaticamente i profitti</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Gestione automatica che libera tempo</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>QR menu che velocizza gli ordini</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">•</span>
                  <span>79€ una tantum, nessun abbonamento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Funzionalità Uniche - Design Minimale */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-8xl md:text-10xl font-bold text-white mb-4 drop-shadow-lg">
              Tecnologie AI Avanzate
            </h2>
            <p className="text-lg text-gray-300">
              Funzionalità esclusive che ti danno un vantaggio competitivo reale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">AI Menu Optimization</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Algoritmi di machine learning analizzano stagionalità, meteo e vendite per suggerirti il menu ottimale.
              </p>
              <div className="text-orange-400 font-semibold text-sm">→ +30% profitti medi</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Multi-Language QR Menu</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Sistema di traduzione automatica con 50+ lingue e conversione valuta in tempo reale.
              </p>
              <div className="text-orange-400 font-semibold text-sm">→ +50% ordini turistici</div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300">
              <div className="text-4xl mb-3">🍃</div>
              <h3 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Seasonal Analysis</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Analisi predittiva che suggerisce ingredienti stagionali e ottimizza i costi.
              </p>
              <div className="text-orange-400 font-semibold text-sm">→ -25% sprechi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trasparenza - Niente recensioni (ancora) */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
            <h2 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              È tutto nuovo...e trasparente
            </h2>
            <div className="mt-6 text-gray-400 text-sm">
              La scelta più semplice: prova subito, senza rischi, e valuta tu stesso.
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/demo-request" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all">
                Prova Gratis 7 Giorni
              </Link>
              <Link href="/demo" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-slate-900 transition-all">
                Vedi Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prezzi - Design Minimale */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md rounded-2xl p-8 border border-orange-500/30">
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Solo 79€ Una Tantum
            </h2>
            
            <div className="text-xl text-gray-300 mb-6">
              <span className="line-through text-gray-500">199€</span> 
              <span className="text-orange-400 font-bold ml-2">79€</span>
              <span className="text-sm text-gray-400 ml-2">(65% di sconto)</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-white font-semibold text-sm">Licenza Permanente</div>
                <div className="text-gray-400 text-xs">Nessun abbonamento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-white font-semibold text-sm">Supporto Enterprise</div>
                <div className="text-gray-400 text-xs">24/7 incluso</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-white font-semibold text-sm">Aggiornamenti AI</div>
                <div className="text-gray-400 text-xs">Nuove funzionalità incluse</div>
              </div>
            </div>
            
            <div className="flex justify-center">
              {!isAuthenticated ? (
                <Link href="/demo-request" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                    {t('landing.tryFree')} 7 Giorni
                  </div>
                </Link>
              ) : (
                <Link href="/dashboard" className="group relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-xl">
                    {t('navigation.dashboard')}
                  </div>
                </Link>
              )}
            </div>

            <div className="text-gray-400 text-xs mt-4">
              ⚡ Setup in 2 minuti • 🔒 Crittografia AES-256 • 📱 Compatibile tutti i dispositivi
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Design Minimale */}
      {/* Contact Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              🚀 Pronto a Iniziare? Contattami!
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Supporto diretto e personalizzato per il tuo locale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={getWhatsAppUrl(whatsappMessage)} 
                target="_blank"
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                📱 WhatsApp
              </a>
              <a 
                href={getEmailUrl(emailSubject, emailBody)} 
                className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                ✉️ Email
              </a>
              <a 
                href={getPhoneUrl()} 
                className="bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
              >
                📞 Chiama
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              ⚡ Risposta entro 2 ore • 💬 Consulenza gratuita • 📊 Preventivo personalizzato
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-1 py-4 border-t border-white/10">
        <div className="w-full text-center min-h-[150px] flex flex-col justify-center">
          <div className="flex items-center justify-center mb-1">
            <LogoText size="md" forceWhite={true} />
          </div>
          <p className="text-gray-400 text-sm mb-1">
            © 2025 Tablo. Il futuro della gestione locale.
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-400">
            <Link href="/pricing" className="hover:text-white transition-colors">{t('landing.pricing')}</Link>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="hover:text-white transition-colors">{t('landing.login')}</Link>
                <Link href="/register" className="hover:text-white transition-colors">{t('landing.register')}</Link>
                <Link href="/demo-request" className="hover:text-white transition-colors">{t('landing.tryFree')}</Link>
              </>
            ) : (
              <Link href="/dashboard" className="hover:text-white transition-colors">{t('navigation.dashboard')}</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
