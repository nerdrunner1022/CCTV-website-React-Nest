import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Section } from '../components/ui/Layout';
import { useQuoteBasket } from '../features/quote/basket';
import { apiFetch } from '../lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  isQuoteOnly: boolean;
  images: string[];
  specs: Record<string, unknown> | null;
}

export function ProductDetail(): React.ReactNode {
  const { slug } = useParams<{ slug: string }>();
  const add = useQuoteBasket((state) => state.add);

  const product = useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiFetch<Product | null>(`/products/${slug}`),
    enabled: Boolean(slug),
  });

  const data = product.data;

  if (product.isLoading) {
    return <Section>Loading…</Section>;
  }

  if (!data) {
    return <Section>Product not found.</Section>;
  }

  const specs = data.specs
    ? Object.entries(data.specs).map(
        ([key, value]) => [key, String(value)] as const,
      )
    : [];

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2">
        <ImageSlot
          src={data.images[0]}
          alt={data.name}
          className="aspect-video w-full rounded-2xl"
        />
        <div>
          <h1 className="text-2xl font-semibold text-fg sm:text-3xl">
            {data.name}
          </h1>
          <p className="mt-3 text-muted">{data.description}</p>
          <p className="mt-4 text-2xl font-bold text-fg">
            {data.price
              ? `$${Number(data.price).toLocaleString()}`
              : 'Quote on request'}
          </p>
          <Button
            size="lg"
            className="mt-6 w-full sm:w-auto"
            onClick={() => add({ productId: data.id, name: data.name })}
          >
            Add to quote
          </Button>
          <p className="mt-3 text-sm text-subtle">
            {data.isQuoteOnly
              ? 'This item is quote-based so we can confirm compatibility with your system.'
              : 'Add it to your quote and we will confirm availability.'}
          </p>
        </div>
      </div>

      {specs.length > 0 ? (
        <div className="mt-14 max-w-2xl">
          <h2 className="text-xl font-semibold text-fg">Specifications</h2>
          <dl className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
            {specs.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between gap-6 px-5 py-3 text-sm"
              >
                <dt className="text-muted">{key}</dt>
                <dd className="text-right font-medium text-fg-soft">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </Section>
  );
}
