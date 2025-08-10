'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  table: {
    number: number;
  };
}

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: {
    name: string;
    price: number;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Errore nel caricamento dell\'ordine:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Caricamento dettagli ordine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Pagamento Completato!</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Il tuo ordine è stato confermato e inviato alla cucina.</p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dettagli Ordine</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full">#{order.orderNumber}</span>
            </div>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white">{item.menuItem.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 font-medium">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-orange-600 dark:text-orange-400">€{(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Totale</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Info */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 text-lg">Cosa succede ora?</h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-2 font-medium">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                  Il tuo ordine è stato inviato alla cucina
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                  Riceverai una notifica quando sarà pronto
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                  Puoi seguire lo stato del tuo ordine
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-full font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-md text-center"
          >
            Torna alla Home
          </Link>
          {order && (
            <Link
              href={`/orders/${order.id}`}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-md text-center"
            >
              Segui il tuo ordine
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Caricamento...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 