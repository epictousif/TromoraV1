"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, MapPin, X, Filter, Star } from "lucide-react"

interface City {
  name: string
  areas: string[]
  popular?: boolean
}

interface CityFilterProps {
  onCitySelect?: (city: string) => void
  onAreaSelect?: (area: string, city: string) => void
  className?: string
}

const cities: City[] = [
  {
    name: "Ranchi",
    areas: ["Kantatoli", "Lalpur", "Harmu", "Morabadi", "Ratu Road", "Circular Road"],
    popular: true,
  },
  {
    name: "Patna",
    areas: ["Boring Road", "Kankarbagh", "Rajendra Nagar", "Patliputra", "Danapur"],
    popular: true,
  },
  {
    name: "Delhi",
    areas: ["Connaught Place", "Saket", "Dwarka", "Karol Bagh", "Lajpat Nagar"],
    popular: true,
  },
  {
    name: "Mumbai",
    areas: ["Andheri", "Bandra", "Borivali", "Powai", "Thane"],
    popular: true,
  },
  {
    name: "Kolkata",
    areas: ["Salt Lake", "Howrah", "Park Street", "Ballygunge", "New Town"],
  },
  {
    name: "Jaipur",
    areas: ["Vaishali Nagar", "Malviya Nagar", "C-Scheme", "Mansarovar"],
  },
  {
    name: "Bangalore",
    areas: ["Koramangala", "Indiranagar", "Whitefield", "Electronic City"],
  },
  {
    name: "Chennai",
    areas: ["T. Nagar", "Anna Nagar", "Velachery", "OMR"],
  },
]

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

const buttonVariants = {
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

export default function CityFilter({ onCitySelect, onAreaSelect }: CityFilterProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [isDropdownHovered, setIsDropdownHovered] = useState(false)
  const [isCityButtonHovered, setIsCityButtonHovered] = useState(false)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAreas, setFilteredAreas] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const hoverTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  // Filter areas based on search query
  useEffect(() => {
    if (!selectedCity) {
      setFilteredAreas([])
      return
    }

    let areas: string[] = []
    if (selectedCity === "All Cities") {
      areas = cities.flatMap((city) => city.areas)
    } else {
      const city = cities.find((c) => c.name === selectedCity)
      areas = city?.areas || []
    }

    if (searchQuery.trim()) {
      areas = areas.filter((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredAreas(areas)
  }, [selectedCity, searchQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("[data-city-button]") && !target.closest("[data-dropdown]")) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (selectedCity && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [selectedCity])

  // Auto close when neither button nor dropdown is hovered
  useEffect(() => {
    if (!isCityButtonHovered && !isDropdownHovered) {
      closeTimeoutRef.current = window.setTimeout(() => {
        closeDropdown()
      }, 300) // 300ms delay before closing
    } else {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [isCityButtonHovered, isDropdownHovered])

  const openDropdown = useCallback(
    (cityName: string, target: HTMLElement) => {
      const rect = target.getBoundingClientRect()

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + rect.width / 2,
      })

      setSelectedCity(cityName)
      setSearchQuery("")
      onCitySelect?.(cityName)
    },
    [onCitySelect],
  )

  const closeDropdown = useCallback(() => {
    setSelectedCity(null)
    setIsDropdownHovered(false)
    setIsCityButtonHovered(false)
    setHoveredCity(null)
    setSearchQuery("")
  }, [])

  const handleCityHover = useCallback(
    (cityName: string, event: React.MouseEvent) => {
      const target = event.currentTarget as HTMLElement
      setHoveredCity(cityName)
      setIsCityButtonHovered(true)

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current)
      }

      // Open dropdown after a short delay
      hoverTimeoutRef.current = window.setTimeout(() => {
        openDropdown(cityName, target)
      }, 200) // 200ms delay before opening
    },
    [openDropdown],
  )

  const handleCityLeave = useCallback(() => {
    setIsCityButtonHovered(false)
    setHoveredCity(null)

    // Clear hover timeout if mouse leaves before dropdown opens
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  const handleAreaSelect = useCallback(
    (area: string) => {
      onAreaSelect?.(area, selectedCity || "")
      closeDropdown()
    },
    [selectedCity, onAreaSelect, closeDropdown],
  )

  const popularCities = cities.filter((city) => city.popular)
  const otherCities = cities.filter((city) => !city.popular)

  return (
    <>
      <motion.nav
        ref={navRef}
        className="w-full bg-white border-b border-gray-100 shadow-sm mt-20"
        aria-label="City Selection Navigation"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center space-x-2 px-3 sm:px-4 lg:px-6 py-2.5 min-w-max">
            {/* Popular Cities */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 rounded-full">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-yellow-700 whitespace-nowrap">Popular</span>
              </div>
              {popularCities.map((city) => (
                <motion.button
                  key={city.name}
                  data-city-button
                  onMouseEnter={(e) => handleCityHover(city.name, e)}
                  onMouseLeave={handleCityLeave}
                  className={`
                    inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200
                    ${
                      selectedCity === city.name || hoveredCity === city.name
                        ? "border-red-500 text-red-600 bg-red-50 shadow-sm"
                        : "border-gray-200 text-gray-700 bg-white hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                    }
                  `}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-expanded={selectedCity === city.name}
                >
                  {city.name}
                  <motion.div animate={{ rotate: selectedCity === city.name ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3 h-3 ml-1.5 text-red-500" />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Other Cities */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap px-2">Others:</span>
              {otherCities.map((city) => (
                <motion.button
                  key={city.name}
                  data-city-button
                  onMouseEnter={(e) => handleCityHover(city.name, e)}
                  onMouseLeave={handleCityLeave}
                  className={`
                    inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-full border transition-all duration-200
                    ${
                      selectedCity === city.name || hoveredCity === city.name
                        ? "border-red-500 text-red-600 bg-red-50 shadow-sm"
                        : "border-gray-200 text-gray-700 bg-white hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                    }
                  `}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  aria-expanded={selectedCity === city.name}
                >
                  {city.name}
                  <motion.div animate={{ rotate: selectedCity === city.name ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3 h-3 ml-1.5 text-red-500" />
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200" />

            {/* All Cities Button */}
            <motion.button
              data-city-button
              onMouseEnter={(e) => handleCityHover("All Cities", e)}
              onMouseLeave={handleCityLeave}
              className={`
                inline-flex items-center font-medium px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap
                ${
                  selectedCity === "All Cities" || hoveredCity === "All Cities"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-md hover:from-red-600 hover:to-red-700"
                }
              `}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-expanded={selectedCity === "All Cities"}
            >
              <Filter className="w-3 h-3 mr-1.5" />
              All Cities
              <motion.div animate={{ rotate: selectedCity === "All Cities" ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3 ml-1.5" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Dropdown */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            ref={dropdownRef}
            data-dropdown
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 overflow-hidden"
            onMouseEnter={() => setIsDropdownHovered(true)}
            onMouseLeave={() => setIsDropdownHovered(false)}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-red-500 rounded-full">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-red-700">
                    {selectedCity === "All Cities" ? "All Areas" : `Areas in ${selectedCity}`}
                  </span>
                </div>
                <motion.button
                  onClick={closeDropdown}
                  className="p-1.5 hover:bg-red-200 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4 text-red-500" />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-400"
                />
                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Areas List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredAreas.length > 0 ? (
                <div className="p-2">
                  {filteredAreas.map((area, index) => (
                    <motion.button
                      key={`${selectedCity}-${area}`}
                      onClick={() => handleAreaSelect(area)}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all flex items-center justify-between group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 4, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                    >
                      <span className="font-medium">{area}</span>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ rotate: -90 }}
                        whileHover={{ rotate: 0 }}
                      >
                        <ChevronDown className="h-4 w-4 text-red-500" />
                      </motion.div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {searchQuery ? "No areas found" : "No areas available"}
                  </p>
                  {searchQuery && <p className="text-xs text-gray-400 mt-1">Try a different search term</p>}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {filteredAreas.length > 0 && (
              <motion.div
                className="px-4 py-2.5 bg-gray-50 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {filteredAreas.length} area{filteredAreas.length !== 1 ? "s" : ""} found
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Available</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}