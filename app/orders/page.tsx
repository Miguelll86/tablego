'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

interface Order {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  table?: {
    id: string;
    number: number;
  };
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  notes?: string;
  menuItem: {
    id: string;
    name: string;
    price: number;
  };
}

export default function Orders() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, preparing, ready, completed
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Errore nel caricamento degli ordini');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchOrders();
        setError('');
        addNotification({
          title: 'Ordine Aggiornato',
          message: `Ordine aggiornato con successo!`,
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nell\'aggiornamento dell\'ordine');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo ordine? Questa azione non può essere annullata.')) {
      return;
    }

    try {
      setDeletingOrder(orderId);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchOrders();
        addNotification({
          title: 'Ordine Eliminato',
          message: 'Ordine eliminato con successo!',
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nell\'eliminazione dell\'ordine');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setDeletingOrder(null);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500 text-white';
      case 'CONFIRMED': return 'bg-blue-500 text-white';
      case 'PREPARING': return 'bg-orange-500 text-white';
      case 'READY': return 'bg-green-500 text-white';
      case 'SERVED': return 'bg-purple-500 text-white';
      case 'COMPLETED': return 'bg-gray-500 text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'In attesa';
      case 'CONFIRMED': return 'Confermato';
      case 'PREPARING': return 'In preparazione';
      case 'READY': return 'Pronto';
      case 'SERVED': return 'Servito';
      case 'COMPLETED': return 'Completato';
      case 'CANCELLED': return 'Annullato';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'DINE_IN': return 'Al ristorante';
      case 'TAKEAWAY': return 'Asporto';
      case 'DELIVERY': return 'Consegna';
      default: return type;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-6">
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestione Ordini</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitora e gestisci tutti gli ordini del ristorante</p>
            </div>

      {/* Notifiche */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
          </div>
      )}

      {/* Filtri */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Tutti', color: 'bg-gray-500' },
            { value: 'PENDING', label: 'In attesa', color: 'bg-yellow-500' },
            { value: 'CONFIRMED', label: 'Confermati', color: 'bg-blue-500' },
            { value: 'PREPARING', label: 'In preparazione', color: 'bg-orange-500' },
            { value: 'READY', label: 'Pronti', color: 'bg-green-500' },
            { value: 'COMPLETED', label: 'Completati', color: 'bg-gray-500' }
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.value
                  ? `${filterOption.color} text-white`
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
            </div>
          </div>

      {/* Lista ordini */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nessun ordine trovato</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'Non ci sono ancora ordini.' : `Nessun ordine con stato "${getStatusText(filter)}".`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    #{order.orderNumber}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getTypeText(order.type)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    €{order.totalAmount.toFixed(2)}
                </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString('it-IT')}
                </div>
              </div>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {order.table && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">🪑</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Tavolo {order.table.number}
                    </span>
                  </div>
                )}
                {order.customerName && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">👤</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {order.customerName}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400">🍽️</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {order.items.length} articoli
                  </span>
                </div>
              </div>

              {order.notes && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Note:</strong> {order.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'CONFIRMED');
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Conferma
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'PREPARING');
                      }}
                      className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Inizia preparazione
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'READY');
                      }}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Pronto
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'SERVED');
                      }}
                      className="px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors"
                    >
                  Servito
                </button>
                  )}
                  {order.status === 'SERVED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order.id, 'COMPLETED');
                      }}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Completa
                </button>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(order.id);
                  }}
                  disabled={deletingOrder === order.id}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deletingOrder === order.id ? 'Eliminando...' : 'Elimina'}
                </button>
              </div>
            </div>
          ))
        )}
        </div>

      {/* Modal dettagli ordine */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ordine #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                  ✕
              </button>
            </div>

              <div className="space-y-6">
                {/* Informazioni ordine */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stato</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                </div>
                </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</label>
                    <p className="text-gray-900 dark:text-white mt-1">{getTypeText(selectedOrder.type)}</p>
                  </div>
                <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Data</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString('it-IT')}
                  </p>
                </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Totale</label>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      €{selectedOrder.totalAmount.toFixed(2)}
                    </p>
                </div>
                </div>

              {/* Articoli */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Articoli ordinati</h3>
                  <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.menuItem.name}</p>
                        {item.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.notes}</p>
                        )}
                      </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.quantity}x €{item.price.toFixed(2)}
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            €{(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Note */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Note</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 