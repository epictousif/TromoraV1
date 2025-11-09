"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Calendar,
  Scissors,
  Clock,
  Sparkles,
  ChevronDown,
  Star,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

interface SalonSearchProps {
  className?: string
}

const serviceCategories = [
  { id: "hair", name: "Hair Services", services: ["Hair Cut", "Hair Color", "Hair Spa", "Hair Treatment"] },
  { id: "skin", name: "Skin Care", services: ["Facial", "Cleanup", "Bleach", "Threading"] },
  { id: "massage", name: "Massage", services: ["Head Massage", "Body Massage", "Foot Massage"] },
  { id: "makeup", name: "Makeup", services: ["Bridal Makeup", "Party Makeup", "Engagement Makeup"] },
]

const recentSearches = [
  {
    location: "Delhi",
    dates: "Today",
    services: "Hair Cut",
  },
  {
    location: "Mumbai",
    dates: "Tomorrow",
    services: "Spa Package",
  },
]

export default function SalonSearch({ className = "" }: SalonSearchProps) {
  const [location, setLocation] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [services, setServices] = useState<string[]>([])
  const [showNearMe, setShowNearMe] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [minRating, setMinRating] = useState<number | null>(null)

  // Generate calendar dates
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "d"
  const rows = []
  let days = []
  let day = startDate
  let formattedDate = ""

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      days.push(
        <div
          className={`relative p-2 h-10 flex items-center justify-center cursor-pointer transition-all duration-200 rounded-lg  ${
            !isSameMonth(day, monthStart)
              ? "text-gray-300 hover:bg-gray-100"
              : isSameDay(day, selectedDate)
                ? "bg-red-500 text-white shadow-lg scale-105"
                : isSameDay(day, new Date())
                  ? "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600"
          }`}
          key={day.toString()}
          onClick={() => handleDateSelect(cloneDay)}
        >
          <span className="text-sm font-medium">{formattedDate}</span>
          {isSameDay(day, new Date()) && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>,
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day.toString()}>
        {days}
      </div>,
    )
    days = []
  }

  const handleRecentSearch = (search: (typeof recentSearches)[0]) => {
    setLocation(search.location)
    setServices([search.services])
  }

  const toggleService = (service: string) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service))
    } else {
      setServices([...services, service])
    }
  }

  const formatDateDisplay = (date: Date) => {
    const today = new Date()
    const tomorrow = addDays(today, 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return format(date, "EEE, MMM d")
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-4 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />

      <div className="relative z-10 px-3 sm:px-4 lg:px-6 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Compact Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 overflow-hidden"
          >
            <div className="p-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Location Input */}
                <div className="flex-1">
                  <div className="relative group">
                    <div className="relative bg-gray-50 hover:bg-white rounded-lg p-2.5 transition-all duration-300 border border-gray-200 hover:border-red-300">
                      <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-red-500" />
                        Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-transparent text-gray-900 font-medium text-sm focus:outline-none placeholder-gray-500"
                          placeholder="Enter location"
                        />
                        <button
                          onClick={() => setShowNearMe(!showNearMe)}
                          className="absolute right-0 top-0 flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Near me</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="flex-1">
                  <div className="relative group">
                    <div
                      className="bg-gray-50 hover:bg-white rounded-lg p-2.5 transition-all duration-300 border border-gray-200 hover:border-red-300 cursor-pointer"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-red-500" />
                        Date
                      </label>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900 font-medium text-sm">{formatDateDisplay(selectedDate)}</div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-500 transition-transform ${showDatePicker ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="flex-1">
                  <div className="relative group">
                    <div
                      className="relative bg-gray-50 hover:bg-white rounded-lg p-2.5 transition-all duration-300 border border-gray-200 hover:border-red-300 cursor-pointer"
                      onClick={() => setShowServices(!showServices)}
                    >
                      <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                        <Scissors className="h-3 w-3 mr-1 text-red-500" />
                        Services
                      </label>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900 font-medium text-sm truncate">
                          {services.length > 0 ? `${services.length} selected` : "Select services"}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-500 transition-transform ${showServices ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Picker Expansion - Full Calendar */}
            <AnimatePresence>
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-800">{format(currentMonth, "MMMM yyyy")}</h3>
                      <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="p-2 text-xs font-semibold text-gray-500 text-center">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="space-y-1">{rows}</div>
                    </div>

                    {/* Quick Date Selection */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDateSelect(new Date())}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => handleDateSelect(addDays(new Date(), 1))}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        Tomorrow
                      </button>
                      <button
                        onClick={() => handleDateSelect(addDays(new Date(), 7))}
                        className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                      >
                        Next Week
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Services Expansion */}
            <AnimatePresence>
              {showServices && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Service Categories */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Select Services</h3>
                        <div className="space-y-3">
                          {serviceCategories.map((category) => (
                            <div key={category.id}>
                              <h4 className="text-xs font-medium text-gray-600 mb-2">{category.name}</h4>
                              <div className="flex flex-wrap gap-2">
                                {category.services.map((service) => (
                                  <button
                                    key={service}
                                    onClick={() => toggleService(service)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                      services.includes(service)
                                        ? "bg-red-500 border-red-500 text-white"
                                        : "bg-white border-gray-300 text-gray-700 hover:border-red-300"
                                    }`}
                                  >
                                    {service}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="space-y-4">
                        {/* Price Range */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <IndianRupee className="h-4 w-4 text-gray-600" />
                            <span className="text-xs text-gray-600">
                              ₹{priceRange[0]} - ₹{priceRange[1]}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Minimum Rating */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                          <div className="flex space-x-2">
                            {[4, 3, 2, 1].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setMinRating(minRating === rating ? null : rating)}
                                className={`flex items-center px-2 py-1 rounded-full border text-xs transition-all ${
                                  minRating === rating
                                    ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-yellow-300"
                                }`}
                              >
                                <Star className="h-3 w-3 fill-current mr-1" />
                                <span>{rating}+</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Recent Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">Recent searches</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg text-sm text-white transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium">
                        {search.location} • {search.dates} | {search.services}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
