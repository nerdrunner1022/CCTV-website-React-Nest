import React from 'react';
import { HardwareItem } from '../types';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HardwareItem[];
  customConfigs: any[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearQuote: () => void;
  onProceedToSurvey: () => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  items,
  customConfigs,
  onRemoveItem,
  onUpdateQuantity,
  onClearQuote,
  onProceedToSurvey,
}) => {
  if (!isOpen) return null;

  const hardwareSubtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const configsSubtotal = customConfigs.reduce((acc, cfg) => acc + (cfg.totalInvestment || 0), 0);
  const subtotal = hardwareSubtotal + configsSubtotal;
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0  flex pl-10">
        <div className="w-screen  bg-surface-container-low shadow-2xl flex flex-col justify-between border-l border-surface-container-high/60 animate-slide-left">
          {/* Header */}
          <div className="p-6 border-b border-surface-container-high/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-xl">view_in_ar</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Your quote list
                </h3>
                <span className="font-label-mono-sm text-xs text-outline">
                  {items.length + customConfigs.length} {items.length + customConfigs.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 && customConfigs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  shopping_cart_checkout
                </span>
                <span className="font-headline-sm text-base text-on-surface font-semibold">
                  Your list is empty
                </span>
                <p className="font-body-sm text-xs text-outline mt-1 ">
                  Browse cameras and add the ones you’re interested in. Our team can help you choose.
                </p>
              </div>
            ) : (
              <>
                {/* Standard Hardware Items */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-surface-container border border-surface-container-high flex gap-3 relative group"
                  >
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover bg-surface-container-lowest shrink-0 border border-surface-container-high"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-label-mono-sm text-xs text-primary font-bold">
                            {item.category}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-outline hover:text-error text-xs cursor-pointer p-0.5"
                            title="Remove item"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                        <h4 className="font-headline-sm text-xs font-bold text-on-surface line-clamp-1">
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 bg-surface-container-high rounded px-1.5 py-0.5 border border-surface-container-highest">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-on-surface hover:text-primary text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-label-mono-sm text-xs text-on-surface font-bold px-1">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-on-surface hover:text-primary text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-label-mono-sm text-xs font-bold text-tertiary">
                          ${(item.price * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Custom Configs */}
                {customConfigs.map((cfg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-surface-container-high/60 border border-primary/30 flex flex-col gap-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-sm text-xs text-primary font-bold uppercase">
                        Configured system
                      </span>
                      <span className="font-label-mono-sm text-xs font-bold text-tertiary">
                        ${cfg.totalInvestment?.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-headline-sm text-xs font-semibold text-on-surface">
                      {cfg.name}
                    </span>
                    <div className="text-[11px] font-mono text-on-surface-variant flex flex-wrap gap-2">
                      <span>• {cfg.domes} standard cameras</span>
                      <span>• {cfg.ptzs} zoom cameras</span>
                      <span>• {cfg.thermals} thermal cameras</span>
                      <span>• {cfg.storage}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer & Actions */}
          <div className="p-6 border-t border-surface-container-high/60 bg-surface-container flex flex-col gap-4">
            <div className="space-y-2 font-label-mono-sm text-xs">
              <div className="flex justify-between text-on-surface-variant text-sm">
                <span>Product estimate</span>
                <span className="text-on-surface font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <p className="text-xs leading-relaxed text-outline">
                Final pricing, taxes and installation are confirmed after we learn more about your property.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToSurvey();
                }}
                disabled={items.length === 0 && customConfigs.length === 0}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-mono-sm text-xs font-bold uppercase tracking-wider rounded shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span>Request a survey</span>
              </button>

              <div className="flex justify-end">
                <button
                  onClick={onClearQuote}
                  disabled={items.length === 0 && customConfigs.length === 0}
                  className="px-3 py-2 text-xs text-outline hover:text-on-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Clear list
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
