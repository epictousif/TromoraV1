

import type React from "react"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { Search, MapPin, Loader2, Calendar, Crosshair } from "lucide-react"
import { Button } from "@/SalonFinder/components/ui/button"
import { useSalonStore } from "../store/salon-store"

export function SalonSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [showServiceSug, setShowServiceSug] = useState(false)
  const [showLocationSug, setShowLocationSug] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const datePickerRef = useRef<HTMLDivElement | null>(null)
  const serviceRef = useRef<HTMLDivElement | null>(null)
  const locationRef = useRef<HTMLDivElement | null>(null)
  const hoverCloseTimer = useRef<number | null>(null)
  const serviceHoverTimer = useRef<number | null>(null)
  const locationHoverTimer = useRef<number | null>(null)
  const { searchSalons, searchByLocation, loading, salons } = useSalonStore()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchSalons(searchQuery.trim())
    }
    if (locationQuery.trim()) {
      searchByLocation(locationQuery.trim())
    }
  }

  const handleLocationSearch = () => {
    if (locationQuery.trim()) {
      searchByLocation(locationQuery.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: "search" | "location") => {
    if (e.key === "Enter") {
      if (type === "search") {
        handleSearch()
      } else {
        handleLocationSearch()
      }
    }
  }

  // Debounced dynamic search
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchSalons(searchQuery.trim())
      }
    }, 300)
    return () => clearTimeout(t)
  }, [searchQuery, searchSalons])

  useEffect(() => {
    const t = setTimeout(() => {
      if (locationQuery.trim().length >= 2) {
        searchByLocation(locationQuery.trim())
      }
    }, 300)
    return () => clearTimeout(t)
  }, [locationQuery, searchByLocation])

  // Close popovers on outside click
  useEffect(() => {
    if (!showDatePicker && !showServiceSug && !showLocationSug) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setShowDatePicker(false)
      }
      if (serviceRef.current && !serviceRef.current.contains(target)) {
        setShowServiceSug(false)
      }
      if (locationRef.current && !locationRef.current.contains(target)) {
        setShowLocationSug(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showDatePicker, showServiceSug, showLocationSug])

  // Helpers for calendar rendering
  const monthLabel = useMemo(() => {
    return calendarMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  }, [calendarMonth])

  const getDaysGrid = (base: Date) => {
    const year = base.getFullYear()
    const month = base.getMonth()
    const firstDay = new Date(year, month, 1)
    const startWeekday = firstDay.getDay() // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < startWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    // pad to complete weeks
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }

  const isSelected = (d: number) => {
    if (!selectedDate) return false
    const sel = new Date(selectedDate)
    return (
      d === sel.getDate() &&
      calendarMonth.getMonth() === sel.getMonth() &&
      calendarMonth.getFullYear() === sel.getFullYear()
    )
  }

  // Services list for suggestions: dynamically derived from salons in store.
  // Fallback to the backend enum if salons are not yet loaded.
  const allServices = useMemo(() => {
    try {
      const dynamic = Array.from(
        new Set(
          (salons || [])
            .flatMap((s) => Array.isArray(s.services) ? s.services : [])
            .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
        )
      )
        .map((s) => s.trim())
        .sort((a, b) => a.localeCompare(b))
      if (dynamic.length > 0) return dynamic
    } catch {}
    // Fallback to static enum (kept in sync with backend model)
    return [
      "Haircut","Hair Styling","Hair Wash","Hair Coloring","Hair Treatment",
      "Beard Trim","Shaving","Mustache Styling",
      "Facial","Face Cleanup","Head Massage","Hair Spa",
      "Eyebrow Threading","Manicure","Pedicure","Waxing","Bleaching",
      "Bridal Makeup","Party Makeup",
      "Hair Straightening","Hair Curling","Keratin Treatment","Scalp Treatment",
    ]
  }, [salons])

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return allServices
    return allServices.filter(s => s.toLowerCase().includes(q))
  }, [allServices, searchQuery])

  // Salon names derived from store for suggestions
  const salonNames = useMemo(() => {
    try {
      const names = Array.from(
        new Set(
          (salons || [])
            .map(s => (typeof (s as any)?.name === 'string' ? (s as any).name.trim() : ''))
            .filter(n => n.length > 0)
        )
      )
      return names
    } catch {
      return [] as string[]
    }
  }, [salons])

  const popularSalonNames = useMemo(() => {
    // If rating exists, sort by it; otherwise just take first few
    try {
      const byRating = [...(salons || [])]
        .sort((a: any, b: any) => (b?.rating || 0) - (a?.rating || 0))
        .map((s: any) => (typeof s?.name === 'string' ? s.name.trim() : ''))
        .filter((n: string) => n.length > 0)
      const uniq = Array.from(new Set(byRating))
      if (uniq.length > 0) return uniq.slice(0, 6)
    } catch {}
    return salonNames.slice(0, 6)
  }, [salons, salonNames])

  const filteredSalonNames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return popularSalonNames
    return salonNames.filter(n => n.toLowerCase().includes(q)).slice(0, 10)
  }, [searchQuery, salonNames, popularSalonNames])

  // India states and major cities for richer suggestions
  const indiaStates = useMemo(
    () => [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
      "Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh"
    ],
    []
  )

  // Default seed list; will be extended by lazy-loaded full list from /india-cities.json
  const defaultIndiaCities = useMemo(
    () => [
      "Delhi","Mumbai","Bengaluru","Kolkata","Chennai","Hyderabad","Pune","Ahmedabad",
      "Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Thane","Bhopal","Visakhapatnam","Patna","Vadodara","Ghaziabad","Ludhiana","Agra","Nashik","Faridabad","Meerut","Rajkot","Varanasi","Srinagar","Aurangabad","Dhanbad","Amritsar","Navi Mumbai","Prayagraj","Howrah","Ranchi","Coimbatore","Jabalpur","Gwalior","Vijayawada","Jodhpur","Madurai","Raipur","Kota","Guwahati","Chandigarh","Thiruvananthapuram","Noida","Gurugram","Mysuru","Dehradun","Bhubaneswar","Mangaluru","Salem","Warangal","Tiruchirappalli","Ajmer","Udaipur","Kolhapur","Hubballi","Dharwad","Imphal","Shillong","Jamshedpur","Bokaro"
    ],
    []
  )

  const [indiaCities, setIndiaCities] = useState<string[]>(defaultIndiaCities)
  const citiesLoadedRef = useRef(false)

  const loadIndiaCities = useCallback(async () => {
    if (citiesLoadedRef.current) return
    try {
      const res = await fetch('/india-cities.json')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          // Merge and dedupe
          const merged = Array.from(new Set([...
            defaultIndiaCities,
            ...data.filter((x: any) => typeof x === 'string')
          ])) as string[]
          setIndiaCities(merged)
          citiesLoadedRef.current = true
        }
      }
    } catch {
      // ignore, fallback to default list
      citiesLoadedRef.current = true
    }
  }, [defaultIndiaCities])

  // Load full list when user opens suggestions or starts typing
  useEffect(() => {
    if (showLocationSug || locationQuery.trim().length >= 1) {
      loadIndiaCities()
    }
  }, [showLocationSug, locationQuery, loadIndiaCities])

  // Combined list used when no query (defaults to popular cities)
  const popularLocations = useMemo(() => [
    "Delhi","Mumbai","Bengaluru","Hyderabad","Pune","Kolkata","Chennai","Ahmedabad","Jaipur","Surat","Ranchi","Patna"
  ], [])

  // Simple Levenshtein distance for tolerant matching
  const levenshtein = (a: string, b: string) => {
    const m = a.length, n = b.length
    if (m === 0) return n
    if (n === 0) return m
    const dp: number[] = Array(n + 1)
    for (let j = 0; j <= n; j++) dp[j] = j
    for (let i = 1; i <= m; i++) {
      let prev = dp[0]
      dp[0] = i
      for (let j = 1; j <= n; j++) {
        const temp = dp[j]
        dp[j] = Math.min(
          dp[j] + 1, // deletion
          dp[j - 1] + 1, // insertion
          prev + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
        )
        prev = temp
      }
    }
    return dp[n]
  }

  const filteredLocations = useMemo(() => {
    const q = locationQuery.trim().toLowerCase()
    const universe = Array.from(new Set([...indiaCities, ...indiaStates]))
    if (!q) return popularLocations
    // Prioritize direct includes
    let results = universe.filter(c => c.toLowerCase().includes(q))
    // If too few, add fuzzy matches (distance <= 2)
    if (results.length < 8) {
      const fuzzy = universe.filter(c => levenshtein(c.toLowerCase(), q) <= 2)
      const merged = Array.from(new Set([...results, ...fuzzy]))
      results = merged
    }
    return results.slice(0, 20)
  }, [locationQuery, indiaCities, indiaStates, popularLocations])

  return (
    <>
      {/* Unified pill-shaped search bar */}
      <div className="w-full px-8 md:px-16">
        <div className="mx-auto max-w-xl md:max-w-4xl flex items-center gap-5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5 pl-3 pr-3 md:pl-5 md:pr-5 h-12 md:h-14">
          {/* Location segment (moved to first) */}
          <div
            ref={locationRef}
            className="relative flex items-center gap-2 flex-[1.7] min-w-0 px-3 md:px-4 py-1 rounded-full ring-1 ring-transparent hover:ring-black/10 focus-within:ring-black/10 hover:bg-gray-100/70 focus-within:bg-gray-100/70 transition-colors cursor-text"
            onMouseEnter={() => {
              if (locationHoverTimer.current) { window.clearTimeout(locationHoverTimer.current); locationHoverTimer.current = null }
              setShowLocationSug(true)
            }}
            onMouseLeave={() => {
              if (locationHoverTimer.current) window.clearTimeout(locationHoverTimer.current)
              locationHoverTimer.current = window.setTimeout(() => setShowLocationSug(false), 150)
            }}
          >
            <MapPin className="h-5 w-5 text-gray-600" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => { setLocationQuery(e.target.value); setShowLocationSug(true) }}
              onKeyPress={(e) => handleKeyPress(e as any, "location")}
              placeholder="Search Location"
              className="w-full bg-transparent placeholder:text-gray-500 text-gray-800 outline-none text-sm md:text-base"
            />
            <button
              type="button"
              className="shrink-0 px-2 py-0.5 rounded-full text-[11px] md:text-xs bg-white/70 hover:bg-white text-gray-700 ring-1 ring-black/5 cursor-pointer inline-flex items-center gap-1"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords
                    const loc = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    setLocationQuery(loc)
                    setShowLocationSug(false)
                    searchByLocation(loc)
                  })
                }
              }}
              aria-label="Use near me location"
            >
              <Crosshair className="h-3 w-3" />
              <span>Near me</span>
            </button>
            {showLocationSug && (
              <div className="absolute left-0 top-full mt-2 w-[min(15rem,90vw)] z-50 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="h-[18rem] overflow-auto p-1 pr-1">
                  {/* Popular locations */}
                  <div className="px-2 py-1">
                    <div className="text-[11px] font-medium text-gray-600 mb-1">Popular Locations</div>
                    <div className="flex flex-wrap gap-1.5">
                      {filteredLocations.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setLocationQuery(city)
                            setShowLocationSug(false)
                            searchByLocation(city)
                          }}
                          className="px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-[12px] ring-1 ring-black/5 cursor-pointer"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px my-1 bg-gray-100" />
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const { latitude, longitude } = pos.coords
                          const loc = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                          setLocationQuery(loc)
                          setShowLocationSug(false)
                          searchByLocation(loc)
                        })
                      }
                    }}
                    className="flex w-full items-center gap-2 px-3 pr-4 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
                  >
                    <Crosshair className="h-4 w-4 text-gray-500" />
                    <span className="text-sm md:text-base text-gray-800">Use current location</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gray-200" />

          {/* Services segment (moved to second) */}
          <div
            ref={serviceRef}
            className="relative flex items-center gap-2 flex-[1.35] min-w-0 px-3 md:px-4 py-1 rounded-full ring-1 ring-transparent hover:ring-black/10 focus-within:ring-black/10 hover:bg-gray-100/70 focus-within:bg-gray-100/70 transition-colors cursor-text"
            onMouseEnter={() => {
              if (serviceHoverTimer.current) { window.clearTimeout(serviceHoverTimer.current); serviceHoverTimer.current = null }
              setShowServiceSug(true)
            }}
            onMouseLeave={() => {
              if (serviceHoverTimer.current) window.clearTimeout(serviceHoverTimer.current)
              serviceHoverTimer.current = window.setTimeout(() => setShowServiceSug(false), 150)
            }}
          >
            <Search className="h-5 w-5 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowServiceSug(true) }}
              onKeyPress={(e) => handleKeyPress(e as any, "search")}
              placeholder="Search Salon & More"
              className="w-full bg-transparent placeholder:text-gray-500 text-gray-800 outline-none text-sm md:text-base"
            />
            {showServiceSug && filteredServices.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-[min(15rem,90vw)] z-50 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="h-[18rem] overflow-auto p-1 pr-1">
                  {/* Popular searches inside dropdown */}
                  <div className="px-2 py-1">
                    <div className="text-[11px] font-medium text-gray-600 mb-1">Popular Searches</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Hair Cut", "Massage", "Beard Trim", "Spa"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag)
                            setShowServiceSug(false)
                            searchSalons(tag)
                          }}
                          className="px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-[12px] ring-1 ring-black/5 cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular salons chips when no query */}
                  {!searchQuery.trim() && popularSalonNames.length > 0 && (
                    <div className="px-2 py-1">
                      <div className="text-[11px] font-medium text-gray-600 mb-1">Popular Salons</div>
                      <div className="flex flex-wrap gap-1.5">
                        {popularSalonNames.map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              setSearchQuery(name)
                              setShowServiceSug(false)
                              searchSalons(name)
                            }}
                            className="px-2.5 py-1 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 text-[12px] ring-1 ring-black/5 cursor-pointer"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-px my-1 bg-gray-100" />

                  {/* Service matches */}
                  {filteredServices.map(item => (
                    <button
                      key={item}
                      onClick={() => { setSearchQuery(item); setShowServiceSug(false); searchSalons(item) }}
                      className="flex w-full items-center gap-2 px-3 pr-4 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <Search className="h-4 w-4 text-gray-500 shrink-0" />
                      <span className="text-sm md:text-base text-gray-800 truncate">{item}</span>
                    </button>
                  ))}

                  {/* Salon name matches */}
                  {filteredSalonNames.map(name => (
                    <button
                      key={name}
                      onClick={() => { setSearchQuery(name); setShowServiceSug(false); searchSalons(name) }}
                      className="flex w-full items-center gap-2 px-3 pr-4 py-2 rounded-lg hover:bg-gray-50 text-left cursor-pointer"
                    >
                      <Search className="h-4 w-4 text-gray-500 shrink-0" />
                      <span className="text-sm md:text-base text-gray-800 truncate">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-gray-200" />

          {/* Date selector */}
          <div
            ref={datePickerRef}
            className="relative hidden md:block px-3 md:px-4"
            onMouseEnter={() => {
              if (hoverCloseTimer.current) {
                window.clearTimeout(hoverCloseTimer.current)
                hoverCloseTimer.current = null
              }
              setCalendarMonth(selectedDate ? new Date(selectedDate) : new Date())
              setShowDatePicker(true)
            }}
            onMouseLeave={() => {
              if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current)
              hoverCloseTimer.current = window.setTimeout(() => {
                setShowDatePicker(false)
              }, 150)
            }}
          >
            <button
              type="button"
              className="flex items-center gap-2 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                // Ensure it opens on click as well
                setCalendarMonth(selectedDate ? new Date(selectedDate) : new Date())
                setShowDatePicker(true)
              }}
            >
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-sm">{selectedDate ? new Date(selectedDate).toLocaleDateString() : "Select Date"}</span>
            </button>
            {showDatePicker && (
              <div className="absolute left-0 top-full mt-2 w-[min(15rem,90vw)] z-50 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="h-[18rem] overflow-auto p-1 pr-1">
                  {/* Calendar header */}
                  <div className="flex items-center justify-between mb-0.5">
                  <button
                    type="button"
                    className="h-5 w-5 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer text-[11px]"
                    onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>
                  <div className="text-[11px] font-medium">{monthLabel}</div>
                  <button
                    type="button"
                    className="h-5 w-5 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-pointer text-[11px]"
                    onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                  </div>
                  {/* Weekday labels */}
                  <div className="grid grid-cols-7 text-[10px] text-gray-500 mb-1">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="text-center py-0">{d}</div>
                  ))}
                  </div>
                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1">
                  {getDaysGrid(calendarMonth).map((d, i) => {
                    if (d === null) return <div key={i} className="h-7" />
                    const y = calendarMonth.getFullYear()
                    const m = calendarMonth.getMonth()
                    const iso = new Date(y, m, d).toISOString().slice(0,10)
                    const selected = isSelected(d)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSelectedDate(iso)
                          setShowDatePicker(false)
                          handleSearch()
                        }}
                        className={
                          "h-7 w-7 mx-auto rounded-full text-[11px] flex items-center justify-center cursor-pointer " +
                          (selected ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800")
                        }
                      >
                        {d}
                      </button>
                    )
                  })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search CTA */}
          <Button onClick={handleSearch} className="ml-auto h-9 md:h-10 px-4 md:px-6 rounded-full bg-black hover:bg-black/90 text-white font-semibold cursor-pointer"
            onBlur={() => { setShowServiceSug(false); setShowLocationSug(false); setShowDatePicker(false) }}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Search</span>}
          </Button>
        </div>
      </div>

      {/* Spacer to avoid overlap when any popover is open */}
      {(showServiceSug || showLocationSug || showDatePicker) && (
        <div className="h-52 md:h-56" />
      )}

      {/* Popular Search chips moved inside services dropdown */}
    </>
  )
}
