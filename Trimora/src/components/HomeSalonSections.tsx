import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

// Salon type definition
interface Salon {
  _id: string
  name: string
  image: string | string[]
  location: {
    city: string
    state: string
  }
  rating: number
}

// Horizontal Scroller Component
function HorizontalScroller({ items, renderItem }: { 
  items: Salon[]
  renderItem: (item: Salon, index: number) => React.ReactNode 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    updateScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateScrollButtons)
      return () => container.removeEventListener('scroll', updateScrollButtons)
    }
  }, [items])

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = 240 + 20 // card width + gap
    scrollContainerRef.current.scrollBy({
      left: -cardWidth * 2,
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = 240 + 20 // card width + gap
    scrollContainerRef.current.scrollBy({
      left: cardWidth * 2,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {/* Side navigation arrows */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      
      {/* Gradient fade effects */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/60 to-transparent pointer-events-none z-10" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/60 to-transparent pointer-events-none z-10" />
      )}
    </div>
  )
}

// Salon Card Component
function SalonCard({ salon }: { salon: Salon }) {
  const getImageSrc = () => {
    if (Array.isArray(salon.image) && salon.image.length > 0) {
      return salon.image[0]
    }
    return typeof salon.image === 'string' ? salon.image : "/placeholder.svg?height=144&width=240&query=salon"
  }

  return (
    <Link 
      to={`/salon/${salon._id}`}
      className="block w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src={getImageSrc()}
          alt={salon.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-800">
            {salon.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
          {salon.name}
        </h3>
        
        <p className="text-xs text-gray-600 mb-2 line-clamp-1">
          {salon.location.city}, {salon.location.state}
        </p>
      </div>
    </Link>
  )
}

// Section Header Component
function SectionHeader({ title, viewAllLink }: { title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <Link 
        to={viewAllLink}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        View all →
      </Link>
    </div>
  )
}

// Main Component Props
interface HomeSalonSectionsProps {
  recommended: Salon[]
  trending: Salon[]
  newSalons: Salon[]
  recent?: Salon[]
}

// Main HomeSalonSections Component
export function HomeSalonSections({ 
  recommended, 
  trending, 
  newSalons,
  recent = []
}: HomeSalonSectionsProps) {
  return (
    <div className="space-y-12 py-8">
      {/* Recommended for you */}
      <section>
        <SectionHeader 
          title="Recommended for you" 
          viewAllLink="/salons?sort=recommended" 
        />
        <HorizontalScroller
          items={recommended}
          renderItem={(salon) => <SalonCard salon={salon} />}
        />
      </section>

      {/* Trending now */}
      <section>
        <SectionHeader 
          title="Trending now" 
          viewAllLink="/salons?sort=trending" 
        />
        <HorizontalScroller
          items={trending}
          renderItem={(salon) => <SalonCard salon={salon} />}
        />
      </section>

      {/* New on Trimora */}
      <section>
        <SectionHeader 
          title="New on Trimora" 
          viewAllLink="/salons?sort=new" 
        />
        <HorizontalScroller
          items={newSalons}
          renderItem={(salon) => <SalonCard salon={salon} />}
        />
      </section>

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section>
          <SectionHeader 
            title="Recently viewed" 
            viewAllLink="/salons?filter=recent" 
          />
          <HorizontalScroller
            items={recent}
            renderItem={(salon) => <SalonCard salon={salon} />}
          />
        </section>
      )}
    </div>
  )
}

export default HomeSalonSections