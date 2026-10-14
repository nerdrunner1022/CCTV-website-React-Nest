import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { buttonClasses } from '../ui/Button';

const NAV_LINKS = [
  { to: '/solutions/home', label: 'Solutions' },
  { to: '/packages', label: 'Packages' },
  { to: '/products', label: 'Products' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/projects', label: 'Projects' },
  { to: '/amc', label: 'Support' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export function Header(): React.ReactNode {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-fg">
          <span aria-hidden className="text-2xl">
            📹
          </span>
          <span>CCTV Shop</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-muted hover:text-fg'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/book-survey" className={buttonClasses('primary', 'sm')}>
            Book a Free Survey
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-fg-soft lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden>{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-sm font-medium text-fg-soft last:border-none"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/book-survey"
              onClick={() => setOpen(false)}
              className={buttonClasses('primary', 'md', 'my-3')}
            >
              Book a Free Survey
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
