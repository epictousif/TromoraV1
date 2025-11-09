import { useState, useEffect } from 'react'
import { HomeSalonSections } from '../components/HomeSalonSections'

// Salon type definition
interface Salon {
  _id: string
  name: string
  image: string | string[]
  location: {
    city: string
    state: string
  }
  rating: number
}

export function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [sections, setSections] = useState({
    recommended: [],
    trending: [],
    newSalons: [],
    recent: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHomeSalons()
  }, [])

  const fetchHomeSalons = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/home-salons')
      
      if (!response.ok) {
        throw new Error('Failed to fetch salons')
      }
      
      const data = await response.json()
      setSalons(data.salons || [])
      
      // Set sections if available
      if (data.sections) {
        setSections(data.sections)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load salons')
      console.error('Error fetching home salons:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading salons...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchHomeSalons}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Salons
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book appointments at the best salons in your city
          </p>
        </div>

        {/* Salon Sections */}
        <HomeSalonSections
          recommended={sections.recommended.length > 0 ? sections.recommended : salons}
          trending={sections.trending.length > 0 ? sections.trending : salons}
          newSalons={sections.newSalons.length > 0 ? sections.newSalons : salons}
          recent={sections.recent.length > 0 ? sections.recent : []}
        />
      </div>
    </div>
  )
}

export default HomePage
