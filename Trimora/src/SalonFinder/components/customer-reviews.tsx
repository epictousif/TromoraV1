import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Ranchi",
    rating: 5,
    comment: "Amazing experience! Booked my appointment through Trimora and got the best haircut. No waiting, transparent pricing. Highly recommended!",
    service: "Hair Styling"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    location: "Garhwa",
    rating: 5,
    comment: "Finally, a platform that connects us to quality salons in smaller cities. The booking process is so smooth and the salon was exactly as described.",
    service: "Beard Grooming"
  },
  {
    id: 3,
    name: "Anjali Singh",
    location: "Dhanbad",
    rating: 4,
    comment: "Love how easy it is to find verified salons near me. The reviews helped me choose the perfect spa for my facial treatment.",
    service: "Facial Treatment"
  },
  {
    id: 4,
    name: "Vikash Gupta",
    location: "Jamshedpur",
    rating: 5,
    comment: "Trimora has made salon booking so convenient! No more calling multiple places. Just book online and walk in at your time.",
    service: "Full Service"
  },
  {
    id: 5,
    name: "Sunita Devi",
    location: "Hazaribagh",
    rating: 5,
    comment: "As a working mother, Trimora saves me so much time. I can book appointments for the whole family in advance. Great service!",
    service: "Family Package"
  },
  {
    id: 6,
    name: "Amit Pandey",
    location: "Bokaro",
    rating: 4,
    comment: "The transparency in pricing and services is what I love most. No hidden charges, exactly what's promised. Keep it up Trimora!",
    service: "Hair Cut & Styling"
  }
]

export function CustomerReviews() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers across Tier-2 and Tier-3 cities who trust Trimora for their beauty and wellness needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
                {/* Rating Stars */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-600">({review.rating}.0)</span>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 mb-3 leading-relaxed text-sm line-clamp-3">
                  "{review.comment}"
                </p>

                {/* Service */}
                <div className="mb-3">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {review.service}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who trust Trimora
          </p>
          <a
            href="/auth"
            className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
          >
            Book Your Appointment Now
          </a>
        </div>
      </div>
    </div>
  )
}
