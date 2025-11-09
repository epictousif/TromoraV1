import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';

const BookingDemo: React.FC = () => {
  const navigate = useNavigate();

  // Sample salon data for demo
  const sampleSalons = [
    {
      id: '66b8f123456789abcdef0001',
      name: 'Cheveux Vuitton',
      address: 'Gopal Marketing Complex, Argora Chowk Rd, near Firayalal Next',
      city: 'Ranchi',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
      services: ['Hair Cut', 'Hair Wash', 'Beard Trim', 'Facial'],
      openTime: '09:00',
      closingTime: '22:00'
    },
    {
      id: '66b8f123456789abcdef0002',
      name: 'Elite Hair Studio',
      address: 'Main Road, Lalpur',
      city: 'Ranchi',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400',
      services: ['Hair Styling', 'Hair Coloring', 'Manicure', 'Pedicure'],
      openTime: '10:00',
      closingTime: '21:00'
    },
    {
      id: '66b8f123456789abcdef0003',
      name: 'Royal Cuts Salon',
      address: 'Circular Road, Ranchi',
      city: 'Ranchi',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
      services: ['Haircut', 'Shaving', 'Hair Treatment', 'Head Massage'],
      openTime: '08:00',
      closingTime: '20:00'
    }
  ];

  const handleBookNow = (salonId: string) => {
    navigate(`/book/${salonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fresha-Style Booking System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience seamless salon booking with our modern, step-by-step flow
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Selection</h3>
              <p className="text-sm text-gray-600">Browse and add services to your cart with live pricing</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Choice</h3>
              <p className="text-sm text-gray-600">Select your preferred professional or let us choose</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
              <p className="text-sm text-gray-600">Real-time availability with smart scheduling</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment & Confirm</h3>
              <p className="text-sm text-gray-600">Flexible payment options with WhatsApp integration</p>
            </div>
          </div>
        </div>

        {/* Sample Salons */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Try Booking at These Demo Salons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleSalons.map((salon) => (
              <div key={salon.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{salon.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{salon.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {salon.address}, {salon.city}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Popular Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {salon.services.slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                      {salon.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{salon.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {salon.openTime} - {salon.closingTime}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBookNow(salon.id)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Test the Booking System</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">Click "Book Now"</h4>
                <p className="text-gray-600">Start the booking flow by clicking on any salon above</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">Select Services</h4>
                <p className="text-gray-600">Browse available services and add them to your cart using the [+] button</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">Choose Professional</h4>
                <p className="text-gray-600">Select "Any Professional" or choose a specific one</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold text-gray-900">Pick Date & Time</h4>
                <p className="text-gray-600">Select your preferred appointment date and available time slot</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <h4 className="font-semibold text-gray-900">Payment & Confirmation</h4>
                <p className="text-gray-600">Choose payment method and get instant confirmation with WhatsApp sharing</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a demo system. You'll need to be logged in to complete bookings. 
              The backend requires actual salon data and services to be populated for full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDemo;
