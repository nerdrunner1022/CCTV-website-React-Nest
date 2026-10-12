/**
 * Minimal analytics shim. When VITE_GA_ID is configured, gtag is loaded and
 * these calls forward to Google Analytics. Otherwise they are no-ops.
 */
type Gtag = (command: string, ...args: unknown[]) => void;

function gtag(): Gtag | undefined {
  return (window as unknown as { gtag?: Gtag }).gtag;
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
): void {
  gtag()?.('event', name, params ?? {});
}

export function trackPageView(path: string): void {
  gtag()?.('event', 'page_view', { page_path: path });
}
