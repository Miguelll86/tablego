'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuItemForm from '../components/MenuItemForm';
import { useAuth } from '../hooks/useAuth';

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
  categoryId: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens?: string;
  category: Category;
}

export default function MenuPage() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      loadCategories();
    }
  }, [authLoading]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Carica categorie
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      // Carica piatti
      const menuItemsResponse = await fetch('/api/menu-items');
      const menuItemsData = await menuItemsResponse.json();
      
      if (categoriesData.success && Array.isArray(categoriesData.categories)) {
        setCategories(categoriesData.categories);
      } else {
        setCategories([]);
      }
      
      if (menuItemsData.success && Array.isArray(menuItemsData.menuItems)) {
        setMenuItems(menuItemsData.menuItems);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Errore caricamento dati:', error);
      setCategories([]);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      if (data.success) {
        setNewCategory({ name: '', description: '' });
        setShowCategoryForm(false);
        await loadCategories();
        alert('Categoria creata con successo!');
      } else {
        alert(`Errore nella creazione: ${data.error || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error('Errore creazione categoria:', error);
      alert('Errore di connessione durante la creazione della categoria');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditCategoryForm(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEditingCategory(null);
        setShowEditCategoryForm(false);
        await loadCategories();
        alert('Categoria aggiornata con successo!');
      } else {
        alert(`Errore nell'aggiornamento: ${data.error || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error('Errore aggiornamento categoria:', error);
      alert('Errore di connessione durante l\'aggiornamento della categoria');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria? Tutti i piatti associati verranno eliminati.')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadCategories();
        alert('Categoria eliminata con successo!');
      } else {
        alert(`Errore nell'eliminazione: ${data.error || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error('Errore eliminazione categoria:', error);
      alert('Errore di connessione durante l\'eliminazione della categoria');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo piatto?')) return;

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await loadCategories();
        alert('Piatto eliminato con successo!');
      } else {
        alert(`Errore nell'eliminazione: ${data.error || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error('Errore eliminazione piatto:', error);
      alert('Errore di connessione durante l\'eliminazione');
    }
  };

  const handleSaveItem = async () => {
    setEditingItem(null);
    await loadCategories();
  };

  // Filtra i piatti per categoria selezionata
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestione Menu</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuova Categoria
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            + Nuovo Piatto
          </button>
        </div>
      </div>

      {/* Filtri categoria */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Tutti
          </button>
          {Array.isArray(categories) && categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista categorie e piatti */}
      <div className="grid gap-6">
        {selectedCategory === 'all' ? (
          // Mostra tutte le categorie con i loro piatti
          Array.isArray(categories) && categories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {(() => {
                  const categoryItems = menuItems.filter(item => item.categoryId === category.id);
                  return categoryItems.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Nessun piatto in questa categoria</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                Modifica
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Elimina
                              </button>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-orange-600">€{item.price.toFixed(2)}</span>
                            <div className="flex gap-1">
                              {item.isVegetarian && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Veg</span>
                              )}
                              {item.isGlutenFree && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">GF</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))
        ) : (
          // Mostra solo i piatti della categoria selezionata
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(filteredItems) && filteredItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-600">€{item.price.toFixed(2)}</span>
                  <div className="flex gap-1">
                    {item.isVegetarian && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Veg</span>
                    )}
                    {item.isGlutenFree && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">GF</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form per nuovo piatto */}
      {showAddForm && (
        <MenuItemForm
          onSave={handleSaveItem}
          onCancel={() => setShowAddForm(false)}
          categories={categories}
        />
      )}

      {/* Form per modifica piatto */}
      {editingItem && (
        <MenuItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => setEditingItem(null)}
          categories={categories}
        />
      )}

      {/* Form per nuova categoria */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nuova Categoria</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Descrizione</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crea
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form per modifica categoria */}
      {showEditCategoryForm && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Modifica Categoria</h3>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Descrizione</label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditCategoryForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 