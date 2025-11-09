"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useParams } from "react-router"
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Zap,
  Users,
  Award,
  Wifi,
  Car,
  Coffee,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "./ui/use-toast"
import { useSalonDetailStore } from "../store/salon-detail-store"
import { SalonService } from "../services/salon-service"
import type { Salon } from "../types/salon"
// import { createBooking } from "../../services/bookingsService" // Unused import

export function SalonDetails() {
  const { id } = useParams()
  const [salon, setSalon] = useState<Salon | null>(null)
  const [loadingSalon, setLoadingSalon] = useState(false)
  const [errorSalon, setErrorSalon] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAvailNote, setShowAvailNote] = useState(false)
  const [showAllServices, setShowAllServices] = useState(true)
  const [activeTab, setActiveTab] = useState("services")
  const [serviceCategory, setServiceCategory] = useState<string>("All")
  const fetchedRef = useRef<string | null>(null)
  const inFlightRef = useRef(false)
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  // Sticky header scroll state
  const [headerMode, setHeaderMode] = useState<"none" | "book" | "title">("none")
  const bookRef = useRef<HTMLDivElement | null>(null)
  const titleSwitchRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Booking form state
  const [bookOpen, setBookOpen] = useState(false)
  const [appointmentTime, setAppointmentTime] = useState("") // datetime-local string
  const [appointmentTimeMs, setAppointmentTimeMs] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [submitting] = useState(false) // setSubmitting not used

  // Format minutes to "X hrs Y mins"
  const formatDuration = (mins?: number) => {
    if (!mins || mins <= 0) return ""
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h && m) return `${h} hr${h > 1 ? "s" : ""} ${m} min${m > 1 ? "s" : ""}`
    if (h) return `${h} hr${h > 1 ? "s" : ""}`
    return `${m} min${m > 1 ? "s" : ""}`
  }

  const handleContinueToCheckout = () => {
    if (!id) return
    if (!appointmentTime) {
      toast({ title: "Pick a date & time", description: "Please select appointment time.", variant: "destructive" as any })
      return
    }
    if (!selectedServiceIds.length) {
      toast({ title: "Select at least one service", description: "Choose services to continue.", variant: "destructive" as any })
      return
    }
    // Build services and ISO time same as submit path
    const svcs = (details?.services || [])
      .filter((s) => selectedServiceIds.includes((s as any)._id))
      .map((s) => ({
        serviceId: (s as any)._id,
        name: (s as any).name,
        price: Number((s as any).price ?? 0) || 0,
        durationMinutes: Number((s as any).duration ?? (s as any).durationMinutes ?? 0) || undefined,
      }))
    const isoTime = (() => {
      if (appointmentTimeMs && Number.isFinite(appointmentTimeMs)) return new Date(appointmentTimeMs).toISOString()
      const v = appointmentTime.trim()
      if (/^\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}$/.test(v)) {
        const [d, m, yAndTime] = v.split("-")
        const [y, time] = [yAndTime.slice(0,4), yAndTime.slice(5)]
        const norm = `${y}-${m}-${d}T${time}`
        const dt = new Date(norm)
        if (!isNaN(dt.getTime())) return dt.toISOString()
      }
      const dt = new Date(v)
      if (!isNaN(dt.getTime())) return dt.toISOString()
      return ""
    })()
    if (!isoTime) {
      toast({ title: "Invalid date/time", description: "Please use the picker to choose a valid time.", variant: "destructive" as any })
      return
    }
    navigate("/checkout", {
      state: {
        salonId: id,
        salonName: (details as any)?.name,
        salonImageUrl: (details as any)?.images?.[0]?.url || (details as any)?.images?.[0],
        services: svcs,
        appointmentTimeISO: isoTime,
        notes: notes.trim() || undefined,
      },
    })
    setBookOpen(false)
  }

  const toggleService = (sid: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    )
  }

  // submit handled on checkout page now

  // Extract experience in years from various possible fields on employee
  const getExperienceYears = (emp: any): number | null => {
    const raw = emp?.experienceYears ?? emp?.experience ?? emp?.meta?.experienceYears
    const n = typeof raw === "string" ? parseFloat(raw) : typeof raw === "number" ? raw : null
    if (n == null || isNaN(n)) return null
    return Math.max(0, Math.round(n))
  }

  // Jump to Reviews tab and scroll into view
  const scrollToReviews = () => {
    try {
      setActiveTab("reviews")
      // wait for tab content to render
      setTimeout(() => {
        const el = document.getElementById("reviews-section")
        el?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    } catch {}
  }

  const { bySalonId, loading, error, loadSalonDetails } = useSalonDetailStore()
  const details = id ? bySalonId[id] : undefined

  // Native share (device share) if available; used inside the share box
  const handleShare = async () => {
    try {
      if (!salon) return
      const url = window.location.href
      const title = salon.name
      const text = `Check out ${salon.name} in ${(salon.location as any)?.district ?? salon.location.city}, ${salon.location.state}`

      if (navigator.share) {
        await navigator.share({ title, text, url })
        return
      }

      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
      window.open(waUrl, "_blank", "noopener,noreferrer")

      try {
        await navigator.clipboard?.writeText(url)
      } catch (e) {
        // ignore clipboard errors silently
      }
    } catch (err) {
      console.error("Share failed", err)
    }
  }

  // Initialize favorite from localStorage when salon loads
  useEffect(() => {
    try {
      if (!salon?._id) return
      const raw = localStorage.getItem("favorite_salons")
      const arr: string[] = raw ? JSON.parse(raw) : []
      setIsFavorite(arr.includes(salon._id))
    } catch {}
  }, [salon?._id])

  const handleFavoriteClick = () => {
    if (!salon?._id) return
    try {
      const raw = localStorage.getItem("favorite_salons")
      const arr: string[] = raw ? JSON.parse(raw) : []
      const exists = arr.includes(salon._id)
      const next = exists ? arr.filter((x) => x !== salon._id) : [...arr, salon._id]
      localStorage.setItem("favorite_salons", JSON.stringify(next))
      setIsFavorite(!exists)
    } catch {
      setIsFavorite((v) => !v)
    }
  }

  useEffect(() => {
    if (!salon?.image || salon.image.length <= 1) return

    // Clear existing interval
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current)
    }

    // Set up new interval for auto slideshow
    imageIntervalRef.current = setInterval(() => {
      setSelectedImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % salon.image.length
        return nextIndex
      })
    }, 10000) // Change image every 10 seconds

    // Cleanup interval on unmount or salon change
    return () => {
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current)
      }
    }
  }, [salon?.image])

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)

    // Reset the auto-slideshow timer
    if (imageIntervalRef.current) {
      clearInterval(imageIntervalRef.current)
    }

    if (salon?.image && salon.image.length > 1) {
      imageIntervalRef.current = setInterval(() => {
        setSelectedImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % salon.image.length
          return nextIndex
        })
      }, 10000)
    }
  }

  useEffect(() => {
    if (!id) return
    if (fetchedRef.current === id || inFlightRef.current) return
    const run = async () => {
      try {
        inFlightRef.current = true
        setLoadingSalon(true)
        const s = await SalonService.getSalonById(id)
        setSalon(s)
        setErrorSalon(null)
        fetchedRef.current = id
      } catch (e) {
        setErrorSalon(e instanceof Error ? e.message : "Failed to load salon")
      } finally {
        setLoadingSalon(false)
        inFlightRef.current = false
      }
    }
    run()
  }, [id])

  useEffect(() => {
    if (id && !details && !loading[id]) {
      loadSalonDetails(id)
    }
  }, [id, details, loading, loadSalonDetails])

  useEffect(() => {
    const onScroll = () => {
      const OFFSET = 8 // small tolerance to avoid flicker
      const bookTop = bookRef.current?.getBoundingClientRect().top ?? Infinity
      const titleTop = titleSwitchRef.current?.getBoundingClientRect().top ?? Infinity

      // If title switch sentinel has reached/fixed past top, show title
      if (titleTop <= OFFSET) {
        setHeaderMode("title")
      } else if (bookTop <= OFFSET) {
        // Otherwise, if booking section reached top, show Book Now
        setHeaderMode("book")
      } else {
        setHeaderMode("none")
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "ac":
        return <Zap className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  if (!id)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2 font-heading">Invalid Salon ID</h2>
            <p className="text-muted-foreground font-body">Please check the URL and try again.</p>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      {headerMode !== "none" && (
        <div className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0 h-9">
              <div
                className={`absolute inset-0 flex items-center transition-all duration-300 ease-out ${
                  headerMode === "book" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                <Button
                  size="sm"
                  className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }}
                >
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Book Now
                </Button>
              </div>
              <div
                className={`absolute inset-0 flex items-center transition-all duration-300 ease-out ${
                  headerMode === "title" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                }`}
              >
                <p className="text-sm font-semibold truncate">{salon?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleShare}
                aria-label="Share salon"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant={isFavorite ? "default" : "outline"}
                size="sm"
                className="h-9 px-3"
                onClick={handleFavoriteClick}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {loadingSalon && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <h3 className="text-lg font-semibold mb-2 font-heading">Loading Salon Details</h3>
              <p className="text-muted-foreground font-body">Please wait while we fetch the information...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {errorSalon && (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-destructive mb-2 font-heading">Error Loading Salon</h2>
              <p className="text-destructive/80 font-body">{errorSalon}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {salon && (
        <div className="min-h-screen bg-background">
          <div className="bg-white border-b border-border/20">
            <div className="max-w-7xl mx-auto pl-[2.25rem] md:pl-[2.75rem] pr-5 pt-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-heading">{salon.name}</h1>
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      type="button"
                      onClick={scrollToReviews}
                      className="flex items-center gap-1 cursor-pointer group"
                      aria-label="View reviews"
                      title="View reviews"
                    >
                      <span className="font-bold text-lg">{salon.reviews > 0 && salon.rating > 0 ? salon.rating.toFixed(1) : "0.0"}</span>
                      <Star
                        className={`h-5 w-5 ${salon.reviews > 0 && salon.rating > 0 ? "fill-current text-amber-500" : "text-muted-foreground"}`}
                      />
                      {salon.reviews > 0 ? (
                        <span className="text-primary font-medium underline decoration-transparent group-hover:decoration-current">({salon.reviews} {salon.reviews === 1 ? "review" : "reviews"})</span>
                      ) : (
                        <span className="text-blue-600 font-medium underline decoration-transparent group-hover:decoration-current">(0)</span>
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 font-medium">Open at {salon.openTime}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById("booking-address")
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "center" })
                          el.classList.add("ring-2", "ring-blue-300", "rounded-md", "transition-shadow")
                          setTimeout(() => el.classList.remove("ring-2", "ring-blue-300"), 1200)
                        }
                      }}
                      className="text-muted-foreground underline decoration-transparent hover:decoration-foreground/40 transition-[text-decoration-color] cursor-pointer"
                      title="Jump to full address"
                    >
                      {(salon.location as any)?.district ?? salon.location.city}, {salon.location.state}
                    </button>
                    {salon.location?.mapUrl && (
                      <a
                        href={salon.location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open directions to ${salon.name}`}
                        className="group inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium ml-2 underline decoration-transparent hover:decoration-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded-sm"
                      >
                        Get directions
                        <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3 inline-flex items-center gap-2"
                    onClick={handleShare}
                    aria-label={`Share ${salon.name}`}
                    title="Share"
                  >
                    <span className="text-sm font-medium">Share</span>
                    <Share2 className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={handleFavoriteClick}
                    aria-pressed={isFavorite}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`h-6 w-6 transition-colors ${
                        isFavorite ? "text-red-600 fill-red-600 stroke-red-600" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto pl-3 pr-4 md:pl-5 md:pr-8">
            <div className="grid gap-4 lg:[grid-template-columns:64%_36%]">
              {/* Left Content */}
              <div>
                <div className="bg-white p-6 pr-1">
                  {/* Large main image (increased height) */}
                  <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-xl">
                    {(salon.badge || salon.featured) && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-md">
                          <Award className="h-3 w-3" />
                          {salon.badge ? salon.badge : "Featured"}
                        </span>
                    </div>
                    )}

                    
                    <img
                      src={salon.image?.[selectedImageIndex] || "/luxury-salon-interior.png" || "/placeholder.svg"}
                      alt={salon.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {salon.image && salon.image.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          onClick={() => {
                            const len = salon.image?.length || 0
                            if (!len) return
                            const prev = (selectedImageIndex - 1 + len) % len
                            handleImageSelect(prev)
                          }}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          onClick={() => {
                            const len = salon.image?.length || 0
                            if (!len) return
                            const next = (selectedImageIndex + 1) % len
                            handleImageSelect(next)
                          }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>

                  
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-t border-border/20">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/10 overflow-x-auto px-4 py-2">
                    {[
                      { id: "services", label: "Services", icon: Users },
                      { id: "team", label: "Team", icon: Users },
                      { id: "reviews", label: "Reviews", icon: Star },
                      { id: "about", label: "About Us", icon: Heart },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-foreground text-background shadow-sm ring-1 ring-foreground/10"
                            : "bg-background/80 text-foreground border border-border hover:bg-muted/60"
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6 lg:p-8">
                    {activeTab === "about" && (
                      <div className="space-y-8">
                        {salon.description && (
                          <div>
                            <h3 className="text-2xl font-black font-heading text-foreground mb-4">
                              About {salon.name}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed font-body text-lg">
                              {salon.description}
                            </p>
                          </div>
                        )}

                        {/* Location with interactive map */}
                        <div>
                          {salon.location?.coordinates?.latitude !== undefined && salon.location?.coordinates?.longitude !== undefined && (
                            <div
                              className="rounded-lg overflow-hidden border relative cursor-pointer group"
                              role="button"
                              tabIndex={0}
                              title="Open in Google Maps"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  const lat = salon.location?.coordinates?.latitude
                                  const lng = salon.location?.coordinates?.longitude
                                  const url = `https://www.google.com/maps?q=${lat},${lng}`
                                  window.open(url, "_blank")
                                }
                              }}
                              onClick={() => {
                                const lat = salon.location?.coordinates?.latitude
                                const lng = salon.location?.coordinates?.longitude
                                const url = `https://www.google.com/maps?q=${lat},${lng}`
                                window.open(url, "_blank")
                              }}
                            >
                              <iframe
                                title="Google Maps Preview"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-56 md:h-72 pointer-events-none"
                                src={`https://www.google.com/maps?q=${salon.location.coordinates.latitude},${salon.location.coordinates.longitude}&z=15&output=embed`}
                              />
                            </div>
                          )}
                          <div className="mt-3 text-sm text-card-foreground">
                            {salon.location?.address ? `${salon.location.address}, ` : ""}
                            {salon.location?.city}{salon.location?.city ? ", " : ""}{salon.location?.state}
                            {salon.location?.pincode ? `, ${salon.location.pincode}` : ""}
                          </div>
                          {salon.amenities.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-2xl font-black font-heading text-foreground mb-4">Amenities</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {salon.amenities.map((amenity) => (
                                  <div
                                    key={amenity}
                                    className="flex items-center gap-3 bg-muted/50 p-4 rounded-xl hover:bg-muted/70 transition-colors"
                                  >
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      {getAmenityIcon(amenity)}
                                    </div>
                                    <span className="font-semibold font-body text-card-foreground">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-8">
                            <h3 className="text-2xl font-black font-heading text-foreground mb-4">Opening times</h3>
                            {(() => {
                              const days = [
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                                "Sunday",
                              ]
                              const oh: any = (salon as any).openingHours
                              const fallback = `${salon.openTime || "10:00 am"} – ${salon.closingTime || "11:00 pm"}`
                              return (
                                <ul className="space-y-1">
                                  {days.map((d) => {
                                    const slot = oh?.[d]
                                    const closed = (typeof slot === "object" && (slot.closed === true || slot.status === "closed")) || false
                                    const label = closed
                                      ? "Closed"
                                      : (slot?.open && slot?.close)
                                        ? `${slot.open} – ${slot.close}`
                                        : typeof slot === "string" && slot.includes("-")
                                          ? slot.replace("-", " – ")
                                          : fallback
                                    const isToday = (() => {
                                      try {
                                        const idx = new Date().getDay() // 0=Sun ... 6=Sat
                                        const map = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                                        return map[idx] === d
                                      } catch { return false }
                                    })()
                                    return (
                                      <li key={d} className={`flex items-center justify-between rounded-md px-2 py-1.5 ${isToday ? "bg-muted/60" : ""}`}>
                                        <div className="flex items-center gap-2">
                                          <span className={`h-2.5 w-2.5 rounded-full ${closed ? "bg-red-400" : "bg-green-500"}`} />
                                          <span className={`font-medium ${isToday ? "font-bold" : ""}`}>{d}</span>
                                        </div>
                                        <span className={`text-sm ${isToday ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
                                      </li>
                                    )
                                  })}
                                </ul>
                              )
                            })()}
                          </div>

                        </div>
                      </div>
                    )}

                    {activeTab === "services" && (
                      <div>
                        {/* Services heading removed as requested */}

                        {/* Build categories from details.services; fallback to tags from salon.services */}
                        {details?.services?.length ? (
                          <>
                            {(() => {
                              const all = details.services
                              const cats = Array.from(
                                new Set(["All", ...all.map((s) => s.category || "Others")])
                              )
                              return (
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                                  {cats.map((cat) => (
                                    <button
                                      key={cat}
                                      onClick={() => setServiceCategory(cat)}
                                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                                        serviceCategory === cat
                                          ? "bg-foreground text-background border-foreground shadow"
                                          : "bg-muted text-foreground border-border hover:bg-muted/70"
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              )
                            })()}

                            {/* Services list for selected category with Show All / Show Less */}
                            <div className="mt-4 space-y-3">
                              {(() => {
                                const LIMIT = 10
                                const filtered = details.services.filter(
                                  (s) => serviceCategory === "All" || (s.category || "Others") === serviceCategory
                                )
                                const items = showAllServices ? filtered : filtered.slice(0, LIMIT)
                                return (
                                  <>
                                    {items.map((s) => (
                                      <div
                                        key={s._id}
                                        className="rounded-2xl border border-border bg-card hover:shadow-sm transition-colors p-5 flex items-start justify-between gap-4"
                                      >
                                        <div className="min-w-0">
                                          <h4 className="font-bold text-card-foreground truncate">{s.name}</h4>
                                          <div className="text-xs text-muted-foreground mt-1">
                                            {formatDuration((s as any).duration || (s as any).durationMinutes)}
                                            {(s as any).description ? ` • ${(s as any).description}` : ""}
                                          </div>
                                          {typeof (s as any).price !== "undefined" && (
                                            <div className="mt-2 font-semibold text-foreground">₹{(s as any).price}</div>
                                          )}
                                        </div>
                                        <div className="shrink-0 self-center">
                                        </div>
                                      </div>
                                    ))}
                                    {filtered.length > LIMIT && (
                                      <Button
                                        variant="outline"
                                        onClick={() => setShowAllServices(!showAllServices)}
                                        className="mt-1"
                                      >
                                        {showAllServices ? (
                                          <>
                                            <ChevronUp className="h-4 w-4 mr-2" />
                                            Show Less
                                          </>
                                        ) : (
                                          <>
                                            <ChevronDown className="h-4 w-4 mr-2" />
                                            Show All ({filtered.length - LIMIT} more)
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </>
                                )
                              })()}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {salon.services.slice(0, showAllServices ? salon.services.length : 12).map((service) => (
                                <div
                                  key={service}
                                  className="bg-muted/50 px-4 py-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors hover:shadow-sm"
                                >
                                  <span className="font-medium font-body text-card-foreground text-sm">{service}</span>
                                </div>
                              ))}
                            </div>
                            {salon.services.length > 12 && (
                              <Button
                                variant="outline"
                                onClick={() => setShowAllServices(!showAllServices)}
                                className="mt-4"
                              >
                                {showAllServices ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-2" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                    Show All ({salon.services.length - 12} more)
                                  </>
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div id="reviews-section">
                        <h3 className="text-2xl font-black font-heading text-foreground mb-4">Customer Reviews</h3>
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <h4 className="text-base font-semibold mb-2 font-heading">Reviews Coming Soon</h4>
                          <p className="text-muted-foreground font-body text-sm">
                            Customer reviews and ratings will be available here.
                          </p>
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-amber-500" />
                              <span className="font-semibold">
                                {salon.rating > 0 ? salon.rating.toFixed(1) : "New"}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              ({salon.reviews} {salon.reviews === 1 ? "review" : "reviews"})
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "team" && (
                      <div>
                        <h3 className="text-2xl font-black font-heading text-foreground mb-6">Team</h3>

                        {loading[id] && !details && (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary/20 border-t-primary mx-auto mb-3"></div>
                            <p className="text-muted-foreground font-body text-sm">Loading team details...</p>
                          </div>
                        )}

                        {error[id] && (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Shield className="h-6 w-6 text-destructive" />
                            </div>
                            <p className="text-destructive font-body text-sm">{error[id]}</p>
                          </div>
                        )}

                        {details?.employees?.length ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {details.employees.map((emp) => {
                              const e = emp as any
                              const avatar = e.photo || e.image || e.avatar || e.profileImage || "/avatar.png"
                              const rating =
                                (typeof e.rating === "number" && e.rating) ||
                                (typeof e.averageRating === "number" && e.averageRating) ||
                                4.8
                              const role = e.role || e.designation || "Team Member"
                              const yrs = getExperienceYears(e)
                              const svcCount = (details.services || []).filter((s) => {
                                const se = (s as any).employee
                                const sid = typeof se === "string" ? se : se?._id
                                const eid = e._id || e.id
                                return eid && sid && String(sid) === String(eid)
                              }).length

                              return (
                                <div key={e._id || e.id || emp.name} className="flex flex-col items-center text-center">
                                  <div className="relative">
                                    <img
                                      src={avatar}
                                      alt={emp.name}
                                      className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-1 ring-border shadow-sm"
                                    />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow border flex items-center gap-1 text-[11px] font-semibold">
                                      <span>{Number(rating).toFixed(1)}</span>
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <p className="font-semibold text-foreground truncate max-w-[8rem] sm:max-w-[10rem]">{emp.name}</p>
                                    <p className="text-muted-foreground text-sm truncate">{role}</p>
                                    {yrs != null && (
                                      <p className="text-xs text-muted-foreground mt-0.5">{yrs} yrs experience</p>
                                    )}
                                    <div className="mt-1">
                                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-foreground border border-border">
                                        <Clock className="h-3 w-3" />
                                        {svcCount} services
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          !loading[id] && (
                            <div className="text-center py-8 bg-muted/30 rounded-lg">
                              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                              <h4 className="text-base font-semibold mb-2 font-heading">No Team Members Found</h4>
                              <p className="text-muted-foreground font-body text-sm">
                                Team information will be available soon.
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="bg-muted/30">
                <div className="p-6 pl-0 pr-2 md:pr-3 w-full relative">
                  {/* Image Thumbnails Card */}
                  <Card className="shadow-lg border-0 bg-card mb-1 w-full">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 grid-rows-2 h-[280px] md:h-[320px] gap-3 w-full">
                        {(salon.image?.slice(1, 5) || [
                          "/modern-salon-reception.png",
                          "/upscale-salon-hair-wash.png",
                          "/luxury-salon-interior.png",
                          "/luxury-salon-interior.png",
                        ]).map((thumbSrc, idx) => {
                          const imgIndex = idx + 1
                          const isSelected = selectedImageIndex === imgIndex
                          return (
                            <button
                              key={imgIndex}
                              onClick={() => handleImageSelect(imgIndex)}
                              className={`w-full h-full rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-primary/50"
                              }`}
                            >
                              <img src={thumbSrc} alt={`${salon.name} ${imgIndex}`} className="w-full h-full object-cover" />
                            </button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Details Card */}
                  <div ref={bookRef} />
                  <div className="sticky top-20">
                    <Card className="shadow-xl border-0 bg-card w-full">
                    <CardContent className="pl-6 pr-8 md:pr-10 pt-2 pb-6">
                      <div className="space-y-4">
                        {/* Summary info inside booking box */}
                        <div className="space-y-2">
                          <h3 className="text-3xl md:text-4xl leading-tight font-bold font-heading text-card-foreground -mt-2">{salon.name}</h3>
                          <button
                            type="button"
                            onClick={scrollToReviews}
                            className="flex items-center gap-2 text-sm cursor-pointer group"
                            aria-label="View reviews"
                            title="View reviews"
                          >
                            <span className="font-semibold">{salon.reviews > 0 && salon.rating > 0 ? salon.rating.toFixed(1) : "0.0"}</span>
                            <Star
                              className={
                                `h-4 w-4 ${salon.reviews > 0 && salon.rating > 0 ? "fill-current text-amber-500" : "text-muted-foreground"}`
                              }
                            />
                            {salon.reviews > 0 ? (
                              <span className="text-primary font-medium underline decoration-transparent group-hover:decoration-current">({salon.reviews} {salon.reviews === 1 ? "review" : "reviews"})</span>
                            ) : (
                              <span className="text-blue-600 font-medium underline decoration-transparent group-hover:decoration-current">(0)</span>
                            )}
                          </button>
                          <div className="flex items-center gap-2 mt-3 mb-2">
                            <Badge className="bg-gradient-to-r from-emerald-50 to-green-100 text-green-700 border border-green-200 rounded-full text-sm px-3 py-1 font-semibold shadow-sm inline-flex items-center">
                              <Zap className="h-4 w-4 mr-1.5 text-green-600" />
                              Deals
                            </Badge>
                          </div>
                          <div className="pt-3">
                            <Button 
                              onClick={() => {
                                navigate(`/services/${id}`)
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-base font-semibold rounded-lg"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </Button>
                            <Dialog open={bookOpen} onOpenChange={setBookOpen}>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Book an appointment</DialogTitle>
                                  <DialogDescription>Select services and preferred time.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {details?.services?.length ? (
                                    <div>
                                      <p className="text-sm font-semibold mb-2">Select services</p>
                                      <div className="max-h-48 overflow-auto space-y-2 pr-1">
                                        {details.services.map((s: any) => (
                                          <label key={s._id} className="flex items-center justify-between gap-3 rounded-lg border p-2 hover:bg-muted/50">
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={selectedServiceIds.includes(s._id)}
                                                onChange={() => toggleService(s._id)}
                                              />
                                              <span className="text-sm font-medium">{s.name}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              ₹{s.price ?? 0}{s.duration ? ` • ${formatDuration(s.duration)}` : ""}
                                            </div>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Services list unavailable. You can still book a slot.</p>
                                  )}
                                  <div className="grid gap-2">
                                    <label className="text-sm font-semibold">Date & time</label>
                                    <input
                                      type="datetime-local"
                                      value={appointmentTime}
                                      onChange={(e) => { setAppointmentTime(e.target.value); setAppointmentTimeMs((e.target as HTMLInputElement).valueAsNumber || null) }}
                                      className="h-10 w-full rounded-md border px-3"
                                      min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <label className="text-sm font-semibold">Notes (optional)</label>
                                    <textarea
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      className="min-h-[80px] w-full rounded-md border px-3 py-2"
                                      placeholder="Any preferences or instructions"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setBookOpen(false)} disabled={submitting}>Cancel</Button>
                                    <Button onClick={handleContinueToCheckout} disabled={submitting} className="bg-primary text-primary-foreground">
                                      Continue
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <p className="text-sm font-semibold text-red-500 m-0">Cancellation Policy</p>
                            <Dialog>
                              <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                  <DialogTrigger asChild>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        aria-label="View cancellation policy"
                                        className="inline-flex items-center justify-center p-0 text-red-500 hover:text-red-600 transition-colors align-middle"
                                      >
                                        <Info className="h-4 w-4" strokeWidth={1.8} />
                                      </button>
                                    </TooltipTrigger>
                                  </DialogTrigger>
                                  <TooltipContent side="right" className="text-sm">
                                    View policy
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-red-500">Cancellation Policy</DialogTitle>
                                  <DialogDescription asChild>
                                    <div className="space-y-2 text-sm text-card-foreground">
                                      <p>✅ Free Cancellation – Cancel 45 min before appointment → Full Refund / Wallet Credit.</p>
                                      <p>⚠️ Late Cancellation – Cancel within 45 min → 50% charged.</p>
                                      <p>❌ No Show – Not arriving without cancel → 100% charged.</p>
                                      <p>🏠 Salon Cancel – Full Refund + ₹20 Wallet Bonus.</p>
                                      <p>🔄 Reschedule – Allowed once (≥ 45 min before).</p>
                                      <p>💳 Refunds – Processed in 3–5 working days.</p>
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="mt-5 mb-4 h-px bg-border/70" />
                        </div>

                        <div className="bg-muted p-4 rounded-xl">
                          <div className="flex items-center justify-center gap-3 text-card-foreground">
                            <Clock className="h-5 w-5 text-primary" />
                            <div className="text-center">
                              <p className="font-bold font-heading">Open Today</p>
                              <p className="text-red-500 font-body font-semibold">Open until {salon.closingTime}</p>
                              {salon.availability && (
                                <div className="space-y-1">
                                  {salon.availability.toLowerCase().includes("available") ? (
                                    <button
                                      type="button"
                                      className="text-sm font-semibold text-green-600 hover:text-green-700"
                                      onClick={() => setShowAvailNote((v) => !v)}
                                      aria-pressed={showAvailNote}
                                    >
                                      Available
                                    </button>
                                  ) : (
                                    <p className="text-sm font-semibold text-amber-600">Busy</p>
                                  )}
                                  {showAvailNote && (
                                    <p className="text-xs font-medium text-green-600">Accepting bookings</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Phone number hidden for customers */}

                        <div className="space-y-3 pt-4">
                          <div id="booking-address" className="text-sm text-card-foreground">
                            {salon.location?.address ? `${salon.location.address}, ` : ""}
                            {salon.location?.city}{salon.location?.city ? ", " : ""}{salon.location?.state}
                            {salon.location?.pincode ? `, ${salon.location.pincode}` : ""}
                          </div>
                          {salon.location?.mapUrl && (
                            <Button
                              variant="outline"
                              className="w-full h-12 text-base font-bold bg-transparent"
                              onClick={() => window.open(salon.location.mapUrl, "_blank")}
                            >
                              <MapPin className="h-5 w-5 mr-2" />
                              View on Map
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
