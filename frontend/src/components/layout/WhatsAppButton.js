import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const WhatsAppButton = () => {
  const { settings } = useSettings();

  const handleClick = () => {
    const phoneNumber = settings?.whatsapp_number || '6281234567890';
    const message = settings?.whatsapp_message || `Hello${settings?.site_name ? ' ' + settings.site_name : ''}! I'm interested in your services.`;
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
