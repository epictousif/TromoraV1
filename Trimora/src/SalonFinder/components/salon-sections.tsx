import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, MapPin, Star, Clock, TrendingUp, Sparkles, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

// API service to fetch salons from backend
const fetchSalonsFromAPI = async () => {
  try {
    const response = await fetch('https://tromora-v1-b8fdk67zz-tousifhassana-8941s-projects.vercel.app/api/v1/saloon/getAllSalons')
    const data = await response.json()
    if (data.status === 'success') {
      return data.salons
    }
    return []
  } catch (error) {
    console.error('Error fetching salons:', error)
    return []
  }
}

// Helper function to calculate distance (mock implementation)
const calculateDistance = (_salon: any) => {
  // Mock distance calculation - in real app, use user's location
  const distances = ['0.5 km', '0.8 km', '1.2 km', '1.5 km', '2.0 km', '2.5 km']
  return distances[Math.floor(Math.random() * distances.length)]
}

// Helper function to format salon data for different sections
const formatSalonData = (salons: any[], type: string) => {
  return salons.map((salon: any, index: number) => {
    const baseData = {
      id: salon._id,
      name: salon.name,
      rating: salon.rating || 4.5,
      image: salon.image?.[0] || "/placeholder.svg",
      price: salon.pricing?.haircut ? `₹${salon.pricing.haircut}` : "₹500",
      services: salon.services?.slice(0, 2).join(' & ') || "Beauty Services"
    }

    switch (type) {
      case 'nearby':
        return {
          ...baseData,
          distance: calculateDistance(salon)
        }
      case 'trending':
        return {
          ...baseData,
          bookings: `${Math.floor(Math.random() * 500) + 100}+ bookings`
        }
      case 'new':
        return {
          ...baseData,
          badge: "New"
        }
      case 'recent':
        const days = ['2 days ago', '1 week ago', '3 days ago', '5 days ago', '1 day ago']
        return {
          ...baseData,
          lastVisited: days[index % days.length]
        }
      default:
        return baseData
    }
  })
}

interface SalonCardProps {
  salon: any
  type: 'nearby' | 'trending' | 'new' | 'recent'
}

function SalonCard({ salon, type }: SalonCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/salon/${salon.id}`)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer flex-shrink-0" 
      style={{ width: '280px', height: '220px' }}
      onClick={handleClick}
    >
      <div className="relative" style={{ height: '140px' }}>
        <img 
          src={salon.image} 
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {type === 'new' && salon.badge && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {salon.badge}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{salon.rating}</span>
        </div>
      </div>
      
      <div className="p-3 flex flex-col justify-between" style={{ height: '80px' }}>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors text-sm line-clamp-1">
            {salon.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">{salon.services}</p>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-purple-600">{salon.price}</span>
          
          {type === 'nearby' && (
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{salon.distance}</span>
            </div>
          )}
          
          {type === 'trending' && (
            <div className="flex items-center gap-1 text-gray-500">
              <TrendingUp className="w-3 h-3" />
              <span>{salon.bookings}</span>
            </div>
          )}
          
          {type === 'recent' && (
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{salon.lastVisited}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  salons: any[]
  type: 'nearby' | 'trending' | 'new' | 'recent'
}

function SalonSection({ title, icon, salons, type }: SectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= salons.length ? 0 : prev + itemsPerView
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, salons.length - itemsPerView) : Math.max(0, prev - itemsPerView)
    )
  }

  const visibleSalons = salons.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= salons.length}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '16px', paddingRight: '16px' }}>
        {visibleSalons.map((salon) => (
          <SalonCard key={salon.id} salon={salon} type={type} />
        ))}
      </div>
    </div>
  )
}

export function SalonSections() {
  const [allSalons, setAllSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSalons = async () => {
      setLoading(true)
      const salons = await fetchSalonsFromAPI()
      setAllSalons(salons)
      setLoading(false)
    }
    loadSalons()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Create different salon sets for each section
  const nearbySalons = formatSalonData(allSalons.slice(0, 8), 'nearby')
  const trendingSalons = formatSalonData(allSalons.slice(2, 10), 'trending')
  const newSalons = formatSalonData(allSalons.slice(4, 12), 'new')
  const recentSalons = formatSalonData(allSalons.slice(1, 9), 'recent')

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '70px'}}>
      <SalonSection
        title="Near By You"
        icon={<MapPin className="w-6 h-6 text-blue-600" />}
        salons={nearbySalons}
        type="nearby"
      />
      
      <SalonSection
        title="Trending"
        icon={<TrendingUp className="w-6 h-6 text-red-600" />}
        salons={trendingSalons}
        type="trending"
      />
      
      <SalonSection
        title="New to Trimora"
        icon={<Sparkles className="w-6 h-6 text-green-600" />}
        salons={newSalons}
        type="new"
      />
      
      <SalonSection
        title="Recently Viewed"
        icon={<Eye className="w-6 h-6 text-purple-600" />}
        salons={recentSalons}
        type="recent"
      />
    </div>
  )
}

export default SalonSections
