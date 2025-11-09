import { create } from "zustand"
import { EmployeeServiceApi } from "../services/employee-service"
import { EmployeeServicesApi } from "../services/employee-services"
import type { Employee } from "../types/employee"
import type { EmployeeServiceItem } from "../types/employee-service"

interface SalonDetail {
  employees: Employee[]
  services: EmployeeServiceItem[]
}

interface SalonDetailState {
  bySalonId: Record<string, SalonDetail>
  loading: Record<string, boolean>
  error: Record<string, string | null>
  loadSalonDetails: (salonId: string) => Promise<void>
}

export const useSalonDetailStore = create<SalonDetailState>((set, get) => ({
  bySalonId: {},
  loading: {},
  error: {},
  async loadSalonDetails(salonId: string) {
    const { bySalonId, loading } = get()
    // Guard: if details already present or a request is in-flight, do nothing
    if (bySalonId[salonId] || loading[salonId]) return

    set((s) => ({ loading: { ...s.loading, [salonId]: true }, error: { ...s.error, [salonId]: null } }))

    try {
      const [employees, services] = await Promise.all([
        EmployeeServiceApi.getEmployeesBySalon(salonId),
        EmployeeServicesApi.getServicesBySalon(salonId),
      ])
      set((s) => ({
        bySalonId: { ...s.bySalonId, [salonId]: { employees, services } },
        loading: { ...s.loading, [salonId]: false },
      }))
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load details"
      set((s) => ({
        error: { ...s.error, [salonId]: message },
        loading: { ...s.loading, [salonId]: false },
      }))
    }
  },
}))
