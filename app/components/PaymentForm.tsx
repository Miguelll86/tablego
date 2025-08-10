'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentFormProps {
  amount: number;
  orderId: string;
  customerEmail?: string;
  customerName?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

function CheckoutForm({ amount, orderId, customerEmail, customerName, onSuccess, onError, onClose }: PaymentFormProps) {
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
        return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
        receipt_email: customerEmail,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pagamento</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Totale da pagare:</span>
              <span className="font-bold text-xl text-green-600">€{amount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600">Ordine #{orderId}</p>
          </div>

          <PaymentElement />

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('successo') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
            )}
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Elaborazione pagamento...' : 'Paga ora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Crea il Payment Intent
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: props.amount,
        orderId: props.orderId,
        customerEmail: props.customerEmail,
        customerName: props.customerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          props.onError(data.error || 'Errore nella creazione del pagamento');
        }
      })
      .catch((error) => {
        props.onError('Errore di connessione');
      });
  }, [props.amount, props.orderId, props.customerEmail, props.customerName]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Preparazione pagamento...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
} 