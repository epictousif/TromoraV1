import { ArrowLeft, RefreshCw, XCircle, Clock, CreditCard, AlertTriangle, MessageSquare, PinIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RefundPolicy() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "1. Booking Cancellations by Users",
      icon: XCircle,
      color: "blue",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Users may cancel bookings through the Trimora app before the scheduled service time.</li>
            <li>Each salon/wellness partner may have their own cancellation window (e.g., 2 hours or 24 hours before appointment). Please check at the time of booking.</li>
            <li>If you cancel within the allowed cancellation window, you may be eligible for a refund as per the partner's policy.</li>
          </ul>
        </div>
      )
    },
    {
      title: "2. Cancellations by Partners",
      icon: RefreshCw,
      color: "green",
      content: (
        <div>
          <ul className="space-y-2">
            <li>If a salon/wellness partner cancels your booking (due to unavailability or other reasons), you will receive a full refund of any advance amount paid.</li>
            <li>In such cases, Trimora may assist in rescheduling your appointment with the same or another partner.</li>
          </ul>
        </div>
      )
    },
    {
      title: "3. No-Show Policy",
      icon: Clock,
      color: "red",
      content: (
        <div>
          <p>If you fail to show up for your appointment without prior cancellation, the booking amount may be non-refundable.</p>
        </div>
      )
    },
    {
      title: "4. Refund Process",
      icon: CreditCard,
      color: "purple",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Eligible refunds will be initiated within 7–10 working days.</li>
            <li>Refunds will be processed to the original payment method (UPI, wallet, card, or net banking).</li>
            <li>In case of payment gateway delays, Trimora will not be responsible once the refund has been initiated.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Non-Refundable Services",
      icon: AlertTriangle,
      color: "orange",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Some promotional offers, discounts, or packages may be marked as non-refundable.</li>
            <li>Such terms will be clearly displayed at the time of booking.</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. Disputes",
      icon: MessageSquare,
      color: "indigo",
      content: (
        <div>
          <ul className="space-y-2">
            <li>Any disputes regarding cancellations or refunds should be reported to support@trimora.com within 48 hours of the scheduled appointment.</li>
            <li>Trimora will mediate between users and partners, but final service responsibility lies with the partner.</li>
          </ul>
        </div>
      )
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100" },
      green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100" },
      red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", iconBg: "bg-red-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", iconBg: "bg-orange-100" },
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600", iconBg: "bg-indigo-100" }
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
            Refund & Cancellation Policy – Trimora
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
            At Trimora, we value your trust. This Refund & Cancellation Policy explains how cancellations and refunds are handled for salon & wellness bookings.
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

      {/* Important Note Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <PinIcon className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Important Note</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white leading-relaxed">
                📌 Trimora is a booking platform and not the direct service provider. Refund eligibility depends on the partner's policies, but we will always try to ensure a smooth resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
