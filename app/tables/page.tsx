'use client';

import { useState, useEffect } from 'react';
import TableForm from '../components/TableForm';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

interface Table {
  id: string;
  number: number;
  capacity: number;
  position: string;
  status: string;
  qrCode: string;
  createdAt: string;
  orders?: Order[];
  reservations?: Reservation[];
  type: 'TABLE' | 'UMBRELLA'; // Valori del database
}

interface Order {
  id: string;
  status: string;
  items?: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  menuItem?: {
    name: string;
    price: number;
  };
}

interface Reservation {
  id: string;
  customerName: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export default function Tables() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'TABLE' | 'UMBRELLA'>('all');
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchTables();
    }
  }, [user]);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      const data = await response.json();
      
      if (data.success) {
        setTables(data.tables);
      } else {
        setError(data.error || 'Errore nel caricamento dei tavoli');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTable = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: formData.number,
          capacity: formData.capacity,
          position: formData.position,
          status: 'AVAILABLE',
          type: formData.type === 'umbrella' ? 'UMBRELLA' : 'TABLE' // Mappa i valori
        })
      });

      const data = await response.json();
      
      if (response.ok && (data.success || data.table)) {
        await fetchTables();
        setIsFormOpen(false);
        addNotification({
          title: formData.type === 'umbrella' ? 'Ombrellone Creato' : 'Tavolo Creato',
          message: data.message || (formData.type === 'umbrella' ? 'Ombrellone creato con successo' : 'Tavolo creato con successo'),
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nella creazione');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTable = async (formData: any) => {
    if (!editingTable) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/tables/${editingTable.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: formData.type === 'umbrella' ? 'UMBRELLA' : 'TABLE' // Mappa i valori
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTables();
        setEditingTable(null);
        setIsFormOpen(false);
        setError('');
      } else {
        setError(data.error || 'Errore nell\'aggiornamento');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    const itemName = table?.type === 'UMBRELLA' ? 'ombrellone' : 'tavolo';
    
    if (!confirm(`Sei sicuro di voler eliminare questo ${itemName}?`)) return;

    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTables();
        setError('');
        addNotification({
          title: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} Eliminato`,
          message: `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} eliminato con successo`,
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nell\'eliminazione');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingTable) {
      handleUpdateTable(formData);
    } else {
      handleCreateTable(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500';
      case 'OCCUPIED': return 'bg-red-500';
      case 'RESERVED': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponibile';
      case 'OCCUPIED': return 'Occupato';
      case 'RESERVED': return 'Prenotato';
      default: return 'Manutenzione';
    }
  };

  const downloadQRCode = async (table: Table) => {
    try {
      const response = await fetch(`/api/tables/${table.id}/qr?format=png&size=400`);
      
      if (!response.ok) {
        throw new Error('Errore nel download del QR');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const tableType = table.type === 'UMBRELLA' ? 'ombrellone' : 'tavolo';
      link.download = `qr-${tableType}-${table.number}.png`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addNotification({
        title: 'Download completato',
        message: `QR PNG scaricato per ${tableType} ${table.number}`,
        type: 'success'
      });
    } catch (error) {
      console.error('Errore download QR:', error);
      addNotification({
        title: 'Errore',
        message: 'Impossibile scaricare il QR code',
        type: 'error'
      });
    }
  };

  const regenerateQRCode = async (table: Table) => {
    try {
      addNotification({
        title: 'Rigenerazione in corso...',
        message: `Rigenerazione QR per ${table.type === 'UMBRELLA' ? 'ombrellone' : 'tavolo'} ${table.number}`,
        type: 'info'
      });

      const response = await fetch(`/api/tables/${table.id}/qr`, {
        method: 'PUT'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTables();
        addNotification({
          title: 'QR Rigenerato',
          message: `QR aggiornato per ${table.type === 'UMBRELLA' ? 'ombrellone' : 'tavolo'} ${table.number}`,
          type: 'success'
        });
      } else {
        throw new Error(data.error || 'Errore nella rigenerazione');
      }
    } catch (error) {
      console.error('Errore rigenerazione QR:', error);
      addNotification({
        title: 'Errore',
        message: 'Impossibile rigenerare il QR code',
        type: 'error'
      });
    }
  };

  const regenerateAllQRCodes = async () => {
    try {
      const response = await fetch('/api/tables/regenerate-qr', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTables();
        addNotification({
          title: 'QR Rigenerati',
          message: 'Tutti i codici QR sono stati rigenerati con successo',
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nella rigenerazione dei QR');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowOrdersModal(true);
  };

  const handleTableAction = async (tableId: string, action: 'sit' | 'leave') => {
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'sit' ? 'OCCUPIED' : 'AVAILABLE'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchTables();
      } else {
        setError(data.error || 'Errore nell\'aggiornamento dello stato');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const createTestOrder = async (tableId: string) => {
    try {
      // Prima otteniamo i menu items disponibili
      const menuResponse = await fetch('/api/menu-items');
      const menuData = await menuResponse.json();
      
      if (!menuData.success || !menuData.menuItems || menuData.menuItems.length === 0) {
        addNotification({
          title: 'Errore',
          message: 'Nessun piatto disponibile per creare l\'ordine di test',
          type: 'error'
        });
        return;
      }

      // Prendiamo i primi 3 piatti disponibili per l'ordine di test
      const testItems = menuData.menuItems.slice(0, 3).map((item: any, index: number) => ({
        menuItemId: item.id,
        quantity: Math.floor(Math.random() * 3) + 1, // Quantità casuale tra 1 e 3
        price: item.price // Aggiungiamo il prezzo
      }));

      // Calcoliamo il totale
      const totalAmount = testItems.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId,
          items: testItems,
          totalAmount: totalAmount,
          notes: 'Ordine di test generato automaticamente'
        })
      });

      const data = await response.json();
      
      if (data.id) { // Se abbiamo un ID, l'ordine è stato creato
        await fetchTables();
        setShowOrdersModal(false);
        addNotification({
          title: 'Ordine di Test Creato',
          message: `Ordine di test creato con ${testItems.length} piatti - Totale: €${totalAmount.toFixed(2)}`,
          type: 'success'
        });
      } else {
        addNotification({
          title: 'Errore',
          message: data.error || 'Errore nella creazione dell\'ordine di test',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Errore creazione ordine di test:', error);
      addNotification({
        title: 'Errore',
        message: 'Errore di connessione durante la creazione dell\'ordine di test',
        type: 'error'
      });
    }
  };

  const openManualOrderModal = async (table: Table) => {
    try {
      // Carica i menu items
      const menuResponse = await fetch('/api/menu-items');
      const menuData = await menuResponse.json();
      
      if (menuData.success && menuData.menuItems) {
        setMenuItems(menuData.menuItems);
        setSelectedItems([]);
        setSelectedTableForOrder(table);
        setShowManualOrderModal(true);
      } else {
        addNotification({
          title: 'Errore',
          message: 'Impossibile caricare il menu',
          type: 'error'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Errore',
        message: 'Errore di connessione',
        type: 'error'
      });
    }
  };

  const createManualOrder = async () => {
    if (!selectedTableForOrder || selectedItems.length === 0) {
      addNotification({
        title: 'Errore',
        message: 'Seleziona almeno un piatto',
        type: 'error'
      });
      return;
    }

    try {
      const orderItems = selectedItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTableForOrder.id,
          items: orderItems,
          totalAmount: totalAmount,
          notes: 'Ordine manuale creato dal gestore'
        })
      });

      const data = await response.json();
      
      if (data.id) {
        await fetchTables();
        setShowManualOrderModal(false);
        setSelectedTableForOrder(null);
        setSelectedItems([]);
        addNotification({
          title: 'Ordine Manuale Creato',
          message: `Ordine creato con ${selectedItems.length} piatti - Totale: €${totalAmount.toFixed(2)}`,
          type: 'success'
        });
      } else {
        addNotification({
          title: 'Errore',
          message: data.error || 'Errore nella creazione dell\'ordine',
          type: 'error'
        });
      }
    } catch (error) {
      addNotification({
        title: 'Errore',
        message: 'Errore di connessione',
        type: 'error'
      });
    }
  };

  const addItemToOrder = (item: any) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(selected => 
        selected.id === item.id 
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      ));
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const removeItemFromOrder = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
    } else {
      setSelectedItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTableIcon = (capacity: number, type: string) => {
    if (type === 'UMBRELLA') {
      return <span className="text-2xl">🏖️</span>;
    }
    
    if (capacity <= 2) return <span className="text-2xl">🟢</span>;
    if (capacity <= 4) return <span className="text-2xl">🟡</span>;
    if (capacity <= 6) return <span className="text-2xl">🟠</span>;
    return <span className="text-2xl">🔴</span>;
  };

  const getActionButton = (table: Table) => {
    if (table.status === 'AVAILABLE') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTableAction(table.id, 'sit');
          }}
          className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
        >
          Occupa
        </button>
      );
    } else if (table.status === 'OCCUPIED') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTableAction(table.id, 'leave');
          }}
          className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          Libera
        </button>
      );
    }
    return null;
  };

  // Filtra tavoli/ombrelloni in base al tipo selezionato
  const filteredTables = selectedType === 'all' 
    ? tables 
    : tables.filter(table => table.type === selectedType);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestione Tavoli & Ombrelloni</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gestisci tavoli e ombrelloni per ristoranti e stabilimenti balneari
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Nuovo {selectedType === 'UMBRELLA' ? 'Ombrellone' : selectedType === 'TABLE' ? 'Tavolo' : 'Elemento'}</span>
              </button>
              <button
                onClick={regenerateAllQRCodes}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Rigenera QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Filtri per tipo */}
        <div className="mb-6">
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🏠 Tutti ({tables.length})
            </button>
            <button
              onClick={() => setSelectedType('TABLE')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'TABLE'
                  ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🟢 Tavoli ({tables.filter(t => t.type === 'TABLE').length})
            </button>
            <button
              onClick={() => setSelectedType('UMBRELLA')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'UMBRELLA'
                  ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🏖️ Ombrelloni ({tables.filter(t => t.type === 'UMBRELLA').length})
            </button>
          </div>
        </div>

        {/* Lista tavoli/ombrelloni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <div 
              key={table.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleTableClick(table)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTableIcon(table.capacity, table.type)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {table.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} {table.number}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {table.capacity} posti
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Stato:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    table.status === 'OCCUPIED' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    table.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {getStatusText(table.status)}
                  </span>
                </div>

                {table.orders && table.orders.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Ordini attivi:</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {table.orders.length}
                    </span>
                  </div>
                )}

                {table.reservations && table.reservations.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Prenotazioni:</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {table.reservations.length}
                    </span>
                  </div>
                )}

                <div className="flex space-x-2">
                  {getActionButton(table)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTable(table);
                    }}
                    className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openManualOrderModal(table);
                    }}
                    className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    title="Crea ordine manuale"
                  >
                    📝 Manuale
                  </button>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadQRCode(table);
                    }}
                    className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex items-center justify-center"
                    title="Scarica QR PNG"
                  >
                    📱 Scarica QR
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      regenerateQRCode(table);
                    }}
                    className="flex-1 bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 flex items-center justify-center"
                    title="Rigenera QR"
                  >
                    🔄 Rigenera
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Form Modal */}
        {isFormOpen && (
          <TableForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTable(null);
            }}
            onSubmit={handleFormSubmit}
            table={editingTable}
            isLoading={isSubmitting}
          />
        )}

        {/* Orders Modal */}
        {showOrdersModal && selectedTable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ordini - {selectedTable.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} {selectedTable.number}
                  </h2>
                  <button
                    onClick={() => setShowOrdersModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                {(!selectedTable.orders || selectedTable.orders.length === 0) ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">Nessun ordine attivo per questo {selectedTable.type === 'UMBRELLA' ? 'ombrellone' : 'tavolo'}</p>
                    <button
                      onClick={() => openManualOrderModal(selectedTable)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Crea Ordine Manuale
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedTable.orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Ordine #{order.id.slice(-6)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {new Date(order.createdAt).toLocaleString('it-IT')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              €{order.totalAmount.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'PREPARING' ? 'bg-orange-100 text-orange-800' :
                              order.status === 'READY' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">
                                  {item.quantity}x {item.menuItem?.name || 'Piatto non disponibile'}
                                </span>
                                <span className="text-gray-900 dark:text-white">
                                  €{((item.quantity || 0) * (item.menuItem?.price || 0)).toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Nessun item disponibile
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Order Modal */}
        {showManualOrderModal && selectedTableForOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ordine Manuale - {selectedTableForOrder.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} {selectedTableForOrder.number}
                  </h2>
                  <button
                    onClick={() => setShowManualOrderModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Menu Disponibile
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600"
                        onClick={() => addItemToOrder(item)}
                      >
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-gray-600 dark:text-gray-300">€{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Ordine In Corso
                  </h3>
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-2 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, item.quantity - 1);
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400"
                          >
                            ➖
                          </button>
                          <span className="text-gray-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, item.quantity + 1);
                            }}
                            className="text-green-500 hover:text-green-700 dark:text-green-400"
                          >
                            ➕
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItemFromOrder(item.id);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowManualOrderModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={createManualOrder}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Crea Ordine
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 