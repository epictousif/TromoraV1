"use client"

import { motion } from "framer-motion"
import {
  CheckCircle,
  Building2,
  Users,
  Calendar,
  BarChart3,
  Rocket,
  Star,
  ListChecks,
  Tag,
  LifeBuoy,
  Camera,
  UserPlus,
} from "lucide-react"

export default function PartnerWithUs() {
  return (
    <div className="pt-0">{/* navbar hidden on this route, so no top offset needed */}
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900"
              >
                Grow your salon with Trimora
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-lg text-gray-600"
              >
                Join India’s modern salon network. Get bookings, manage staff & inventory, run campaigns, and delight clients—all in one place.
              </motion.p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="http://localhost:5173/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold shadow transition-all duration-500 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 bg-[linear-gradient(90deg,#ef4444_0%,#dc2626_50%,#ef4444_100%)] [background-size:200%_100%] [background-position:0_0] hover:[background-position:100%_0]"
                >
                  Get Started
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-gray-300 text-gray-800 font-semibold transition-all duration-300 hover:bg-gray-100/70 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/60"
                >
                  Explore Features
                </a>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> No setup fees</span>
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Cancel anytime</span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-2xl border bg-white shadow-xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, title: "Smart Scheduling", desc: "Auto-reminders & waitlists" },
                    { icon: Users, title: "Client CRM", desc: "Profiles, history, notes" },
                    { icon: Building2, title: "POS & Billing", desc: "UPI/card, invoices" },
                    { icon: BarChart3, title: "Reports", desc: "Revenue, staff, inventory" },
                  ].map((f) => (
                    <div key={f.title} className="p-4 rounded-xl bg-gray-50 border">
                      <f.icon className="h-5 w-5 text-red-500" />
                      <div className="mt-2 font-semibold text-gray-900">{f.title}</div>
                      <div className="text-sm text-gray-600">{f.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Rocket className="h-4 w-4 text-red-500" />
                  Launch your digital storefront in minutes
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Complete Business Solution */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">Complete Solution For <span className="text-sky-400">Business Owner</span></h2>
        <p className="text-gray-600 text-center mt-3">Everything you need to run and grow your salon business – all in one powerful platform</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {[
            {
              title: "Professional Profile",
              desc: "Showcase your name, photo & services.",
              Icon: Camera,
              color: "from-red-500 to-red-600",
            },
            {
              title: "Smart Booking",
              desc: "Online appointments with instant notifications.",
              Icon: Calendar,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Team Management",
              desc: "Schedule & track staff performance.",
              Icon: Users,
              color: "from-emerald-500 to-emerald-600",
            },
            {
              title: "Flexible Services & Pricing",
              desc: "Set what you offer and your prices.",
              Icon: ListChecks,
              color: "from-purple-500 to-purple-600",
            },
            {
              title: "Ratings & Reviews",
              desc: "Earn customer trust & boost ratings.",
              Icon: Star,
              color: "from-yellow-500 to-amber-500",
            },
            {
              title: "Payments Made Easy",
              desc: "UPI/Card/Wallet + every 2-day settlements & GST reports.",
              Icon: BarChart3,
              color: "from-sky-500 to-indigo-600",
            },
            {
              title: "Promotions & Verified Badge",
              desc: "Run offers, loyalty programs & get trusted.",
              Icon: Tag,
              color: "from-pink-500 to-rose-600",
            },
            {
              title: "Support & Marketing",
              desc: "24/7 help, free photoshoot & social media boost.",
              Icon: LifeBuoy,
              color: "from-cyan-500 to-blue-500",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28, scale: 0.92, filter: "blur(2px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-3xl p-[2px] bg-multicolor-animated h-full will-change-transform transform-gpu"
            >
              <div className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-lg transition-all h-full min-h-[170px] flex flex-col overflow-hidden group">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center text-white transform-gpu transition-transform duration-300 group-hover:scale-110`}
                  >
                    <item.Icon className="h-5 w-5" />
                  </div>
                  <div className="text-base font-semibold text-gray-900">{item.title}</div>
                </div>
                <motion.p
                  className="mt-3 text-sm text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: 0.05 + index * 0.08 }}
                >
                  {item.desc}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">How it <span className="text-sky-400">works</span></h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { step: 1, title: "Create your account", desc: "Sign up and add basic details of your salon.", Icon: UserPlus, color: "from-red-500 to-red-600" },
              { step: 2, title: "Set up services", desc: "Add staff, pricing, and availability.", Icon: ListChecks, color: "from-blue-500 to-indigo-600" },
              { step: 3, title: "Go live", desc: "Start accepting online bookings instantly.", Icon: Rocket, color: "from-emerald-500 to-teal-600" },
            ].map((s) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl bg-white border p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white`}>
                    <s.Icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold text-red-600">STEP {s.step}</div>
                </div>
                <div className="mt-3 text-lg font-bold text-gray-900">{s.title}</div>
                <div className="mt-1 text-gray-600 text-sm leading-relaxed">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">
          Success Stories from <span className="text-sky-500">Real Partners</span>
        </h2>
        <p className="text-gray-600 text-center mt-3">Hear from salon owners who transformed their business with Trimora</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                '"Trimora ne hamara business completely transform kar diya! Pehle 20-25 customers daily aate the, ab 40+ aate hain. Monthly income double ho gaya hai. Best decision ever!"',
              name: "Priya Sharma",
              salon: "Glamour Salon",
              city: "Mumbai",
              since: "2023",
              url: "#",
            },
            {
              quote:
                '"Monthly revenue ₹80,000 se ₹1,40,000 ho gaya! Customer management bahut easy ho gaya hai. Support team bhi excellent hai – Hindi mein help karte hain."',
              name: "Rajesh Kumar",
              salon: "Style Studio",
              city: "Delhi",
              since: "2022",
              url: "#",
            },
            {
              quote:
                '"Best decision for my salon business! No-shows almost zero ho gaye. Premium customers mil rahe hain. App bahut user‑friendly hai aur training bhi free mili."',
              name: "Sunita Patel",
              salon: "Beauty Lounge",
              city: "Bangalore",
              since: "2023",
              url: "#",
            },
          ].map((t) => (
            <motion.div
              key={t.name}
              className="rounded-3xl p-[2px] bg-multicolor-animated cursor-pointer select-none"
              initial={{ scale: 0.98 }}
              whileHover={{ scale: 1, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.7 }}
              aria-label={`Testimonial by ${t.name} from ${t.salon}, ${t.city}`}
            >
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                {/* Stars */}
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-4 text-gray-800 text-sm leading-relaxed">{t.quote}</p>

                {/* Profile */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white grid place-items-center font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs">
                      <a href={t.url} className="text-purple-600 hover:text-purple-700 hover:underline">
                        {t.salon}, {t.city}
                      </a>
                      <div className="text-gray-500">Partner since {t.since}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 text-white p-10 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to partner with us?</h3>
          <p className="mt-2 text-white/90">Create your free Trimora partner account and start getting bookings today.</p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="http://localhost:5173/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-red-600 font-semibold hover:bg-white/90"
            >
              Get Started
            </a>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-red-700/70 hover:bg-red-700 text-white font-semibold"
            >
              Explore Marketplace
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
