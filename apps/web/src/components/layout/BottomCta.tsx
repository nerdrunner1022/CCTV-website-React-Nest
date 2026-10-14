import { whatsAppLink } from '../../lib/whatsapp';
import { LinkButton } from '../ui/Button';

/**
 * A compact call-to-action shown at the bottom of every content page, linking
 * through to the survey form on the home page (`/#book-survey`).
 */
export function BottomCta(): React.ReactNode {
  return (
    <section className="border-t border-line bg-surface-2">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="text-lg font-semibold text-fg">
            Not sure what you need? Book a free survey.
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            A technician checks the angles and cable routes, then sends a clear
            fixed-price quote. No obligation, no pushy sales.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2">
          <LinkButton to="/#book-survey">Book my free survey</LinkButton>
          <a
            href={whatsAppLink('Hi, I would like to book a free CCTV survey.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-accent-600 hover:underline"
          >
            <span aria-hidden>💬</span> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
