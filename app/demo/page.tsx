'use client';

import { useState } from 'react';
import Link from 'next/link';
import LogoText from '../components/LogoText';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState<any[]>([]);

  const menuItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Pomodoro, mozzarella, basilico',
      price: 12.00,
      category: 'Pizze'
    },
    {
      id: 2,
      name: 'Pizza Diavola',
      description: 'Pomodoro, mozzarella, salame piccante',
      price: 14.00,
      category: 'Pizze'
    },
    {
      id: 3,
      name: 'Carbonara',
      description: 'Uova, guanciale, pecorino, pepe',
      price: 16.00,
      category: 'Primi'
    },
    {
      id: 4,
      name: 'Tiramisù',
      description: 'Classico dolce italiano',
      price: 8.00,
      category: 'Dolci'
    },
    {
      id: 5,
      name: 'Acqua 1L',
      description: 'Acqua naturale',
      price: 3.00,
      category: 'Bevande'
    }
  ];

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
            alert('Ordine inviato! Grazie per aver provato Tablo! 🎉');
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particelle animate di sfondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <LogoText size="md" className="transform hover:scale-105 transition-transform duration-300" />
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white/80 hover:text-white transition-colors duration-300 font-medium"
              >
                ← Torna alla Home
              </Link>
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Acquista - 79€
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Demo Header */}
                      <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Prova Tablo in Azione! 🚀
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
                Questa è una demo interattiva che mostra come funziona Tablo. 
                Prova a sfogliare il menu, aggiungere piatti al carrello e completare un ordine!
              </p>
              <Link 
                href="/demo-request" 
                className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                🎯 Prova Gratis 7 Giorni - Nessuna Carta Richiesta
              </Link>
            </div>

          {/* Demo Container */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Menu Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">🍽️ Menu Digitale</h3>
                  <div className="text-sm text-gray-300">Tavolo #5</div>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
                  {['menu', 'orders', 'tables'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab === 'menu' && '📱 Menu'}
                      {tab === 'orders' && '📋 Ordini'}
                      {tab === 'tables' && '🪑 Tavoli'}
                    </button>
                  ))}
                </div>

                {/* Menu Content */}
                {activeTab === 'menu' && (
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-bold text-white">{item.name}</h4>
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                            <div className="text-xl font-bold text-green-400">€{item.price.toFixed(2)}</div>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                          >
                            + Aggiungi
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Orders Content */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">🔥</span>
                        <h4 className="text-lg font-bold text-yellow-300">Ordine #1234</h4>
                        <span className="text-sm bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                          In Preparazione
                        </span>
                      </div>
                      <div className="text-gray-300">
                        <p>• Margherita x2</p>
                        <p>• Carbonara x1</p>
                        <p>• Acqua 1L x1</p>
                        <p className="text-yellow-300 font-semibold mt-2">Tempo stimato: 15 min</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">✅</span>
                        <h4 className="text-lg font-bold text-green-300">Ordine #1233</h4>
                        <span className="text-sm bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Completato
                        </span>
                      </div>
                      <div className="text-gray-300">
                        <p>• Diavola x1</p>
                        <p>• Tiramisù x1</p>
                        <p className="text-green-300 font-semibold mt-2">Servito in 12 min</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tables Content */}
                {activeTab === 'tables' && (
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((tableNum) => (
                      <div 
                        key={tableNum}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          tableNum === 5 
                            ? 'bg-blue-500/20 border-blue-500/50' 
                            : tableNum === 2 
                            ? 'bg-yellow-500/20 border-yellow-500/50'
                            : 'bg-white/5 border-white/20'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🪑</div>
                          <div className="font-bold text-white">Tavolo {tableNum}</div>
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            tableNum === 5 
                              ? 'bg-blue-500/30 text-blue-300' 
                              : tableNum === 2 
                              ? 'bg-yellow-500/30 text-yellow-300'
                              : 'bg-gray-500/30 text-gray-300'
                          }`}>
                            {tableNum === 5 ? 'Occupato' : tableNum === 2 ? 'In Attesa' : 'Libero'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 sticky top-24">
                <h3 className="text-2xl font-bold text-white mb-6">🛒 Il tuo Ordine</h3>
                
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-gray-300">Il tuo carrello è vuoto</p>
                    <p className="text-sm text-gray-400 mt-2">Aggiungi qualcosa dal menu!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{item.name}</h4>
                              <p className="text-sm text-gray-300">€{item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition-colors"
                              >
                                -
                              </button>
                              <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-green-500/20 text-green-300 rounded-full hover:bg-green-500/30 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/10 pt-4 mb-6">
                      <div className="flex justify-between items-center text-lg font-bold text-white mb-2">
                        <span>Totale:</span>
                        <span>€{getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={placeOrder}
                      className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 transform hover:scale-105 shadow-lg"
                    >
                      🚀 Invia Ordine
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Altre Funzionalità di Tablo
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-4">📊</div>
                <h4 className="text-xl font-bold text-white mb-2">Dashboard Analytics</h4>
                <p className="text-gray-300">
                  Monitora vendite, piatti più popolari e performance del ristorante in tempo reale.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-4">💳</div>
                <h4 className="text-xl font-bold text-white mb-2">Pagamenti Stripe</h4>
                <p className="text-gray-300">
                  Integrazione completa con Stripe per pagamenti sicuri direttamente dal tavolo.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl mb-4">⚙️</div>
                <h4 className="text-xl font-bold text-white mb-2">Gestione Avanzata</h4>
                <p className="text-gray-300">
                  Controllo completo su menu, categorie, prezzi e configurazioni del ristorante.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8 border border-blue-500/30">
              <h3 className="text-3xl font-bold text-white mb-4">
                Pronto a Digitalizzare il tuo Ristorante?
              </h3>
              <p className="text-xl text-gray-300 mb-6">
                Ottieni accesso completo a tutte le funzionalità con la licenza lifetime al nuovo prezzo di 79€
              </p>
              <Link 
                href="/register" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                🚀 Acquista Ora - 79€
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 