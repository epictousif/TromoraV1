import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Phone, IndianRupee, MessageCircle, Share2 } from 'lucide-react';

interface BookingDetails {
  bookingId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  salon: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  services: Array<{
    name: string;
    price: number;
    durationMinutes: number;
  }>;
  totalPrice: number;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface BookingConfirmationProps {
  bookingId: string;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingId, onNewBooking }) => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/fresha/confirmation/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setBooking(data.booking);
      } else {
        setError('Failed to load booking details');
      }
    } catch (err) {
      setError('Failed to load booking details');
      console.error('Error fetching booking details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    if (!booking) return 0;
    return booking.services.reduce((total, service) => total + service.durationMinutes, 0);
  };

  const generateWhatsAppMessage = () => {
    if (!booking) return '';
    
    const message = `🎉 *Booking Confirmed!*

📅 *Appointment Details:*
• Booking ID: ${booking.bookingId}
• Date: ${formatDate(booking.appointmentTime)}
• Time: ${formatTime(booking.appointmentTime)}
• Duration: ${formatDuration(getTotalDuration())}

💇‍♂️ *Services:*
${booking.services.map(service => `• ${service.name} - ₹${service.price}`).join('\n')}

💰 *Total: ₹${booking.totalPrice}*

🏪 *Salon Details:*
• ${booking.salon.name}
• ${booking.salon.address}, ${booking.salon.city}
• Phone: ${booking.salon.phone}

👤 *Customer:*
• ${booking.customer.name}
• ${booking.customer.phone}

Looking forward to serving you! 💫`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppShare = () => {
    if (!booking) return;
    
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${booking.salon.phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSMSShare = () => {
    if (!booking) return;
    
    const message = `Booking Confirmed! ID: ${booking.bookingId}, Date: ${formatDate(booking.appointmentTime)}, Time: ${formatTime(booking.appointmentTime)}, Salon: ${booking.salon.name}`;
    const smsUrl = `sms:${booking.salon.phone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <button
            onClick={onNewBooking}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Make New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your appointment has been successfully booked. We've sent you a confirmation.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          {/* Booking ID */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Booking ID</p>
            <p className="text-xl font-bold text-blue-900">{booking.bookingId}</p>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(booking.appointmentTime)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{formatTime(booking.appointmentTime)}</p>
              </div>
            </div>
          </div>

          {/* Salon Info */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Salon</p>
                <p className="font-semibold">{booking.salon.name}</p>
                <p className="text-gray-600">{booking.salon.address}, {booking.salon.city}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-semibold">{booking.salon.phone}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
            <div className="space-y-3">
              {booking.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{formatDuration(service.durationMinutes)}</p>
                  </div>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="w-4 h-4" />
                    {service.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Total Amount</p>
                <p className="text-sm text-gray-600">Duration: {formatDuration(getTotalDuration())}</p>
              </div>
              <p className="text-2xl font-bold flex items-center">
                <IndianRupee className="w-6 h-6" />
                {booking.totalPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Share on WhatsApp
          </button>

          {/* SMS Share */}
          <button
            onClick={handleSMSShare}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Send SMS
          </button>

          {/* New Booking */}
          <button
            onClick={onNewBooking}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Make Another Booking
          </button>
        </div>

        {/* Important Notes */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Please arrive 10 minutes before your appointment time</li>
            <li>• Bring a valid ID for verification</li>
            <li>• Contact the salon if you need to reschedule or cancel</li>
            <li>• Payment can be made at the salon if you chose "Pay at Salon"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
