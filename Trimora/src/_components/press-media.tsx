import { Mail, Rocket, Sparkles, Target, Users, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PressMedia() {
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
            Press & Media – Trimora
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              We're just getting started
            </h2>
            <Rocket className="w-8 h-8 text-purple-600" />
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            At Trimora, our journey has only begun – and we believe the story of bringing salon & wellness services online in Tier-2 and Tier-3 cities will soon reach many headlines.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 text-center mb-12">
            While we don't have media mentions yet, our mission is clear:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span className="text-purple-600 font-semibold">Empower</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower local salons & wellness centers with technology
              </p>
            </div>

            {/* Mission Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-pink-100">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-pink-600" />
                <span className="text-pink-600 font-semibold">Experience</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To give customers a smooth and transparent booking experience
              </p>
            </div>

            {/* Mission Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-purple-600 font-semibold">Transform</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To transform beauty & grooming in small-town India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Press Contact Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Press Contact
            </h3>
            
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              For media queries, interviews, or future press opportunities, write to us at:
            </p>
            
            <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <Mail className="w-6 h-6 text-purple-600" />
              <a 
                href="mailto:press@trimora.com" 
                className="text-xl font-semibold text-purple-700 hover:text-purple-800 transition-colors"
              >
                press@trimora.com
              </a>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                We're excited to share our story and vision with the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
