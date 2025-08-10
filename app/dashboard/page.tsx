'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

interface Order {
    id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

interface CategoryOrder {
    name: string;
    orders: number;
}

interface DailyTrend {
    date: string;
    orders: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Funzione per generare il messaggio di benvenuto basato sull'orario
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const userName = user?.name || 'Utente';
    
    if (hour >= 5 && hour < 12) {
      return `Buongiorno, ${userName}! 🌅`;
    } else if (hour >= 12 && hour < 18) {
      return `Buon pomeriggio, ${userName}! ☀️`;
    } else if (hour >= 18 && hour < 22) {
      return `Buonasera, ${userName}! 🌆`;
    } else {
      return `Buonanotte, ${userName}! 🌙`;
    }
  };

  // Funzione per caricare gli ordini
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (!response.ok) {
        // Se è un errore 401, probabilmente l'utente non è autenticato
        if (response.status === 401) {
          setError('Utente non autenticato');
          setOrders([]);
          return;
        }
        // Se è un errore 404, probabilmente non ci sono ristoranti
        if (response.status === 404) {
          setError('Nessun ristorante trovato');
          setOrders([]);
          return;
        }
        throw new Error(data.error || `Errore nel caricamento degli ordini: ${response.status}`);
      }
      
      // Gestisce sia array diretto che oggetto con success
      let ordersData = [];
      if (Array.isArray(data)) {
        ordersData = data;
      } else if (data.success && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else if (data.orders && Array.isArray(data.orders)) {
        ordersData = data.orders;
      } else {
        ordersData = []; // Default a array vuoto se nessun formato riconosciuto
      }
      
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error('Errore nel fetchOrders:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      setOrders([]); // Inizializza come array vuoto in caso di errore
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
        }
        await fetchOrders();
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        if (isMounted) {
          setError('Errore nel caricamento dei dati');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Carica i dati immediatamente
    loadData();
    
    // Refresh automatico ogni 30 secondi
    const interval = setInterval(() => {
      if (isMounted) {
        loadData();
      }
    }, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []); // Rimuovo la dipendenza da user per evitare loop infiniti

  // Calcola i dati per la dashboard
  const todayRevenue = Array.isArray(orders) ? orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString() && order.status === 'COMPLETED';
    })
    .reduce((sum, order) => sum + order.totalAmount, 0) : 0;

  const completedOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'COMPLETED').length : 0;
  const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'PENDING').length : 0;
  const activeTables = Array.isArray(orders) ? orders.filter(order => order.status === 'PENDING' || order.status === 'PREPARING').length : 0;

  // Calcola il fatturato settimanale dinamicamente
  const calculateWeeklyRevenue = () => {
    const weekDays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const weeklyRevenue = [0, 0, 0, 0, 0, 0, 0]; // Lun-Dom
    
    if (Array.isArray(orders)) {
      orders.forEach(order => {
        if (order.status === 'COMPLETED') {
          const orderDate = new Date(order.createdAt);
          const dayOfWeek = orderDate.getDay(); // 0 = Domenica, 1 = Lunedì, etc.
          const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Converti in Lun=0, Dom=6
          weeklyRevenue[adjustedDay] += order.totalAmount;
        }
      });
    }
    
    return weeklyRevenue;
  };

  // Calcola gli ordini per categoria dinamicamente
  const calculateCategoryOrders = () => {
    const categoryMap = new Map<string, number>();
    
    if (Array.isArray(orders)) {
      orders.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach(item => {
            if (item.menuItem && item.menuItem.category) {
              const categoryName = item.menuItem.category.name;
              categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + item.quantity);
            }
          });
        }
      });
    }
    
    // Converti in array e ordina per quantità
    return Array.from(categoryMap.entries())
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5); // Top 5 categorie
  };

  const weeklyRevenue = calculateWeeklyRevenue();
  const categoryOrders = calculateCategoryOrders();
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const recentOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];

  // Calcola il trend giornaliero dinamicamente
  const calculateDailyTrend = () => {
    const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const dailyTrend = [0, 0, 0, 0, 0, 0, 0]; // Lun-Dom
    
    if (Array.isArray(orders)) {
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dayOfWeek = orderDate.getDay(); // 0 = Domenica, 1 = Lunedì, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Converti in Lun=0, Dom=6
        dailyTrend[adjustedDay]++;
      });
    }
    
    return weekDays.map((day, index) => ({
      date: day,
      orders: dailyTrend[index]
    }));
  };

  const dailyTrend = calculateDailyTrend();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
            {authLoading ? 'Caricamento autenticazione...' : 'Caricamento dati...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
      {/* Header con pulsante refresh */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-1">
            {getWelcomeMessage()}
          </p>
        </div>
        <button
          onClick={() => {
            if (!authLoading) {
              setIsLoading(true);
              fetchOrders().finally(() => setIsLoading(false));
            }
          }}
          disabled={authLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Aggiorna</span>
        </button>
      </div>

      {/* Messaggio di errore */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-200 px-4 py-3 rounded mb-6">
          <strong>Errore:</strong> {error}
        </div>
      )}

      {/* Contenuto principale della dashboard */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6 hover:scale-[1.02] transition-transform">
            <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow mr-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          <div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Fatturato Oggi</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">€{todayRevenue.toFixed(2)}</p>
          </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6 hover:scale-[1.02] transition-transform">
                <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shadow mr-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
            <div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Ordini Completati</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{completedOrders}</p>
                  </div>
                </div>
              </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6 hover:scale-[1.02] transition-transform">
                <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl shadow mr-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
            <div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">In Attesa</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{pendingOrders}</p>
                  </div>
                </div>
              </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6 hover:scale-[1.02] transition-transform">
                <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl shadow mr-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
            <div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Tavoli Attivi</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeTables}</p>
                  </div>
                </div>
              </div>
            </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Fatturato Settimanale</h3>
          {Math.max(...weeklyRevenue) > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-2">
              {weeklyRevenue.map((revenue: number, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-orange-500 to-orange-600 rounded-t-lg shadow-md"
                    style={{ height: `${(revenue / Math.max(...weeklyRevenue)) * 200}px` }}
                  ></div>
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mt-2">
                    {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][index]}
                  </p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    €{revenue.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Nessun fatturato questa settimana
              </p>
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ordini per Categoria</h3>
          {categoryOrders.length > 0 ? (
            <div className="space-y-4">
              {categoryOrders.map((category: CategoryOrder, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{category.orders}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Nessun ordine per categoria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Ordini Recenti</h3>
        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order: Order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Ordine #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.items.length} articoli - {new Date(order.createdAt).toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">€{order.totalAmount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {order.status === 'COMPLETED' ? 'Completato' : 
                     order.status === 'PENDING' ? 'In Attesa' : 'In Preparazione'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Nessun ordine recente
            </p>
          </div>
        )}
      </div>

      {/* Daily Trend */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Trend Giornaliero</h3>
        {dailyTrend.some(trend => trend.orders > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dailyTrend.map((trend: DailyTrend, index: number) => (
              <div key={`${trend.date}-${index}`} className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{trend.date}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{trend.orders}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ordini</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Nessun ordine questa settimana</p>
          </div>
        )}
      </div>
      </main>
  );
} 