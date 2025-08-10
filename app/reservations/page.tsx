'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  table: {
    id: string;
    number: number;
    type: 'TABLE' | 'UMBRELLA';
    capacity: number;
  };
}

interface Table {
  id: string;
  number: number;
  capacity: number;
  type: 'TABLE' | 'UMBRELLA';
  status: string;
}

export default function Reservations() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('all');
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'TABLE' | 'UMBRELLA'>('all');
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsappData, setWhatsappData] = useState<{url: string, message: string} | null>(null);

  useEffect(() => {
    if (user) {
      fetchReservations();
      fetchTables();
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      
      if (data.success) {
        setReservations(data.reservations);
      } else {
        setError(data.error || 'Errore nel caricamento delle prenotazioni');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/tables');
      const data = await response.json();
      
      if (data.success) {
        setTables(data.tables);
      }
    } catch (error) {
      console.error('Errore caricamento tavoli:', error);
    }
  };

  const handleCreateReservation = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success || data.id) {
        await fetchReservations();
        setIsFormOpen(false);
        setError('');
        
        // Se abbiamo un URL WhatsApp, mostriamo una notifica speciale
        if (data.whatsappUrl) {
          // Mostra la modale WhatsApp
          setWhatsappData({
            url: data.whatsappUrl,
            message: `🎉 Prenotazione Confermata!

Ciao ${formData.customerName},

La tua prenotazione è stata confermata:

📅 Data: ${new Date(formData.date).toLocaleDateString('it-IT')}
🕐 Orario: ${formData.startTime}
👥 Persone: ${formData.guests}
🪑 Tavolo: ${tables.find(t => t.id === formData.tableId)?.number || 'N/A'}
📝 Note: ${formData.notes || 'Nessuna nota'}

Grazie per aver scelto il nostro ristorante!`
          });
          setShowWhatsAppModal(true);
          
          addNotification({
            title: 'Prenotazione Creata',
            message: 'Prenotazione creata con successo! Messaggio WhatsApp pronto per l\'invio.',
            type: 'success'
          });
        } else {
          addNotification({
            title: 'Prenotazione Creata',
            message: 'Prenotazione creata con successo',
            type: 'success'
          });
        }
      } else {
        setError(data.error || 'Errore nella creazione');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReservation = async (formData: any) => {
    if (!editingReservation) return;

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/reservations/${editingReservation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReservations();
        setEditingReservation(null);
        setIsFormOpen(false);
        setError('');
        addNotification({
          title: 'Prenotazione Aggiornata',
          message: 'Prenotazione aggiornata con successo',
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nell\'aggiornamento');
      }
    } catch (error) {
      setError('Errore di connessione');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa prenotazione?')) return;

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchReservations();
        setError('');
        addNotification({
          title: 'Prenotazione Eliminata',
          message: 'Prenotazione eliminata con successo',
          type: 'success'
        });
      } else {
        setError(data.error || 'Errore nell\'eliminazione');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingReservation) {
      handleUpdateReservation(formData);
    } else {
      handleCreateReservation(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'In Attesa';
      case 'CONFIRMED': return 'Confermata';
      case 'CANCELLED': return 'Cancellata';
      default: return 'Sconosciuto';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Filtra prenotazioni per data e status
  const filteredReservations = reservations.filter(reservation => {
    const matchesDate = !selectedDate || reservation.date.startsWith(selectedDate);
    const matchesStatus = selectedStatus === 'all' || reservation.status === selectedStatus;
    return matchesDate && matchesStatus;
  });

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestione Prenotazioni</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gestisci le prenotazioni di tavoli e ombrelloni
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>📅</span>
              <span>Nuova Prenotazione</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Filtri */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Data
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Stato
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="all">Tutti gli stati</option>
              <option value="PENDING">In Attesa</option>
              <option value="CONFIRMED">Confermate</option>
              <option value="CANCELLED">Cancellate</option>
            </select>
          </div>
        </div>

        {/* Lista prenotazioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {reservation.customerName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {reservation.customerEmail}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(reservation.status)}`}></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Data:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(reservation.date)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Orario:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Ospiti:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {reservation.guests} persone
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Tavolo:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {reservation.table.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} {reservation.table.number}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Stato:</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>

                {reservation.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Note:</strong> {reservation.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <button
                    onClick={() => handleEditReservation(reservation)}
                    className="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDeleteReservation(reservation.id)}
                    className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nessuna prenotazione trovata
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedDate || selectedStatus !== 'all' 
                ? 'Prova a modificare i filtri di ricerca'
                : 'Crea la tua prima prenotazione cliccando su "Nuova Prenotazione"'
              }
            </p>
          </div>
        )}

        {/* Reservation Form Modal */}
        {isFormOpen && (
          <ReservationForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingReservation(null);
            }}
            onSubmit={handleFormSubmit}
            reservation={editingReservation}
            tables={tables}
            isLoading={isSubmitting}
          />
        )}

        {/* WhatsApp Modal */}
        {showWhatsAppModal && whatsappData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📱 Invia Messaggio WhatsApp
                </h2>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Messaggio da inviare:
                </h3>
                <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg">
                  <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-sans">
                    {whatsappData.message}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-full font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Chiudi
                </button>
                <button
                  onClick={() => {
                    window.open(whatsappData.url, '_blank');
                    setShowWhatsAppModal(false);
                  }}
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-green-600 transition-all flex items-center space-x-2"
                >
                  <span>📱</span>
                  <span>Apri WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Componente per il form di prenotazione
function ReservationForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  reservation, 
  tables, 
  isLoading 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  reservation: Reservation | null;
  tables: Table[];
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '14:00',
    guests: '2',
    tableId: '',
    notes: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        customerPhone: reservation.customerPhone,
        date: reservation.date.split('T')[0],
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        guests: reservation.guests.toString(),
        tableId: reservation.table.id,
        notes: reservation.notes || ''
      });
    } else {
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '12:00',
        endTime: '14:00',
        guests: '2',
        tableId: '',
        notes: ''
      });
    }
  }, [reservation, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione lato client
    if (!formData.customerName || !formData.customerPhone || !formData.date || !formData.startTime || !formData.guests || !formData.tableId) {
      // Mostra errore nel form invece di alert
      return;
    }
    
    // Trasforma i dati nel formato corretto per l'API
    const apiData = {
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerEmail: formData.customerEmail.trim(),
      date: formData.date,
      time: formData.startTime, // L'API si aspetta 'time' invece di 'startTime'
      partySize: parseInt(formData.guests), // Converti in numero
      tableId: formData.tableId,
      notes: formData.notes.trim()
    };
    
    onSubmit(apiData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {reservation ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nome Cliente *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Nome e Cognome"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="email@esempio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Telefono *
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="+39 123 456 7890"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Data *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Orario *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Numero Ospiti *
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                min="1"
                max="20"
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Tavolo/Ombrellone *
              </label>
              <select
                name="tableId"
                value={formData.tableId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Seleziona tavolo/ombrellone</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.type === 'UMBRELLA' ? '🏖️' : '🟢'} {table.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} {table.number} ({table.capacity} posti)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Note
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Note aggiuntive..."
            />
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : (reservation ? 'Aggiorna' : 'Crea')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 