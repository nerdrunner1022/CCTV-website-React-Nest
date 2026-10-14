import { useQuery } from '@tanstack/react-query';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface Project {
  id: string;
  title: string;
  clientType: string | null;
  location: string | null;
  summary: string | null;
  beforeImages: string[];
  afterImages: string[];
  testimonial: { author: string; quote: string } | null;
}

export function Projects(): React.ReactNode {
  const projects = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiFetch<Project[]>('/projects'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Projects"
        title="Recent installations"
        description="A sample of the properties we protect. We never publish camera views or customer addresses."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(projects.data ?? []).map((project) => (
          <div
            key={project.id}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className="grid grid-cols-2">
              <div className="relative">
                <ImageSlot
                  src={project.beforeImages?.[0]}
                  alt={`${project.title} — before`}
                  hint="Before"
                  className="aspect-video w-full"
                />
                <span className="absolute left-2 top-2 rounded bg-navy/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fg">
                  Before
                </span>
              </div>
              <div className="relative">
                <ImageSlot
                  src={project.afterImages[0]}
                  alt={`${project.title} — after`}
                  hint="After"
                  className="aspect-video w-full"
                />
                <span className="absolute left-2 top-2 rounded bg-navy/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fg">
                  After
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-fg">{project.title}</h3>
              <p className="mt-1 text-sm text-subtle">
                {[project.clientType, project.location]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {project.summary ? (
                <p className="mt-3 text-sm text-muted">{project.summary}</p>
              ) : null}
              {project.testimonial ? (
                <blockquote className="mt-4 border-l-2 border-brand-300 pl-3 text-sm italic text-muted">
                  “{project.testimonial.quote}” — {project.testimonial.author}
                </blockquote>
              ) : null}
            </div>
          </div>
        ))}
        {(projects.data ?? []).length === 0 ? (
          <p className="text-subtle">
            No projects published yet. Add them from the admin once seeded.
          </p>
        ) : null}
      </div>
    </Section>
  );
}
