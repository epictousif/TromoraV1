import { ArrowLeft, Cookie, Shield, BarChart3, Settings, Target, Globe, RefreshCw, Mail, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CookiePolicy() {
  const navigate = useNavigate()

  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: Shield,
      color: "red",
      description: "Required for the platform to function properly.",
      example: "login authentication, booking process, and security."
    },
    {
      title: "Performance & Analytics Cookies",
      icon: BarChart3,
      color: "blue",
      description: "Help us understand how users interact with our app/website.",
      example: "tracking app usage, error reports, and improving features."
    },
    {
      title: "Functional Cookies",
      icon: Settings,
      color: "green",
      description: "Allow us to remember your preferences.",
      example: "language selection, location preference, saved salons."
    },
    {
      title: "Marketing & Advertising Cookies",
      icon: Target,
      color: "purple",
      description: "Used to show you relevant offers, promotions, and ads.",
      example: "personalized deals from salons and wellness partners."
    }
  ]

  const sections = [
    {
      title: "1. What Are Cookies?",
      icon: Cookie,
      color: "orange",
      content: (
        <div>
          <p>Cookies are small text files stored on your device (mobile/desktop) when you visit our app or website. They help us remember your preferences and provide a smoother, personalized experience.</p>
        </div>
      )
    },
    {
      title: "3. How We Use Cookies",
      icon: Settings,
      color: "indigo",
      content: (
        <div>
          <ul className="space-y-2">
            <li>To make the booking process faster and more secure.</li>
            <li>To analyze app/website performance.</li>
            <li>To provide personalized recommendations and reminders.</li>
            <li>To deliver relevant promotions and marketing.</li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Third-Party Cookies",
      icon: Globe,
      color: "teal",
      content: (
        <div>
          <ul className="space-y-2">
            <li>We may use third-party services (like Google Analytics, payment gateways, or ad networks) that set cookies on your device.</li>
            <li>These third parties are responsible for their own cookie usage and policies.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Managing Cookies",
      icon: Settings,
      color: "pink",
      content: (
        <div>
          <p className="mb-4">You have the right to accept, reject, or delete cookies:</p>
          <ul className="space-y-2">
            <li>Most browsers allow you to manage cookies in settings.</li>
            <li>Disabling some cookies may affect the functionality of the Trimora app/website.</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. Updates to This Policy",
      icon: RefreshCw,
      color: "emerald",
      content: (
        <div>
          <p>We may update our Cookie Policy from time to time. Any changes will be notified via app/website.</p>
        </div>
      )
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", iconBg: "bg-red-100" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100" },
      green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", iconBg: "bg-orange-100" },
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600", iconBg: "bg-indigo-100" },
      teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600", iconBg: "bg-teal-100" },
      pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600", iconBg: "bg-pink-100" },
      emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", iconBg: "bg-emerald-100" }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.orange
  }

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cookie Policy – Trimora
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            At Trimora, we use cookies and similar technologies to improve your experience on our salon & wellness booking platform. This Cookie Policy explains what cookies are, how we use them, and your choices.
          </p>
        </div>
      </div>

      {/* What Are Cookies Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {sections.slice(0, 1).map((section, index) => {
            const colors = getColorClasses(section.color)
            const IconComponent = section.icon
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-2xl p-8 mb-8`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cookie Types Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              2. Types of Cookies We Use
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {cookieTypes.map((type, index) => {
                const colors = getColorClasses(type.color)
                const IconComponent = type.icon
                
                return (
                  <div key={index} className={`bg-white ${colors.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {type.title}
                        </h3>
                        <p className="text-gray-700 mb-3">
                          {type.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Example:</strong> {type.example}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.slice(1).map((section, index) => {
            const colors = getColorClasses(section.color)
            const IconComponent = section.icon
            
            return (
              <div key={index + 1} className={`${colors.bg} ${colors.border} border rounded-2xl p-8`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Mail className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">7. Contact Us</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white/90 mb-6">
                If you have any questions about our Cookie Policy:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5 text-white" />
                  <a 
                    href="mailto:support@trimora.com" 
                    className="text-white hover:text-white/80 font-medium transition-colors"
                  >
                    support@trimora.com
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="w-5 h-5 text-white" />
                  <span className="text-white">
                    Trimora HQ – Garhwa, Jharkhand, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
