import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EmployeeService, type Employee, type CreateEmployeeRequest, type UpdateEmployeeRequest } from '../services/employeeService';

type EmployeeState = {
  employees: Employee[];
  current?: Employee | null;
  isLoading: boolean;
  error: string | null;
};

type EmployeeActions = {
  clearError: () => void;
  setCurrent: (emp: Employee | null) => void;
  reset: () => void;
  fetchAll: () => Promise<{ success: boolean; data?: Employee[]; error?: string }>;
  fetchBySalonUser: (salonUserId: string) => Promise<{ success: boolean; data?: Employee[]; error?: string }>;
  fetchBySalon: (salonId: string) => Promise<{ success: boolean; data?: Employee[]; error?: string }>;
  getById: (id: string) => Promise<{ success: boolean; data?: Employee; error?: string }>;
  create: (payload: CreateEmployeeRequest) => Promise<{ success: boolean; data?: Employee; error?: string }>;
  update: (payload: UpdateEmployeeRequest) => Promise<{ success: boolean; data?: Employee; error?: string }>;
  remove: (id: string) => Promise<{ success: boolean; error?: string }>;
};

export const useEmployeeStore = create<EmployeeState & EmployeeActions>()(
  devtools(
    persist(
      (set, get) => ({
        employees: [],
        current: null,
        isLoading: false,
        error: null,

        clearError: () => set({ error: null }),
        setCurrent: (emp) => set({ current: emp }),
        reset: () => set({ employees: [], current: null }),

        fetchAll: async () => {
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] fetchAll start');
            const data = await EmployeeService.listEmployees();
            const arr = Array.isArray(data) ? data : [];
            console.info('[EmployeeStore] fetchAll success', { count: arr.length });
            // Overwrite to avoid stale cached employees
            set({ employees: arr, isLoading: false });
            return { success: true, data: arr };
          } catch (e: any) {
            console.error('[EmployeeStore] fetchAll error', e);
            set({ isLoading: false, error: e?.message || 'Failed to fetch employees' });
            return { success: false, error: e?.message || 'Failed to fetch employees' };
          }
        },

        fetchBySalonUser: async (salonUserId: string) => {
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] fetchBySalonUser start', { salonUserId });
            const data = await EmployeeService.listBySalonUser(salonUserId);
            const arr = Array.isArray(data) ? data : [];
            console.info('[EmployeeStore] fetchBySalonUser success', { count: arr.length });
            // Overwrite to avoid stale cached employees
            set({ employees: arr, isLoading: false });
            return { success: true, data: arr };
          } catch (e: any) {
            console.error('[EmployeeStore] fetchBySalonUser error', e);
            set({ isLoading: false, error: e?.message || 'Failed to fetch employees' });
            return { success: false, error: e?.message || 'Failed to fetch employees' };
          }
        },

        fetchBySalon: async (salonId: string) => {
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] fetchBySalon start', { salonId });
            const data = await EmployeeService.listBySalon(salonId);
            const arr = Array.isArray(data) ? data : [];
            console.info('[EmployeeStore] fetchBySalon success', { count: arr.length });
            // Overwrite to avoid stale cached employees
            set({ employees: arr, isLoading: false });
            return { success: true, data: arr };
          } catch (e: any) {
            console.error('[EmployeeStore] fetchBySalon error', e);
            set({ isLoading: false, error: e?.message || 'Failed to fetch employees' });
            return { success: false, error: e?.message || 'Failed to fetch employees' };
          }
        },

        getById: async (id: string) => {
          if (!id) {
            console.warn('[EmployeeStore] getById called with empty id');
            return { success: false, error: 'Missing employee id' };
          }
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] getById start', { id });
            const data = await EmployeeService.getEmployeeById(id);
            console.info('[EmployeeStore] getById success', { id: data?._id });
            set({ current: data, isLoading: false });
            return { success: true, data };
          } catch (e: any) {
            console.error('[EmployeeStore] getById error', e);
            set({ isLoading: false, error: e?.message || 'Failed to fetch employee' });
            return { success: false, error: e?.message || 'Failed to fetch employee' };
          }
        },

        create: async (payload: CreateEmployeeRequest) => {
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] create start');
            const emp = await EmployeeService.createEmployee(payload);
            const prev = Array.isArray(get().employees) ? get().employees : [];
            set({ employees: [emp, ...prev], isLoading: false });
            console.info('[EmployeeStore] create success', { id: emp._id });
            return { success: true, data: emp };
          } catch (e: any) {
            console.error('[EmployeeStore] create error', e);
            set({ isLoading: false, error: e?.message || 'Failed to create employee' });
            return { success: false, error: e?.message || 'Failed to create employee' };
          }
        },

        update: async (payload: UpdateEmployeeRequest) => {
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] update start', { id: payload._id });
            const updated = await EmployeeService.updateEmployee(payload);
            // Refetch fresh copy (cache-busted in service) to ensure perfect sync
            const refetchId = updated?._id || payload._id; // fallback to payload id if response lacks id
            const fresh = await EmployeeService.getEmployeeById(refetchId);
            const prev = Array.isArray(get().employees) ? get().employees : [];
            const next = prev.length ? prev.map(e => (e._id === fresh._id ? fresh : e)) : [fresh];
            set({ employees: next, isLoading: false, current: fresh });
            console.info('[EmployeeStore] update success', { id: fresh._id });
            return { success: true, data: fresh };
          } catch (e: any) {
            console.error('[EmployeeStore] update error', e);
            set({ isLoading: false, error: e?.message || 'Failed to update employee' });
            return { success: false, error: e?.message || 'Failed to update employee' };
          }
        },

        remove: async (id: string) => {
          if (!id) {
            console.warn('[EmployeeStore] remove called with empty id');
            return { success: false, error: 'Missing employee id' };
          }
          set({ isLoading: true, error: null });
          try {
            console.info('[EmployeeStore] remove start', { id });
            await EmployeeService.deleteEmployee(id);
            const prev = Array.isArray(get().employees) ? get().employees : [];
            set({ employees: prev.filter(e => e._id !== id), isLoading: false });
            console.info('[EmployeeStore] remove success', { id });
            return { success: true };
          } catch (e: any) {
            console.error('[EmployeeStore] remove error', e);
            set({ isLoading: false, error: e?.message || 'Failed to delete employee' });
            return { success: false, error: e?.message || 'Failed to delete employee' };
          }
        },
      }),
      { name: 'employee_store' }
    )
  )
);
