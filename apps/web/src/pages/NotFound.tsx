import { LinkButton } from '../components/ui/Button';
import { Section } from '../components/ui/Layout';

export function NotFound(): React.ReactNode {
  return (
    <Section>
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-5xl" aria-hidden>
          🔍
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-slate-600">
          The page you were looking for doesn&apos;t exist.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <LinkButton to="/">Back to home</LinkButton>
          <LinkButton to="/book-survey" variant="secondary">
            Book a Free Survey
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
