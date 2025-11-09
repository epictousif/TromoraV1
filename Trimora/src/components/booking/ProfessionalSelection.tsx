import React, { useState, useEffect } from 'react';
import { User, Star, Award, Clock } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  profileImage?: string;
  rating: number;
  experience: number;
  specialization: string[];
  totalBookings: number;
}

interface ProfessionalSelectionProps {
  salonId: string;
  onContinue: (professionalId: string | null) => void;
  onBack: () => void;
}

const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  salonId,
  onContinue,
  onBack
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfessionals();
  }, [salonId]);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/v1/fresha/salon/${salonId}/professionals`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setProfessionals(data.professionals);
      } else {
        setError('Failed to load professionals');
      }
    } catch (err) {
      setError('Failed to load professionals');
      console.error('Error fetching professionals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
  };

  const handleAnyProfessional = () => {
    setSelectedProfessional('any');
  };

  const handleContinue = () => {
    onContinue(selectedProfessional === 'any' ? null : selectedProfessional);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading professionals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfessionals}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Services
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Choose Professional</h2>
            <p className="text-gray-600 mt-2">
              Select a professional or let us assign the best available one for you
            </p>
          </div>

          {/* Any Professional Option */}
          <div className="mb-6">
            <div
              onClick={handleAnyProfessional}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProfessional === 'any'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Any Professional</h3>
                  <p className="text-gray-600">
                    We'll assign the best available professional for your appointment
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Fastest booking
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Best availability
                    </span>
                  </div>
                </div>
                {selectedProfessional === 'any' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Individual Professionals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Or choose a specific professional:
            </h3>
            
            {professionals.map((professional) => (
              <div
                key={professional.id}
                onClick={() => handleProfessionalSelect(professional.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProfessional === professional.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={professional.profileImage || '/default-avatar.png'}
                      alt={professional.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {professional.rating >= 4.5 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {professional.name}
                    </h4>
                    
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{professional.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{professional.experience} years exp</span>
                      </div>
                      
                      <span className="text-sm text-gray-600">
                        {professional.totalBookings} bookings
                      </span>
                    </div>
                    
                    {professional.specialization.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {professional.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedProfessional === professional.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedProfessional}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedProfessional
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Date & Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSelection;
