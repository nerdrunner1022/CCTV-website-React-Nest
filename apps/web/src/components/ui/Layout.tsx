import type { ReactNode } from 'react';

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}): ReactNode {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-4 py-16 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}): ReactNode {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }): ReactNode {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
      {children}
    </span>
  );
}
