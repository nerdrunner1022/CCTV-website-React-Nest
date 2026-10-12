import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuoteBasketItem {
  productId: string;
  name: string;
  quantity: number;
}

interface QuoteBasketState {
  items: QuoteBasketItem[];
  add: (item: Omit<QuoteBasketItem, 'quantity'> & { quantity?: number }) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

/** Client-side "Add to quote" basket. Complex items never go to a hard checkout. */
export const useQuoteBasket = create<QuoteBasketState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find(
            (entry) => entry.productId === item.productId,
          );
          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId
                  ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
                  : entry,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: item.productId,
                name: item.name,
                quantity: item.quantity ?? 1,
              },
            ],
          };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.productId === productId
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'cctv-quote-basket' },
  ),
);
