import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CompactSalonCard } from "./compact-salon-card"
import { EmptyState } from "./ui/empty-state"
import type { Salon } from "../types/salon"

interface SalonCarouselProps {
  salons: Salon[]
}

export function SalonCarousel({ salons }: SalonCarouselProps) {
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
  }, [salons])

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = 260 + 20 // card width + gap
    scrollContainerRef.current.scrollBy({
      left: -cardWidth * 2, // scroll 2 cards at a time
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    const cardWidth = 260 + 20 // card width + gap
    scrollContainerRef.current.scrollBy({
      left: cardWidth * 2, // scroll 2 cards at a time
      behavior: 'smooth'
    })
  }

  if (salons.length === 0) {
    return (
      <EmptyState
        title="No salons found"
        description="Try refining your search or checking nearby locations."
      />
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-white">
      {/* Foreground content */}
      <div className="relative space-y-4 p-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {salons.length} {salons.length === 1 ? "Salon" : "Salons"} Found
          </h2>
        </div>

        {/* Horizontal scrolling container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
          >
            {salons.map((salon) => (
              <div key={salon._id} className="flex-shrink-0">
                <CompactSalonCard salon={salon} />
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
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white border border-gray-200 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
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
      </div>
    </div>
  )
}
