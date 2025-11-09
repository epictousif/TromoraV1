"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { salonData } from "./booking"
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Heart,
  Share2,
  Verified,
  Car,
  Wind,
  Wifi,
  Coffee,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Award,
  Shield,
  Sparkles,
  Timer,
  IndianRupee,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const timeSlots = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: false },
  { time: "12:00 PM", available: true },
  { time: "12:30 PM", available: true },
  { time: "1:00 PM", available: true },
  { time: "1:30 PM", available: false },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: true },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: false },
  { time: "4:30 PM", available: true },
  { time: "5:00 PM", available: true },
  { time: "5:30 PM", available: true },
  { time: "6:00 PM", available: true },
  { time: "6:30 PM", available: false },
]

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Excellent service! The staff is very professional and the ambiance is great.",
    date: "2 days ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    rating: 4,
    comment: "Good haircut and reasonable prices. Will definitely come back.",
    date: "1 week ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Anjali Singh",
    rating: 5,
    comment: "Amazing facial treatment! My skin feels so refreshed and glowing.",
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
]

export default function ViewDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const salon = salonData.find((s) => s.id === Number(id))

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
  })

  if (!salon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Salon not found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Back to Salons
          </button>
        </div>
      </div>
    )
  }

  const toggleService = (service: any) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.name === service.name)
      if (exists) {
        return prev.filter((s) => s.name !== service.name)
      } else {
        return [...prev, { ...service, quantity: 1 }]
      }
    })
  }

  const updateServiceQuantity = (serviceName: string, change: number) => {
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.name === serviceName ? { ...service, quantity: Math.max(1, service.quantity + change) } : service,
      ),
    )
  }

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price * service.quantity, 0)
  }

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => {
      const duration = Number.parseInt(service.duration)
      return total + duration * service.quantity
    }, 0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % salon.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + salon.gallery.length) % salon.gallery.length)
  }

  const generateDateOptions = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const handleBooking = () => {
    if (selectedServices.length === 0 || !selectedTime || !customerDetails.name || !customerDetails.phone) {
      alert("Please fill all required details")
      return
    }
    setShowBookingModal(true)
  }

  const handleBack = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{salon.name}</h1>
              <p className="text-sm text-gray-600">{salon.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Salon Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="relative">
                <img
                  src={salon.gallery[currentImageIndex] || "/placeholder.svg"}
                  alt={salon.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {salon.gallery.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {salon.gallery.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Salon Info */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{salon.name}</h2>
                    {salon.verified && (
                      <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full shadow-sm">
                        <Verified className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full shadow-sm">
                      <span className="text-sm font-medium">{salon.badge}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{salon.location}</span>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{salon.distance}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-gray-900">{salon.rating}</span>
                      <span className="text-gray-500">({salon.reviews}+ reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{salon.openTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">₹{salon.currentPrice}</span>
                    <span className="text-lg text-gray-500 line-through">₹{salon.originalPrice}</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full shadow-sm">
                    <span className="text-sm font-bold">{salon.discount}% OFF</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{salon.description}</p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-3 mb-6">
                {salon.amenities.includes("AC") && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm font-medium">Air Conditioned</span>
                  </div>
                )}
                {salon.amenities.includes("Parking") && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-xl">
                    <Car className="h-4 w-4" />
                    <span className="text-sm font-medium">Free Parking</span>
                  </div>
                )}
                {salon.amenities.includes("WiFi") && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-xl">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">Free WiFi</span>
                  </div>
                )}
                {salon.amenities.includes("Coffee") && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Coffee className="h-4 w-4" />
                    <span className="text-sm font-medium">Complimentary Coffee</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4">
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">Call Now</span>
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all flex items-center justify-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">Chat</span>
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all flex items-center justify-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="font-medium">Directions</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-red-500" />
                Our Services
              </h3>
              <div className="space-y-4">
                {salon.detailedServices.map((service: any, index: number) => {
                  const isSelected = selectedServices.find((s) => s.name === service.name)
                  return (
                    <motion.div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-red-500 bg-gradient-to-r from-red-50 to-pink-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      onClick={() => toggleService(service)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                              <Timer className="h-3 w-3" />
                              <span className="text-xs font-medium">{service.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateServiceQuantity(service.name, -1)
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-medium px-2">{isSelected.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateServiceQuantity(service.name, 1)
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? "border-red-500 bg-red-500" : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Customer Reviews
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-red-500" />
                Book Appointment
              </h3>

              {/* Selected Services Summary */}
              {selectedServices.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <h4 className="font-medium text-gray-900 mb-3">Selected Services</h4>
                  <div className="space-y-2">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">
                          {service.name} {service.quantity > 1 && `x${service.quantity}`}
                        </span>
                        <span className="font-medium text-gray-900">₹{service.price * service.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-red-200 mt-3 pt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Timer className="h-4 w-4" />
                        <span>{getTotalDuration()} min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm font-bold text-gray-900">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹{getTotalPrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Select Date</h4>
                <div className="grid grid-cols-7 gap-2">
                  {generateDateOptions().map((date, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedDate.toDateString() === date.toDateString()
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xs font-medium">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-sm font-bold">{date.getDate()}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Select Time</h4>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <motion.button
                      key={index}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : slot.available
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.95 } : {}}
                    >
                      {slot.time}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Your Details</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Book Now Button */}
              <motion.button
                onClick={handleBooking}
                disabled={
                  selectedServices.length === 0 || !selectedTime || !customerDetails.name || !customerDetails.phone
                }
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  selectedServices.length > 0 && selectedTime && customerDetails.name && customerDetails.phone
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={
                  selectedServices.length > 0 && selectedTime && customerDetails.name && customerDetails.phone
                    ? { scale: 1.02 }
                    : {}
                }
                whileTap={
                  selectedServices.length > 0 && selectedTime && customerDetails.name && customerDetails.phone
                    ? { scale: 0.98 }
                    : {}
                }
              >
                {selectedServices.length > 0 ? `Book Now - ₹${getTotalPrice()}` : "Select Services to Book"}
              </motion.button>

              {/* Safety Badge */}
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">100% Safe & Hygienic</span>
                </div>
                <p className="text-xs text-green-600 mt-1">All safety protocols followed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your appointment has been successfully booked</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Salon:</span>
                  <span className="font-medium">{salon.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg">₹{getTotalPrice()}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
