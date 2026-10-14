import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'whatsapp' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-surface text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50',
  whatsapp: 'bg-accent-600 text-white hover:bg-accent-700',
  ghost: 'text-brand-700 hover:bg-brand-50',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
};

export function buttonClasses(
  variant: Variant = 'primary',
  size: Size = 'md',
  className = '',
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(' ');
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps): ReactNode {
  return (
    <button className={buttonClasses(variant, size, className ?? '')} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = LinkProps & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps): ReactNode {
  return (
    <Link className={buttonClasses(variant, size, className ?? '')} {...props}>
      {children}
    </Link>
  );
}
