'use client';

import { useEffect, useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  restaurants: Restaurant[];
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users${query ? `?q=${encodeURIComponent(query)}` : ''}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data.users);
      setError(null);
    } catch (e: any) {
      setError('Non autorizzato o errore di rete');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (restaurantId: string, isActive: boolean) => {
    const prev = users.slice();
    try {
      setUsers((curr) => curr.map(u => ({
        ...u,
        restaurants: u.restaurants.map(r => r.id === restaurantId ? { ...r, isActive } : r)
      })));
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, isActive })
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      setUsers(prev);
      alert('Errore nel salvataggio');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Amministrazione — Utenti e Ristoranti</h1>
        <p className="text-sm text-gray-400 mb-6">Cerca account, visualizza ristoranti e attiva/disattiva l'accesso.</p>

        <div className="flex items-center gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome o email"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
          />
          <button onClick={load} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Cerca</button>
        </div>

        {error && <div className="mb-4 text-red-400">{error}</div>}
        {loading ? (
          <div>Caricamento…</div>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold">{user.name || 'Senza nome'}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
                {user.restaurants.length === 0 ? (
                  <div className="text-sm text-gray-400">Nessun ristorante associato</div>
                ) : (
                  <div className="space-y-2">
                    {user.restaurants.map(r => (
                      <div key={r.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3">
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-gray-500">Creato il {new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${r.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {r.isActive ? 'Attivo' : 'Disattivo'}
                          </span>
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={r.isActive} onChange={(e) => toggleActive(r.id, e.target.checked)} />
                            <div className="w-10 h-5 bg-gray-600 peer-checked:bg-green-600 rounded-full relative transition-colors">
                              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5" />
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


