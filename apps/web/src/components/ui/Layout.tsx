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
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl px-4 py-20 sm:py-24 ${className}`}
    >
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
      <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg text-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className = '',
  flush = false,
}: {
  children: ReactNode;
  className?: string;
  /** Remove the default padding — useful when a card leads with a full-bleed image. */
  flush?: boolean;
}): ReactNode {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface ${flush ? '' : 'p-6'} ${className}`}
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
