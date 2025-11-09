import { Mail, Phone, Users, Newspaper, MapPin, ArrowLeft, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ContactUs() {
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
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Contact Us – Trimora
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            We'd love to hear from you! Whether you're a customer, salon partner, or media professional – the Trimora team is here to help.
          </p>
        </div>
      </div>

      {/* Contact Cards Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Customer Support Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Have questions about bookings, payments, or services?
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <a 
                  href="mailto:support@trimora.com" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  support@trimora.com
                </a>
              </div>
            </div>

            {/* Business & Partnerships Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Business & Partnerships</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Are you a salon or wellness center looking to grow with Trimora?
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <a 
                  href="mailto:partners@trimora.com" 
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  partners@trimora.com
                </a>
              </div>
            </div>

            {/* Press & Media Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Newspaper className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Press & Media</h3>
              </div>
              <p className="text-gray-600 mb-4">
                For press releases, interviews, or media-related queries:
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" />
                <a 
                  href="mailto:press@trimora.com" 
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  press@trimora.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Headquarters Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-gray-900">Headquarters</h2>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trimora Technologies Pvt. Ltd.
              </h3>
              <p className="text-gray-600 text-lg">
                Garhwa, Jharkhand, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Quick Contact</h2>
              </div>
              
              <p className="text-lg mb-6 text-white/90">
                You can also fill out our quick contact form <strong>[here]</strong> (to be added) and our team will get back to you within 24 hours.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-white/80">
                  📧 Response time: Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
