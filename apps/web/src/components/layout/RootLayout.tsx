import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';
import { MobileCta } from '../MobileCta';
import { WhatsAppButton } from '../WhatsAppButton';
import { Footer } from './Footer';
import { Header } from './Header';

export function RootLayout(): React.ReactNode {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileCta />
      <ScrollRestoration />
    </div>
  );
}
