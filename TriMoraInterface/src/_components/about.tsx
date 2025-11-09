"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Brain,
  Users,
  Smartphone,
  Handshake,
  Download,
  Store,
  Heart,
  Target,
  Eye,
  Award,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const features = [
  {
    icon: CheckCircle,
    title: "Verified Salons Only",
    description: "We manually onboard only trusted salons",
    color: "text-green-500",
  },
  {
    icon: Clock,
    title: "Real-Time Booking",
    description: "Book your slot as per your time",
    color: "text-blue-500",
  },
  {
    icon: MapPin,
    title: "Focus on Local",
    description: "Empowering small-town salon owners",
    color: "text-purple-500",
  },
  {
    icon: MessageCircle,
    title: "Instant Confirmation",
    description: "Get booking details on WhatsApp",
    color: "text-orange-500",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Coming Soon: AI-powered skin, hair & beard analysis",
    color: "text-red-500",
  },
]

const milestones = [
  {
    icon: MapPin,
    title: "Founded in Garhwa, Jharkhand",
    description: "Started from the heart of India",
  },
  {
    icon: Store,
    title: "20+ Local Salons Onboarded",
    description: "In the first phase of our journey",
  },
  {
    icon: Smartphone,
    title: "Beta App Launching Soon",
    description: "In selected cities across India",
  },
  {
    icon: Users,
    title: "Team Expanding",
    description: "Designers, developers & growth leaders",
  },
  {
    icon: Handshake,
    title: "Growing Partnerships",
    description: "With salon chains & individual artists",
  },
]

export default function AboutPage() {
  // Services grid to replace the hero: 6 total, show 4
  type ServiceCard = { key: string; title: string; subtitle: string; from: string; to: string }
  const pageSize = 4
  const serviceCards: ServiceCard[] = useMemo(() => ([
    { key: 'haircut', title: 'Haircut', subtitle: 'Trending now', from: '#FF7A7A', to: '#FF3D3D' },
    { key: 'hairspa', title: 'Hair Spa', subtitle: 'Relax & repair', from: '#7AA2FF', to: '#3D66FF' },
    { key: 'beard', title: 'Beard Trim', subtitle: 'Sharp look', from: '#7AFFC7', to: '#07B38A' },
    { key: 'facial', title: 'Facial', subtitle: 'Glow care', from: '#FFCC7A', to: '#FF8A00' },
    { key: 'waxing', title: 'Waxing', subtitle: 'Smooth skin', from: '#C67AFF', to: '#7B2CFF' },
    { key: 'manicure', title: 'Manicure', subtitle: 'Hand care', from: '#7AD0FF', to: '#2CB3FF' },
  ]), [])
  const totalPages = useMemo(() => Math.max(1, Math.ceil(serviceCards.length / pageSize)), [serviceCards.length])
  const [page, setPage] = useState(0)
  useEffect(() => { if (page > totalPages - 1) setPage(totalPages - 1) }, [totalPages, page])
  const visible = useMemo(() => {
    const start = page * pageSize
    return serviceCards.slice(start, start + pageSize)
  }, [page, serviceCards])
  return (
    <div className="min-h-screen bg-white">
      {/* Replaced Hero: Services grid (6 total, show 4) */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Discover by category</h2>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} className="h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15">‹</button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} className="h-9 w-9 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15">›</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visible.map(card => (
              <div key={card.key} className="relative overflow-hidden rounded-2xl h-40 ring-1 ring-white/10 shadow-md">
                <div className="absolute inset-0 opacity-80" style={{ background: `linear-gradient(135deg, ${card.from} 0%, ${card.to} 100%)` }} />
                <div className="relative h-full w-full p-4 flex items-end">
                  <div>
                    <div className="text-white/90 text-sm">{card.subtitle}</div>
                    <div className="text-white font-semibold text-lg leading-tight">{card.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span key={i} className={`h-1.5 w-5 rounded-full ${i === page ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <img src="/placeholder.svg?height=400&width=500" alt="Trimora Team" className="rounded-xl shadow-lg" />
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Who We Are</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
              <p className="text-base text-gray-600 leading-relaxed">
                At Trimora, we're redefining the way India experiences salons. Gone are the days of long waits, surprise
                prices, and unverified service providers. Whether you're looking for a quick haircut or a premium
                grooming experience, Trimora helps you discover, compare, and book verified salons, all from the comfort
                of your home.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                We started in the heart of Garhwa, Jharkhand, with a bold mission — to bring the power of technology to
                Tier 2 and Tier 3 cities where local salons needed digital tools the most.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Mission */}
            <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">
                To empower everyday Indians with a smarter, simpler, and more reliable way to book salon services —
                bridging the gap between quality salons and customers, across every city and town.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeInUp} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed mb-3">
                We envision a future where every salon in India — big or small — is digitally discoverable, trusted, and
                easily bookable.
              </p>
              <p className="text-base font-semibold text-gray-800">
                We're not just a booking app. We are building India's most inclusive beauty-tech ecosystem.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Trimora Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Choose Trimora?</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200"
                whileHover={{ y: -3 }}
              >
                <div
                  className={`p-2 rounded-lg w-fit mb-3 ${feature.color.replace("text-", "bg-").replace("500", "100")}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-red-50 to-red-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-full mr-3">
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Meet Our Founder</h2>
                </div>
                <h3 className="text-lg font-bold text-red-600 mb-1">Tousif Hasan Ansari</h3>
                <p className="text-base text-gray-600 mb-4">Founder & Visionary behind Trimora</p>
                <blockquote className="text-base text-gray-700 italic leading-relaxed mb-4 border-l-4 border-red-500 pl-4">
                  "I come from a small town, where I saw big dreams. With Trimora, I want to empower the local salon
                  industry and make beauty services organized, accessible, and efficient for all. If Swiggy can bring
                  food to your door, why can't you book your haircut with one tap?"
                </blockquote>
                <p className="text-sm text-gray-600">
                  Tousif is a mechanical engineer-turned-entrepreneur who believes in solving real India's real problems
                  with the power of tech.
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="order-1 lg:order-2">
              <img
                src="/placeholder.svg?height=450&width=400"
                alt="Tousif Hasan Ansari - Founder"
                className="rounded-xl shadow-lg mx-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Journey So Far</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {milestones.map((milestone, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <milestone.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-red-200 rounded-full mx-auto animate-ping opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Join Us</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* For Users */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-bold">For Users</h3>
              </div>
              <p className="text-base text-gray-300 mb-6">Find the right salon, book your time, and skip the wait.</p>
              <motion.button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="h-4 w-4" />
                <span>Download Trimora App</span>
              </motion.button>
            </motion.div>

            {/* For Salon Owners */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center mb-4">
                <Store className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-bold">For Salon Owners</h3>
              </div>
              <p className="text-base text-gray-300 mb-6">
                Go digital with Trimora. Get listed, get bookings, grow your salon.
              </p>
              <motion.button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Handshake className="h-4 w-4" />
                <span>Become a Salon Partner</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className="font-semibold">Trimora – Built in Bharat. For Every Indian.</span>
              <span className="text-xl">🇮🇳</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
