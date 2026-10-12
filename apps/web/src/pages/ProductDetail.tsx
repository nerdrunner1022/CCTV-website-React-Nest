import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
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

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-100 text-5xl">
          <span aria-hidden>📷</span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {data.name}
          </h1>
          <p className="mt-3 text-slate-600">{data.description}</p>
          <p className="mt-4 text-2xl font-bold text-slate-900">
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
          <p className="mt-3 text-sm text-slate-500">
            {data.isQuoteOnly
              ? 'This item is quote-based so we can confirm compatibility with your system.'
              : 'Add it to your quote and we will confirm availability.'}
          </p>
        </div>
      </div>
    </Section>
  );
}
