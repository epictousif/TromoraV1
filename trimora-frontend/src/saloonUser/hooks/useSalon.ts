import { useEffect } from 'react';
import { useSalonStore } from '../store/salonStore';
import { useAuth } from './useAuth';
import type { 
  CreateSalonRequest, 
  UpdateSalonRequest,
  LocationSearchParams,
  NearbySearchParams,
  ServiceSearchParams
} from '../types/salon';

export const useSalon = () => {
  const { user } = useAuth();
  const {
    salons,
    currentSalon,
    isLoading,
    error,
    totalCount,
    lastFetched,
    createSalon,
    
    getSalonById,
    updateSalon,
    deleteSalon,
    searchByLocation,
    searchNearby,
    searchByServices,
    getUserSalons,
    getUserSalonCount,
    clearError,
    setLoading,
    setCurrentSalon
  } = useSalonStore();

  // Auto-load user's salons when user is available
  useEffect(() => {
    console.info('[useSalon] useEffect triggered. user?.id =', user?.id);
    if (user?.id) {
      console.info('[useSalon] Fetching salons for user:', user.id);
      getUserSalons(user.id);
    } else {
      console.warn('[useSalon] No user ID found. Skipping getUserSalons.');
    }
  }, [user?.id, getUserSalons]);

  // Refresh on window focus to avoid stale UI when data updated elsewhere
  useEffect(() => {
    const onFocus = () => {
      if (user?.id) {
        getUserSalons(user.id);
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user?.id, getUserSalons]);

  // Periodic refresh every 60s when authenticated
  useEffect(() => {
    if (!user?.id) return;
    const id = setInterval(() => {
      getUserSalons(user.id!);
    }, 60000);
    return () => clearInterval(id);
  }, [user?.id, getUserSalons]);

  const handleCreateSalon = async (salonData: CreateSalonRequest) => {
    return await createSalon(salonData);
  };

  const handleUpdateSalon = async (salonData: UpdateSalonRequest) => {
    const res = await updateSalon(salonData);
    if (res?.success && user?.id) {
      // Force refresh list from backend to avoid any stale cache
      await getUserSalons(user.id);
    }
    return res;
  };

  const handleDeleteSalon = async (id: string) => {
    return await deleteSalon(id);
  };

  const handleGetSalonById = async (id: string) => {
    return await getSalonById(id);
  };

  const handleSearchByLocation = async (params: LocationSearchParams) => {
    return await searchByLocation(params);
  };

  const handleSearchNearby = async (params: NearbySearchParams) => {
    return await searchNearby(params);
  };

  const handleSearchByServices = async (params: ServiceSearchParams) => {
    return await searchByServices(params);
  };

  const refreshUserSalons = async () => {
    if (user?.id) {
      console.info('[useSalon] refreshUserSalons for user:', user.id);
      return await getUserSalons(user.id);
    }
    return { success: false, error: 'User not authenticated' };
  };

  const getUserSalonsCount = async () => {
    if (user?.id) {
      console.info('[useSalon] getUserSalonsCount for user:', user.id);
      return await getUserSalonCount(user.id);
    }
    return { success: false, error: 'User not authenticated' };
  };

  return {
    // State
    salons,
    currentSalon,
    isLoading,
    error,
    totalCount,
    lastFetched,
    user,
    
    // Actions
    createSalon: handleCreateSalon,
    updateSalon: handleUpdateSalon,
    deleteSalon: handleDeleteSalon,
    getSalonById: handleGetSalonById,
    searchByLocation: handleSearchByLocation,
    searchNearby: handleSearchNearby,
    searchByServices: handleSearchByServices,
    refreshUserSalons,
    getUserSalonsCount,
    
    // Utility
    clearError,
    setLoading,
    setCurrentSalon
  };
};
