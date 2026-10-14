import { LeadForm } from '../components/LeadForm';
import { Card, Section, SectionHeading } from '../components/ui/Layout';
import { whatsAppLink } from '../lib/whatsapp';

const PLANS = [
  {
    name: 'Essential AMC',
    price: 'Annual',
    features: ['One annual health check', 'Priority phone support', 'Discounted repairs'],
  },
  {
    name: 'Comprehensive AMC',
    price: 'Annual',
    features: [
      'Two health checks a year',
      'Priority response',
      'Free firmware and settings updates',
      'Discounted replacement parts',
    ],
  },
];

export function Amc(): React.ReactNode {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="AMC & Support"
          title="Keep your system running, year after year"
          description="Maintenance plans plus a support route for anything that needs attention."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {PLANS.map((plan) => (
            <Card key={plan.name}>
              <h3 className="text-lg font-semibold text-fg">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-subtle">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden className="text-accent-500">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-surface-2 p-6">
          <h3 className="font-semibold text-fg">Need help now?</h3>
          <p className="mt-1 text-sm text-muted">
            Existing customers can raise a support ticket from the portal, or
            message us directly. Ticket numbers are tracked end to end.
          </p>
          <a
            href={whatsAppLink('Hi, I need support with my CCTV system.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-semibold text-accent-600 underline"
          >
            Message us on WhatsApp
          </a>
        </div>
      </Section>

      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Talk to us"
          title="Request support or an AMC quote"
        />
        <LeadForm defaultNote="I would like info about an AMC plan / support." />
      </Section>
    </>
  );
}
