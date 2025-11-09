import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Careers() {
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
            Careers at <span className="text-red-500">Trimora</span>
          </h1>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              At Trimora, we are building the future of salon & wellness booking in India's Tier-2 and Tier-3 cities. 
              Our mission is to bring local salons and wellness centers online, empowering them with technology while 
              giving customers a modern and hassle-free experience.
            </p>
            <p>
              We are not just creating an app – we are creating a movement. And we are looking for passionate people 
              who want to grow with us.
            </p>
          </div>
        </div>

        {/* Why Join Trimora Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Join Trimora?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Startup Culture</h3>
              <p className="text-gray-700 leading-relaxed">
                Work in a fast-paced, innovative environment.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real Impact</h3>
              <p className="text-gray-700 leading-relaxed">
                Your work directly helps small businesses grow and customers get better services.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growth Opportunities</h3>
              <p className="text-gray-700 leading-relaxed">
                Learn, build, and grow your career with a rising startup.
              </p>
            </div>

            <div className="bg-white border-2 border-red-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-red-600 text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Spirit</h3>
              <p className="text-gray-700 leading-relaxed">
                Be part of a young, ambitious, and collaborative team.
              </p>
            </div>
          </div>
        </div>

        {/* Current Openings Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Current Openings</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Development Associates</h3>
                <p className="text-gray-600">(City Operations)</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing & Growth Interns</h3>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Stack Developers</h3>
                <p className="text-gray-600">(MERN)</p>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">UI/UX Designers</h3>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Salon Partnership Managers</h3>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 italic">(More roles coming soon!)</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              ✨ If you're ready to build something impactful and grow with us, send your resume to careers@trimora.com
            </h2>
            <div className="mt-8">
              <a 
                href="mailto:careers@trimora.com" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-500 font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Send Your Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
