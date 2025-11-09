import { ArrowLeft, Shield, Database, Users, Lock, Eye, Cookie, Mail, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      color: "blue",
      content: (
        <div>
          <p className="mb-4">When you use Trimora, we may collect the following types of information:</p>
          <ul className="space-y-2 ml-4">
            <li><strong>Personal Information:</strong> Name, phone number, email address, gender, and payment details.</li>
            <li><strong>Identity Information (for salon partners):</strong> Aadhaar, PAN, or business registration documents.</li>
            <li><strong>Usage Data:</strong> Device type, IP address, app usage patterns, and booking history.</li>
          </ul>
        </div>
      )
    },
    {
      title: "2. How We Use Your Information",
      icon: Users,
      color: "green",
      content: (
        <div>
          <p className="mb-4">We use your information to:</p>
          <ul className="space-y-2 ml-4">
            <li>Process bookings and payments.</li>
            <li>Connect you with verified salons and wellness professionals.</li>
            <li>Provide personalized offers, reminders, and recommendations.</li>
            <li>Improve our services and app experience.</li>
            <li>Ensure safety, fraud prevention, and compliance with the law.</li>
          </ul>
        </div>
      )
    },
    {
      title: "3. Sharing of Information",
      icon: Users,
      color: "purple",
      content: (
        <div>
          <p className="mb-4">We may share your information only in these cases:</p>
          <ul className="space-y-2 ml-4">
            <li>With salon and wellness partners to fulfill your booking.</li>
            <li>With trusted third-party service providers (e.g., payment gateways, SMS/email providers).</li>
            <li>When required by law or regulatory authorities.</li>
          </ul>
          <p className="mt-4 font-semibold text-purple-700">We never sell your personal data to advertisers.</p>
        </div>
      )
    },
    {
      title: "4. Data Security",
      icon: Lock,
      color: "red",
      content: (
        <div>
          <p>We use industry-standard encryption and security measures to protect your data. However, no system is 100% secure, so we encourage you to use strong passwords and keep your account safe.</p>
        </div>
      )
    },
    {
      title: "5. Your Rights",
      icon: Eye,
      color: "indigo",
      content: (
        <div>
          <p className="mb-4">You can:</p>
          <ul className="space-y-2 ml-4">
            <li>Access and update your personal information.</li>
            <li>Request deletion of your account.</li>
            <li>Opt-out of promotional communications at any time.</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. Cookies & Tracking",
      icon: Cookie,
      color: "orange",
      content: (
        <div>
          <p>We use cookies and similar technologies to enhance your experience, such as remembering preferences and analyzing app performance.</p>
        </div>
      )
    },
    {
      title: "7. Changes to this Policy",
      icon: Shield,
      color: "teal",
      content: (
        <div>
          <p>We may update this Privacy Policy from time to time. Any changes will be notified via email or app notification.</p>
        </div>
      )
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100" },
      green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100" },
      red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", iconBg: "bg-red-100" },
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600", iconBg: "bg-indigo-100" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", iconBg: "bg-orange-100" },
      teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600", iconBg: "bg-teal-100" }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
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
            Privacy Policy – Trimora
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            At Trimora, your privacy and trust are our top priorities. This Privacy Policy explains how we collect, use, protect, and share your information when you use our salon and wellness booking platform.
          </p>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => {
            const colors = getColorClasses(section.color)
            const IconComponent = section.icon
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-2xl p-8`}>
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
              <h2 className="text-3xl font-bold text-white">Contact Us</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white/90 mb-6">
                If you have any questions or concerns about this Privacy Policy, please contact us:
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
