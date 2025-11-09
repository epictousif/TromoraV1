import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message: string;
  buttonText?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '',
  message,
  buttonText = 'Send WhatsApp Message',
  className = ''
}) => {
  const generateWhatsAppLink = () => {
    // Clean phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp click-to-chat URL format
    // If no phone number provided, opens WhatsApp with message ready to send
    return cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
  };

  const handleClick = () => {
    const whatsappUrl = generateWhatsAppLink();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      {buttonText}
    </button>
  );
};

export default WhatsAppButton;
