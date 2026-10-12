const DEFAULT_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '15551234567';

/** Builds a WhatsApp click-to-chat link with a prefilled message. */
export function whatsAppLink(message: string, number = DEFAULT_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
