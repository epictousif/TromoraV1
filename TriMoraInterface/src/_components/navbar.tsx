"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Search,
  Bell,
  User,
  Calendar,
  Settings,
  LogOut,
  Scissors,
  Sparkles,
  Gift,
  Heart,
} from "lucide-react"


interface NavbarProps {
  className?: string
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
    name: "Spa Packages",
    icon: Gift,
    description: "Relaxing spa experiences",
    href: "/services/spa",
  },
  {
    name: "Bridal Packages",
    icon: Heart,
    description: "Complete bridal makeover",
    href: "/services/bridal",
  },
]

const userMenuItems = [
  { name: "My Appointments", icon: Calendar, href: "/appointments" },
  { name: "Account Settings", icon: Settings, href: "/settings" },
  { name: "Notifications", icon: Bell, href: "/notifications" },
]

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

export default function Navbar({ className = "" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const servicesRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

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
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isSearchOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsServicesDropdownOpen(false)
        setIsUserDropdownOpen(false)
        setIsSearchOpen(false)
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
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-white shadow-sm border-b border-gray-100"
        }
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
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
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <motion.button
                className="flex items-center text-gray-700 hover:text-red-500 font-medium transition-colors"
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
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

            {/* Navigation Links */}
            {["Book Appointment", "Our Salons", "About Us"].map((item) => (
              <motion.a
                key={item}
                href="#"
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Info */}
            <div className="hidden xl:flex items-center space-x-3 px-4 border-l border-gray-200">
              <motion.div
                className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Phone className="h-5 w-5" />
              </motion.div>
              <div>
                <div className="text-sm font-semibold text-gray-800">+1 (555) 123-4567</div>
                <div className="text-xs text-gray-500">Call for inquiries</div>
              </div>
            </div>

            {/* Book Now Button */}
            <motion.a
              href="#"
              className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.a>

            {/* Notifications */}
            <motion.button
              className="relative p-2 text-gray-400 hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* User Dropdown */}
            <div className="relative hidden md:block" ref={userRef}>
              <motion.button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-100 to-red-100 flex items-center justify-center border-2 border-red-200">
                  <User className="h-5 w-5 text-red-500" />
                </div>
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
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                      </div>
                      {userMenuItems.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <motion.a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 4 }}
                          >
                            <IconComponent className="h-4 w-4 mr-3" />
                            {item.name}
                          </motion.a>
                        )
                      })}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <motion.button
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign out
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-red-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-6 space-y-6">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Mobile Services */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                  <div className="space-y-2">
                    {services.map((service, index) => {
                      const IconComponent = service.icon
                      return (
                        <motion.a
                          key={service.name}
                          href={service.href}
                          className="flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <IconComponent className="h-5 w-5 text-red-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {["Book Appointment", "Our Salons", "About Us"].map((item, index) => (
                    <motion.a
                      key={item}
                      href="#"
                      className="block px-3 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 4) * 0.1 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Contact & CTA */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">+1 (555) 123-4567</div>
                      <div className="text-sm text-gray-500">Call for inquiries</div>
                    </div>
                  </div>

                  <motion.a
                    href="#"
                    className="block w-full px-6 py-4 text-center bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                  </motion.a>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Signed in as John Doe</span>
                    <button className="text-sm text-red-600 hover:text-red-600">Sign Out</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    
    </motion.nav>
  )
}
