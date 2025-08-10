'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Image from 'next/image';
import LanguageSelector from '../components/LanguageSelector';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../hooks/useLanguage';

interface RestaurantSettings {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  stripeConfig: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    isConfigured: boolean;
  };
}

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (user?.restaurant?.id) {
      fetchSettings();
    }
  }, [user?.restaurant?.id]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.restaurant?.id) {
        setError('ID del ristorante non trovato');
        return;
      }
      
      const response = await fetch(`/api/settings?restaurantId=${user.restaurant.id}`);
      const data = await response.json();
      
      if (data.success) {
        // Rimuovi il campo success dalla risposta prima di impostare settings
        const { success, ...settingsData } = data;
        setSettings(settingsData);
      } else {
        setError(data.error || 'Errore nel caricamento delle impostazioni');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (formData: FormData) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      if (!user?.restaurant?.id) {
        setError('ID del ristorante non trovato');
        return;
      }

      // Converti FormData in oggetto JSON
      const jsonData: any = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value;
      }

      // Debug: log dei dati da inviare
      console.log('Dati JSON da inviare:', jsonData);
      
      const response = await fetch(`/api/settings?restaurantId=${user.restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Impostazioni salvate con successo!');
        // Aggiorna i settings locali con i nuovi dati
        const { success, ...settingsData } = data;
        setSettings(settingsData);
      } else {
        setError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSaving(false);
    }
  };

  const testStripeConnection = async () => {
    try {
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/settings/test-stripe', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        let message = data.message;
        if (data.note) {
          message += `\n\n${data.note}`;
        }
        setSuccess(message);
      } else {
        setError('Errore nella connessione Stripe: ' + data.error);
      }
    } catch (error) {
      setError('Errore nel test della connessione: ' + (error as Error).message);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 dark:bg-slate-800/70 dark:border-slate-700">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
      {/* Header con pulsante logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{t('navigation.logout')}</span>
          </button>
        </div>
      </div>

      {/* Modal di conferma logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('common.confirm')} {t('navigation.logout')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Sei sicuro di voler effettuare il logout? Dovrai effettuare nuovamente l'accesso per utilizzare l'applicazione.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenuto principale delle impostazioni */}
        {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}

        {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 shadow-md">
            {success}
          </div>
        )}

        {settings && (
        <form action={handleSaveSettings} className="space-y-8">
          {/* Personalizzazione Tema */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('settings.restaurantInfo')}</h2>
            
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('settings.restaurantName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={settings.name}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={settings.phone}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                </div>
                  </div>
                  
                  <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.email')}
                </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={settings.email}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {t('common.address')}
                </label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={settings.address}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t('common.description')}
                </label>
                <textarea
                  name="description"
                  defaultValue={settings.description}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

                  <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Logo
                    </label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleLogoChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                {logoPreview && (
                      <div className="mt-2">
                    <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Configurazione Stripe */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configurazione Pagamenti Stripe</h2>
            
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Nota:</strong> Inserisci le tue chiavi Stripe per abilitare i pagamenti con carta. 
                Il webhook secret è opzionale e serve solo per ricevere notifiche automatiche dei pagamenti completati.
              </p>
              {settings.stripeConfig.isConfigured && (
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  <strong>ℹ️ Chiavi già configurate:</strong> Le chiavi sono salvate ma non visibili per sicurezza. 
                  Inserisci nuovamente le chiavi se vuoi modificarle.
                </p>
              )}
              </div>

            <div className="space-y-6">
                <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Stripe Publishable Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="stripePublishableKey"
                  defaultValue={settings.stripeConfig.publishableKey.startsWith('***') ? '' : settings.stripeConfig.publishableKey}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="pk_test_..."
                  required
                  />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chiave pubblica che inizia con pk_test_ o pk_live_</p>
                </div>
                
                <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Stripe Secret Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="stripeSecretKey"
                  defaultValue={settings.stripeConfig.secretKey.startsWith('***') ? '' : settings.stripeConfig.secretKey}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="sk_test_..."
                  required
                  />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chiave segreta che inizia con sk_test_ o sk_live_</p>
                </div>
                
                <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Stripe Webhook Secret <span className="text-gray-500">(Opzionale)</span>
                  </label>
                  <input
                    type="password"
                    name="stripeWebhookSecret"
                  defaultValue={settings.stripeConfig.webhookSecret.startsWith('***') ? '' : settings.stripeConfig.webhookSecret}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="whsec_..."
                  />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chiave webhook che inizia con whsec_. Serve solo per notifiche automatiche. 
                  I pagamenti funzioneranno comunque senza questa chiave.
                </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Stato Connessione</p>
                  <p className={`text-sm ${settings.stripeConfig.isConfigured ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {settings.stripeConfig.isConfigured ? 'Configurato' : 'Non configurato'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={testStripeConnection}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Test Connessione
                </button>
              </div>
            </div>
          </div>

          {/* Pulsante Salva */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
            >
              {isSaving ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
        )}
      </main>
  );
} 