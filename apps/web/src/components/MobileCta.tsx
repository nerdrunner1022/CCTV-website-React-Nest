import { Link } from 'react-router-dom';
import { whatsAppLink } from '../lib/whatsapp';

/** Sticky mobile call-to-action bar. */
export function MobileCta(): React.ReactNode {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white text-xs font-semibold md:hidden">
      <a
        href="tel:+10000000000"
        className="flex flex-col items-center gap-1 py-3 text-slate-700"
      >
        <span aria-hidden>📞</span>
        Call
      </a>
      <a
        href={whatsAppLink('Hi, I would like a quote for CCTV.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 py-3 text-accent-600"
      >
        <span aria-hidden>💬</span>
        WhatsApp
      </a>
      <Link
        to="/book-survey"
        className="flex flex-col items-center gap-1 bg-brand-600 py-3 text-white"
      >
        <span aria-hidden>📅</span>
        Free survey
      </Link>
    </div>
  );
}
