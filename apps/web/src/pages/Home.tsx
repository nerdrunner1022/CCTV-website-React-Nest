import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { LinkButton } from '../components/ui/Button';
import { Badge, Card, Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';
import { whatsAppLink } from '../lib/whatsapp';

interface Solution {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  typicalCameras: string | null;
  startingPrice: string | null;
}

interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number | null;
}

const STEPS = [
  { title: 'Free survey', text: 'We visit, check angles and cable routes, and listen to what matters.' },
  { title: 'Clear quote', text: 'A written fixed-price quote — no surprises, no pressure.' },
  { title: 'Installation', text: 'Tidy, professional install at a time that suits you.' },
  { title: 'Handover', text: 'We set up phone viewing and show you how everything works.' },
  { title: 'Support', text: 'Local support and optional AMC to keep it running.' },
];

export function Home(): React.ReactNode {
  const solutions = useQuery({
    queryKey: ['solutions'],
    queryFn: () => apiFetch<Solution[]>('/solutions'),
  });

  const testimonials = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => apiFetch<Testimonial[]>('/testimonials'),
  });

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <Badge>Free site survey · Local team</Badge>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Free site survey, professional installation, local support.
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              Tell us about your home, shop, or office. We survey for free and
              give you a clear fixed-price quote before any work starts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/book-survey" size="lg">
                Book a Free Survey
              </LinkButton>
              <a
                href={whatsAppLink('Hi, I would like to book a free CCTV survey.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-6 py-4 font-semibold text-white hover:bg-accent-600"
              >
                <span aria-hidden>💬</span> Chat on WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Confirmation within 2 hours in business hours.
            </p>
          </div>

          <div>
            <LeadForm />
          </div>
        </div>
      </div>

      {/* Solutions */}
      <Section>
        <SectionHeading
          eyebrow="Find your fit"
          title="CCTV for every kind of property"
          description="Starting prices shown — your final quote is confirmed by a free survey."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(solutions.data ?? []).map((solution) => (
            <Card key={solution.id}>
              <h3 className="text-lg font-semibold text-slate-900">
                {solution.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{solution.summary}</p>
              <p className="mt-4 text-sm font-medium text-slate-700">
                {solution.typicalCameras}
              </p>
              {solution.startingPrice ? (
                <p className="mt-1 text-brand-700">
                  from ${Number(solution.startingPrice).toLocaleString()}
                </p>
              ) : null}
              <Link
                to={`/solutions/${solution.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                View solution →
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Simple process"
          title="How it works"
          description="Five steps from first call to looking after your system."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Calculator teaser */}
      <Section>
        <div className="grid items-center gap-8 rounded-3xl bg-brand-700 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Not sure how many cameras you need?
            </h2>
            <p className="mt-3 text-brand-100">
              Answer 4 quick questions and get an instant suggested package and
              rough price.
            </p>
          </div>
          <div className="lg:text-right">
            <LinkButton to="/calculator" variant="secondary" size="lg">
              Try the camera calculator
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      {(testimonials.data ?? []).length > 0 ? (
        <Section className="bg-slate-50">
          <SectionHeading eyebrow="Reviews" title="What customers say" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(testimonials.data ?? []).map((testimonial) => (
              <Card key={testimonial.id}>
                <p className="text-amber-500" aria-hidden>
                  {'★'.repeat(testimonial.rating ?? 5)}
                </p>
                <p className="mt-3 text-slate-700">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-slate-900">
                  {testimonial.author}
                  {testimonial.role ? (
                    <span className="font-normal text-slate-500">
                      {' '}
                      · {testimonial.role}
                    </span>
                  ) : null}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Final CTA */}
      <Section>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready for peace of mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Book your free survey today — a technician will confirm within 2
            hours in business hours.
          </p>
          <div className="mt-6 flex justify-center">
            <LinkButton to="/book-survey" size="lg">
              Book a Free Survey
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
