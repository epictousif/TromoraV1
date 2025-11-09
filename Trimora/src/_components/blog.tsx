import { CheckCircle, MapPin, Smartphone, Shield, TrendingUp, Users, Clock, Eye, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Blog() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Why Small Cities Need a Digital Salon & Wellness Platform
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              In India, beauty and wellness are not just services – they are an essential part of lifestyle. But while big cities enjoy modern salon apps and luxury wellness booking platforms, Tier-2 and Tier-3 cities are still waiting for this digital transformation.
            </p>
            
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-800 mb-2">
                At Trimora, we asked ourselves a simple question:
              </p>
              <p className="text-xl font-semibold text-purple-700 flex items-center gap-2">
                <span>👉</span>
                Why should premium grooming and wellness be limited to metros like Delhi, Mumbai, or Bangalore?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              The Challenges in Small Cities
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-900">No Easy Booking System</h3>
                </div>
                <p className="text-gray-600">
                  Customers often wait in long queues at salons.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-900">Lack of Transparency</h3>
                </div>
                <p className="text-gray-600">
                  Prices and services are not always clear.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-900">Limited Reach for Salons</h3>
                </div>
                <p className="text-gray-600">
                  Local businesses struggle to attract new clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How Trimora is Changing the Game
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    Smart Booking App
                  </h3>
                  <p className="text-gray-700">
                    Customers can book their slot before visiting, saving time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Verified Salons & Wellness Centers
                  </h3>
                  <p className="text-gray-700">
                    Only trusted partners are listed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Transparent Pricing
                  </h3>
                  <p className="text-gray-700">
                    No hidden charges, clear service lists.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Tech for Growth
                  </h3>
                  <p className="text-gray-700">
                    Local salons can now go digital and compete with big brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Our Vision
            </h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="w-8 h-8 text-white" />
                <h3 className="text-2xl font-semibold text-white">A Movement for Small Cities</h3>
              </div>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Trimora is more than just an app – it's a movement to bring small-city salons and wellness centers online. We want every customer, whether in Garhwa, Ranchi, or any Tier-3 town, to enjoy a smooth, modern, and reliable grooming experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
