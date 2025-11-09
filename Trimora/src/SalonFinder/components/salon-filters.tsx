

import { useState } from "react"
import { Filter, X, Sliders } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useSalonStore } from "../store/salon-store"
import { SALON_SERVICES, SALON_AMENITIES, AVAILABILITY_OPTIONS } from "../lib/constants"

export function SalonFilters() {
  const { filters, setFilters, clearFilters } = useSalonStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service]

    setFilters({ ...filters, services: newServices })
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]

    setFilters({ ...filters, amenities: newAmenities })
  }

  const handleAvailabilityChange = (availability: string) => {
    setFilters({
      ...filters,
      availability: filters.availability === availability ? "" : availability,
    })
  }

  const activeFiltersCount = filters.services.length + filters.amenities.length + (filters.availability ? 1 : 0)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between h-12 border-gray-200 bg-white hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Sliders className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Filters</span>
            {activeFiltersCount > 0 && <Badge className="bg-red-500 text-white">{activeFiltersCount}</Badge>}
          </div>
          <X className={`h-5 w-5 transition-transform ${isOpen ? "rotate-45" : ""}`} />
        </Button>
      </div>

      {/* Filter Panel */}
      <div className={`space-y-6 ${!isOpen ? "hidden lg:block" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5 text-red-500" />
            Filters
          </h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <h4 className="text-sm font-semibold text-red-700 mb-3">Active Filters ({activeFiltersCount})</h4>
            <div className="flex flex-wrap gap-2">
              {filters.services.map((service) => (
                <Badge key={service} className="bg-red-500 text-white hover:bg-red-600">
                  {service}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => handleServiceToggle(service)} />
                </Badge>
              ))}
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} className="bg-blue-500 text-white hover:bg-blue-600">
                  {amenity}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => handleAmenityToggle(amenity)} />
                </Badge>
              ))}
              {filters.availability && (
                <Badge className="bg-green-500 text-white hover:bg-green-600">
                  {filters.availability}
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={() => handleAvailabilityChange(filters.availability)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Services Filter */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Services</h4>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {SALON_SERVICES.map((service) => (
              <div key={service} className="flex items-center space-x-3">
                <Checkbox
                  id={service}
                  checked={filters.services.includes(service)}
                  onCheckedChange={() => handleServiceToggle(service)}
                  className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <label
                  htmlFor={service}
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-red-600 transition-colors"
                >
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Amenities</h4>
          </div>
          <div className="p-4 space-y-3">
            {SALON_AMENITIES.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-3">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label
                  htmlFor={amenity}
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Availability</h4>
          </div>
          <div className="p-4 space-y-3">
            {AVAILABILITY_OPTIONS.map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox
                  id={option}
                  checked={filters.availability === option}
                  onCheckedChange={() => handleAvailabilityChange(option)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor={option}
                  className="text-sm font-medium text-gray-700 cursor-pointer hover:text-green-600 transition-colors"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
