import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  SalonStore, 
  CreateSalonRequest, 
  UpdateSalonRequest,
  LocationSearchParams,
  NearbySearchParams,
  ServiceSearchParams
} from '../types/salon';
import { SalonService } from '../services/salonService';

export const useSalonStore = create<SalonStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        salons: [],
        currentSalon: null,
        isLoading: false,
        error: null,
        totalCount: 0,
       lastFetched: 0,

        // CRUD Operations
        createSalon: async (salonData: CreateSalonRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            const salon = await SalonService.createSalon(salonData);
            
            set(state => ({
              salons: [salon, ...state.salons],
              totalCount: state.totalCount + 1,
              isLoading: false,
              error: null
            }));
            
            return { success: true, data: salon };
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        getSalons: async (userId?: string) => {
          set({ isLoading: true, error: null });
          
          try {
            let result: any;
            if (userId) {
              result = await SalonService.getSalonsByUserIdWithDetails(userId);
            } else {
              result = await SalonService.getAllSalons();
            }
            const salons = Array.isArray(result)
              ? result
              : Array.isArray(result?.salons)
                ? result.salons
                : [];
            
            set({
              salons,
              totalCount: salons.length,
              isLoading: false,
              error: null,
              lastFetched: Date.now(),
            });
            
            return { success: true, data: salons };
          } catch (error: any) {
            set({
              salons: [],
              totalCount: 0,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        getSalonById: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const salon = await SalonService.getSalonById(id);
            
            set(state => ({
              currentSalon: salon,
              salons: Array.isArray(state.salons) && state.salons.length
                ? state.salons.map(s => (s._id === salon._id ? salon : s))
                : [salon],
              isLoading: false,
              error: null,
              lastFetched: Date.now(),
            }));
            
            return { success: true, data: salon };
          } catch (error: any) {
            set({
              currentSalon: null,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        updateSalon: async (salonData: UpdateSalonRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            const updatedSalon = await SalonService.updateSalon(salonData);
            const refetchId = updatedSalon?._id || salonData._id;
            const keysToVerify: Array<keyof UpdateSalonRequest> = ['phone','name','openTime','closingTime','availability'];
            const differs = (a: any, b: any) => (a ?? undefined) !== (b ?? undefined);
            const nestedDiffers = (a: any, b: any) => {
              const aa = (a ?? '').toString().trim();
              const bb = (b ?? '').toString().trim();
              return aa !== bb;
            };
            const needsRetry = (freshObj: any, payload: UpdateSalonRequest) => {
              // flat keys
              const flatMismatch = keysToVerify.some(k => payload[k] !== undefined && differs(freshObj[k], payload[k]));
              // nested location fields mapped from payload root
              const loc = freshObj?.location || {};
              const addressMismatch = payload.address !== undefined && nestedDiffers(loc.address, payload.address);
              const cityMismatch = payload.city !== undefined && nestedDiffers(loc.city, payload.city);
              const stateMismatch = payload.state !== undefined && nestedDiffers(loc.state, payload.state);
              const pincodeMismatch = payload.pincode !== undefined && nestedDiffers(loc.pincode, payload.pincode);
              return flatMismatch || addressMismatch || cityMismatch || stateMismatch || pincodeMismatch;
            };
            
            // initial refetch
            let fresh = await SalonService.getSalonById(refetchId);
            let attempts = 0;
            while (
              attempts < 3 &&
              needsRetry(fresh as any, salonData)
            ) {
              await new Promise(res => setTimeout(res, 700 + attempts * 300));
              fresh = await SalonService.getSalonById(refetchId);
              attempts++;
            }

            set(state => ({
              salons: Array.isArray(state.salons) && state.salons.length
                ? state.salons.map(salon => salon._id === fresh._id ? fresh : salon)
                : [fresh],
              currentSalon: state.currentSalon?._id === fresh._id 
                ? fresh 
                : state.currentSalon,
              isLoading: false,
              error: null,
              lastFetched: Date.now(),
            }));

            return { success: true, data: fresh };
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        deleteSalon: async (id: string) => {
          set({ isLoading: true, error: null });
          
          try {
            await SalonService.deleteSalon(id);
            
            set(state => ({
              salons: state.salons.filter(salon => salon._id !== id),
              currentSalon: state.currentSalon?._id === id ? null : state.currentSalon,
              totalCount: Math.max(0, state.totalCount - 1),
              isLoading: false,
              error: null
            }));
            
            return { success: true };
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        // Search Operations
        searchByLocation: async (params: LocationSearchParams) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await SalonService.searchByLocation(params);
            
            set({
              salons: response.salons,
              totalCount: response.pagination?.total || response.salons.length,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: response };
          } catch (error: any) {
            set({
              salons: [],
              totalCount: 0,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        searchNearby: async (params: NearbySearchParams) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await SalonService.searchNearby(params);
            
            set({
              salons: response.salons,
              totalCount: response.salons.length,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: response };
          } catch (error: any) {
            set({
              salons: [],
              totalCount: 0,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        searchByServices: async (params: ServiceSearchParams) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await SalonService.searchByServices(params);
            
            set({
              salons: response.salons,
              totalCount: response.pagination?.total || response.salons.length,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: response };
          } catch (error: any) {
            set({
              salons: [],
              totalCount: 0,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        // User-specific Operations
        getUserSalons: async (userId: string) => {
          console.info('[salonStore] getUserSalons started for userId:', userId);
          set({ isLoading: true, error: null });
          
          try {
            const result = await SalonService.getSalonsByUserIdWithDetails(userId);
            const salons = Array.isArray(result)
              ? result
              : Array.isArray((result as any)?.salons)
                ? (result as any).salons
                : [];
            
            console.info('[salonStore] getUserSalons success. Count:', salons.length);
            set({
              salons,
              totalCount: salons.length,
              isLoading: false,
              error: null
            });
            
            return { success: true, data: salons };
          } catch (error: any) {
            console.error('[salonStore] getUserSalons error:', error?.message || error);
            set({
              salons: [],
              totalCount: 0,
              isLoading: false,
              error: error.message
            });
            return { success: false, error: error.message };
          }
        },

        getUserSalonCount: async (userId: string) => {
          try {
            const count = await SalonService.getSalonCountByUserId(userId);
            
            set({ totalCount: count });
            
            return { success: true, count };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        },

        // Utility Actions
        clearError: () => {
          set({ error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setCurrentSalon: (salon) => {
          set({ currentSalon: salon });
        }
      }),
      {
        name: 'salon-store-v2',
        // Do not persist salons/currentSalon to avoid stale UI
        partialize: (state) => ({
          totalCount: state.totalCount
        })
      }
    ),
    {
      name: 'salon-store-v2'
    }
  )
);
