import { LeadForm } from '../components/LeadForm';
import { Section } from '../components/ui/Layout';

export function BookSurvey(): React.ReactNode {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Free site survey
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          Book your free survey
        </h1>
        <p className="mt-3 text-slate-600">
          Fill this in and a technician will confirm within 2 hours during
          business hours. It takes under a minute.
        </p>

        <div className="mt-8">
          <LeadForm />
        </div>
      </div>
    </Section>
  );
}
