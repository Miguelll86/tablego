'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RestaurantInfo {
  name: string;
  logo?: string;
}

export default function RestaurantHeader() {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      
      if (data.success) {
        setRestaurant({
          name: data.settings.name,
          logo: data.settings.logo
        });
      }
    } catch (error) {
      console.error('Errore nel caricamento info ristorante:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {restaurant?.logo ? (
        <Image
          src={restaurant.logo}
          alt={`Logo ${restaurant.name}`}
          width={32}
          height={32}
          className="rounded-lg object-cover shadow-sm"
        />
      ) : (
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">
            {restaurant?.name?.charAt(0) || 'R'}
          </span>
        </div>
      )}
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {restaurant?.name || 'TableGo'}
      </span>
    </div>
  );
} 