import { create } from 'zustand';
import { User, Filters } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },
}));

interface FilterState {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filters: {
    period: 'THIS_MONTH',
  },
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({ filters: { period: 'THIS_MONTH' } }),
}));
