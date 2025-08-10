'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PaymentForm from '../../components/PaymentForm';

interface Table {
  id: string;
  number: number;
  restaurant: {
    id: string;
    name: string;
    logo?: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function QRMenuPage() {
  const params = useParams();
  const tableId = params.tableId as string;
  
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    if (tableId) {
      loadTableAndMenu();
    }
  }, [tableId]);

  const loadTableAndMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Caricamento tavolo:', tableId);
      console.log('URL completo:', window.location.href);
      
      // Carica i dati del tavolo
      const tableUrl = `/api/tables/${tableId}`;
      console.log('Chiamata API tavolo:', tableUrl);
      
      const tableResponse = await fetch(tableUrl);
      console.log('Risposta tavolo:', tableResponse.status);
      console.log('Headers risposta:', Object.fromEntries(tableResponse.headers.entries()));
      
      if (!tableResponse.ok) {
        const errorData = await tableResponse.json();
        console.error('Errore tavolo:', errorData);
        throw new Error(errorData.error || 'Tavolo non trovato');
      }
      
      const tableData = await tableResponse.json();
      console.log('Dati tavolo:', tableData);
      
      if (!tableData.success) {
        throw new Error(tableData.error || 'Errore nel caricamento del tavolo');
      }
      
      setTable(tableData.table);

      // Carica le categorie e i menu items
      console.log('Caricamento categorie per ristorante:', tableData.table.restaurant.id);
      const categoriesResponse = await fetch(`/api/categories?restaurantId=${tableData.table.restaurant.id}`);
      console.log('Risposta categorie:', categoriesResponse.status);
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log('Dati categorie:', categoriesData);
        
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
          if (categoriesData.categories.length > 0) {
            setSelectedCategory(categoriesData.categories[0].id);
          }
        } else {
          console.error('Errore categorie:', categoriesData.error);
          setError('Errore nel caricamento delle categorie');
        }
      } else {
        console.error('Errore nella richiesta categorie');
        setError('Errore nel caricamento delle categorie');
      }
    } catch (err: any) {
      console.error('Errore caricamento:', err);
      setError(err.message || 'Errore nel caricamento del menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckoutLoading(true);
    try {
      const orderItems = cart.map(cartItem => ({
        menuItemId: cartItem.item.id,
        quantity: cartItem.quantity,
        notes: ''
      }));

      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableId,
          items: orderItems,
          customerName,
          customerPhone,
          notes: orderNotes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Ordine creato con successo, ora mostra il form di pagamento
        setCurrentOrder(data.order);
        setShowCheckoutForm(false);
        setShowPaymentForm(true);
      } else {
        setError(data.error || 'Errore nella creazione dell\'ordine');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Pagamento completato con successo
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setOrderNotes('');
    setShowPaymentForm(false);
    setCurrentOrder(null);
    
    // Reindirizza alla pagina di successo
    window.location.href = `/payment-success?orderId=${currentOrder?.id}`;
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setShowPaymentForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Caricamento menu...</p>
          {tableId && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Tavolo ID: {tableId}</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Errore</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={loadTableAndMenu}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Riprova
          </button>
          {tableId && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Tavolo ID: {tableId}</p>}
        </div>
      </div>
    );
  }

  if (!table) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-8">
          <p className="text-gray-700 dark:text-gray-300 font-medium">Tavolo non trovato</p>
          {tableId && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Tavolo ID: {tableId}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100 dark:bg-slate-900/80 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {table.restaurant.logo && (
                <img 
                  src={table.restaurant.logo} 
                  alt={table.restaurant.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{table.restaurant.name}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Tavolo {table.number}</p>
              </div>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCheckoutForm(true)}
              className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              🛒 Carrello
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex space-x-3 overflow-x-auto pb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-bold whitespace-nowrap shadow-md transition-all ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-white/80 backdrop-blur-md text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        {selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories
              .find(cat => cat.id === selectedCategory)
              ?.items.map((item) => (
                <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 overflow-hidden hover:scale-[1.02] transition-transform">
                  <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Immagine Piatto</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">€{item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{item.description}</p>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className={`w-full py-3 px-6 rounded-full font-bold transition-all ${
                        item.isAvailable
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md'
                          : 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {item.isAvailable ? 'Aggiungi al Carrello' : 'Non Disponibile'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-12">
              <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">Nessun piatto disponibile</p>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:bg-slate-800/90 dark:border-slate-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Completa Ordine</h3>
            
            {/* Cart Items */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Il tuo ordine:</h4>
                <div className="space-y-3">
              {cart.map((cartItem) => (
                    <div key={cartItem.item.id} className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{cartItem.item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">€{cartItem.item.price.toFixed(2)} x {cartItem.quantity}</p>
                  </div>
                      <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all"
                    >
                      -
                    </button>
                        <span className="font-bold text-gray-900 dark:text-white min-w-[20px] text-center">{cartItem.quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400 text-right">Totale: €{getTotalPrice().toFixed(2)}</p>
              </div>
            </div>

            {/* Customer Info */}
              <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Il tuo nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
              />
              <input
                type="tel"
                placeholder="Telefono (opzionale)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium"
              />
              <textarea
                placeholder="Note per l'ordine (opzionale)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCheckoutForm(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading || cart.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isCheckoutLoading ? 'Elaborazione...' : 'Procedi al Pagamento'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && currentOrder && (
        <PaymentForm
          amount={currentOrder.totalAmount}
          orderId={currentOrder.id}
          customerName={customerName}
          customerEmail=""
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
} 