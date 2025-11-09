import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function About() {
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
            Welcome to <span className="text-red-500">Trimora</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-6">
            India's first organized salon & wellness booking platform specially built for Tier-2 and Tier-3 cities.
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            We believe that everyone deserves premium grooming and wellness experiences, no matter where they live. 
            But in smaller towns, salons and wellness centers often lack proper booking systems, verified staff, 
            and transparent pricing. That's why we created Trimora.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 mb-20 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            "To bring every salon and wellness center in small towns and cities online – making beauty, grooming, 
            and self-care services accessible, transparent, and reliable for all."
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">📱</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>Customers</strong> can easily discover nearby salons, spas, and wellness centers 
                and book time slots in advance through our app.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">✅</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>Verified profiles</strong> with services, staff, reviews, and pricing 
                give complete clarity – no hidden charges.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">💼</span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                <strong>Local salons and wellness businesses</strong> get a tech-powered booking system 
                to manage appointments and grow digitally.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Trimora Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Trimora?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">✔️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trusted Salons, Spas & Wellness Experts</h3>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">✔️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Seamless booking with transparent pricing</h3>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">✔️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">No waiting – book your slot from home</h3>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">✔️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Specially designed for Tier-2 & Tier-3 cities like Garhwa, Ranchi, and beyond</h3>
            </div>
          </div>
        </div>

        {/* Movement Section */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl p-12 mb-20 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              ✨ Trimora is more than just an app – it's a movement.
            </h2>
            <p className="text-xl leading-relaxed">
              We empower local salons and wellness centers with technology, while giving customers 
              a modern, reliable, and delightful beauty & self-care experience.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join the Trimora Movement</h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Ready to experience the future of salon and wellness booking? 
            Join thousands of satisfied customers who trust Trimora for their beauty and wellness needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/auth" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              Get Started Today
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
