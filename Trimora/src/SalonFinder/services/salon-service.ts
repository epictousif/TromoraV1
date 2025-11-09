import { API_BASE_URL } from "../lib/constants"
import type { Salon, SearchParams } from "../types/salon"

export class RateLimitError extends Error {
  constructor(message = "Too Many Requests") {
    super(message)
    this.name = "RateLimitError"
  }
}

export class SalonService {
  private static async fetchWithErrorHandling<T>(url: string, retries = 1, baseDelayMs = 1000): Promise<T> {
    try {
      const response = await fetch(url)

      if (response.status === 429) {
        if (retries > 0) {
          const retryAfterHeader = response.headers.get("retry-after")
          const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 0
          // Use Retry-After if present, else exponential backoff from provided base.
          // Cap the wait to 5s to keep UX responsive in dev.
          const backoffMs = Math.min(retryAfterMs || baseDelayMs * Math.pow(2, 1 - retries), 5000)
          await new Promise((r) => setTimeout(r, backoffMs))
          return this.fetchWithErrorHandling<T>(url, retries - 1, baseDelayMs)
        }
        // retries exhausted -> propagate a typed rate limit error
        throw new RateLimitError()
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if ((data as any)?.status === "error") {
        throw new Error((data as any).message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error instanceof Error ? error : new Error("Unknown error occurred")
    }
  }

  // Deduplicate in-flight getSalonById requests per ID to avoid bursts under StrictMode / rapid navigations
  private static inFlightSalonById: Record<string, Promise<Salon>> = {}
  // Deduplicate fetching all salons
  private static inFlightAllSalons: Promise<Salon[]> | null = null
  // Deduplicate nearby searches by a key
  private static inFlightNearby: Record<string, Promise<Salon[]>> = {}

  static async getAllSalons(): Promise<Salon[]> {
    if (!this.inFlightAllSalons) {
      this.inFlightAllSalons = this.fetchWithErrorHandling<{ salons: Salon[] }>(
        `${API_BASE_URL}/getAllSalons`,
      ).then((d) => d.salons).finally(() => {
        this.inFlightAllSalons = null
      })
    }
    return this.inFlightAllSalons
  }

  static async searchNearby(params: SearchParams): Promise<Salon[]> {
    const { latitude, longitude, maxDistance = 5000, page = 1, limit = 20 } = params

    const queryParams = new URLSearchParams({
      latitude: latitude!.toString(),
      longitude: longitude!.toString(),
      maxDistance: maxDistance.toString(),
      page: page.toString(),
      limit: limit.toString(),
    })

    const key = `${Math.round((latitude || 0) * 1e5)},${Math.round((longitude || 0) * 1e5)}:${maxDistance}:${page}:${limit}`
    if (!this.inFlightNearby[key]) {
      this.inFlightNearby[key] = this.fetchWithErrorHandling<{ salons: Salon[] }>(
        `${API_BASE_URL}/search/nearby?${queryParams}`,
      ).then((d) => d.salons).finally(() => {
        delete this.inFlightNearby[key]
      })
    }
    return this.inFlightNearby[key]
  }

  static async searchByLocation(location: string): Promise<Salon[]> {
    // Determine if pincode (numeric) or text
    const raw = location.trim()
    const isNumeric = /^\d+$/.test(raw)

    if (isNumeric) {
      const qp = new URLSearchParams({ pincode: raw })
      const data = await this.fetchWithErrorHandling<{ salons: Salon[] }>(
        `${API_BASE_URL}/search/location?${qp}`,
      )
      return data.salons
    }

    // Text path: query city first (OR-style behavior is implemented by sequential tries)
    let qp = new URLSearchParams({ city: raw })
    let data = await this.fetchWithErrorHandling<{ salons: Salon[] }>(
      `${API_BASE_URL}/search/location?${qp}`,
    )
    if (Array.isArray(data.salons) && data.salons.length > 0) return data.salons

    // Retry with state only if city returned zero
    qp = new URLSearchParams({ state: raw })
    data = await this.fetchWithErrorHandling<{ salons: Salon[] }>(
      `${API_BASE_URL}/search/location?${qp}`,
    )
    return data.salons
  }

  static async searchByServices(services: string[]): Promise<Salon[]> {
    const queryParams = new URLSearchParams({
      services: services.join(","),
    })

    const data = await this.fetchWithErrorHandling<{ salons: Salon[] }>(
      `${API_BASE_URL}/search/services?${queryParams}`,
    )
    return data.salons
  }

  static async getSalonById(id: string): Promise<Salon> {
    if (!this.inFlightSalonById[id]) {
      this.inFlightSalonById[id] = this.fetchWithErrorHandling<{ salon: Salon }>(
        `${API_BASE_URL}/getSalon/${id}`,
      ).then((d) => d.salon).finally(() => {
        // clear after settle to allow future fetches
        delete this.inFlightSalonById[id]
      })
    }
    return this.inFlightSalonById[id]
  }
}
