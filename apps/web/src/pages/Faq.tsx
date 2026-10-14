import { useQuery } from '@tanstack/react-query';
import { Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

export function Faq(): React.ReactNode {
  const faqs = useQuery({
    queryKey: ['faqs'],
    queryFn: () => apiFetch<Faq[]>('/faqs'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="FAQ"
        title="Questions we hear all the time"
        description="Quick answers that save you a phone call. Still stuck? Message us on WhatsApp."
      />

      <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
        {(faqs.data ?? []).map((faq) => (
          <details key={faq.id} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-fg">
              {faq.question}
              <span aria-hidden className="text-brand-600 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted">{faq.answer}</p>
          </details>
        ))}
        {(faqs.data ?? []).length === 0 ? (
          <p className="p-5 text-subtle">No FAQs published yet.</p>
        ) : null}
      </div>
    </Section>
  );
}
