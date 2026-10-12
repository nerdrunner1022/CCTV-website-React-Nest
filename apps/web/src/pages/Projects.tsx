import { useQuery } from '@tanstack/react-query';
import { Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface Project {
  id: string;
  title: string;
  clientType: string | null;
  location: string | null;
  summary: string | null;
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
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex aspect-video items-center justify-center bg-slate-100 text-4xl">
              <span aria-hidden>🏠</span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {[project.clientType, project.location]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {project.summary ? (
                <p className="mt-3 text-sm text-slate-600">{project.summary}</p>
              ) : null}
              {project.testimonial ? (
                <blockquote className="mt-4 border-l-2 border-brand-300 pl-3 text-sm italic text-slate-600">
                  “{project.testimonial.quote}” — {project.testimonial.author}
                </blockquote>
              ) : null}
            </div>
          </div>
        ))}
        {(projects.data ?? []).length === 0 ? (
          <p className="text-slate-500">
            No projects published yet. Add them from the admin once seeded.
          </p>
        ) : null}
      </div>
    </Section>
  );
}
