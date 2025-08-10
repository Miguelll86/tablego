'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import LogoText from '../components/LogoText';
import LanguageSelector from '../components/LanguageSelector';
import { getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '../lib/config';

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'support'>('pro');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <LogoText size="lg" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Prezzi Semplici e Trasparenti
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Acquista una volta, usa per sempre. Nessun abbonamento nascosto, nessuna sorpresa.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* One-Time Purchase */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border-2 border-orange-200 dark:border-orange-800 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
              PIÙ POPOLARE
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Tablo Pro
              </h2>
              <div className="mb-6">
                <span className="text-6xl font-bold text-orange-600">79€</span>
                <span className="text-gray-500 dark:text-gray-400 text-xl"> una tantum</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Acquista una volta, usa per sempre. Nessun costo ricorrente.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Tutte le funzionalità AI incluse</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Menu digitali illimitati</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Gestione tavoli e ordini</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Sistema pagamenti integrato</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">QR code personalizzati</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Analytics e report</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Aggiornamenti gratuiti</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Supporto email base</span>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href="mailto:info@tablo.com?subject=Acquisto Tablo Pro - 79€&body=Ciao, vorrei acquistare Tablo Pro per il mio ristorante. Attendo vostre indicazioni per il pagamento." 
                className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg text-center"
              >
                💳 Acquista Ora - 79€
              </a>
              <a 
                href={getWhatsAppUrl("Ciao! Vorrei informazioni su Tablo Pro (79€) per il mio locale.")}
                target="_blank"
                className="block w-full border-2 border-orange-500 text-orange-600 py-3 px-8 rounded-2xl font-bold text-base hover:bg-orange-50 transition-all text-center"
              >
                💬 Contattami su WhatsApp
              </a>
            </div>
          </div>

          {/* Support Package */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Supporto Premium
              </h2>
              <div className="mb-6">
                <span className="text-6xl font-bold text-blue-600">39€</span>
                <span className="text-gray-500 dark:text-gray-400 text-xl">/anno</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Assistenza dedicata e prioritaria. Opzionale e rinnovabile.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Supporto telefonico dedicato</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Assistenza remota 24/7</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Configurazione personalizzata</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Training staff</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Integrazione sistemi esistenti</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Backup e sicurezza avanzata</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Consulenza strategica</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-3">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Rinnovo annuale opzionale</span>
              </div>
            </div>

            <div className="space-y-3">
              <a 
                href="mailto:info@tablo.com?subject=Supporto Premium - 39€/anno&body=Ciao, vorrei aggiungere il Supporto Premium al mio account Tablo. Attendo vostre indicazioni." 
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg text-center"
              >
                📞 Aggiungi Supporto - 39€/anno
              </a>
              <a 
                href={getWhatsAppUrl("Ciao! Vorrei informazioni sul Supporto Premium (39€/anno) per Tablo.")}
                target="_blank"
                className="block w-full border-2 border-blue-500 text-blue-600 py-3 px-8 rounded-2xl font-bold text-base hover:bg-blue-50 transition-all text-center"
              >
                💬 Chiedi Info su WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Domande Frequenti
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                🤔 Come funziona l'acquisto?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Paghi 79€ una volta sola e hai accesso completo a Tablo per sempre. Nessun abbonamento, nessun costo ricorrente.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                🆘 Il supporto è obbligatorio?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No! Il supporto premium è completamente opzionale. Puoi usare Tablo senza problemi anche senza supporto.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                🔄 Posso rinnovare il supporto?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sì! Il supporto premium si rinnova annualmente a 39€. Puoi disattivarlo quando vuoi.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                📱 Funziona su tutti i dispositivi?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Assolutamente! Tablo è una Progressive Web App che funziona su smartphone, tablet e computer.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">
              💬 Hai Domande? Contattami Direttamente!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Supporto personalizzato per ogni esigenza del tuo ristorante
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <a 
                href={getWhatsAppUrl("Ciao! Vorrei informazioni su Tablo per il mio ristorante.")}
                target="_blank"
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                📱 WhatsApp
              </a>
              <a 
                href="mailto:info@tablo.com?subject=Informazioni su Tablo&body=Ciao, vorrei maggiori informazioni su Tablo per il mio ristorante." 
                className="bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                ✉️ Email
              </a>
              <a 
                href={getPhoneUrl()} 
                className="bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
              >
                📞 Chiamami
              </a>
            </div>
            <p className="text-sm opacity-75 mt-6">
              Risposta garantita entro 2 ore • Consulenza gratuita • Preventivo personalizzato
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Pronto a Trasformare il Tuo Ristorante?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Unisciti a centinaia di ristoranti che hanno già scelto Tablo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/demo-request" 
                className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Prova Gratis per 7 Giorni
              </Link>
              <Link 
                href="/demo" 
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all"
              >
                Vedi Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 