import { Link } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Button } from '../components/ui/Button';
import { Section, SectionHeading } from '../components/ui/Layout';
import { useQuoteBasket } from '../features/quote/basket';

export function Quote(): React.ReactNode {
  const items = useQuoteBasket((state) => state.items);
  const remove = useQuoteBasket((state) => state.remove);
  const clear = useQuoteBasket((state) => state.clear);

  const note = items.length
    ? `Quote request for:\n${items
        .map((item) => `- ${item.name} × ${item.quantity}`)
        .join('\n')}`
    : undefined;

  return (
    <Section>
      <SectionHeading
        eyebrow="Your quote"
        title="Request a quote for your items"
        description="We confirm compatibility and pricing, then send a written quote. Complex systems stay quote-based on purpose."
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Your items</h3>
            {items.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                Nothing added yet.{' '}
                <Link
                  to="/products"
                  className="font-semibold text-brand-700 hover:underline"
                >
                  Browse the catalogue
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="text-slate-700">
                      {item.name}{' '}
                      <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {items.length > 0 ? (
              <Button variant="ghost" size="sm" className="mt-4" onClick={clear}>
                Clear items
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Your details
          </h3>
          <LeadForm defaultNote={note} />
        </div>
      </div>
    </Section>
  );
}
