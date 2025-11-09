import { ArrowLeft, Mail, Users, CreditCard, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSection {
  title: string
  icon: React.ElementType
  color: string
  items: FAQItem[]
}

export default function FAQ() {
  const navigate = useNavigate()
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const faqSections: FAQSection[] = [
    {
      title: "Customers",
      icon: Users,
      color: "blue",
      items: [
        {
          question: "What is Trimora?",
          answer: "Trimora is a salon & wellness booking platform for Tier-2 and Tier-3 cities. It helps you discover verified salons, spas, and wellness centers and book your time slot in advance."
        },
        {
          question: "How do I book a service?",
          answer: "Open the Trimora app → Choose your city → Browse salons/wellness centers → Select a service → Pick your time slot → Confirm booking."
        },
        {
          question: "Do I need to pay online?",
          answer: "You can choose between Pay Online or Pay at Salon options."
        },
        {
          question: "Can I cancel or reschedule my booking?",
          answer: "Yes. You can easily cancel or reschedule from the app. Note: Cancellation policies may vary by salon."
        }
      ]
    },
    {
      title: "Salon & Wellness Partners",
      icon: HelpCircle,
      color: "green",
      items: [
        {
          question: "How do I list my salon or wellness center on Trimora?",
          answer: "Go to the \"Partner with Us\" section and register your business. Our team will verify your details and get you onboard."
        },
        {
          question: "Is there any fee for registration?",
          answer: "Currently, onboarding is free for early partners. Premium features may be introduced later."
        },
        {
          question: "How will Trimora help my business grow?",
          answer: "• Get discovered by more customers\n• Manage appointments digitally\n• Build trust with transparent pricing\n• Reduce no-shows and waiting lines"
        }
      ]
    },
    {
      title: "Payments & Pricing",
      icon: CreditCard,
      color: "purple",
      items: [
        {
          question: "Are prices fixed?",
          answer: "Yes, all services listed on Trimora show transparent pricing. No hidden charges."
        },
        {
          question: "What payment options are available?",
          answer: "We support UPI, debit/credit cards, wallets, and cash at salon."
        }
      ]
    },
    {
      title: "General",
      icon: Mail,
      color: "red",
      items: [
        {
          question: "Which cities does Trimora serve?",
          answer: "We are starting with Garhwa & Ranchi and will expand to more Tier-2 & Tier-3 cities soon."
        },
        {
          question: "How do I contact Trimora?",
          answer: "📧 support@trimora.com (customers)\n📧 partners@trimora.com (salon & wellness businesses)"
        }
      ]
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        iconBg: "bg-blue-100",
        text: "text-blue-700"
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "text-green-600",
        iconBg: "bg-green-100",
        text: "text-green-700"
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        icon: "text-purple-600",
        iconBg: "bg-purple-100",
        text: "text-purple-700"
      },
      red: {
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "text-red-600",
        iconBg: "bg-red-100",
        text: "text-red-700"
      }
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
            Frequently Asked Questions (FAQ) – Trimora
          </h1>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-12">
            <p className="text-lg">
              Didn't find what you're looking for? 👉 <a href="/contact" className="underline hover:no-underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {faqSections.map((section, sectionIndex) => {
            const colors = getColorClasses(section.color)
            const IconComponent = section.icon
            
            return (
              <div key={section.title} className={`${colors.bg} ${colors.border} border rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${colors.text}`}>
                    🔹 {section.title}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => {
                    const isOpen = openItems[`${sectionIndex}-${itemIndex}`]
                    
                    return (
                      <div key={itemIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => toggleItem(sectionIndex, itemIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-4">
                            Q{sectionIndex * 10 + itemIndex + 1}. {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 text-lg">
              👉 This FAQ will be regularly updated as we grow and add new features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
