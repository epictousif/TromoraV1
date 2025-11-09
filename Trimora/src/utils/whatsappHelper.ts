import { BookingDetails } from '../services/bookingService';

export const generateBookingWhatsAppMessage = (booking: BookingDetails): string => {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `🎉 *Booking Confirmation - Trimora*

Hello! My booking has been confirmed with the following details:

👤 *Customer:* ${booking.userName}
📞 *Phone:* ${booking.userPhone}
💇 *Service:* ${booking.serviceName}
🏪 *Salon:* ${booking.salonName}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${booking.time}
⏱️ *Duration:* ${booking.duration} minutes
💰 *Amount:* ₹${booking.price}
🆔 *Booking ID:* ${booking.id}

${booking.notes ? `📝 *Notes:* ${booking.notes}\n\n` : ''}Thank you for the confirmation! Looking forward to my appointment.

*Booked via Trimora App* 📱`;
};

export const generateWhatsAppLink = (phoneNumber: string = '', message: string): string => {
  // Clean phone number (remove non-digits)
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // URL encode the message
  const encodedMessage = encodeURIComponent(message);
  
  // WhatsApp click-to-chat URL format
  return cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;
};

export const openWhatsApp = (phoneNumber: string = '', message: string): void => {
  const whatsappUrl = generateWhatsAppLink(phoneNumber, message);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
