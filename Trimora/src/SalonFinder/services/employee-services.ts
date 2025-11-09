import { API_EMPLOYEE_SERVICE_URL } from "../lib/constants"
import type { EmployeeServiceItem } from "../types/employee-service"

export class EmployeeServicesApi {
  private static cooldownUntil = 0
  private static async fetchWithErrorHandling<T>(url: string, retries = 3, baseDelayMs = 800): Promise<T> {
    const now = Date.now()
    if (this.cooldownUntil > now) {
      await new Promise((r) => setTimeout(r, this.cooldownUntil - now))
    }
    const res = await fetch(url)
    if (res.status === 429) {
      if (retries > 0) {
        const retryAfterHeader = res.headers.get("retry-after")
        const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 0
        const backoffMs = retryAfterMs || baseDelayMs * Math.pow(2, 3 - retries)
        await new Promise((r) => setTimeout(r, backoffMs))
        return this.fetchWithErrorHandling<T>(url, retries - 1, baseDelayMs)
      }
      const retryAfterHeader = res.headers.get("retry-after")
      const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 0
      // Set a short cooldown (5s default) to avoid hammering during rate limiting
      this.cooldownUntil = Date.now() + (retryAfterMs || 5000)
      throw new Error("HTTP 429")
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if ((data as any)?.status === "error") throw new Error((data as any).message || "API error")
    return data
  }

  // Deduplicate in-flight employee services fetches per salon
  private static inFlightBySalon: Record<string, Promise<EmployeeServiceItem[]>> = {}

  static async getServicesBySalon(salonId: string): Promise<EmployeeServiceItem[]> {
    console.log(`Fetching services for salon: ${salonId}`)
    console.log(`API URL: ${API_EMPLOYEE_SERVICE_URL}/salon/${salonId}`)
    
    if (!this.inFlightBySalon[salonId]) {
      this.inFlightBySalon[salonId] = this.fetchWithErrorHandling<
        { services?: EmployeeServiceItem[] } | EmployeeServiceItem[]
      >(`${API_EMPLOYEE_SERVICE_URL}/salon/${salonId}`).then((data) => {
        console.log('API Response:', data)
        if (Array.isArray(data)) return data as EmployeeServiceItem[]
        return (data?.services || []) as EmployeeServiceItem[]
      }).catch((error) => {
        console.error('Service fetch error:', error)
        throw error
      }).finally(() => {
        delete this.inFlightBySalon[salonId]
      })
    }
    return this.inFlightBySalon[salonId]
  }
}
