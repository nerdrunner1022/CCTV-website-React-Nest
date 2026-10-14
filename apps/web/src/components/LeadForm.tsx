import { zodResolver } from '@hookform/resolvers/zod';
import { createLeadSchema, type CreateLeadInput } from '@cctv/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { captureLeadSource } from '../lib/source';
import { whatsAppLink } from '../lib/whatsapp';
import { Button } from './ui/Button';

const PROPERTY_OPTIONS = [
  { value: 'HOME', label: 'Home' },
  { value: 'SHOP', label: 'Shop' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'OTHER', label: 'Other' },
] as const;

const SLOT_OPTIONS = [
  { value: 'MORNING', label: 'Morning' },
  { value: 'AFTERNOON', label: 'Afternoon' },
  { value: 'EVENING', label: 'Evening' },
] as const;

/**
 * The money form: a survey booking that should take under 60 seconds to fill.
 * Reused on the home page, solution pages, contact page and the dedicated
 * booking route.
 */
export function LeadForm({
  defaultNote,
}: {
  defaultNote?: string;
} = {}): React.ReactNode {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      propertyType: 'HOME',
      preferredSlot: 'MORNING',
      source: captureLeadSource(),
      note: defaultNote,
      company: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await apiFetch<{ id: string }>('/leads', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      trackEvent('generate_lead', { source: values.source });
      setSubmitted(true);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
    }
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-accent-500/30 bg-accent-500/5 p-8 text-center">
        <p className="text-3xl" aria-hidden>
          ✅
        </p>
        <h3 className="mt-3 text-xl font-bold text-fg">
          Request received
        </h3>
        <p className="mt-2 text-muted">
          We&apos;ve received your request — a technician will confirm within 2
          hours during business hours.
        </p>
        <a
          href={whatsAppLink('Hi, I just booked a free CCTV survey.')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block font-semibold text-accent-600 underline"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2"
    >
      <Field label="Name" error={errors.name?.message}>
        <input
          {...register('name')}
          className={inputClass}
          placeholder="Your name"
          autoComplete="name"
        />
      </Field>

      <Field label="Phone" error={errors.phone?.message}>
        <input
          {...register('phone')}
          className={inputClass}
          placeholder="Phone number"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>

      <Field label="Email (optional)" error={errors.email?.message}>
        <input
          {...register('email')}
          className={inputClass}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>

      <Field label="Area / address" error={errors.area?.message}>
        <input
          {...register('area')}
          className={inputClass}
          placeholder="Suburb, street, or landmark"
        />
      </Field>

      <Field label="Property type" error={errors.propertyType?.message}>
        <select {...register('propertyType')} className={inputClass}>
          {PROPERTY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Preferred time" error={errors.preferredSlot?.message}>
        <select {...register('preferredSlot')} className={inputClass}>
          {SLOT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Preferred date (optional)" error={errors.preferredDate?.message}>
        <input
          {...register('preferredDate')}
          type="date"
          className={inputClass}
        />
      </Field>

      <Field label="Note (optional)" error={errors.note?.message} className="sm:col-span-2">
        <textarea
          {...register('note')}
          rows={3}
          className={inputClass}
          placeholder="Anything we should know? e.g. two entrances, existing cameras"
        />
      </Field>

      {/* honeypot — hidden from humans */}
      <input
        {...register('company')}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      {serverError ? (
        <p className="sm:col-span-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {serverError}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending…' : 'Book my free survey'}
        </Button>
        <p className="mt-2 text-center text-xs text-subtle">
          Takes under a minute. No obligation, no pushy sales.
        </p>
      </div>
    </form>
  );
}

const inputClass =
  'w-full rounded-lg border border-line-strong bg-navy/60 px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 [color-scheme:dark]';

function Field({
  label,
  error,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}): React.ReactNode {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-fg-soft">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      ) : null}
    </label>
  );
}
