import { Link } from 'react-router-dom';
import { Card, Section, SectionHeading } from '../components/ui/Layout';

const CARDS = [
  { title: 'Invoices', text: 'View and download your invoices.' },
  { title: 'Warranty', text: 'Check what is covered and until when.' },
  { title: 'AMC', text: 'See plan status and renewal dates.' },
  { title: 'Support tickets', text: 'Raise and track service requests.' },
];

/**
 * Customer portal shell. Authentication and live data are wired in Phase 3;
 * this establishes the route and layout.
 */
export function Portal(): React.ReactNode {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('cctv-token') : null;

  if (!token) {
    return (
      <Section>
        <p className="text-muted">
          Please{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            log in
          </Link>{' '}
          to view your account.
        </p>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading
        eyebrow="Your account"
        title="Customer portal"
        description="Everything about your system in one place."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Card key={card.title}>
            <h3 className="font-semibold text-fg">{card.title}</h3>
            <p className="mt-2 text-sm text-muted">{card.text}</p>
            <p className="mt-4 text-xs text-subtle">Coming in Phase 3</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
