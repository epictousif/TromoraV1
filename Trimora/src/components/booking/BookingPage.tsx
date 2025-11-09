import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FreshaBookingFlow from './FreshaBookingFlow';

const BookingPage: React.FC = () => {
  const { salonId } = useParams<{ salonId: string }>();
  const navigate = useNavigate();

  if (!salonId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Salon</h2>
          <p className="text-gray-600 mb-4">Please select a salon to book an appointment.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <FreshaBookingFlow 
      salonId={salonId} 
      onClose={() => navigate('/')}
    />
  );
};

export default BookingPage;
