import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = '6281234567890'; // Replace with actual number
    const message = 'Hello Ellavera Beauty! I\'m interested in your cosmetic manufacturing services.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="whatsapp-float bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-colors"
      data-testid="whatsapp-button"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default WhatsAppButton;
