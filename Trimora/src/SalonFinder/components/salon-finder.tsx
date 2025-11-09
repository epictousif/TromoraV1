

import { useEffect, useRef } from "react"
import { useSalonStore } from "../store/salon-store"
import { SalonHeader } from "./salon-header"
import { SalonGrid } from "./salon-grid"
import { SalonSearch } from "./salon-search"
import { SalonSections } from "./salon-sections"
import { CustomerReviews } from "./customer-reviews"
import { LoadingSpinner } from "./ui/loading-spinner"
import { ErrorMessage } from "./ui/error-message"

export function SalonFinder() {
  const { salons, loading, error, fetchSalons, fetchSalonsByCoordinates, clearError } = useSalonStore()
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    // First try to get user's location and fetch nearby salons
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchSalonsByCoordinates(latitude, longitude)
        },
        (error) => {
          console.log("Location access denied, fetching all salons:", error)
          // If location access is denied, fetch all salons
          fetchSalons()
        },
      )
    } else {
      // If geolocation is not supported, fetch all salons
      fetchSalons()
    }
  }, [fetchSalons, fetchSalonsByCoordinates])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-width gradient hero (header + search) */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-90" />
        <div className="relative h-full">
          <div className="container mx-auto px-4 pt-20 pb-10 md:pt-28 md:pb-14 max-w-7xl min-h-[320px] md:min-h-[400px]">
            <SalonHeader />
            <div className="mt-8 md:mt-10">
              <SalonSearch />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <main className="flex-1">
          {error && <ErrorMessage message={error} onDismiss={clearError} className="mb-6" />}

          {/* Salon Sections */}
          <SalonSections />

          {/* Original Salon Grid */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Salons</h2>
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <SalonGrid salons={salons} />
            )}
          </div>
        </main>
      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews />
    </div>
  )
}
