import React, { useState } from 'react';
import { PageView } from '../types';

interface HeaderProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  quoteCount: number;
  onOpenQuoteDrawer: () => void;
  onOpenSurveyModal: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  quoteCount,
  onOpenQuoteDrawer,
  onOpenSurveyModal,
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
      {/* Top Ambient Telemetry Ribbon */}
      <div className="bg-[#0a0e16] px-4 lg:px-12 py-1.5 flex items-center justify-between text-[#bcc9cd] font-mono text-[10px] tracking-wide border-b border-[#262a33]/40">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span>NETWORK: <span className="text-[#4edea3] font-semibold">SECURE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span>24/7 MONITORING: <span className="text-[#4edea3] font-semibold">ACTIVE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[#869397]">ENCRYPTION:</span>
            <span className="text-[#dfe2ee]">AES-256 GCM</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            className="flex items-center gap-1.5 text-[#4cd7f6] hover:text-[#acedff] transition-colors"
            href="tel:18002344773"
          >
            <span className="material-symbols-outlined text-[14px]">support_agent</span>
            <span className="hidden sm:inline">EMERGENCY SOC:</span> 1-800-AEGIS-SEC
          </a>
          <span className="text-[#869397]">|</span>
          <span className="text-[#bcc9cd]">LATENCY: 12ms</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20   px-4 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <button
          onClick={() => handleNavClick('overview-and-3d-showcase')}
          className="flex items-center gap-3 shrink-0 text-left focus:outline-none group"
        >
          <img
            alt="AegisVision CCTV Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XWnhzJ4E_o9oOcNW1TyZmlw2IuH_MGsXe2TFUIHNZ_sOGLlyeRh3zk3L4aqYmvTgsaklsy8Li9aqD1AiYYBi3oyyt2uER9RNET-KA1-Bje2qyx2ebP3BdJYEXY163OUTvfVn5OujZSaoPgD7BnttOa68KTP8el1C-9MqL3dqppmxupVYF0-iWCJTt9eO5_1NeRLyk0nqfxIP_yfqt62U_GUdKeUpWG8jTANk-CqgwzYAxUF8MZZu6FI2g"
          />
          <div className="flex flex-col">
            <span className="text-[20px] text-[#dfe2ee] tracking-wider uppercase font-extrabold leading-tight">
              AEGIS<span className="text-[#4cd7f6]">VISION</span>
            </span>
            <span className="font-mono text-[9px] text-[#869397] tracking-widest uppercase">
              Perimeter Telemetry
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px]">
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
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
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
            className="relative p-2 text-[#bcc9cd] hover:text-[#dfe2ee] transition-colors rounded hover:bg-[#1c2028]"
            title="View Selected Quote Items"
          >
            <span className="material-symbols-outlined text-[24px]">view_in_ar</span>
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
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#4cd7f6]/40 group-hover:ring-[#4cd7f6] transition-all"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS9zvhp3Aceh6mv6a7U5g76W484Y9ZCdVl99lqFRULeFTcrOir9KgWE57F6BMojvLKPftBC0UXwe_1Wzr-jx5ctRDGElQyY_AOTEC9dz1ZIssAtvc1rWJnrAurjR3zydXc1NPltkp1eJLLoWJN5aHV7qHNWUhf7H5yqhycJjAfZCkIrJLUTcA60X_xo-RyfPcIgZY3ISPHr7CM8MkfRuprw6Cn055qDJJsy3BVAYgbeC9uZwU8xsCdFQ"
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
                  <span className="text-[11px] text-[#869397] font-mono block">admin@aegisvision.mil</span>
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
            className="p-2 text-[#bcc9cd] hover:text-[#dfe2ee] xl:hidden"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#181c24] border-t border-[#262a33] px-4 py-3 flex flex-col gap-1 shadow-2xl">
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
        </div>
      )}
    </header>
  );
};
