import { ArrowLeft, Info, AlertTriangle, ExternalLink, User, Heart, DollarSign, Copyright, RefreshCw, Shield, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Disclaimer() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "General Information",
      icon: Info,
      color: "blue",
      content: (
        <div>
          <p>This website/app ("Trimora" or "we") is intended to provide general information, guidance, and services. The content provided here should not be considered professional, medical, financial, legal, or any other specialized advice. Before taking any action based on the information provided, you should consult a qualified professional.</p>
        </div>
      )
    },
    {
      title: "Accuracy and Completeness",
      icon: AlertTriangle,
      color: "orange",
      content: (
        <div>
          <p>We strive to ensure that the information on this website/app is accurate, complete, and up-to-date. However, we do not guarantee that all information is always correct, reliable, or current. We are not responsible for any errors, omissions, or outdated content.</p>
        </div>
      )
    },
    {
      title: "Third-Party Links and Services",
      icon: ExternalLink,
      color: "purple",
      content: (
        <div>
          <p>This website/app may include links to third-party websites, advertisements, or services. These links are provided for your convenience only. We are not responsible for the content, privacy practices, or terms of third-party websites or services.</p>
        </div>
      )
    },
    {
      title: "User Responsibility",
      icon: User,
      color: "red",
      content: (
        <div>
          <p>Use of this website/app is entirely at your own risk. We are not liable for any direct, indirect, incidental, special, or consequential losses, damages, or inconveniences arising from your use of the website/app.</p>
        </div>
      )
    },
    {
      title: "Medical and Health-Related Content",
      icon: Heart,
      color: "green",
      content: (
        <div>
          <p>Any health, wellness, or medical-related content on this website/app is for informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult a licensed doctor or healthcare professional for medical decisions.</p>
        </div>
      )
    },
    {
      title: "Business and Financial Advice",
      icon: DollarSign,
      color: "emerald",
      content: (
        <div>
          <p>Business, investment, or financial-related content on this website/app is for informational purposes and does not constitute personalized professional advice. Always consult a certified expert before making any business or financial decisions.</p>
        </div>
      )
    },
    {
      title: "Intellectual Property",
      icon: Copyright,
      color: "indigo",
      content: (
        <div>
          <p>All content, design, logos, images, and trademarks on this website/app are the property of Trimora. Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
        </div>
      )
    },
    {
      title: "Changes to Content and Disclaimer",
      icon: RefreshCw,
      color: "teal",
      content: (
        <div>
          <p>We reserve the right to modify, update, or remove content and this disclaimer at any time without prior notice. Regular review of this disclaimer is your responsibility.</p>
        </div>
      )
    },
    {
      title: "Limitation of Liability",
      icon: Shield,
      color: "pink",
      content: (
        <div>
          <p>By using this website/app, you accept all risks associated with its use. We are not responsible for any losses, damages, or inconveniences—whether direct or indirect—arising from your reliance on or use of the content.</p>
        </div>
      )
    },
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      color: "gray",
      content: (
        <div>
          <p>By using this website/app, you acknowledge that you have read, understood, and agreed to this disclaimer and the Terms & Conditions. If you do not agree with these terms, you should stop using the website/app immediately.</p>
        </div>
      )
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", iconBg: "bg-blue-100" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-600", iconBg: "bg-orange-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", iconBg: "bg-purple-100" },
      red: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-600", iconBg: "bg-red-100" },
      green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600", iconBg: "bg-green-100" },
      emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", iconBg: "bg-emerald-100" },
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600", iconBg: "bg-indigo-100" },
      teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600", iconBg: "bg-teal-100" },
      pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600", iconBg: "bg-pink-100" },
      gray: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-600", iconBg: "bg-gray-100" }
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
            Disclaimer
          </h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-semibold text-yellow-800">Important Notice</h2>
            </div>
            <p className="text-yellow-700">
              Please read this disclaimer carefully before using our platform. By continuing to use Trimora, you acknowledge and accept these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Sections */}
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

      {/* Final Notice */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Legal Notice</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white leading-relaxed">
                This disclaimer is an integral part of our Terms & Conditions. Your continued use of Trimora constitutes acceptance of all terms outlined above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
