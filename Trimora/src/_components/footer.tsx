"use client"

import { motion } from "framer-motion"
import {
  MapPin,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Download,
  Heart,
  ExternalLink,
  HelpCircle,
  FileText,
  Shield,
  Users,
  Briefcase,
  BookOpen,
  Scissors,
  Brain,
  Gift,
  Tag,
  ArrowRight,
  Globe,
  Zap,
  Award,
  TrendingUp,
  Store,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const companyLinks = [
  { name: "About Us", href: "/about", icon: Users },
  { name: "Our Vision", href: "/vision", icon: Heart },
  { name: "Careers", href: "/careers", icon: Briefcase, badge: "Hiring" },
  { name: "Blog", href: "/blog", icon: BookOpen },
]

const serviceLinks = [
  { name: "Book a Salon", href: "/book", icon: Scissors },
  { name: "AI Scanner", href: "/ai-scanner", icon: Brain, badge: "Beta" },
  { name: "Bridal Packages", href: "/packages", icon: Gift },
  { name: "Offers & Deals", href: "/offers", icon: Tag },
]

const supportLinks = [
  { name: "Help Center", href: "/help", icon: HelpCircle },
  { name: "Contact Us", href: "/contact", icon: Phone },
  { name: "Live Chat", href: "#", icon: MessageCircle, badge: "24/7" },
  { name: "WhatsApp", href: "https://wa.me/919876543210", icon: MessageCircle },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Terms of Service", href: "/terms", icon: FileText },
  { name: "Refund Policy", href: "/refunds", icon: FileText },
  { name: "Guidelines", href: "/guidelines", icon: Users },
]

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook, color: "hover:bg-blue-600", followers: "12K" },
  { name: "Instagram", href: "#", icon: Instagram, color: "hover:bg-pink-600", followers: "25K" },
  { name: "LinkedIn", href: "#", icon: Linkedin, color: "hover:bg-blue-700", followers: "5K" },
  { name: "YouTube", href: "#", icon: Youtube, color: "hover:bg-red-600", followers: "8K" },
]

const stats = [
  { label: "Happy Customers", value: "10K+", icon: Users },
  { label: "Partner Salons", value: "500+", icon: Store },
  { label: "Cities Covered", value: "15+", icon: MapPin },
  { label: "Bookings Made", value: "50K+", icon: TrendingUp },
]

const cities = [
  { name: "Garhwa", status: "live" },
  { name: "Daltonganj", status: "live" },
  { name: "Ranchi", status: "live" },
  { name: "Patna", status: "live" },
  { name: "Delhi", status: "coming" },
  { name: "Mumbai", status: "coming" },
]

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Section with Stats */}
        <div className="border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Brand Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Trimora
              </h2>
              <div className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="text-xs text-red-400 font-medium">Trusted Partner</span>
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm leading-relaxed">
              Revolutionizing salon experiences across India. Book verified salons with transparent pricing and flexible
              timing — all in one seamless platform.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Award className="h-3 w-3 text-yellow-500" />
                <span>Built for Bharat</span>
              </div>
              <div className="w-1 h-1 bg-gray-500 rounded-full" />
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span>Trusted by Salons</span>
              </div>
              <div className="w-1 h-1 bg-gray-500 rounded-full" />
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3 text-red-500 fill-current" />
                <span>Loved by Users</span>
              </div>
            </div>
          </motion.div>

          {/* Links Grid */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Company */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <div className="w-1 h-4 bg-red-500 rounded-full mr-2" />
                Company
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group py-1"
                    >
                      <div className="flex items-center">
                        <link.icon className="h-3 w-3 mr-2 group-hover:text-red-500 transition-colors" />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-md">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <div className="w-1 h-4 bg-blue-500 rounded-full mr-2" />
                Services
              </h3>
              <ul className="space-y-2">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group py-1"
                    >
                      <div className="flex items-center">
                        <link.icon className="h-3 w-3 mr-2 group-hover:text-blue-500 transition-colors" />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-md">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <div className="w-1 h-4 bg-green-500 rounded-full mr-2" />
                Support
              </h3>
              <ul className="space-y-2">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors group py-1"
                      target={link.href.startsWith("http") ? "_blank" : "_self"}
                    >
                      <div className="flex items-center">
                        <link.icon className="h-3 w-3 mr-2 group-hover:text-green-500 transition-colors" />
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-md">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <div className="w-1 h-4 bg-yellow-500 rounded-full mr-2" />
                Legal
              </h3>
              <ul className="space-y-2">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center text-xs text-gray-400 hover:text-white transition-colors group py-1"
                    >
                      <link.icon className="h-3 w-3 mr-2 group-hover:text-yellow-500 transition-colors" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Interactive Section */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Social Media */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-white">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-2">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`flex items-center justify-between p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all duration-300 group ${social.color}`}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-2">
                        <social.icon className="h-4 w-4" />
                        <span className="text-xs font-medium">{social.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-white">{social.followers}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-white">Stay Updated</h3>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    />
                    <motion.button
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium rounded-lg transition-all duration-300 flex items-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-400">Get updates on new features & offers</p>
                </div>
              </motion.div>

              {/* App Download */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-white flex items-center">
                  <Download className="h-4 w-4 mr-2 text-red-500" />
                  Get the App
                </h3>
                <div className="space-y-2">
                  <motion.a
                    href="#"
                    className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center">
                      <Download className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="text-xs font-medium text-white">Google Play</div>
                    </div>
                  </motion.a>
                  <motion.a
                    href="#"
                    className="flex items-center space-x-2 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                      <Download className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Download on</div>
                      <div className="text-xs font-medium text-white">App Store</div>
                    </div>
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Coverage Area */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-red-500" />
                  Service Coverage
                </h3>
                <motion.a
                  href="/coverage"
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                  whileHover={{ x: 3 }}
                >
                  <span>View Full Map</span>
                  <ExternalLink className="h-3 w-3" />
                </motion.a>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                      city.status === "live"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        city.status === "live" ? "bg-green-500" : "bg-yellow-500"
                      } ${city.status === "live" ? "animate-pulse" : ""}`}
                    />
                    <span>{city.name}</span>
                    {city.status === "coming" && <span className="text-xs opacity-75">(Soon)</span>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700/50 bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs text-gray-400 text-center md:text-left">
                © 2025 Trimora | Founded with <Heart className="inline h-3 w-3 text-red-500 fill-current mx-1" />
                by <span className="font-semibold text-white">Tousif Hasan Ansari</span> in Garhwa, Jharkhand{" "}
                <span className="text-sm">🇮🇳</span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>From Bharat, for Bharat</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
