import { whatsAppLink } from '../lib/whatsapp';

/** Floating WhatsApp button, present on every page. */
export function WhatsAppButton(): React.ReactNode {
  return (
    <a
      href={whatsAppLink('Hi, I have a question about CCTV installation.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-2xl text-white shadow-lg transition hover:bg-accent-600 md:bottom-6"
    >
      <span aria-hidden>💬</span>
    </a>
  );
}
