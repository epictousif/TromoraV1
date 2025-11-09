import React from 'react';
import { MessageCircle, CheckCircle, Calendar, Clock, User, Phone, MapPin } from 'lucide-react';

interface BookingDetails {
  id: string;
  userName: string;
  userPhone: string;
  serviceName: string;
  salonName: string;
  salonPhone?: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking }) => {
  
  const generateWhatsAppLink = () => {
    const message = `🎉 *Booking Confirmation - Trimora*

Hello! My booking has been confirmed with the following details:

👤 *Customer:* ${booking.userName}
📞 *Phone:* ${booking.userPhone}
💇 *Service:* ${booking.serviceName}
🏪 *Salon:* ${booking.salonName}
📅 *Date:* ${new Date(booking.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
⏰ *Time:* ${booking.time}
⏱️ *Duration:* ${booking.duration} minutes
💰 *Amount:* ₹${booking.price}
🆔 *Booking ID:* ${booking.id}

Thank you for the confirmation! Looking forward to my appointment.

*Booked via Trimora App* 📱`;

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // Use salon phone number if available, otherwise use a general WhatsApp link
    const phoneNumber = booking.salonPhone ? booking.salonPhone.replace(/[^0-9]/g, '') : '';
    
    // WhatsApp click-to-chat URL format
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = generateWhatsAppLink();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your appointment has been successfully booked</p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium text-gray-900">{booking.userName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{booking.userPhone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Salon</p>
              <p className="font-medium text-gray-900">{booking.salonName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-900">{formatDate(booking.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-gray-900">{booking.time}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">₹</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-gray-900">₹{booking.price}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-500">Service</p>
          <p className="font-medium text-gray-900">{booking.serviceName}</p>
          <p className="text-sm text-gray-500 mt-1">Duration: {booking.duration} minutes</p>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-500">Booking ID</p>
          <p className="font-mono text-sm font-medium text-gray-900">{booking.id}</p>
        </div>
      </div>

      {/* WhatsApp Button */}
      <div className="text-center">
        <button
          onClick={handleWhatsAppClick}
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <MessageCircle className="w-5 h-5" />
          Send WhatsApp Confirmation
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Click to send booking details via WhatsApp
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">Important Notes:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Please arrive 10 minutes before your appointment time</li>
          <li>• Bring a valid ID for verification</li>
          <li>• Contact the salon directly for any changes or cancellations</li>
          <li>• Your booking confirmation has been sent to your registered email</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingConfirmation;
