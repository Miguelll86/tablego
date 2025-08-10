'use client';

import { useState, useEffect } from 'react';

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => void;
  table?: Table | null;
  isLoading?: boolean;
}

interface TableFormData {
  number: string;
  capacity: string;
  position: string;
  status: string;
  type: 'table' | 'umbrella';
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  position: string | null;
  status: string;
  type?: 'TABLE' | 'UMBRELLA';
}

export default function TableForm({ isOpen, onClose, onSubmit, table, isLoading }: TableFormProps) {
  const [formData, setFormData] = useState<TableFormData>({
    number: '',
    capacity: '',
    position: 'Interno',
    status: 'AVAILABLE',
    type: 'table',
  });

  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number.toString(),
        capacity: table.capacity.toString(),
        position: table.position || 'Interno',
        status: table.status,
        type: table.type === 'UMBRELLA' ? 'umbrella' : 'table',
      });
    } else {
      setFormData({
        number: '',
        capacity: '',
        position: 'Interno',
        status: 'AVAILABLE',
        type: 'table',
      });
    }
  }, [table, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {table ? `Modifica ${table.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'}` : `Nuovo ${formData.type === 'umbrella' ? 'Ombrellone' : 'Tavolo'}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo elemento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Tipo Elemento *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="table">🟢 Tavolo</option>
              <option value="umbrella">🏖️ Ombrellone</option>
            </select>
          </div>

          {/* Informazioni base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Numero {formData.type === 'umbrella' ? 'Ombrellone' : 'Tavolo'} *
            </label>
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              min="1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Es. 1"
            />
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Capacità *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              max="20"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Es. 4"
            />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Posizione
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="Interno">Interno</option>
              <option value="Esterno">Esterno</option>
              <option value="Terrazza">Terrazza</option>
              <option value="Veranda">Veranda</option>
              <option value="Sala Privata">Sala Privata</option>
            </select>
          </div>

          <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Stato
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="AVAILABLE">Disponibile</option>
              <option value="OCCUPIED">Occupato</option>
              <option value="RESERVED">Prenotato</option>
              <option value="MAINTENANCE">Manutenzione</option>
            </select>
          </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : (table ? `Aggiorna ${table.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'}` : `Crea ${formData.type === 'umbrella' ? 'Ombrellone' : 'Tavolo'}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 