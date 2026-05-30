import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { BackendBooking } from '@/lib/adapters';

export interface BookingWithDetails {
  id: string;
  equipment: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
  };
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export function useMyBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<BackendBooking[]>('/bookings/my');
        
        const mappedBookings: BookingWithDetails[] = data.map((b) => {
          const eq = b.equipment as any;
          return {
            id: b._id,
            equipment: {
              id: eq._id,
              name: eq.title,
              image: eq.images && eq.images.length > 0 ? eq.images[0] : '',
              pricePerDay: eq.pricePerDay,
            },
            startDate: new Date(b.startDate).toLocaleDateString(),
            endDate: new Date(b.endDate).toLocaleDateString(),
            status: b.status,
            totalPrice: b.totalPrice,
          };
        });

        setBookings(mappedBookings);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
}
