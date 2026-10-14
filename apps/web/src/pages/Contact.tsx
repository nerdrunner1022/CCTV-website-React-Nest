import { LeadForm } from '../components/LeadForm';
import { Section, SectionHeading } from '../components/ui/Layout';
import { whatsAppLink } from '../lib/whatsapp';

export function Contact(): React.ReactNode {
  return (
    <Section>
      <SectionHeading
        eyebrow="Contact"
        title="Talk to a local team"
        description="Call, message, or book a free survey. We reply fast — confirmation within 2 hours in business hours."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-semibold text-fg">Phone</h3>
            <a
              href="tel:+10000000000"
              className="mt-1 block text-brand-700 hover:underline"
            >
              +1 000 000 0000
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-semibold text-fg">WhatsApp</h3>
            <a
              href={whatsAppLink('Hi, I have a question about CCTV.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-accent-600 hover:underline"
            >
              Chat with us now
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-semibold text-fg">Hours</h3>
            <p className="mt-1 text-sm text-muted">
              Mon–Fri 9:00–18:00 · Sat 9:00–14:00
            </p>
          </div>

          <div className="flex aspect-video items-center justify-center rounded-2xl bg-surface text-subtle">
            <span aria-hidden>🗺️ Map area</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-fg">
            Book your free survey
          </h3>
          <LeadForm />
        </div>
      </div>
    </Section>
  );
}
