import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EmployeeServicesService, type EmployeeServiceItem, type CreateEmployeeServiceRequest, type UpdateEmployeeServiceRequest } from '../services/employeeServicesService';

export type EmployeeServicesState = {
  services: EmployeeServiceItem[];
  current?: EmployeeServiceItem | null;
  isLoading: boolean;
  error: string | null;
};

export type EmployeeServicesActions = {
  clearError: () => void;
  setCurrent: (svc: EmployeeServiceItem | null) => void;
  reset: () => void;
  fetchByEmployee: (employeeId: string, opts?: { isActive?: boolean | 'all' }) => Promise<{ success: boolean; data?: EmployeeServiceItem[]; error?: string }>;
  fetchBySalon: (salonId: string, opts?: { isActive?: boolean | 'all' }) => Promise<{ success: boolean; data?: EmployeeServiceItem[]; error?: string }>;
  fetchBySalonUser: (salonUserId: string, opts?: { isActive?: boolean | 'all' }) => Promise<{ success: boolean; data?: EmployeeServiceItem[]; error?: string }>;
  getById: (id: string) => Promise<{ success: boolean; data?: EmployeeServiceItem; error?: string }>;
  create: (employeeId: string, payload: Omit<CreateEmployeeServiceRequest, 'employee'>) => Promise<{ success: boolean; data?: EmployeeServiceItem; error?: string }>;
  update: (payload: UpdateEmployeeServiceRequest) => Promise<{ success: boolean; data?: EmployeeServiceItem; error?: string }>;
  remove: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggle: (id: string) => Promise<{ success: boolean; data?: EmployeeServiceItem; error?: string }>;
};

export const useEmployeeServicesStore = create<EmployeeServicesState & EmployeeServicesActions>()(
  devtools(
    persist(
      (set, get) => ({
        services: [],
        current: null,
        isLoading: false,
        error: null,

        clearError: () => set({ error: null }),
        setCurrent: (svc) => set({ current: svc }),
        reset: () => set({ services: [], current: null }),

        fetchByEmployee: async (employeeId, opts) => {
          set({ isLoading: true, error: null });
          try {
            const list = await EmployeeServicesService.listByEmployee(employeeId, opts);
            set({ services: list, isLoading: false });
            return { success: true, data: list };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to fetch services' });
            return { success: false, error: e?.message || 'Failed to fetch services' };
          }
        },

        fetchBySalon: async (salonId, opts) => {
          set({ isLoading: true, error: null });
          try {
            const list = await EmployeeServicesService.listBySalon(salonId, opts);
            set({ services: list, isLoading: false });
            return { success: true, data: list };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to fetch services' });
            return { success: false, error: e?.message || 'Failed to fetch services' };
          }
        },

        fetchBySalonUser: async (salonUserId, opts) => {
          set({ isLoading: true, error: null });
          try {
            const list = await EmployeeServicesService.listBySalonUser(salonUserId, opts);
            set({ services: list, isLoading: false });
            return { success: true, data: list };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to fetch services' });
            return { success: false, error: e?.message || 'Failed to fetch services' };
          }
        },

        getById: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const data = await EmployeeServicesService.getById(id);
            set({ current: data, isLoading: false });
            return { success: true, data };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to fetch service' });
            return { success: false, error: e?.message || 'Failed to fetch service' };
          }
        },

        create: async (employeeId, payload) => {
          set({ isLoading: true, error: null });
          try {
            const created = await EmployeeServicesService.create(employeeId, payload);
            const prev = Array.isArray(get().services) ? get().services : [];
            set({ services: [created, ...prev], isLoading: false });
            return { success: true, data: created };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to create service' });
            return { success: false, error: e?.message || 'Failed to create service' };
          }
        },

        update: async (payload) => {
          set({ isLoading: true, error: null });
          try {
            const updated = await EmployeeServicesService.update(payload);
            const prev = Array.isArray(get().services) ? get().services : [];
            const next = prev.map(s => (s._id === updated._id ? updated : s));
            set({ services: next, isLoading: false, current: updated });
            return { success: true, data: updated };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to update service' });
            return { success: false, error: e?.message || 'Failed to update service' };
          }
        },

        remove: async (id) => {
          set({ isLoading: true, error: null });
          try {
            await EmployeeServicesService.remove(id);
            const prev = Array.isArray(get().services) ? get().services : [];
            set({ services: prev.filter(s => s._id !== id), isLoading: false });
            return { success: true };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to delete service' });
            return { success: false, error: e?.message || 'Failed to delete service' };
          }
        },

        toggle: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const toggled = await EmployeeServicesService.toggleStatus(id);
            const prev = Array.isArray(get().services) ? get().services : [];
            const next = prev.map(s => (s._id === toggled._id ? toggled : s));
            set({ services: next, isLoading: false, current: toggled });
            return { success: true, data: toggled };
          } catch (e: any) {
            set({ isLoading: false, error: e?.message || 'Failed to toggle service' });
            return { success: false, error: e?.message || 'Failed to toggle service' };
          }
        },
      }),
      { name: 'employee_services_store' }
    )
  )
);
