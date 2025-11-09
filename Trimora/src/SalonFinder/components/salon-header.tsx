"use client"
import { Star, Users, Shield } from "lucide-react"

export function SalonHeader() {
  return (
    <div className="relative text-center pt-8 mt-5 md:mt-9">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-100 mb-3">
        Smarter bookings for local <span className="whitespace-nowrap">beauty & wellness</span>
      </h1>

      <div className="flex justify-center items-center gap-4 text-[11px] text-white">
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-green-50 rounded-full">
            <Star className="h-2.5 w-2.5 text-green-500 fill-current" />
          </div>
          <span className="font-medium">Verified Reviews</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-blue-50 rounded-full">
            <Shield className="h-2.5 w-2.5 text-blue-500" />
          </div>
          <span className="font-medium">Trusted Partners</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="p-0.5 bg-purple-50 rounded-full">
            <Users className="h-2.5 w-2.5 text-purple-500" />
          </div>
          <span className="font-medium">Expert Stylists</span>
        </div>
      </div>
    </div>
  )
}

