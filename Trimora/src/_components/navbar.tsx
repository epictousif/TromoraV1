"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Users,
  Calendar,
  Scissors,
  Sparkles,
  Gift,
  Heart,
  CreditCard,
  Smartphone,
  Rocket,
  Tag,
  ClipboardList,
  Store,
  BarChart3,
  Layers,
  Wallet,
  Hand,
  Leaf,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


interface NavbarProps {
  className?: string
  brandOnly?: boolean
}

const services = [
  {
    name: "Hair Services",
    icon: Scissors,
    description: "Cuts, colors, and styling",
    href: "/services/hair",
  },
  {
    name: "Beauty Treatments",
    icon: Sparkles,
    description: "Facials, makeup, and skincare",
    href: "/services/beauty",
  },
  {
    name: "Nail Care",
    icon: Hand,
    description: "Manicure, pedicure, nail art",
    href: "/services/nail-care",
  },
  {
    name: "Spa Packages",
    icon: Gift,
    description: "Relaxing spa experiences",
    href: "/services/spa",
  },
  {
    name: "Ayurveda & Relaxation",
    icon: Leaf,
    description: "Holistic therapies and wellness",
    href: "/services/ayurveda",
  },
  {
    name: "Bridal Packages",
    icon: Heart,
    description: "Complete bridal makeover",
    href: "/services/bridal",
  },
]

// Features groups for mega dropdown
const featuresGroups = [
  {
    title: "Scheduling & Payments",
    items: [
      { name: "Calendar & Scheduling", icon: Calendar, href: "/features/calendar" },
      { name: "Payments & Point-of-Sale", icon: CreditCard, href: "/features/pos" },
      { name: "Online Booking", icon: Rocket, href: "/features/online-booking" },
      { name: "Express Booking", icon: Rocket, href: "/features/express-booking" },
      { name: "Mobile Apps", icon: Smartphone, href: "/features/mobile-apps" },
    ],
  },
  {
    title: "Client Relationships",
    items: [
      { name: "Client Management", icon: Users, href: "/features/client-management" },
      { name: "Two-Way Texting", icon: Smartphone, href: "/features/two-way-texting" },
      { name: "Memberships & Packages", icon: Tag, href: "/features/memberships" },
      { name: "Forms & Charting", icon: ClipboardList, href: "/features/forms" },
      { name: "Gift Cards", icon: Gift, href: "/features/gift-cards" },
    ],
  },
  {
    title: "Marketing & Automation",
    items: [
      { name: "Automated Flows", icon: Rocket, href: "/features/automation" },
      { name: "Campaigns", icon: Rocket, href: "/features/campaigns" },
      { name: "Offers & Discounts", icon: Tag, href: "/features/offers" },
      { name: "Virtual Waiting Room", icon: Layers, href: "/features/waiting-room" },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Retail & Inventory", icon: Store, href: "/features/inventory" },
      { name: "Staff Management", icon: Users, href: "/features/staff" },
      { name: "Reporting", icon: BarChart3, href: "/features/reporting" },
      { name: "Multi-Location", icon: Layers, href: "/features/multi-location" },
      { name: "Payroll Processing", icon: Wallet, href: "/features/payroll" },
    ],
  },
]

// user menu removed

const navVariants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto" as const,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
}

export default function Navbar({ className = "", brandOnly = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const servicesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const closeTimers = useRef<{ services?: number; features?: number; user?: number }>({})

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false)
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setIsFeaturesDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsServicesDropdownOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled || isMobileMenuOpen
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-gradient-to-b from-red-50/90 to-white/0"
        }
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo + Greeting */}
          <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a href="/" className="flex items-center group">
              <motion.div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                whileHover={{
                  rotate: 12,
                  boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                T
              </motion.div>
              <span className="ml-3 text-xl font-bold hidden sm:block">
                <span className="text-red-500">TRI</span>
                <span className="text-gray-800">MORA</span>
              </span>
            </a>
            {/* Greeting removed as per request */}
          </motion.div>

          {/* Mobile Menu Button */}
          {!brandOnly && (
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          )}

          {/* Desktop Navigation */}
          {!brandOnly && (
          <div className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div
              className="relative"
              ref={servicesRef}
              onMouseEnter={() => {
                if (closeTimers.current.services) {
                  window.clearTimeout(closeTimers.current.services)
                  closeTimers.current.services = undefined
                }
              }}
              onMouseLeave={() => {
                closeTimers.current.services = window.setTimeout(() => {
                  setIsServicesDropdownOpen(false)
                }, 150)
              }}
            >
              <motion.button
                className="flex items-center text-gray-700 hover:text-red-500 font-medium transition-colors"
                onClick={() => {
                  setIsServicesDropdownOpen((prev) => {
                    const next = !prev
                    if (next) setIsFeaturesDropdownOpen(false)
                    return next
                  })
                }}
                onMouseEnter={() => {
                  setIsServicesDropdownOpen(true)
                  setIsFeaturesDropdownOpen(false)
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Services
                <motion.div animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    onMouseLeave={() => setIsServicesDropdownOpen(false)}
                  >
                    <div className="p-2">
                      {services.map((service, index) => {
                        const IconComponent = service.icon
                        return (
                          <motion.a
                            key={service.name}
                            href={service.href}
                            className="flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 4 }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <IconComponent className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-red-500">
                                {service.name}
                              </p>
                              <p className="text-xs text-gray-500">{service.description}</p>
                            </div>
                          </motion.a>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features Mega Dropdown */}
            <div
              className="relative ml-[80px]"
              ref={featuresRef}
              onMouseEnter={() => {
                if (closeTimers.current.features) {
                  window.clearTimeout(closeTimers.current.features)
                  closeTimers.current.features = undefined
                }
              }}
              onMouseLeave={() => {
                closeTimers.current.features = window.setTimeout(() => {
                  setIsFeaturesDropdownOpen(false)
                }, 150)
              }}
            >
              <motion.button
                className="flex items-center text-gray-700 hover:text-red-500 font-medium transition-colors"
                onClick={() => {
                  setIsFeaturesDropdownOpen((prev) => {
                    const next = !prev
                    if (next) setIsServicesDropdownOpen(false)
                    return next
                  })
                }}
                onMouseEnter={() => {
                  setIsFeaturesDropdownOpen(true)
                  setIsServicesDropdownOpen(false)
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
                <motion.div animate={{ rotate: isFeaturesDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isFeaturesDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-[36rem] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-3 text-center"
                    onMouseLeave={() => setIsFeaturesDropdownOpen(false)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 justify-items-center">
                      {featuresGroups.map((group) => (
                        <div key={group.title} className="min-w-0">
                          <h4 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">{group.title}</h4>
                          <div className="space-y-2">
                            {group.items.map((item, idx) => {
                              const Icon = item.icon
                              return (
                                <motion.a
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center p-2 rounded-lg hover:bg-red-50 transition-colors group"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ y: -1 }}
                                >
                                  <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                                    <Icon className="h-4 w-4 text-red-500" />
                                  </span>
                                  <span className="text-sm font-medium text-gray-800 text-left">{item.name}</span>
                                </motion.a>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            {[].map((item) => (
              <motion.a
                key={item}
                href="/press-media"
                className="text-gray-700 hover:text-red-500 font-medium transition-colors relative"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>
          )}

          {/* Right Side Actions */}
          {!brandOnly && (
          <div className="hidden lg:flex items-center space-x-4">

            {/* List Your Business CTA (Desktop) */}
            <motion.a
              href="/partner-with-us"
            
              className="relative overflow-hidden group inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm font-semibold text-gray-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center"></span>
              <span className="relative z-10 text-current group-hover:text-white">Partner With Us</span>
            </motion.a>

            {/* Book Now Button removed by request */}

            {/* Login/Signup or User Menu (Desktop) */}
            {!token ? (
              <motion.a
                href="/auth"
                className="relative overflow-hidden group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm font-semibold text-gray-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center"></span>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
                  Login/Signup
                </span>
              </motion.a>
            ) : (
              <div className="relative" ref={userRef}>
                <motion.button
                  className="relative overflow-hidden group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm font-semibold text-gray-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsUserDropdownOpen((p) => !p)
                    setIsServicesDropdownOpen(false)
                    setIsFeaturesDropdownOpen(false)
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-gray-700">{`Welcome, ${user?.name ?? "Customer"}`}</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="py-1 text-sm text-gray-700">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-red-50"
                          onClick={() => {
                            setIsUserDropdownOpen(false)
                            navigate("/bookings")
                          }}
                        >
                          My Booking
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-red-50"
                          onClick={() => {
                            setIsUserDropdownOpen(false)
                            navigate("/account")
                          }}
                        >
                          My Account
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-red-50"
                          onClick={() => {
                            setIsUserDropdownOpen(false)
                            navigate("/help")
                          }}
                        >
                          Help
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setIsUserDropdownOpen(false)
                            handleLogout()
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
          )}
        </div>

        {/* Mobile Menu */}
        {!brandOnly && (
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
              >
                <div className="px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* Mobile Search removed */}
                  {/* Mobile Services */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Services</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service, index) => {
                        const IconComponent = service.icon
                        return (
                          <motion.a
                            key={service.name}
                            href={service.href}
                            className="flex flex-col items-center p-3 rounded-lg hover:bg-red-50 transition-colors text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <IconComponent className="h-6 w-6 text-red-500 mb-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{service.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                            </div>
                          </motion.a>
                        )
                      })}
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    {[].map((item, index) => (
                      <motion.a
                        key={item}
                        href="/press-media"
                        className="block px-3 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 4) * 0.1 }}
                      >
                        {item}
                      </motion.a>
                    ))}
                  </div>

                  {/* Mobile Features */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="space-y-3">
                      {featuresGroups.map((group, groupIdx) => (
                        <div key={group.title}>
                          <h4 className="text-xs font-semibold text-gray-500 tracking-wider mb-2">{group.title}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {group.items.map((item, idx) => {
                              const Icon = item.icon
                              return (
                                <motion.a
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center p-2 rounded-lg hover:bg-red-50 transition-colors"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: (groupIdx * 5 + idx) * 0.02 }}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-red-50 flex-shrink-0">
                                    <Icon className="h-3 w-3 text-red-500" />
                                  </span>
                                  <span className="text-xs text-gray-800 leading-tight">{item.name}</span>
                                </motion.a>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile CTA & Actions */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <motion.a
                      href="/partner-with-us"
                      className="relative overflow-hidden group block w-full text-center px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Partner With Us
                    </motion.a>

                    {/* Mobile Auth Actions */}
                    <div className="flex flex-col space-y-2">
                      {!token ? (
                        <motion.a
                          href="/auth"
                          className="block w-full text-center px-4 py-2.5 rounded-lg bg-red-500 text-white font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login / Signup
                        </motion.a>
                      ) : (
                        <>
                          <div className="text-center py-2">
                            <span className="text-sm text-gray-600">Welcome, {user?.name || "Customer"}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <motion.button
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                navigate("/bookings")
                              }}
                              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              whileTap={{ scale: 0.98 }}
                            >
                              My Bookings
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                navigate("/account")
                              }}
                              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              whileTap={{ scale: 0.98 }}
                            >
                              My Account
                            </motion.button>
                          </div>
                          <motion.button
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              handleLogout()
                            }}
                            className="w-full px-4 py-2.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            whileTap={{ scale: 0.98 }}
                          >
                            Sign Out
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    
      {/* Greeting strip just below navbar */}
      {!brandOnly && token && (
        <div className="">
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <span className="text-lg md:text-xl font-extrabold text-gray-800">Hi, {user?.name || "Customer"}</span>
          </div> */}
        </div>
      )}
    </motion.nav>
  )
}
