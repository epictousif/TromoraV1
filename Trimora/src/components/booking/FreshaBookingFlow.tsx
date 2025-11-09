import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServiceSelection from './ServiceSelection';
import ProfessionalSelection from './ProfessionalSelection';
import DateTimeSelection from './DateTimeSelection';
import PaymentSelection from './PaymentSelection';
import BookingConfirmation from './BookingConfirmation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}

interface FreshaBookingFlowProps {
  salonId: string;
  onClose?: () => void;
}

type BookingStep = 'services' | 'professional' | 'datetime' | 'payment' | 'confirmation';

const FreshaBookingFlow: React.FC<FreshaBookingFlowProps> = ({ salonId, onClose }) => {
  const { token, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  const [selectedServices, setSelectedServices] = useState<CartItem[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check authentication when trying to proceed to payment
  useEffect(() => {
    if (currentStep === 'payment' && !loading && !token) {
      setShowLoginPrompt(true);
    }
  }, [currentStep, loading, token]);

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + (service.price * service.quantity), 0);
  };

  const requireAuth = () => {
    if (!token) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  const handleServicesContinue = (services: CartItem[]) => {
    setSelectedServices(services);
    setCurrentStep('professional');
  };

  const handleProfessionalContinue = (professionalId: string | null) => {
    setSelectedProfessional(professionalId);
    setCurrentStep('datetime');
  };

  const handleDateTimeContinue = (date: string, time: string) => {
    if (!requireAuth()) return;
    
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep('payment');
  };

  const handlePaymentContinue = async (method: string) => {
    setPaymentMethod(method);
    setIsCreatingBooking(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to continue booking');
        return;
      }

      const bookingData = {
        salonId,
        services: selectedServices.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration
        })),
        professionalId: selectedProfessional,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        paymentMethod: method,
        notes: ''
      };

      const response = await fetch('http://localhost:3000/api/v1/fresha/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setBookingId(data.booking.id);
        setCurrentStep('confirmation');
      } else {
        alert(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleNewBooking = () => {
    setCurrentStep('services');
    setSelectedServices([]);
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setPaymentMethod('');
    setBookingId('');
  };

  const handleBackToServices = () => {
    setCurrentStep('services');
  };

  const handleBackToProfessional = () => {
    setCurrentStep('professional');
  };

  const handleBackToDateTime = () => {
    setCurrentStep('datetime');
  };

  if (isCreatingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Booking...</h2>
          <p className="text-gray-600">Please wait while we confirm your appointment</p>
        </div>
      </div>
    );
  }

  // Login prompt modal
  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please login to continue with your booking. We need to verify your identity to confirm your appointment.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login / Sign Up
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${currentStep === 'services' ? 'text-blue-600' : selectedServices.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'services' ? 'bg-blue-600 text-white' : 
                  selectedServices.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Services</span>
              </div>
              
              <div className={`w-8 h-0.5 ${selectedServices.length > 0 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'professional' ? 'text-blue-600' : selectedProfessional !== null ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'professional' ? 'bg-blue-600 text-white' : 
                  selectedProfessional !== null ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Professional</span>
              </div>
              
              <div className={`w-8 h-0.5 ${selectedDate && selectedTime ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'datetime' ? 'text-blue-600' : selectedDate && selectedTime ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'datetime' ? 'bg-blue-600 text-white' : 
                  selectedDate && selectedTime ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Date & Time</span>
              </div>
              
              <div className={`w-8 h-0.5 ${paymentMethod ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-blue-600' : paymentMethod ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === 'payment' ? 'bg-blue-600 text-white' : 
                  paymentMethod ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  4
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {!token && (
                <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Login required for booking
                </div>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'services' && (
        <ServiceSelection
          salonId={salonId}
          onContinue={handleServicesContinue}
        />
      )}

      {currentStep === 'professional' && (
        <ProfessionalSelection
          salonId={salonId}
          onContinue={handleProfessionalContinue}
          onBack={handleBackToServices}
        />
      )}

      {currentStep === 'datetime' && (
        <DateTimeSelection
          salonId={salonId}
          professionalId={selectedProfessional}
          onContinue={handleDateTimeContinue}
          onBack={handleBackToProfessional}
        />
      )}

      {currentStep === 'payment' && (
        <PaymentSelection
          selectedServices={selectedServices}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          professionalId={selectedProfessional}
          totalPrice={getTotalPrice()}
          onContinue={handlePaymentContinue}
          onBack={handleBackToDateTime}
        />
      )}

      {currentStep === 'confirmation' && (
        <BookingConfirmation
          bookingId={bookingId}
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  );
};

export default FreshaBookingFlow;
