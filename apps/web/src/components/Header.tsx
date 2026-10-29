import React, { useState } from 'react';
import { PageView } from '../types';

interface HeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  quoteCount: number;
  onOpenQuoteDrawer: () => void;
  onOpenSurveyModal: () => void;
  adminEmail?: string | null;
  onLogout?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  quoteCount,
  onOpenQuoteDrawer,
  onOpenSurveyModal,
  adminEmail = null,
  onLogout = () => {},
  searchQuery = '',
  setSearchQuery = () => {}
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'overview-and-3d-showcase', label: 'Overview & 3D Showcase' },
    { id: 'hardware-catalog', label: 'Hardware Catalog' },
    { id: 'installation-and-engineering-services', label: 'Installation & Engineering Services' },
    { id: 'system-configurator-and-estimator', label: 'System Configurator & Estimator' },
    { id: 'contact-and-site-survey', label: 'Contact & Site Survey' }
  ];

  const handleNavClick = (id: PageView) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePage !== 'hardware-catalog') {
      setActivePage('hardware-catalog');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f131c]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="hidden sm:flex bg-[#0a0e16] px-3 sm:px-4 lg:px-12 py-1.5 items-center justify-center text-[#bcc9cd] text-[10px] sm:text-xs text-center border-b border-[#262a33]/40">
        <span>Practical CCTV advice and installation for homes and businesses</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 px-3 sm:px-4 lg:px-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('overview-and-3d-showcase')}
          className="flex items-center gap-2 sm:gap-3 min-w-0 shrink text-left focus:outline-none group"
          aria-label="AegisVision home"
        >
          <img
            alt="AegisVision security camera logo"
            className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 object-contain transition-transform group-hover:scale-105"
            src="/assets/aegisvision-mark.svg"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-[15px] sm:text-[20px] text-[#dfe2ee] tracking-wider uppercase font-extrabold leading-tight">
              AEGIS<span className="text-[#4cd7f6]">VISION</span>
            </span>
            <span className="hidden sm:block font-mono text-[9px] text-[#869397] tracking-widest uppercase">
              Perimeter Telemetry
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden min-[1880px]:flex items-center gap-1 text-[13px]">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 transition-all rounded ${
                  isActive
                    ? 'bg-[#262a33] text-[#4cd7f6] font-bold shadow-sm'
                    : 'text-[#bcc9cd] hover:text-[#dfe2ee] hover:bg-[#1c2028]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Stack */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Quick Hardware Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-[#181c24] px-3 py-1.5 rounded focus-within:ring-1 focus-within:ring-[#4cd7f6] border border-[#3d494c]/40"
          >
            <span className="material-symbols-outlined text-[#869397] text-[18px] mr-2">search</span>
            <input
              className="bg-transparent text-[#dfe2ee] placeholder:text-[#869397] font-mono text-[11px] focus:outline-none w-36 lg:w-52"
              placeholder="Search hardware, specs, SKUs..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (activePage !== 'hardware-catalog') setActivePage('hardware-catalog');
              }}
            />
          </form>

          {/* Request Survey Button */}
          <button
            onClick={onOpenSurveyModal}
            className="hidden sm:inline-flex items-center justify-center bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] font-bold font-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded shadow-[0_0_16px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all"
          >
            Request Survey
          </button>

          {/* Cart / Queue Quote Counter Button */}
          <button
            onClick={onOpenQuoteDrawer}
            aria-label="Cart and Specs Counter"
            className="relative p-1 sm:p-2 text-[#bcc9cd] hover:text-[#dfe2ee] transition-colors rounded hover:bg-[#1c2028]"
            title="View Selected Quote Items"
          >
            <span className="material-symbols-outlined text-[21px] sm:text-[24px]">view_in_ar</span>
            <span className="absolute top-1 right-1 bg-[#0566d9] text-[#e6ecff] font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {quoteCount}
            </span>
          </button>

          {/* Admin Profile & Switcher */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1 cursor-pointer group focus:outline-none"
              aria-label="User profile and admin navigation"
            >
              <img
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-[#4cd7f6]/40 group-hover:ring-[#4cd7f6] transition-all"
                src="/assets/demo-avatar.svg"
              />
              <span className="material-symbols-outlined text-[#869397] group-hover:text-[#dfe2ee] text-sm transition-colors hidden sm:inline">
                arrow_drop_down
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#181c24] border border-[#3d494c] rounded-lg shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-[#262a33]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#dfe2ee]">Admin Console</span>
                    <span className="bg-[#0566d9] text-[#e6ecff] font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[11px] text-[#869397] font-mono block">
                    {adminEmail ?? 'Staff sign-in required'}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setActivePage('admin-dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${
                      activePage === 'admin-dashboard'
                        ? 'bg-[#262a33] text-[#4cd7f6] font-bold'
                        : 'text-[#dfe2ee] hover:bg-[#1c2028]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">dashboard</span>
                      Launch CCTV Admin Console
                    </span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                  {adminEmail && (
                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#bcc9cd] hover:text-[#dfe2ee] hover:bg-[#1c2028]"
                    >
                      Sign out
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActivePage('overview-and-3d-showcase');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#bcc9cd] hover:text-[#dfe2ee] hover:bg-[#1c2028] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">public</span>
                    Public Client Portal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 sm:p-2 text-[#bcc9cd] hover:text-[#dfe2ee] min-[1880px]:hidden"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="min-[1880px]:hidden bg-[#181c24] border-t border-[#262a33] px-4 py-3 flex flex-col gap-1 shadow-2xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left px-3 py-2.5 rounded text-sm font-medium ${
                activePage === link.id
                  ? 'bg-[#262a33] text-[#4cd7f6] font-bold'
                  : 'text-[#bcc9cd] hover:bg-[#1c2028] hover:text-[#dfe2ee]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setActivePage('admin-dashboard');
              setMobileMenuOpen(false);
            }}
            className="text-left px-3 py-2.5 rounded text-sm font-bold text-[#4cd7f6] hover:bg-[#262a33] flex items-center gap-2 border-t border-[#262a33] mt-2 pt-3"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Access CCTV Admin Console
          </button>
          <button
            onClick={() => {
              onOpenSurveyModal();
              setMobileMenuOpen(false);
            }}
            className="mt-1 flex items-center justify-center gap-2 rounded bg-[#06b6d4] px-3 py-3 text-sm font-bold text-[#003640]"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Request a site survey
          </button>
        </div>
      )}
    </header>
  );
};
