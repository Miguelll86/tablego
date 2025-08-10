'use client';

import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    restaurant: '',
    phone: '',
    address: '',
    piva: '',
    codiceUnivoco: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMessage('Registrazione avvenuta con successo! Puoi ora effettuare il login.');
      setForm({ name: '', email: '', password: '', restaurant: '', phone: '', address: '', piva: '', codiceUnivoco: '' });
    } else {
      setMessage(data.error || 'Errore durante la registrazione.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:bg-slate-800/80 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Registrazione</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Crea il tuo account ristorante</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nome completo
              </label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="Il tuo nome completo"
              />
        </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="la-tua-email@esempio.com"
              />
        </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="••••••••"
              />
        </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nome ristorante
              </label>
              <input 
                type="text" 
                name="restaurant" 
                value={form.restaurant} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="Nome del tuo ristorante"
              />
        </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Telefono
              </label>
              <input 
                type="tel" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="+39 123 456 7890"
              />
        </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Indirizzo
              </label>
              <input 
                type="text" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="Indirizzo del ristorante"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                P.IVA
              </label>
              <input 
                type="text" 
                name="piva" 
                value={form.piva} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="12345678901"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Codice Univoco
              </label>
              <input 
                type="text" 
                name="codiceUnivoco" 
                value={form.codiceUnivoco} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium" 
                placeholder="ABC12345"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 mt-6"
            >
          {loading ? 'Registrazione in corso...' : 'Registrati'}
        </button>
            
            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-medium ${
                message.includes('successo') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}
      </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Hai già un account?{' '}
              <a href="/login" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                Accedi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 