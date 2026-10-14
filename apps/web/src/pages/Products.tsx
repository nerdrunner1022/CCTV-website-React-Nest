import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ImageSlot } from '../components/ui/ImageSlot';
import { Card, Section, SectionHeading } from '../components/ui/Layout';
import { useQuoteBasket } from '../features/quote/basket';
import { apiFetch } from '../lib/api';
import { trackEvent } from '../lib/analytics';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  currency: string;
  isQuoteOnly: boolean;
  images: string[];
}

export function Products(): React.ReactNode {
  const products = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<Product[]>('/products'),
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Catalogue"
        title="Cameras, recorders, and accessories"
        description="Add items to your quote — complex systems stay quote-based so you get the right design, not just a box."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(products.data ?? []).map((product) => (
          <Card
            key={product.id}
            flush
            className="flex flex-col overflow-hidden transition hover:border-brand-300"
          >
            <ImageSlot
              src={product.images[0]}
              alt={product.name}
              className="aspect-[4/3] w-full"
            />
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-fg">
                {product.name}
              </h3>
              {product.description ? (
                <p className="mt-2 flex-1 text-sm text-muted">
                  {product.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <p className="mt-4 text-lg font-bold text-fg">
                {product.price
                  ? `$${Number(product.price).toLocaleString()}`
                  : 'Quote on request'}
              </p>
              <div className="mt-4 flex gap-2">
                <AddToQuoteButton product={product} />
                <Link
                  to={`/products/${product.slug}`}
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                >
                  Details
                </Link>
              </div>
            </div>
          </Card>
        ))}
        {(products.data ?? []).length === 0 ? (
          <p className="text-subtle">
            No products published yet. Seed the database to see the catalogue.
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function AddToQuoteButton({ product }: { product: Product }): React.ReactNode {
  const add = useQuoteBasket((state) => state.add);

  return (
    <Button
      size="sm"
      onClick={() => {
        add({ productId: product.id, name: product.name });
        trackEvent('add_to_quote', { product: product.slug });
      }}
      className="flex-1"
    >
      Add to quote
    </Button>
  );
}
