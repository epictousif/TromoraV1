import { create } from "zustand"
import { SalonService, RateLimitError } from "@/SalonFinder/services/salon-service"
import type { Salon, SalonFilters } from "@/SalonFinder/types/salon"

interface SalonStore {
  // State
  salons: Salon[]
  filteredSalons: Salon[]
  loading: boolean
  error: string | null
  filters: SalonFilters

  // Actions
  fetchSalons: () => Promise<void>
  fetchSalonsByCoordinates: (latitude: number, longitude: number) => Promise<void>
  searchSalons: (query: string) => Promise<void>
  searchByLocation: (location: string) => Promise<void>
  setFilters: (filters: SalonFilters) => void
  clearFilters: () => void
  clearError: () => void
  applyFilters: () => void
}

const initialFilters: SalonFilters = {
  services: [],
  amenities: [],
  availability: "",
  city: "",
  state: "",
  pincode: "",
}

export const useSalonStore = create<SalonStore>((set, get) => ({
  // Initial state
  salons: [],
  filteredSalons: [],
  loading: false,
  error: null,
  filters: initialFilters,

  // Internal in-flight trackers to dedupe calls
  // Note: kept inside the store closure (not in state) since it's purely behavioral
  // and should not trigger UI updates.
  // @ts-ignore - using dynamic props on the store instance for internal use
  _inFlightAll: null as Promise<void> | null,
  // @ts-ignore
  _inFlightNearby: {} as Record<string, Promise<void>>,
  // @ts-ignore - single debounced fallback timer to avoid bursts after 429
  _fallbackTimer: null as ReturnType<typeof setTimeout> | null,
  // @ts-ignore - timestamp until which we should avoid making new API calls due to rate limiting
  _rateLimitUntil: null as number | null,

  // Fetch all salons
  fetchSalons: async () => {
    const state: any = get()
    if (state._inFlightAll) return state._inFlightAll
    const p = (async () => {
      set({ loading: true, error: null })
      try {
        const salons = await SalonService.getAllSalons()
        set({ salons, filteredSalons: salons, loading: false })
        get().applyFilters()
      } catch (error) {
        set({
          error: error instanceof Error ? (error as Error).message : "Failed to fetch salons",
          loading: false,
        })
      } finally {
        const s: any = get()
        s._inFlightAll = null
      }
    })()
    state._inFlightAll = p
    return p
  },

  // Fetch salons by coordinates (nearby search)
  fetchSalonsByCoordinates: async (latitude: number, longitude: number) => {
    // Early fallback if coordinates are invalid or missing
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return get().fetchSalons()
    }
    const key = `${Math.round(latitude * 1e5)},${Math.round(longitude * 1e5)}`
    const state: any = get()
    if (!state._inFlightNearby) state._inFlightNearby = {}
    // Respect temporary rate-limit cooldown window
    if (state._rateLimitUntil && Date.now() < state._rateLimitUntil) {
      // schedule a single fallback to getAll if not already scheduled
      if (!state._fallbackTimer) {
        const waitMs = Math.max(0, state._rateLimitUntil - Date.now())
        state._fallbackTimer = setTimeout(async () => {
          try {
            await get().fetchSalons()
          } finally {
            const s: any = get()
            s._fallbackTimer = null
          }
        }, waitMs)
      }
      return state._inFlightNearby[key] || Promise.resolve()
    }
    if (state._inFlightNearby[key]) return state._inFlightNearby[key]

    const p = (async () => {
      set({ loading: true, error: null })
      try {
        const salons = await SalonService.searchNearby({ latitude, longitude })
        if (!salons || salons.length === 0) {
          // Nearby returned no results -> fallback to all salons
          await get().fetchSalons()
        } else {
          set({ salons, filteredSalons: salons, loading: false })
          get().applyFilters()
        }
      } catch (error) {
        if (error instanceof RateLimitError) {
          // Debounced fallback to all salons to avoid hammering when rate-limited
          const state: any = get()
          // Set a short cooldown (5s) to avoid immediate re-tries across the app
          state._rateLimitUntil = Date.now() + 5000
          if (!state._fallbackTimer) {
            console.log("Rate limited on nearby; scheduling fallback to all salons in 3s")
            state._fallbackTimer = setTimeout(async () => {
              try {
                await get().fetchSalons()
              } finally {
                const s: any = get()
                s._fallbackTimer = null
              }
            }, 3000)
          }
          set({ loading: false })
        } else {
          console.log("Nearby search failed, falling back to all salons")
          await get().fetchSalons()
        }
      } finally {
        const s: any = get()
        if (s._inFlightNearby) delete s._inFlightNearby[key]
      }
    })()
    state._inFlightNearby[key] = p
    return p
  },

  // Search salons by services
  searchSalons: async (query: string) => {
    set({ loading: true, error: null })
    try {
      // Canonical service list (kept in sync with backend)
      const CANONICAL_SERVICES = [
        "Haircut","Hair Styling","Hair Wash","Hair Coloring","Hair Treatment",
        "Beard Trim","Shaving","Mustache Styling",
        "Facial","Face Cleanup","Head Massage","Hair Spa",
        "Eyebrow Threading","Manicure","Pedicure","Waxing","Bleaching",
        "Bridal Makeup","Party Makeup",
        "Hair Straightening","Hair Curling","Keratin Treatment","Scalp Treatment",
      ]

      // Map common aliases to canonical names
      const aliasToCanonical: Record<string, string> = {
        "haircut": "Haircut",
        "hair cut": "Haircut",
        "cut": "Haircut",
        "spa": "Hair Spa",
        "beardtrim": "Beard Trim",
        "beard trim": "Beard Trim",
        "massage": "Head Massage",
        "headmassage": "Head Massage",
      }

      const norm = (s: string) => s.toLowerCase().replace(/[-_\s]+/g, " ").trim()
      const normKey = (s: string) => s.toLowerCase().replace(/[-_\s]+/g, "")

      // Split query, normalize, and map to canonical service names when possible
      let parts = query.split(",").map((s) => s.trim()).filter(Boolean)
      const mapped = parts.map((p) => {
        const k = norm(p)
        const k2 = normKey(p)
        if (aliasToCanonical[k]) return aliasToCanonical[k]
        if (aliasToCanonical[k2]) return aliasToCanonical[k2]
        // Try direct canonical match ignoring case/spaces
        const direct = CANONICAL_SERVICES.find(cs => norm(cs) === k || normKey(cs) === k2)
        return direct || p
      })

      const services = Array.from(new Set(mapped))

      let salons = await SalonService.searchByServices(services)

      // Fallback: if API returns no results, fetch all and filter client-side by name/services
      if (!salons || salons.length === 0) {
        await get().fetchSalons()
        const all = get().salons
        const qNorms = parts.map(norm)
        salons = all.filter((s: any) => {
          const name = typeof s?.name === 'string' ? norm(s.name) : ""
          const servs = Array.isArray(s?.services) ? (s.services as string[]).map(norm) : []
          return qNorms.some(q => name.includes(q) || servs.some(v => v.includes(q)))
        })
      }

      set({ salons, filteredSalons: salons, loading: false })
      get().applyFilters()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Search failed",
        loading: false,
      })
    }
  },

  // Search salons by location
  searchByLocation: async (location: string) => {
    set({ loading: true, error: null })
    try {
      const salons = await SalonService.searchByLocation(location)
      // Show exactly what backend returns; no generic fallback to all
      const safe = Array.isArray(salons) ? salons : []
      set({ salons: safe, filteredSalons: safe, loading: false })
      get().applyFilters()
    } catch (error) {
      const state: any = get()
      if (error instanceof RateLimitError) {
        state._rateLimitUntil = Date.now() + 5000
        if (!state._fallbackTimer) {
          state._fallbackTimer = setTimeout(async () => {
            try {
              await get().fetchSalons()
            } finally {
              const s: any = get()
              s._fallbackTimer = null
            }
          }, 3000)
        }
        set({ loading: false })
      } else {
        set({
          error: error instanceof Error ? error.message : "Location search failed",
          loading: false,
        })
      }
    }
  },

  // Set filters and apply them
  setFilters: (filters: SalonFilters) => {
    set({ filters })
    get().applyFilters()
  },

  // Clear all filters
  clearFilters: () => {
    set({ filters: initialFilters })
    get().applyFilters()
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Apply current filters to salons
  applyFilters: () => {
    const { salons, filters } = get()

    let filtered = [...salons]

    // Filter by services
    if (filters.services.length > 0) {
      filtered = filtered.filter((salon) => filters.services.some((service) => salon.services.includes(service)))
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((salon) => filters.amenities.every((amenity) => salon.amenities.includes(amenity)))
    }

    // Filter by availability
    if (filters.availability) {
      filtered = filtered.filter((salon) => salon.availability === filters.availability)
    }

    // Filter by location
    if (filters.city) {
      filtered = filtered.filter((salon) => salon.location.city.toLowerCase().includes(filters.city.toLowerCase()))
    }

    if (filters.state) {
      filtered = filtered.filter((salon) => salon.location.state.toLowerCase().includes(filters.state.toLowerCase()))
    }

    if (filters.pincode) {
      filtered = filtered.filter((salon) => salon.location.pincode.includes(filters.pincode))
    }

    set({ filteredSalons: filtered })
  },
}))
