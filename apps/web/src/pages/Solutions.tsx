import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface Solution {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  typicalCameras: string | null;
  startingPrice: string | null;
}

export function SolutionsIndex(): React.ReactNode {
  const solutions = useQuery({
    queryKey: ['solutions'],
    queryFn: () => apiFetch<Solution[]>('/solutions'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Solutions"
        title="Choose the setup closest to your property"
        description="Every install starts with a free survey to confirm what you actually need."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {(solutions.data ?? []).map((solution) => (
          <Link
            key={solution.id}
            to={`/solutions/${solution.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-300"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {solution.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{solution.summary}</p>
            <p className="mt-3 text-sm font-medium text-slate-700">
              {solution.typicalCameras}
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function SolutionDetail(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>();

  const solution = useQuery({
    queryKey: ['solution', slug],
    queryFn: () => apiFetch<Solution | null>(`/solutions/${slug}`),
    enabled: Boolean(slug),
  });

  const data = solution.data;

  return (
    <>
      <div className="bg-brand-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Solution
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {data?.title ?? 'CCTV solution'}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            {data?.summary ??
              'A tailored system, confirmed by a free survey before you commit.'}
          </p>
          <div className="mt-4 flex gap-6 text-sm text-slate-700">
            {data?.typicalCameras ? <span>{data.typicalCameras}</span> : null}
            {data?.startingPrice ? (
              <span className="font-semibold text-brand-700">
                from ${Number(data.startingPrice).toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose max-w-none text-slate-600">
            {data?.body ? (
              <div dangerouslySetInnerHTML={{ __html: data.body }} />
            ) : (
              <p>
                We cover entrances, key walkways, and storage areas, then set up
                remote viewing on your phone. The free survey confirms camera
                counts and cable routes so the final quote is accurate.
              </p>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Book a free survey
            </h2>
            <LeadForm />
          </div>
        </div>
      </Section>
    </>
  );
}
