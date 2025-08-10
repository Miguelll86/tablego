'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens?: string;
}

interface MenuItemFormProps {
  item?: MenuItem | null;
  onSave: () => void;
  onCancel: () => void;
  categories: Category[];
}

export default function MenuItemForm({ item, onSave, onCancel, categories }: MenuItemFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    isAvailable: true,
    isVegetarian: false,
    isGlutenFree: false,
    allergens: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        image: item.image || '',
        categoryId: item.categoryId,
        isAvailable: item.isAvailable,
        isVegetarian: item.isVegetarian,
        isGlutenFree: item.isGlutenFree,
        allergens: item.allergens || ''
      });
      setImagePreview(item.image || null);
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        image: '',
        categoryId: '',
        isAvailable: true,
        isVegetarian: false,
        isGlutenFree: false,
        allergens: ''
      });
      setImagePreview(null);
    }
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validazione client-side
    if (!form.name.trim()) {
      setError('Il nome del piatto è obbligatorio');
      setLoading(false);
      return;
    }

    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      setError('Il prezzo deve essere un numero maggiore di 0');
      setLoading(false);
      return;
    }

    if (!form.categoryId) {
      setError('Seleziona una categoria');
      setLoading(false);
      return;
    }

    try {
      const url = item ? `/api/menu-items/${item.id}` : '/api/menu-items';
      const method = item ? 'PUT' : 'POST';

      console.log('Invio dati piatto:', {
        ...form,
        price: parseFloat(form.price),
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          isAvailable: form.isAvailable,
          isVegetarian: form.isVegetarian,
          isGlutenFree: form.isGlutenFree,
        }),
      });

      const data = await response.json();
      console.log('Risposta API:', data);
      
      if (data.success) {
        onSave();
      } else {
        setError(data.error || 'Errore nel salvataggio del piatto');
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setError('Errore di connessione al server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {item ? 'Modifica Piatto' : 'Nuovo Piatto'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Piatto *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleziona categoria</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrizione */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrizione
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
            />
          </div>

          {/* Prezzo e Immagine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prezzo (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL Immagine
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://esempio.com/immagine.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Opzioni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Disponibile</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isVegetarian}
                onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Vegetariano</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isGlutenFree}
                onChange={(e) => setForm({ ...form, isGlutenFree: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Senza Glutine</span>
            </label>
          </div>

          {/* Allergeni */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Allergeni
            </label>
            <input
              type="text"
              value={form.allergens}
              onChange={(e) => setForm({ ...form, allergens: e.target.value })}
              placeholder="es. Latte, Noci, Glutine..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Anteprima immagine */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anteprima Immagine
              </label>
              <div className="w-32 h-32 relative border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Anteprima"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Pulsanti */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvataggio...' : (item ? 'Aggiorna' : 'Crea')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 