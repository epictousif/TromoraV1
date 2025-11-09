

import { Star, MapPin, Clock, Phone, ExternalLink, Wifi, Car, Coffee, Snowflake } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import type { Salon } from "../types/salon"

interface SalonModalProps {
  salon: Salon
  open: boolean
  onOpenChange: (open: boolean) => void
}

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  Coffee: Coffee,
  AC: Snowflake,
}

export function SalonModal({ salon, open, onOpenChange }: SalonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{salon.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salon.image.slice(0, 4).map((img, index) => (
              <div key={index} className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${salon.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {salon.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
            {salon.badge && <Badge variant="secondary">{salon.badge}</Badge>}
            {salon.verified && <Badge className="bg-green-500 text-white">Verified</Badge>}
            <Badge
              variant={salon.availability === "Available Now" ? "default" : "secondary"}
              className={salon.availability === "Available Now" ? "bg-green-500" : ""}
            >
              {salon.availability}
            </Badge>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-semibold">{salon.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">Based on {salon.reviews} reviews</span>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">{salon.description}</p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {salon.services.map((service) => (
                <Badge key={service} variant="outline">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {salon.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {salon.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                  return (
                    <div key={amenity} className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{salon.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {salon.openTime} - {salon.closingTime}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Location</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{salon.location.address}</p>
                    <p>
                      {salon.location.city}, {salon.location.state} {salon.location.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={() => window.open(`tel:${salon.phone}`, "_self")}>
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => window.open(salon.location.mapUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
