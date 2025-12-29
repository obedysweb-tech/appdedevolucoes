import { create } from 'zustand';
import { User, Filters } from '@/types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

// Função para carregar usuário do localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      // Verificar se o cache não expirou (24 horas)
      const cacheTime = userData._cacheTime || 0;
      const now = Date.now();
      const cacheAge = now - cacheTime;
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
      
      if (cacheAge < cacheExpiry) {
        // Remover _cacheTime antes de retornar
        const { _cacheTime, ...userWithoutCache } = userData;
        return userWithoutCache as User;
      } else {
        localStorage.removeItem('auth_user');
      }
    }
  } catch (err) {
    console.warn('⚠️ Erro ao carregar usuário do localStorage:', err);
    localStorage.removeItem('auth_user');
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: loadUserFromStorage(),
  isLoading: true,
  setUser: (user) => {
    set({ user });
    // Salvar no localStorage quando o usuário é setado
    if (user) {
      try {
        const userWithCache = { ...user, _cacheTime: Date.now() };
        localStorage.setItem('auth_user', JSON.stringify(userWithCache));
      } catch (err) {
        console.warn('⚠️ Erro ao salvar usuário no localStorage:', err);
      }
    } else {
      localStorage.removeItem('auth_user');
    }
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    localStorage.removeItem('auth_user');
    // Limpar todos os caches de perfil
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('profile_')) {
        localStorage.removeItem(key);
      }
    });
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
