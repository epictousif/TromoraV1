import React, { useState } from 'react';
import { CreditCard, Wallet, IndianRupee, Shield, Clock } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
}

interface PaymentSelectionProps {
  selectedServices: CartItem[];
  selectedDate: string;
  selectedTime: string;
  professionalId: string | null;
  totalPrice: number;
  onContinue: (paymentMethod: string) => void;
  onBack: () => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({
  selectedServices,
  selectedDate,
  selectedTime,
  professionalId: _,
  totalPrice,
  onContinue,
  onBack
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + (service.duration * service.quantity), 0);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleContinue = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onContinue(selectedPaymentMethod);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Date & Time
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Payment Options</h2>
            <p className="text-gray-600 mt-2">
              Choose how you'd like to pay for your appointment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              
              <div className="space-y-4">
                {/* Pay at Salon */}
                <div
                  onClick={() => handlePaymentMethodSelect('pay_at_salon')}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'pay_at_salon'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">Pay at Salon</h4>
                      <p className="text-gray-600">Pay when you arrive at the salon</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          No advance payment required
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Cash or Card accepted
                        </span>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'pay_at_salon' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pay Online */}
                <div
                  onClick={() => handlePaymentMethodSelect('pay_online')}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'pay_online'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">Pay Online</h4>
                      <p className="text-gray-600">Secure online payment with card or UPI</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          100% Secure
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                          ✓ Instant confirmation
                        </span>
                        <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          5% Discount
                        </span>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'pay_online' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Security Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                </p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                {/* Appointment Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} at {formatTime(selectedTime)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(getTotalDuration())}
                    </p>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Services</p>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{service.name}</p>
                          {service.quantity > 1 && (
                            <p className="text-xs text-gray-600">Qty: {service.quantity}</p>
                          )}
                        </div>
                        <p className="font-medium flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {service.price * service.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {totalPrice}
                    </span>
                  </div>
                  
                  {selectedPaymentMethod === 'pay_online' && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>Online Discount (5%)</span>
                      <span className="flex items-center">
                        -<IndianRupee className="w-4 h-4" />
                        {Math.round(totalPrice * 0.05)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {selectedPaymentMethod === 'pay_online' 
                        ? Math.round(totalPrice * 0.95) 
                        : totalPrice
                      }
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!selectedPaymentMethod || isProcessing}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    selectedPaymentMethod && !isProcessing
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : selectedPaymentMethod === 'pay_online' ? (
                    'Proceed to Payment'
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
