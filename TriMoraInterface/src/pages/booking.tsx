"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Scissors,
  User,
  Users,
  Crown,
  ChevronDown,
  ChevronRight,
  Heart,
  Share2,
  Car,
  Wind,
  Clock,
  Verified,
  Map,
  Grid3X3,
  SlidersHorizontal,
  Tag,
  Eye,
  Wifi,
  Coffee,
  Sparkles,
  Phone,
  MessageCircle,
  Navigation,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const popularLocations = [
  { name: "Ranchi Railway Station", count: 15, popular: true },
  { name: "Lalpur", count: 23, popular: true },
  { name: "Main Road", count: 18, popular: true },
  { name: "Kantatoli", count: 12, popular: true },
  { name: "Harmu", count: 8 },
  { name: "Morabadi", count: 6 },
  { name: "Ratu Road", count: 10 },
  { name: "Circular Road", count: 14 },
]

const categories = [
  { name: "Men's Salon", icon: User, count: 28 },
  { name: "Women's Salon", icon: Users, count: 35 },
  { name: "Unisex", icon: Users, count: 42 },
  { name: "Bridal", icon: Crown, count: 18 },
  { name: "Spa & Wellness", icon: Sparkles, count: 22 },
]

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Distance", value: "distance" },
]

export const salonData = [
  {
    id: 1,
    name: "GlamZone Salon & Spa",
    location: "Opp. Plaza Mall, Main Road",
    verified: true,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=80&h=60&fit=crop",
    ],
    rating: 4.8,
    reviews: 150,
    services: ["Haircut", "Facial", "Beard", "Massage"],
    amenities: ["AC", "Parking", "WiFi", "Coffee"],
    originalPrice: 999,
    currentPrice: 399,
    discount: 60,
    badge: "Premium",
    distance: "1.2 km",
    openTime: "9:00 AM - 9:00 PM",
    featured: true,
    availability: "Available Now",
    nextSlot: "2:30 PM",
    description: "Premium salon offering luxury treatments with experienced professionals",
    phone: "+91 9876543210",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
    ],
    detailedServices: [
      { name: "Hair Cut & Styling", price: 299, duration: "45 min", description: "Professional haircut with styling" },
      { name: "Beard Trim & Shave", price: 199, duration: "30 min", description: "Clean shave with beard styling" },
      { name: "Facial Treatment", price: 599, duration: "60 min", description: "Deep cleansing facial with massage" },
      { name: "Head Massage", price: 399, duration: "30 min", description: "Relaxing head and shoulder massage" },
      {
        name: "Hair Wash & Blow Dry",
        price: 149,
        duration: "20 min",
        description: "Professional hair wash and styling",
      },
    ],
  },
  {
    id: 2,
    name: "Royal Cut Studio",
    location: "Near City Center, Lalpur",
    verified: true,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=200&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=80&h=60&fit=crop",
    ],
    rating: 4.6,
    reviews: 89,
    services: ["Haircut", "Shave", "Facial"],
    amenities: ["AC", "Parking"],
    originalPrice: 799,
    currentPrice: 299,
    discount: 62,
    badge: "Popular",
    distance: "0.8 km",
    openTime: "10:00 AM - 8:00 PM",
    featured: false,
    availability: "Busy",
    nextSlot: "4:00 PM",
    description: "Traditional barbershop with modern techniques and classic styling",
    phone: "+91 9876543211",
    gallery: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop",
    ],
    detailedServices: [
      { name: "Classic Hair Cut", price: 199, duration: "30 min", description: "Traditional haircut with precision" },
      { name: "Royal Shave", price: 149, duration: "25 min", description: "Hot towel shave with aftercare" },
      { name: "Gentleman's Facial", price: 399, duration: "45 min", description: "Refreshing facial for men" },
    ],
  },
  {
    id: 3,
    name: "Bella Beauty Lounge",
    location: "Station Road, Kantatoli",
    verified: true,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=200&fit=crop",
    thumbnails: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=80&h=60&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=60&fit=crop",
    ],
    rating: 4.9,
    reviews: 203,
    services: ["Haircut", "Facial", "Manicure", "Pedicure"],
    amenities: ["AC", "WiFi", "Coffee"],
    originalPrice: 1299,
    currentPrice: 499,
    discount: 61,
    badge: "Top Rated",
    distance: "2.1 km",
    openTime: "9:30 AM - 8:30 PM",
    featured: true,
    availability: "Available Now",
    nextSlot: "1:45 PM",
    description: "Luxury beauty lounge specializing in women's grooming and wellness",
    phone: "+91 9876543212",
    gallery: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop",
    ],
    detailedServices: [
      { name: "Hair Cut & Style", price: 399, duration: "60 min", description: "Professional cut with styling" },
      {
        name: "Luxury Facial",
        price: 799,
        duration: "75 min",
        description: "Premium facial with anti-aging treatment",
      },
      { name: "Manicure & Pedicure", price: 599, duration: "90 min", description: "Complete nail care package" },
      { name: "Hair Color & Highlights", price: 1299, duration: "120 min", description: "Professional hair coloring" },
    ],
  },
]

export default function BookingPage() {
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState("Lalpur")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([100, 3000])
  const [sortBy, setSortBy] = useState("popularity")
  const [showMap, setShowMap] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMoreLocations, setShowMoreLocations] = useState(false)
  const [likedSalons, setLikedSalons] = useState<number[]>([])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleLike = (salonId: number) => {
    setLikedSalons((prev) => (prev.includes(salonId) ? prev.filter((id) => id !== salonId) : [...prev, salonId]))
  }

  const handleViewDetails = (salonId: number) => {
    navigate(`/salon/${salonId}`)
  }

  const totalSalons = 52

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1
                className="text-xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {totalSalons} salons in {selectedLocation}, Ranchi
              </motion.h1>
              <motion.div
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Tag className="h-4 w-4" />
                <span className="font-medium">FLAT50 - Use code for 50% off till 30 June</span>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Map Toggle */}
              <motion.button
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm ${
                  showMap
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showMap ? <Grid3X3 className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                <span className="text-sm font-medium">{showMap ? "List View" : "Map View"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <motion.div
            className="w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 sticky top-24">
              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search salons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Popular Locations */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-500" />
                  Popular Locations
                </h3>
                <div className="space-y-2">
                  {popularLocations.slice(0, showMoreLocations ? popularLocations.length : 4).map((location, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedLocation(location.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        selectedLocation === location.name
                          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${location.popular ? "bg-red-500" : "bg-gray-400"}`} />
                        <span className="text-sm font-medium">{location.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{location.count}</span>
                    </motion.button>
                  ))}
                  <button
                    onClick={() => setShowMoreLocations(!showMoreLocations)}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 font-medium flex items-center mt-3 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {showMoreLocations ? "Show Less" : "View More Locations"}
                    <ChevronRight
                      className={`h-4 w-4 ml-1 transition-transform ${showMoreLocations ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-red-500" />
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">₹{priceRange[0]}</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-red-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₹100</span>
                    <span>₹3000</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-red-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <motion.button
                      key={index}
                      onClick={() => toggleCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                        selectedCategories.includes(category.name)
                          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <category.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.count}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-red-500" />
                  Quick Filters
                </h3>
                <div className="space-y-2">
                  <motion.button
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-700 border border-gray-200 transition-all"
                    whileHover={{ x: 2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Available Now</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">12</span>
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 text-gray-700 border border-gray-200 transition-all"
                    whileHover={{ x: 2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Top Rated (4.5+)</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded-full">8</span>
                  </motion.button>
                  <motion.button
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 border border-gray-200 transition-all"
                    whileHover={{ x: 2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Special Offers</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-red-100 px-2 py-1 rounded-full">15</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div className="space-y-6" variants={staggerContainer} initial="initial" animate="animate">
              {salonData.map((salon) => (
                <motion.div
                  key={salon.id}
                  variants={fadeInUp}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 ${
                    salon.featured ? "ring-2 ring-red-100 shadow-red-100/50" : ""
                  }`}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Image Section */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={salon.image || "/placeholder.svg"}
                            alt={salon.name}
                            className="w-52 h-36 object-cover rounded-xl shadow-md"
                          />
                          {salon.featured && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg">
                              Featured
                            </div>
                          )}
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <motion.button
                              onClick={() => toggleLike(salon.id)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart
                                className={`h-4 w-4 ${likedSalons.includes(salon.id) ? "text-red-500 fill-current" : "text-gray-600"}`}
                              />
                            </motion.button>
                            <motion.button
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Share2 className="h-4 w-4 text-gray-600" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex space-x-1 mt-3">
                          {salon.thumbnails.map((thumb, idx) => (
                            <motion.img
                              key={idx}
                              src={thumb || "/placeholder.svg"}
                              alt=""
                              className="w-14 h-10 object-cover rounded-lg border-2 border-gray-200 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{salon.name}</h3>
                              {salon.verified && (
                                <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full shadow-sm">
                                  <Verified className="h-3 w-3" />
                                  <span className="text-xs font-medium">Verified</span>
                                </div>
                              )}
                              <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full shadow-sm">
                                <span className="text-xs font-medium">{salon.badge}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span>{salon.location}</span>
                              <span>•</span>
                              <span className="text-green-600 font-medium">{salon.distance}</span>
                            </div>
                            <div className="flex items-center space-x-6 mb-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-bold text-gray-900">{salon.rating}</span>
                                <span className="text-sm text-gray-500">({salon.reviews}+ reviews)</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span>{salon.openTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-2xl font-bold text-gray-900">₹{salon.currentPrice}</span>
                              <span className="text-sm text-gray-500 line-through">₹{salon.originalPrice}</span>
                            </div>
                            <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full shadow-sm">
                              <span className="text-xs font-bold">{salon.discount}% OFF</span>
                            </div>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {salon.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full flex items-center space-x-1 shadow-sm"
                            >
                              <Scissors className="h-3 w-3" />
                              <span className="font-medium">{service}</span>
                            </span>
                          ))}
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center space-x-4 mb-4">
                          {salon.amenities.includes("AC") && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full">
                              <Wind className="h-3 w-3 text-blue-500" />
                              <span>AC</span>
                            </div>
                          )}
                          {salon.amenities.includes("Parking") && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded-full">
                              <Car className="h-3 w-3 text-green-500" />
                              <span>Parking</span>
                            </div>
                          )}
                          {salon.amenities.includes("WiFi") && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded-full">
                              <Wifi className="h-3 w-3 text-purple-500" />
                              <span>WiFi</span>
                            </div>
                          )}
                          {salon.amenities.includes("Coffee") && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-orange-50 px-2 py-1 rounded-full">
                              <Coffee className="h-3 w-3 text-orange-500" />
                              <span>Coffee</span>
                            </div>
                          )}
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                salon.availability === "Available Now" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                salon.availability === "Available Now" ? "text-green-700" : "text-yellow-700"
                              }`}
                            >
                              {salon.availability}
                            </span>
                            {salon.availability !== "Available Now" && (
                              <span className="text-sm text-gray-500">• Next slot: {salon.nextSlot}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-700 font-medium">Trending</span>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-3 mb-4">
                          <motion.button
                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-sm rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all flex items-center space-x-2 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">Call</span>
                          </motion.button>
                          <motion.button
                            className="px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 text-sm rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all flex items-center space-x-2 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="font-medium">Chat</span>
                          </motion.button>
                          <motion.button
                            className="px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 text-sm rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all flex items-center space-x-2 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Navigation className="h-4 w-4" />
                            <span className="font-medium">Directions</span>
                          </motion.button>
                        </div>

                        {/* Action Button */}
                        <div className="flex">
                          <motion.button
                            onClick={() => handleViewDetails(salon.id)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-5 w-5" />
                            <span>View Details & Book</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            <div className="text-center mt-8">
              <motion.button
                className="px-8 py-4 bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Load More Salons
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
