import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';
import { MobileCta } from '../MobileCta';
import { WhatsAppButton } from '../WhatsAppButton';
import { BottomCta } from './BottomCta';
import { Footer } from './Footer';
import { Header } from './Header';

/**
 * Pages that should not show the bottom CTA: the home page already ends with
 * the full survey form, the booking page *is* the form, and the app pages are
 * not marketing surfaces.
 */
const HIDE_BOTTOM_CTA = new Set([
  '/',
  '/book-survey',
  '/login',
  '/portal',
  '/admin',
]);

export function RootLayout(): React.ReactNode {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Scroll to in-page anchors (e.g. the bottom CTA's `/#book-survey`).
  // Retry a few times because `ScrollRestoration` also moves the page on
  // navigation — the later passes win.
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    let cancelled = false;
    const scroll = () => {
      if (cancelled) return;
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    };
    const raf = window.requestAnimationFrame(scroll);
    const timers = [150, 450, 900].map((ms) => window.setTimeout(scroll, ms));
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [location.hash, location.key]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {HIDE_BOTTOM_CTA.has(location.pathname) ? null : <BottomCta />}
      <Footer />
      <WhatsAppButton />
      <MobileCta />
      <ScrollRestoration />
    </div>
  );
}
