import { ArrowLeft, UserPlus, Settings, Calendar, CreditCard, Wrench, MessageSquare, Mail, Phone, MessageCircle, Clock, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function PartnerSupport() {
  const navigate = useNavigate()

  const supportServices = [
    {
      title: "Account Setup",
      icon: UserPlus,
      color: "blue",
      description: "Assistance with registering your salon, verifying documents, and setting up your profile."
    },
    {
      title: "Managing Services & Staff",
      icon: Settings,
      color: "green",
      description: "Guidance on adding or updating services, pricing, and employee details."
    },
    {
      title: "Booking Management",
      icon: Calendar,
      color: "purple",
      description: "Support for managing bookings, cancellations, rescheduling, and customer communications."
    },
    {
      title: "Payments & Transactions",
      icon: CreditCard,
      color: "red",
      description: "Help with payment settlements, refunds, or transaction-related queries."
    },
    {
      title: "Technical Support",
      icon: Wrench,
      color: "orange",
      description: "Assistance for app or website issues, login problems, or dashboard errors."
    },
    {
      title: "Feedback & Improvement",
      icon: MessageSquare,
      color: "teal",
      description: "We welcome your suggestions and help resolve any concerns to improve your experience on Trimora."
    }
  ]

  const contactMethods = [
    {
      title: "Email Support",
      icon: Mail,
      color: "blue",
      contact: "partnersupport@trimora.com",
      description: "Send us detailed queries and we'll respond promptly",
      href: "mailto:partnersupport@trimora.com"
    },
    {
      title: "Phone/WhatsApp",
      icon: Phone,
      color: "green",
      contact: "+91-XXXXXXXXXX",
      description: "Call or message us for immediate assistance",
      href: "tel:+91XXXXXXXXXX"
    },
    {
      title: "Live Chat",
      icon: MessageCircle,
      color: "purple",
      contact: "Available on partner dashboard",
      description: "9:00 AM to 9:00 PM (Monday to Sunday)",
      href: "#"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100" },
      green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100" },
      red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", iconBg: "bg-red-100" },
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-12 h-12 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Partner Support
            </h1>
          </div>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            At Trimora, we value our salon partners and aim to provide seamless support to help your business grow. Our Partner Support team is here to assist you with any queries, technical issues, or guidance related to using the Trimora platform.
          </p>
        </div>
      </div>

      {/* How We Can Help Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How We Can Help:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {supportServices.map((service, index) => {
              const colors = getColorClasses(service.color)
              const IconComponent = service.icon
              
              return (
                <div key={index} className={`${colors.bg} ${colors.border} border rounded-2xl p-6 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contact Methods Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Contact Partner Support:
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => {
                const colors = getColorClasses(method.color)
                const IconComponent = method.icon
                
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="text-center">
                      <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <a 
                        href={method.href}
                        className={`text-lg font-semibold ${colors.icon} hover:opacity-80 transition-opacity block mb-2`}
                      >
                        {method.contact}
                      </a>
                      <p className="text-gray-600 text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Response Commitment */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Our Commitment</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white leading-relaxed">
                We strive to respond to all partner queries promptly to ensure your salon operations run smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
