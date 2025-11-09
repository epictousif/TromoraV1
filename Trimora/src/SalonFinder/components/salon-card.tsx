

import { MouseEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Star, MapPin, Clock, Wifi, Car, Coffee, Snowflake, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/SalonFinder/components/ui/card"
import { Badge } from "@/SalonFinder/components/ui/badge"
import { Button } from "@/SalonFinder/components/ui/button"
import type { Salon } from "../types/salon"

interface SalonCardProps {
  salon: Salon
}

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Coffee: Coffee,
  AC: Snowflake,
}

export function SalonCard({ salon }: SalonCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const images = Array.isArray(salon.image) && salon.image.length > 0 ? salon.image : ["/placeholder.svg?height=240&width=320&query=salon"]
  const [imgIdx, setImgIdx] = useState(0)
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null)
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
  const prev = (e: MouseEvent) => {
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e: MouseEvent) => {
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % images.length)
  }
  const navigate = useNavigate()

  return (
    <div
      ref={revealRef}
      className={`transition-all duration-500 ease-out will-change-transform ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
    <Card
      className="group w-full overflow-hidden bg-white border border-gray-200 shadow-md rounded-2xl cursor-pointer transition-transform duration-300 ease-out hover:shadow-xl hover:-translate-y-1 md:min-h-[12rem]"
      onClick={() => navigate(`/salon/${salon._id}`)}
      role="button"
      aria-label={`Open details for ${salon.name}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div
          className="relative w-full md:w-64 h-48 md:h-48 flex-shrink-0"
          onMouseMove={(e) => {
            e.stopPropagation()
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
            const x = e.clientX - rect.left
            setHoverSide(x < rect.width / 2 ? "left" : "right")
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
            setHoverSide(null)
          }}
        >
          <img
            src={images[imgIdx]}
            alt={salon.name}
            className="h-48 md:h-48 w-full object-cover max-h-48 will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          {images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={prev}
                className={`absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200 ${hoverSide === "left" ? "opacity-100 pointer-events-auto" : ""}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next image"
                onClick={next}
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200 ${hoverSide === "right" ? "opacity-100 pointer-events-auto" : ""}`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Available badge top-left */}
          <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500 text-white font-medium shadow-sm">
            Available
          </div>

          {/* Featured badge bottom-right, slightly up */}
          <div className="absolute bottom-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-medium shadow-sm">
            Featured
          </div>

          {/* Like Button */}
          <button
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/95 shadow-sm hover:shadow-md hover:bg-white transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>

          {/* Featured/Verified Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {salon.featured && <Badge className="bg-gray-900 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm">Featured</Badge>}
            {salon.verified && <Badge className="bg-gray-700 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm">✓ Verified</Badge>}
          </div>

          {/* Availability */}
          <div className="absolute bottom-3 left-3">
            <Badge
              className={`font-semibold px-3 py-1 rounded-full shadow-sm ${
                salon.availability === "Available Now" ? "bg-gray-900 text-white" : "bg-gray-700 text-white"
              }`}
            >
              {salon.availability}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <CardContent className="flex-1 p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-bold text-3xl md:text-2xl text-gray-900 -mt-1 mb-0 leading-tight">{salon.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {salon.location.city}, {salon.location.state}
                </span>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-full font-semibold shadow-sm">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-sm">{salon.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">({salon.reviews} reviews)</span>
            </div>
          </div>

          {/* Timings */}
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Open: {salon.openTime} - {salon.closingTime}
            </span>
          </div>

          {/* Summary Services (top 3) */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {salon.services.slice(0, 3).map((service) => (
              <Badge
                key={service}
                variant="outline"
                className="text-xs border-gray-200 text-gray-700 cursor-pointer hover:border-gray-300 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/salon/${salon._id}`)
                }}
              >
                {service}
              </Badge>
            ))}
            {salon.services.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/salon/${salon._id}`)
                }}
              >
                More
              </Badge>
            )}
          </div>

          {/* Amenities icons */}
          {salon.amenities.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {salon.amenities.slice(0, 4).map((amenity) => {
                const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                return (
                  <div key={amenity} className="flex items-center gap-2 text-gray-700">
                    {Icon ? <Icon className="h-4 w-4 text-gray-400" /> : null}
                    <span className="text-xs">{amenity}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="h-11 px-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/salon/${salon._id}`)
              }}
            >
              View Details
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-md h-11 px-6"
              onClick={(e) => {
                e.stopPropagation()
                window.open('/list-your-business', '_self')
              }}
            >
              List your business
            </Button>
            {salon.location?.mapUrl && (
              <Button
                variant="outline"
                className="h-11 px-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(salon.location.mapUrl, "_blank")
                }}
              >
                Open Map
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
    </div>
  )
}
