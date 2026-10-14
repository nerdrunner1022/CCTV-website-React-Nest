import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { LinkButton } from '../components/ui/Button';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Badge, Card, Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';
import { whatsAppLink } from '../lib/whatsapp';

interface Solution {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  image: string | null;
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
      <div className="relative overflow-hidden border-b border-line bg-navy">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-24 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-700/10 blur-[120px]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Badge>Cameras · Kits · Professional installation</Badge>
            <h1 className="mt-4 text-4xl leading-tight text-fg sm:text-5xl lg:text-6xl">
              CCTV cameras and kits, installed by local experts.
            </h1>
            <p className="mt-4 max-w-xl text-muted">
              Browse cameras, recorders and ready-to-go kits, book a free site
              survey, and get a clear fixed-price quote before any work starts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/book-survey" size="lg">
                Book a Free Survey
              </LinkButton>
              <LinkButton to="/products" variant="secondary" size="lg">
                Browse the shop
              </LinkButton>
            </div>
            <p className="mt-4 text-sm text-subtle">
              Free survey · Confirmation within 2 hours in business hours.
            </p>
          </div>

          <div>
            <ImageSlot
              src="/images/hero.jpg"
              alt="CCTV cameras and installation"
              hint="Hero image — /images/hero.jpg"
              className="aspect-[4/3] w-full rounded-3xl"
            />
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
            <Card
              key={solution.id}
              flush
              className="flex flex-col overflow-hidden"
            >
              <ImageSlot
                src={solution.image}
                alt={solution.title}
                className="aspect-[4/3] w-full"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-fg">
                  {solution.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {solution.summary}
                </p>
                <p className="mt-4 text-sm font-medium text-fg-soft">
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
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-surface-2">
        <SectionHeading
          eyebrow="Simple process"
          title="How it works"
          description="Five steps from first call to looking after your system."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-line bg-surface p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-semibold text-fg">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Calculator teaser */}
      <Section>
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-8 text-fg-strong sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Not sure how many cameras you need?
            </h2>
            <p className="mt-3 text-fg-strong/85">
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
        <Section className="bg-surface-2">
          <SectionHeading eyebrow="Reviews" title="What customers say" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(testimonials.data ?? []).map((testimonial) => (
              <Card key={testimonial.id}>
                <p className="text-amber-500" aria-hidden>
                  {'★'.repeat(testimonial.rating ?? 5)}
                </p>
                <p className="mt-3 text-fg-soft">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-fg">
                  {testimonial.author}
                  {testimonial.role ? (
                    <span className="font-normal text-subtle">
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

      {/* Book my free survey */}
      <Section id="book-survey" className="bg-surface-2">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Free · No obligation"
              title="Book my free survey"
              description="Tell us where you are and what you'd like covered. A technician visits, checks the angles and cable routes, and sends a clear fixed-price quote — usually within 1 working day."
            />
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2">
                <span aria-hidden className="text-accent-500">✓</span>
                A written fixed-price quote — no surprises
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-accent-500">✓</span>
                Tidy, professional installation at a time that suits you
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-accent-500">✓</span>
                Phone viewing set up and explained before we leave
              </li>
              <li className="flex gap-2">
                <span aria-hidden className="text-accent-500">✓</span>
                Local support and an optional maintenance plan
              </li>
            </ul>
            <p className="mt-6 text-sm text-subtle">
              Prefer to chat first?{' '}
              <a
                href={whatsAppLink('Hi, I would like to book a free CCTV survey.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-600 hover:underline"
              >
                Message us on WhatsApp
              </a>
              .
            </p>
          </div>

          <LeadForm />
        </div>
      </Section>
    </>
  );
}
