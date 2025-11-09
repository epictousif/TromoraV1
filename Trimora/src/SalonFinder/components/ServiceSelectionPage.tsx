"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { 
  ArrowLeft, 
  X, 
  Check, 
  Clock, 
  Star,
  ChevronRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SalonService } from "../services/salon-service"
import { useSalonDetailStore } from "../store/salon-detail-store"
import type { Salon } from "../types/salon"

interface ServicePackage {
  id: string
  name: string
  description: string
  duration: string
  serviceCount: number
  originalPrice: number
  discountedPrice: number
  discount: number
  services: string[]
  category: string
  gender?: string
}

interface Professional {
  id: string
  name: string
  profileImage?: string
  rating: number
  experience: number
  specialization: string[]
  totalBookings: number
}

interface SalonInfo {
  id: string
  name: string
  rating: number
  reviewCount: number
  address: string
  image: string
}

export function ServiceSelectionPage() {
  const navigate = useNavigate()
  const { salonId } = useParams()
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [salon, setSalon] = useState<Salon | null>(null)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)
  const [showProfessionalSelection, setShowProfessionalSelection] = useState(false)
  const [showTimeSelection, setShowTimeSelection] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { bySalonId, loading: storeLoading, loadSalonDetails } = useSalonDetailStore()
  const salonDetails = salonId ? bySalonId[salonId] : undefined

  // Load salon data
  useEffect(() => {
    const loadSalonData = async () => {
      if (!salonId) return
      
      try {
        setLoading(true)
        // Load basic salon info
        const salonData = await SalonService.getSalonById(salonId)
        setSalon(salonData)
        
        // Load detailed salon info including services
        if (!salonDetails && !storeLoading[salonId]) {
          loadSalonDetails(salonId)
        }
        
        // Load professionals for the salon
        try {
          const professionalsResponse = await fetch(`/api/fresha/salon/${salonId}/professionals`)
          if (professionalsResponse.ok) {
            const professionalsData = await professionalsResponse.json()
            setProfessionals(professionalsData.professionals || [])
          } else {
            // Fallback with sample professionals including Manoranjan
            setProfessionals([
              {
                id: "prof1",
                name: "Manoranjan",
                profileImage: "",
                rating: 4.8,
                experience: 5,
                specialization: ["Hair Specialist", "Beard Expert"],
                totalBookings: 150
              },
              {
                id: "prof2", 
                name: "Rajesh Kumar",
                profileImage: "",
                rating: 4.6,
                experience: 3,
                specialization: ["Hair Cut", "Styling"],
                totalBookings: 89
              },
              {
                id: "prof3",
                name: "Amit Singh", 
                profileImage: "",
                rating: 4.9,
                experience: 7,
                specialization: ["Color Expert", "Hair Treatment"],
                totalBookings: 220
              }
            ])
          }
        } catch (profError) {
          console.error('Error loading professionals:', profError)
          // Fallback with sample professionals
          setProfessionals([
            {
              id: "prof1",
              name: "Manoranjan",
              profileImage: "",
              rating: 4.8,
              experience: 5,
              specialization: ["Hair Specialist", "Beard Expert"],
              totalBookings: 150
            }
          ])
        }
        
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load salon")
      } finally {
        setLoading(false)
      }
    }

    loadSalonData()
  }, [salonId, salonDetails, storeLoading, loadSalonDetails])

  // Convert salon info for display
  const salonInfo: SalonInfo | null = salon ? {
    id: salon._id,
    name: salon.name,
    rating: salon.rating || 0,
    reviewCount: salon.reviews || 0,
    address: `${salon.location?.address || ''}, ${salon.location?.city || ''}, ${salon.location?.state || ''}`.replace(/^,\s*/, ''),
    image: salon.image?.[0] || "/placeholder.svg"
  } : null

  // Get real services from backend
  const services = salonDetails?.services || []
  
  // Convert backend services to display format
  const packages: ServicePackage[] = services.map((service: any) => ({
    id: service._id,
    name: service.name,
    description: service.description || "",
    duration: service.duration ? `${service.duration} mins` : service.durationMinutes ? `${service.durationMinutes} mins` : "",
    serviceCount: 1,
    originalPrice: service.price || 0,
    discountedPrice: service.price || 0,
    discount: 0,
    services: [service.name],
    category: service.category || "Others",
    gender: service.gender || ""
  }))

  // Generate dynamic categories from services
  const allCategories = Array.from(new Set(services.map((s: any) => s.category || "Others")))
  const categories = ["All", ...allCategories.sort()]

  const togglePackageSelection = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  const getSubtotal = () => {
    return packages
      .filter(pkg => selectedPackages.includes(pkg.id))
      .reduce((sum, pkg) => sum + pkg.discountedPrice, 0)
  }

  const getDiscount = () => {
    const originalTotal = packages
      .filter(pkg => selectedPackages.includes(pkg.id))
      .reduce((sum, pkg) => sum + pkg.originalPrice, 0)
    return originalTotal - getSubtotal()
  }

  const handleContinue = () => {
    if (selectedPackages.length === 0 || !salonInfo) return
    
    // Show professional selection step
    setShowProfessionalSelection(true)
  }

  const handleProfessionalContinue = () => {
    if (!selectedProfessional) return
    
    // Show time selection step
    setShowTimeSelection(true)
    
    // Generate available time slots based on salon hours
    generateTimeSlots()
  }

  const generateTimeSlots = () => {
    // Default salon hours (9 AM to 8 PM) - can be replaced with actual salon data
    const openHour = salon?.openTime ? parseInt(salon.openTime.split(':')[0]) : 9
    const closeHour = salon?.closingTime ? parseInt(salon.closingTime.split(':')[0]) : 20
    
    const slots = []
    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    
    console.log('Generated time slots:', slots) // Debug log
    setAvailableSlots(slots)
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    console.log('Setting default date:', today) // Debug log
    setSelectedDate(today)
  }

  const handleTimeContinue = () => {
    console.log('handleTimeContinue called', { selectedDate, selectedTime }) // Debug log
    
    if (!selectedDate || !selectedTime) {
      console.log('Missing date or time:', { selectedDate, selectedTime })
      return
    }
    
    const selectedPackageData = packages.filter(pkg => selectedPackages.includes(pkg.id))
    const selectedProfessionalData = selectedProfessional === "any" 
      ? { id: "any", name: "Any Professional" }
      : professionals.find(p => p.id === selectedProfessional)
    
    console.log('Navigating to booking confirmation with:', {
      salon: salonInfo,
      selectedPackages: selectedPackageData,
      selectedProfessional: selectedProfessionalData,
      selectedDate,
      selectedTime,
      total: getSubtotal()
    })
    
    navigate("/booking-confirmation", {
      state: {
        salon: salonInfo,
        selectedPackages: selectedPackageData,
        selectedProfessional: selectedProfessionalData,
        selectedDate,
        selectedTime,
        total: getSubtotal()
      }
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading salon details...</p>
        </div>
      </div>
    )
  }

  // Show professional selection step
  if (showProfessionalSelection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowProfessionalSelection(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Select Professional</h1>
              <p className="text-gray-600">Choose your preferred professional or any available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Professional Selection */}
            <div className="lg:col-span-2 space-y-4">
              {/* Any Professional Option */}
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProfessional === "any"
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedProfessional("any")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Any Professional</h3>
                      <p className="text-gray-600">Let us assign the best available professional for you</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Fastest Booking
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Best Match
                        </Badge>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedProfessional === "any"
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}>
                      {selectedProfessional === "any" && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Professionals */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Or choose a specific professional</h3>
                {professionals.map((professional) => (
                  <Card 
                    key={professional.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedProfessional === professional.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedProfessional(professional.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {professional.profileImage ? (
                            <img 
                              src={professional.profileImage} 
                              alt={professional.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-semibold text-gray-600">
                              {professional.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{professional.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{professional.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{professional.experience} years exp</span>
                            <span>•</span>
                            <span>{professional.totalBookings} bookings</span>
                          </div>
                          {professional.specialization.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {professional.specialization.map((spec, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedProfessional === professional.id
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300"
                        }`}>
                          {selectedProfessional === professional.id && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar - Summary */}
            <div className="space-y-6">
              {salonInfo && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={salonInfo.image} 
                        alt={salonInfo.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{salonInfo.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{salonInfo.rating}</span>
                          <span>({salonInfo.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Selected Services</h4>
                      {packages
                        .filter(pkg => selectedPackages.includes(pkg.id))
                        .map(pkg => (
                          <div key={pkg.id} className="flex justify-between items-start text-sm">
                            <div className="flex-1">
                              <p className="font-medium">{pkg.name}</p>
                              <p className="text-gray-600">{pkg.duration}</p>
                            </div>
                            <span className="font-semibold">₹{pkg.discountedPrice}</span>
                          </div>
                        ))}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={handleProfessionalContinue}
                disabled={!selectedProfessional}
              >
                Continue to Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show time selection step
  if (showTimeSelection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowTimeSelection(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Select Date & Time</h1>
              <p className="text-gray-600">Choose your preferred appointment time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Date & Time Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Selection - Fresha Style */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">When would you like to come in?</h3>
                  
                  {/* Date Grid - Next 7 days */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {(() => {
                      const dates = []
                      const today = new Date()
                      
                      for (let i = 0; i < 7; i++) {
                        const date = new Date(today)
                        date.setDate(today.getDate() + i)
                        
                        const dateStr = date.toISOString().split('T')[0]
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                        const dayNum = date.getDate()
                        const isToday = i === 0
                        const isSelected = selectedDate === dateStr
                        
                        dates.push(
                          <Button
                            key={dateStr}
                            variant="outline"
                            className={`h-16 flex flex-col items-center justify-center p-2 ${
                              isSelected 
                                ? "bg-black text-white border-black hover:bg-gray-800" 
                                : "hover:bg-gray-50 border-gray-200"
                            }`}
                            onClick={() => setSelectedDate(dateStr)}
                          >
                            <span className="text-xs font-medium">
                              {isToday ? 'Today' : dayName}
                            </span>
                            <span className="text-lg font-bold">{dayNum}</span>
                          </Button>
                        )
                      }
                      
                      return dates
                    })()}
                  </div>
                  
                  {/* Custom Date Picker */}
                  <div className="border-t pt-4">
                    <Button 
                      variant="ghost" 
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'date'
                        input.min = new Date().toISOString().split('T')[0]
                        input.value = selectedDate
                        input.onchange = (e) => setSelectedDate((e.target as HTMLInputElement).value)
                        input.click()
                      }}
                    >
                      Choose a different date
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Time Selection - Fresha Style */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Available times for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'selected date'}
                  </h3>
                  
                  {/* Morning Slots */}
                  {(() => {
                    const morningSlots = availableSlots.filter(slot => {
                      const hour = parseInt(slot.split(':')[0])
                      return hour < 12
                    })
                    
                    if (morningSlots.length === 0) return null
                    
                    return (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Morning</h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {morningSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant="outline"
                              className={`h-10 text-sm ${
                                selectedTime === slot
                                  ? "bg-black text-white border-black hover:bg-gray-800"
                                  : "hover:bg-gray-50 border-gray-200"
                              }`}
                              onClick={() => setSelectedTime(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                  
                  {/* Afternoon Slots */}
                  {(() => {
                    const afternoonSlots = availableSlots.filter(slot => {
                      const hour = parseInt(slot.split(':')[0])
                      return hour >= 12 && hour < 17
                    })
                    
                    if (afternoonSlots.length === 0) return null
                    
                    return (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Afternoon</h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {afternoonSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant="outline"
                              className={`h-10 text-sm ${
                                selectedTime === slot
                                  ? "bg-black text-white border-black hover:bg-gray-800"
                                  : "hover:bg-gray-50 border-gray-200"
                              }`}
                              onClick={() => setSelectedTime(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                  
                  {/* Evening Slots */}
                  {(() => {
                    const eveningSlots = availableSlots.filter(slot => {
                      const hour = parseInt(slot.split(':')[0])
                      return hour >= 17
                    })
                    
                    if (eveningSlots.length === 0) return null
                    
                    return (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Evening</h4>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {eveningSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant="outline"
                              className={`h-10 text-sm ${
                                selectedTime === slot
                                  ? "bg-black text-white border-black hover:bg-gray-800"
                                  : "hover:bg-gray-50 border-gray-200"
                              }`}
                              onClick={() => setSelectedTime(slot)}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                  
                  {availableSlots.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-2">No available slots for this date</p>
                      <p className="text-sm text-gray-400">Please select a different date</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Salon Hours Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Salon Hours</span>
                  </div>
                  <p className="text-blue-700 mt-1">
                    Open: {salon?.openTime || "09:00"} - {salon?.closingTime || "20:00"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Summary */}
            <div className="space-y-6">
              {salonInfo && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={salonInfo.image} 
                        alt={salonInfo.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{salonInfo.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{salonInfo.rating}</span>
                          <span>({salonInfo.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Booking Summary</h4>
                      
                      {/* Selected Professional */}
                      <div className="text-sm">
                        <span className="text-gray-600">Professional: </span>
                        <span className="font-medium">
                          {selectedProfessional === "any" 
                            ? "Any Professional" 
                            : professionals.find(p => p.id === selectedProfessional)?.name
                          }
                        </span>
                      </div>

                      {/* Selected Services */}
                      {packages
                        .filter(pkg => selectedPackages.includes(pkg.id))
                        .map(pkg => (
                          <div key={pkg.id} className="flex justify-between items-start text-sm">
                            <div className="flex-1">
                              <p className="font-medium">{pkg.name}</p>
                              <p className="text-gray-600">{pkg.duration}</p>
                            </div>
                            <span className="font-semibold">₹{pkg.discountedPrice}</span>
                          </div>
                        ))}

                      {/* Date & Time */}
                      {selectedDate && (
                        <div className="text-sm">
                          <span className="text-gray-600">Date: </span>
                          <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {selectedTime && (
                        <div className="text-sm">
                          <span className="text-gray-600">Time: </span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={handleTimeContinue}
                disabled={!selectedDate || !selectedTime}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !salonInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Salon not found"}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Services</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-400">Professional</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-400">Time</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-400">Confirm</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Services</h1>
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                    activeCategory === category 
                      ? "bg-black text-white" 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>


            {/* Services Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
              
              {packages
                .filter(pkg => activeCategory === "All" || pkg.category === activeCategory)
                .map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedPackages.includes(pkg.id)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => togglePackageSelection(pkg.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedPackages.includes(pkg.id)
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300"
                          }`}>
                            {selectedPackages.includes(pkg.id) && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {pkg.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{pkg.duration}</span>
                            </div>
                          )}
                          {pkg.gender && (
                            <Badge variant="secondary" className="text-xs">
                              {pkg.gender}
                            </Badge>
                          )}
                        </div>
                        
                        {pkg.description && (
                          <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{pkg.discountedPrice}
                          </span>
                          {pkg.discount > 0 && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ₹{pkg.originalPrice}
                              </span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Save {pkg.discount}%
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Salon Info & Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Salon Info Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img 
                      src={salonInfo.image} 
                      alt={salonInfo.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{salonInfo.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium">{salonInfo.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">({salonInfo.reviewCount})</span>
                      </div>
                      <p className="text-sm text-gray-600">{salonInfo.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              {selectedPackages.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {packages
                        .filter(pkg => selectedPackages.includes(pkg.id))
                        .map(pkg => (
                          <div key={pkg.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{pkg.name}</p>
                              <p className="text-xs text-gray-600">
                                {pkg.duration} {pkg.gender && `• ${pkg.gender}`}
                              </p>
                            </div>
                            <span className="font-semibold">₹{pkg.discountedPrice}</span>
                          </div>
                        ))}
                      
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                        {getDiscount() > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discounts</span>
                            <span>-₹{getDiscount()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total</span>
                          <span>₹{getSubtotal()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        onClick={handleContinue}
                        disabled={selectedPackages.length === 0}
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
