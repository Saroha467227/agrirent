import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { adaptEquipment, adaptEquipmentList } from '@/lib/adapters';
import type { Equipment } from '@/data/equipment';
import type { BackendEquipment } from '@/lib/adapters';

export interface EquipmentFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  district?: string;
  village?: string;
}

export function useEquipmentList(initialFilters: EquipmentFilters = {}) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = useCallback(async (filters: EquipmentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.village) params.append('village', filters.village);

      const { data } = await api.get<BackendEquipment[]>(`/equipment?${params.toString()}`);
      setEquipment(adaptEquipmentList(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount with initial filters
  useEffect(() => {
    fetchEquipment(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { equipment, loading, error, fetchEquipment };
}

export function useEquipmentDetail(id: string | undefined) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<BackendEquipment>(`/equipment/${id}`);
        setEquipment(adaptEquipment(data));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch equipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { equipment, loading, error };
}
