import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LinkButton } from '../components/ui/Button';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Badge, Card, Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface Package {
  id: string;
  slug: string;
  name: string;
  tier: string;
  summary: string | null;
  image: string | null;
  features: string[];
  cameraCount: number | null;
  priceMin: string | null;
  priceMax: string | null;
}

export function Packages(): React.ReactNode {
  const packages = useQuery({
    queryKey: ['packages'],
    queryFn: () => apiFetch<Package[]>('/packages'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Packages"
        title="Kits with clear, honest pricing"
        description="Indicative ranges — the free survey confirms the exact price for your property."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {(packages.data ?? []).map((pkg) => {
          const highlighted = pkg.tier === 'RECOMMENDED';
          return (
            <Card
              key={pkg.id}
              flush
              className={`flex flex-col overflow-hidden ${highlighted ? 'ring-2 ring-brand-500' : ''}`}
            >
              <ImageSlot
                src={pkg.image}
                alt={`${pkg.name} package`}
                className="aspect-[4/3] w-full"
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-fg">
                    {pkg.name}
                  </h3>
                  {highlighted ? <Badge>Most popular</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-muted">{pkg.summary}</p>
                <p className="mt-4 text-2xl font-bold text-fg">
                  {pkg.priceMin && pkg.priceMax
                    ? `$${Number(pkg.priceMin).toLocaleString()} – $${Number(pkg.priceMax).toLocaleString()}`
                    : 'Quote on survey'}
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-muted">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden className="text-accent-500">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <LinkButton
                  to="/book-survey"
                  variant={highlighted ? 'primary' : 'secondary'}
                  className="mt-6 w-full"
                >
                  Book a Free Survey
                </LinkButton>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-subtle">
        Need something custom?{' '}
        <Link to="/products" className="font-semibold text-brand-700 hover:underline">
          Browse the catalogue
        </Link>{' '}
        and add items to a quote.
      </p>
    </Section>
  );
}
