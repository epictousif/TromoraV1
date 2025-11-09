import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-16 mt-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            How <span className="text-red-500">Trimora</span> Works
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Simple steps to book your perfect salon experience or grow your wellness business
          </p>
        </div>

        {/* For Customers Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For Customers <span className="text-2xl">🧑‍💻</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl font-bold">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search & Discover</h3>
              <p className="text-gray-700 leading-relaxed">
                Browse salons, spas, and wellness centers near you with real reviews, verified profiles, and transparent pricing.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl font-bold">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Service</h3>
              <p className="text-gray-700 leading-relaxed">
                Select from a wide range of grooming and wellness services – from haircuts and facials to spa therapies.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl font-bold">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book Your Time Slot</h3>
              <p className="text-gray-700 leading-relaxed">
                Pick a convenient time slot and confirm instantly. No waiting lines, no last-minute stress.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl font-bold">4️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visit & Enjoy</h3>
              <p className="text-gray-700 leading-relaxed">
                Walk into the salon or wellness center at your booked time and enjoy a smooth, hassle-free experience.
              </p>
            </div>
          </div>
        </div>

        {/* For Salons & Wellness Partners Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For Salons & Wellness Partners <span className="text-2xl">💇‍♂️💆‍♀️</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 text-2xl font-bold">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Register Your Business</h3>
              <p className="text-gray-700 leading-relaxed">
                List your salon, spa, or wellness center on Trimora in just a few simple steps.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 text-2xl font-bold">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Showcase Your Services</h3>
              <p className="text-gray-700 leading-relaxed">
                Add your staff, services, pricing, and availability to attract customers.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 text-2xl font-bold">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Bookings Online</h3>
              <p className="text-gray-700 leading-relaxed">
                Manage appointments digitally and reduce no-shows with Trimora's smart booking system.
              </p>
            </div>

            <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-orange-600 text-2xl font-bold">4️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow With Technology</h3>
              <p className="text-gray-700 leading-relaxed">
                Reach more customers, improve service quality, and boost your brand presence in your city.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              ✨ With Trimora, customers enjoy easy, transparent booking, and salons get digital growth with zero hassle.
            </h2>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Start Booking Now
            </a>
            <a 
              href="/partner-with-us" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
