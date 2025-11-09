

import { SalonCarousel } from "./salon-carousel"
import type { Salon } from "../types/salon"

interface SalonGridProps {
  salons: Salon[]
}

export function SalonGrid({ salons }: SalonGridProps) {
  return <SalonCarousel salons={salons} />
}
