import { API_EMPLOYEE_URL } from "../lib/constants"
import type { Employee } from "../types/employee"

export class EmployeeServiceApi {
  private static cooldownUntil = 0

  private static async fetchWithErrorHandling<T>(url: string, retries = 1, baseDelayMs = 1000): Promise<T> {
    // If we're in cooldown from a recent 429, wait before issuing request
    const now = Date.now()
    if (this.cooldownUntil > now) {
      await new Promise((r) => setTimeout(r, this.cooldownUntil - now))
    }
    const res = await fetch(url)
    // Handle rate limiting with retry/backoff
    if (res.status === 429) {
      if (retries > 0) {
        const retryAfterHeader = res.headers.get("retry-after")
        const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 0
        // Use Retry-After if present, else exponential backoff; cap at 5s
        const backoffMs = Math.min(retryAfterMs || baseDelayMs * Math.pow(2, 1 - retries), 5000)
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
    if ((data as any).status === "error") throw new Error((data as any).message || "API error")
    return data
  }

  // Deduplicate in-flight employee fetches per salon
  private static inFlightBySalon: Record<string, Promise<Employee[]>> = {}

  static async getEmployeesBySalon(salonId: string): Promise<Employee[]> {
    if (!this.inFlightBySalon[salonId]) {
      this.inFlightBySalon[salonId] = this.fetchWithErrorHandling<{ employees: Employee[] }>(
        `${API_EMPLOYEE_URL}/by-salon/${salonId}`
      ).then((d) => d.employees || []).finally(() => {
        delete this.inFlightBySalon[salonId]
      })
    }
    return this.inFlightBySalon[salonId]
  }
}
