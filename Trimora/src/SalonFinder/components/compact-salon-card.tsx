import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/SalonFinder/components/ui/card"
import { Badge } from "@/SalonFinder/components/ui/badge"
import type { Salon } from "../types/salon"

interface CompactSalonCardProps {
  salon: Salon
}

export function CompactSalonCard({ salon }: CompactSalonCardProps) {
  const navigate = useNavigate()
  const images = Array.isArray(salon.image) && salon.image.length > 0 ? salon.image : ["/placeholder.svg?height=260&width=260&query=salon"]
  const [imgIdx] = useState(0)
  // Scroll reveal
  const revealRef = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!revealRef.current) return
    const el = revealRef.current
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={revealRef}
      className={`transition-all duration-500 ease-out will-change-transform ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
    <Card
      className="group w-[240px] overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl cursor-pointer transition-transform duration-300 ease-out hover:shadow-lg hover:-translate-y-1 p-0 gap-0"
      onClick={() => navigate(`/salon/${salon._id}`)}
      role="button"
      aria-label={`Open details for ${salon.name}`}
    >
      {/* Rectangular Image with overlay badges */}
      <div className="relative w-[240px] pb-[60%] group">
        <img
          src={images[imgIdx]}
          alt={salon.name}
          className="absolute inset-0 h-full w-full object-cover will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* Available badge top-left */}
        <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-medium shadow-sm">
          Available
        </div>
        {/* Featured badge bottom-right, slightly up */}
        <div className="absolute bottom-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-medium shadow-sm">
          Featured
        </div>
      </div>

      <CardContent className="p-3">
        {/* Name */}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{salon.name}</h3>

        {/* Rating under name */}
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-800">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{salon.rating?.toFixed ? salon.rating.toFixed(1) : salon.rating}</span>
        </div>

        {/* Location */}
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-gray-600">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">
            {salon.location.city}, {salon.location.state}
          </span>
        </div>

        {/* Services (1-2 tags) */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {salon.services.slice(0, 2).map((service) => (
            <Badge key={service} variant="outline" className="text-[10px] px-2 py-0.5 border-gray-200 text-gray-700">
              {service}
            </Badge>
          ))}
          {salon.services.length > 2 && (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/salon/${salon._id}`)
              }}
            >
              More
            </Badge>
          )}
        </div>

      </CardContent>
    </Card>
    </div>
  )
}
