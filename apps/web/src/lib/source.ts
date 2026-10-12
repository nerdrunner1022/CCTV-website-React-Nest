import type { LeadSource } from '@cctv/shared';

const KNOWN_SOURCES: LeadSource[] = [
  'GOOGLE',
  'FACEBOOK',
  'INSTAGRAM',
  'REFERRAL',
  'FLYER_QR',
  'VAN_QR',
  'WHATSAPP',
  'DIRECT',
  'OTHER',
];

/**
 * Determines where a visitor came from using the `utm_source` / `src` query
 * parameters, a `qr` marker (flyer/van), or the referrer host. Stored on the lead
 * so cost-per-channel can be measured.
 */
export function captureLeadSource(): LeadSource {
  if (typeof window === 'undefined') return 'DIRECT';

  const params = new URLSearchParams(window.location.search);
  const raw = (
    params.get('utm_source') ??
    params.get('src') ??
    params.get('qr') ??
    ''
  ).toUpperCase();

  if (raw && (KNOWN_SOURCES as string[]).includes(raw)) {
    return raw as LeadSource;
  }

  if (params.get('qr')) return 'FLYER_QR';

  const referrer = document.referrer.toLowerCase();
  if (referrer.includes('google.')) return 'GOOGLE';
  if (referrer.includes('facebook.') || referrer.includes('fb.')) return 'FACEBOOK';
  if (referrer.includes('instagram.')) return 'INSTAGRAM';

  return 'DIRECT';
}
