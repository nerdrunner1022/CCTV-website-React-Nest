import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { LinkButton } from '../components/ui/Button';
import { Button } from '../components/ui/Button';
import { Card, Section, SectionHeading } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';
import { trackEvent } from '../lib/analytics';

interface CalculatorInput {
  propertyType: 'HOME' | 'SHOP' | 'RESTAURANT' | 'OFFICE' | 'WAREHOUSE' | 'OTHER';
  entrances: number;
  coverage: 'INDOOR' | 'OUTDOOR' | 'MIXED';
  budget: 'LOW' | 'MID' | 'HIGH' | 'UNSURE';
  existingCameras: boolean;
}

interface CalculatorResult {
  suggestedPackage: string;
  cameraCount: number;
  priceMin: number;
  priceMax: number;
  currency: string;
  rationale: string[];
}

export function Calculator(): React.ReactNode {
  const [form, setForm] = useState<CalculatorInput>({
    propertyType: 'HOME',
    entrances: 4,
    coverage: 'OUTDOOR',
    budget: 'UNSURE',
    existingCameras: false,
  });

  const estimate = useMutation({
    mutationFn: (input: CalculatorInput) =>
      apiFetch<CalculatorResult>('/calculator/estimate', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (result) => {
      trackEvent('calculator_complete', { cameras: result.cameraCount });
    },
  });

  return (
    <Section>
      <SectionHeading
        eyebrow="Camera calculator"
        title="How many cameras do you need?"
        description="Answer a few questions for an instant suggested package and rough price. Confirm exact numbers with a free survey."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-fg-soft">
                Property type
              </span>
              <select
                className={inputClass}
                value={form.propertyType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    propertyType: event.target.value as CalculatorInput['propertyType'],
                  }))
                }
              >
                <option value="HOME">Home</option>
                <option value="SHOP">Shop</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="OFFICE">Office</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-fg-soft">
                Number of entrances / key areas ({form.entrances})
              </span>
              <input
                type="range"
                min={1}
                max={20}
                value={form.entrances}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    entrances: Number(event.target.value),
                  }))
                }
                className="w-full"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-fg-soft">
                Coverage
              </span>
              <select
                className={inputClass}
                value={form.coverage}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    coverage: event.target.value as CalculatorInput['coverage'],
                  }))
                }
              >
                <option value="INDOOR">Indoor only</option>
                <option value="OUTDOOR">Outdoor only</option>
                <option value="MIXED">Indoor + outdoor</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-fg-soft">
                Budget
              </span>
              <select
                className={inputClass}
                value={form.budget}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    budget: event.target.value as CalculatorInput['budget'],
                  }))
                }
              >
                <option value="LOW">Budget-friendly</option>
                <option value="MID">Balanced</option>
                <option value="HIGH">Best quality</option>
                <option value="UNSURE">Not sure yet</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-fg-soft">
              <input
                type="checkbox"
                checked={form.existingCameras}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    existingCameras: event.target.checked,
                  }))
                }
              />
              I already have some cameras
            </label>

            <Button
              size="lg"
              className="w-full"
              disabled={estimate.isPending}
              onClick={() => estimate.mutate(form)}
            >
              {estimate.isPending ? 'Calculating…' : 'Get my estimate'}
            </Button>
          </div>
        </Card>

        <div>
          {estimate.data ? (
            <Card className="ring-1 ring-brand-600/50">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                Suggested
              </p>
              <h3 className="mt-1 text-2xl font-bold text-fg">
                {estimate.data.suggestedPackage}
              </h3>
              <p className="mt-3 text-fg-soft">
                About{' '}
                <strong>{estimate.data.cameraCount} cameras</strong> · indicative
                price{' '}
                <strong>
                  ${estimate.data.priceMin.toLocaleString()} – $
                  {estimate.data.priceMax.toLocaleString()}
                </strong>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {estimate.data.rationale.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
              <LinkButton to="/book-survey" className="mt-6 w-full">
                Book a Free Survey
              </LinkButton>
            </Card>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-line-strong p-8 text-center text-subtle">
              Your estimate will appear here.
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

const inputClass =
  'w-full rounded-lg border border-line-strong bg-navy/60 px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 [color-scheme:dark]';
