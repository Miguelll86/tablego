'use client';

import { useState, useEffect } from 'react';
import { usePWA } from './usePWA';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { sendNotification, requestNotificationPermission } = usePWA();

  useEffect(() => {
    // Carica notifiche dal localStorage con gestione errori
    try {
      const savedNotifications = localStorage.getItem('tablego-notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Verifica che i dati siano un array
        if (Array.isArray(parsed)) {
          // Converti le date string in oggetti Date
          const notificationsWithDates = parsed.map((notification: any) => ({
            ...notification,
            timestamp: notification.timestamp ? new Date(notification.timestamp) : new Date(),
          }));
          setNotifications(notificationsWithDates);
          setUnreadCount(notificationsWithDates.filter((n: Notification) => !n.read).length);
        } else {
          // Se i dati non sono un array, resetta
          localStorage.removeItem('tablego-notifications');
        }
      }
    } catch (error) {
      console.error('Errore nel parsing delle notifiche dal localStorage:', error);
      // Rimuovi i dati corrotti
      localStorage.removeItem('tablego-notifications');
    }
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount + 1);
    
    // Salva nel localStorage con gestione errori
    try {
      localStorage.setItem('tablego-notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Errore nel salvataggio delle notifiche:', error);
    }
    
    // Invia notifica push se permesso
    try {
      sendNotification(notification.title, {
        body: notification.message,
        tag: newNotification.id,
        data: notification.action,
      });
    } catch (error) {
      console.error('Errore nell\'invio della notifica push:', error);
    }
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(Math.max(0, unreadCount - 1));
    try {
      localStorage.setItem('tablego-notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Errore nel salvataggio delle notifiche:', error);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    try {
      localStorage.setItem('tablego-notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Errore nel salvataggio delle notifiche:', error);
    }
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    if (notification && !notification.read) {
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
    try {
      localStorage.setItem('tablego-notifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Errore nel salvataggio delle notifiche:', error);
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      localStorage.removeItem('tablego-notifications');
    } catch (error) {
      console.error('Errore nella rimozione delle notifiche:', error);
    }
  };

  // Notifiche predefinite per eventi comuni
  const notifyNewOrder = (orderId: string, tableNumber: string) => {
    addNotification({
      title: 'Nuovo Ordine',
      message: `Ordine #${orderId} ricevuto dal tavolo ${tableNumber}`,
      type: 'success',
      action: {
        label: 'Visualizza Ordine',
        url: `/orders/${orderId}`,
      },
    });
  };

  const notifyOrderStatusChange = (orderId: string, status: string) => {
    addNotification({
      title: 'Stato Ordine Aggiornato',
      message: `Ordine #${orderId} è ora ${status}`,
      type: 'info',
      action: {
        label: 'Visualizza Ordine',
        url: `/orders/${orderId}`,
      },
    });
  };

  const notifyPaymentReceived = (orderId: string, amount: number) => {
    addNotification({
      title: 'Pagamento Ricevuto',
      message: `Pagamento di €${amount.toFixed(2)} per ordine #${orderId}`,
      type: 'success',
      action: {
        label: 'Visualizza Dettagli',
        url: `/orders/${orderId}`,
      },
    });
  };

  const notifyLowStock = (itemName: string) => {
    addNotification({
      title: 'Scorte Basse',
      message: `${itemName} ha scorte basse`,
      type: 'warning',
      action: {
        label: 'Gestisci Menu',
        url: '/menu',
      },
    });
  };

  const notifyError = (message: string) => {
    addNotification({
      title: 'Errore',
      message,
      type: 'error',
    });
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestNotificationPermission,
    // Notifiche predefinite
    notifyNewOrder,
    notifyOrderStatusChange,
    notifyPaymentReceived,
    notifyLowStock,
    notifyError,
  };
} 