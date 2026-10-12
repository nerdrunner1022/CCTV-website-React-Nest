import { Link } from 'react-router-dom';

export function Footer(): React.ReactNode {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 pb-24 md:pb-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-3 font-bold text-slate-900">CCTV Shop</p>
          <p className="text-sm text-slate-600">
            Free site survey, professional installation, and local support.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-900">Solutions</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/solutions/home">Home</Link></li>
            <li><Link to="/solutions/shops">Shops & Restaurants</Link></li>
            <li><Link to="/solutions/offices">Offices</Link></li>
            <li><Link to="/solutions/warehouses">Warehouses</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-900">Company</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-900">Get started</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/book-survey">Book a Free Survey</Link></li>
            <li><Link to="/calculator">Camera Calculator</Link></li>
            <li><Link to="/amc">AMC & Support</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} CCTV Shop. All rights reserved.</p>
        <p className="mt-1">
          We never publish customers&apos; camera views or addresses.
        </p>
      </div>
    </footer>
  );
}
