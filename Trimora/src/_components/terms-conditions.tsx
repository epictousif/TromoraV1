import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle, Scale, Mail, MapPin, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function TermsConditions() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "1. Definitions",
      icon: BookOpen,
      color: "blue",
      content: (
        <div>
          <ul className="space-y-2">
            <li><strong>"Trimora" / "We" / "Us"</strong> – refers to our salon & wellness booking platform.</li>
            <li><strong>"User" / "You"</strong> – anyone who uses Trimora services.</li>
            <li><strong>"Partner"</strong> – salons, spas, and wellness professionals listed on Trimora.</li>
          </ul>
        </div>
      )
    },
    {
      title: "2. Our Services",
      icon: Users,
      color: "green",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Trimora provides an online platform to book salon and wellness services.</li>
            <li>We connect users with verified partners but do not directly provide salon/wellness services.</li>
            <li>Service quality, pricing, and availability are the responsibility of the respective partners.</li>
          </ul>
        </div>
      )
    },
    {
      title: "3. User Responsibilities",
      icon: Shield,
      color: "purple",
      content: (
        <div>
          <ul className="space-y-2">
            <li>You must provide accurate information while signing up.</li>
            <li>You are responsible for maintaining your account and password security.</li>
            <li>You agree not to misuse our platform for fraudulent or illegal purposes.</li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Bookings & Payments",
      icon: CreditCard,
      color: "red",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Bookings made through Trimora are subject to partner acceptance.</li>
            <li>Payments can be made via online methods or at the salon (depending on partner).</li>
            <li>Any cancellation or refund policies will be displayed at the time of booking.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Partner Responsibilities",
      icon: Users,
      color: "indigo",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Partners must provide services as described on the Trimora platform.</li>
            <li>Partners are responsible for maintaining service quality, safety, and hygiene.</li>
            <li>Trimora is not liable for any dispute between the user and the partner.</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. Cancellations & Refunds",
      icon: AlertTriangle,
      color: "orange",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Cancellation policies vary by partner. Please check before booking.</li>
            <li>If eligible, refunds will be processed within 7-10 working days.</li>
          </ul>
        </div>
      )
    },
    {
      title: "7. Limitation of Liability",
      icon: Shield,
      color: "teal",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Trimora acts as a technology platform and is not responsible for direct service delivery.</li>
            <li>We are not liable for service dissatisfaction, injury, or loss caused by a partner.</li>
            <li>Our maximum liability is limited to the booking amount paid through the platform.</li>
          </ul>
        </div>
      )
    },
    {
      title: "8. Intellectual Property",
      icon: FileText,
      color: "pink",
      content: (
        <div>
          <ul className="space-y-2">
            <li>All logos, content, and designs on Trimora are our property.</li>
            <li>You may not copy, distribute, or use them without our written consent.</li>
          </ul>
        </div>
      )
    },
    {
      title: "9. Termination",
      icon: AlertTriangle,
      color: "gray",
      content: (
        <div>
          <ul className="space-y-2">
            <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
            <li>Users may deactivate their accounts anytime by contacting support.</li>
          </ul>
        </div>
      )
    },
    {
      title: "10. Governing Law",
      icon: Scale,
      color: "emerald",
      content: (
        <div>
          <p>These Terms & Conditions are governed by the laws of India. Any disputes shall be resolved under the jurisdiction of Jharkhand courts.</p>
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
      teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600", iconBg: "bg-teal-100" },
      pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600", iconBg: "bg-pink-100" },
      gray: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600", iconBg: "bg-gray-100" },
      emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", iconBg: "bg-emerald-100" }
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
            Terms & Conditions – Trimora
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            Welcome to Trimora! By accessing or using our app/website, you agree to these Terms & Conditions. Please read them carefully.
          </p>
        </div>
      </div>

      {/* Terms Sections */}
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
              <h2 className="text-3xl font-bold text-white">11. Contact Us</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white/90 mb-6">
                For queries or complaints:
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
