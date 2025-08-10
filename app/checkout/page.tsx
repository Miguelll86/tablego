'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import LogoText from '../components/LogoText';
import { getWhatsAppUrl } from '../lib/config';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?service=tablo-pro`,
        receipt_email: 'info@tablo.com',
      },
    });

    if (error) {
      setMessage(error.message || 'Errore nel pagamento');
      onError(error.message || 'Errore nel pagamento');
    } else {
      setMessage('Pagamento completato con successo!');
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          💳 Checkout Sicuro
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Completa il pagamento per attivare Tablo Pro
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl mb-8 border border-orange-200 dark:border-orange-800">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Tablo Pro</span>
          <span className="text-2xl font-bold text-orange-600">79€</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>✅ Licenza permanente</div>
          <div>✅ Tutte le funzionalità AI</div>
          <div>✅ Aggiornamenti gratuiti</div>
          <div>✅ Supporto incluso</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />

        {message && (
          <div className={`p-4 rounded-xl text-sm ${
            message.includes('successo') 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Elaborazione...' : '💳 Paga Ora - 79€'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Pagamento sicuro con Stripe
        </p>
        <div className="flex justify-center space-x-4 text-xs text-gray-400">
          <span>🔒 Crittografia SSL</span>
          <span>💳 Carte sicure</span>
          <span>🛡️ Protezione acquisti</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 7900, // 79€ in centesimi
          currency: 'eur',
          restaurantId: user?.id || 'service-purchase',
          orderId: 'tablo-pro-license'
        })
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setError(data.error || 'Errore nella creazione del pagamento');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    addNotification('Pagamento completato! Tablo Pro è ora attivo.', 'success');
    // Redirect alla dashboard o pagina di successo
    window.location.href = '/payment-success?service=tablo-pro';
  };

  const handleError = (error: string) => {
    addNotification(`Errore nel pagamento: ${error}`, 'error');
    setError(error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Preparazione pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-slate-700 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Errore nel Pagamento
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={createPaymentIntent}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              🔄 Riprova
            </button>
            <a
              href={getWhatsAppUrl("Ciao! Ho avuto un problema con il pagamento di Tablo Pro. Puoi aiutarmi?")}
              target="_blank"
              className="block w-full border-2 border-orange-500 text-orange-600 py-3 px-6 rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
              💬 Contatta Supporto
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <LogoText size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Acquista Tablo Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Completa il pagamento per attivare tutte le funzionalità
          </p>
        </div>

        {/* Checkout Form */}
        <div className="max-w-2xl mx-auto">
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm onSuccess={handleSuccess} onError={handleError} />
            </Elements>
          )}
        </div>

        {/* Info Aggiuntive */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🛡️ Garanzia di Sicurezza
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <div className="text-2xl mb-1">🔒</div>
                <div className="font-semibold">Pagamento Sicuro</div>
                <div>Stripe SSL crittografato</div>
              </div>
              <div>
                <div className="text-2xl mb-1">💯</div>
                <div className="font-semibold">Soddisfazione</div>
                <div>Supporto diretto incluso</div>
              </div>
              <div>
                <div className="text-2xl mb-1">⚡</div>
                <div className="font-semibold">Attivazione</div>
                <div>Immediata dopo il pagamento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
