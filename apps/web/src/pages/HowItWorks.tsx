import { LinkButton } from '../components/ui/Button';
import { Section, SectionHeading } from '../components/ui/Layout';

const STEPS = [
  {
    title: '1. Free survey',
    text: 'We visit your property at a time that suits you. We check entrances, walkways, blind spots, and cable routes — and listen to what matters most to you.',
  },
  {
    title: '2. Clear quote',
    text: 'You get a written, fixed-price quote with the equipment listed. No hidden extras, and no pressure to decide on the spot.',
  },
  {
    title: '3. Installation',
    text: 'Our technicians install tidily and safely, at a time that works for your home or business. We keep disruption to a minimum.',
  },
  {
    title: '4. Handover',
    text: 'We set up remote viewing on your phone, show you how to review footage, and leave you confident using the system.',
  },
  {
    title: '5. Support',
    text: 'Local support whenever you need it, plus optional AMC plans that keep your system checked and maintained.',
  },
];

export function HowItWorks(): React.ReactNode {
  return (
    <Section>
      <SectionHeading
        eyebrow="How it works"
        title="Five steps from worried to reassured"
        description="CCTV is a trust purchase. We keep the process simple and transparent at every step."
      />

      <ol className="space-y-6">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <h3 className="text-lg font-semibold text-brand-700">
              {step.title}
            </h3>
            <p className="mt-2 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 text-center">
        <LinkButton to="/book-survey" size="lg">
          Start with a free survey
        </LinkButton>
      </div>
    </Section>
  );
}
