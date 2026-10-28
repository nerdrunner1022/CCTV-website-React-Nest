import React, { useEffect, useState } from 'react';
import type { HardwareItem, LeadItem, PageView, SurveySubmission } from './types';
import { HARDWARE_ITEMS, INITIAL_LEADS, MOCK_STAFF } from './data/mockData';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { CadViewerModal } from './components/CadViewerModal';
import { Footer } from './components/Footer';
import { HardwareCatalog } from './components/HardwareCatalog';
import { Header } from './components/Header';
import { InstallationEngineering } from './components/InstallationEngineering';
import { OverviewShowcase } from './components/OverviewShowcase';
import { QuoteDrawer } from './components/QuoteDrawer';
import { SiteSurveyModal } from './components/SiteSurveyModal';
import { SystemConfigurator } from './components/SystemConfigurator';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('overview-and-3d-showcase');
  const [quoteItems, setQuoteItems] = useState<HardwareItem[]>([]);
  const [customConfigs, setCustomConfigs] = useState<unknown[]>([]);
  const products = HARDWARE_ITEMS;
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const staff = MOCK_STAFF;
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyPrefillData, setSurveyPrefillData] = useState<Record<string, unknown> | null>(null);
  const [cadModalItem, setCadModalItem] = useState<HardwareItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleAddToQuote = (item: HardwareItem) => {
    setQuoteItems((previous) => {
      const existing = previous.find((entry) => entry.id === item.id);
      if (!existing) return [...previous, { ...item, quantity: 1 }];
      return previous.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: (entry.quantity ?? 1) + 1 }
          : entry,
      );
    });
    showToast(`Added ${item.name} to the quote.`);
  };

  const handleAddConfigToQuote = (configSummary: unknown) => {
    setCustomConfigs((previous) => [...previous, configSummary]);
    showToast('Configured system added to the quote.');
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setQuoteItems((previous) =>
      previous
        .map((item) => {
          if (item.id !== id) return item;
          const quantity = (item.quantity ?? 1) + delta;
          return quantity > 0 ? { ...item, quantity } : null;
        })
        .filter((item): item is HardwareItem => item !== null),
    );
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
    setCustomConfigs([]);
    showToast('Quote cleared.');
  };

  const handleOpenSurveyModal = (prefill?: Record<string, unknown>) => {
    setSurveyPrefillData(prefill ?? null);
    setIsSurveyModalOpen(true);
  };

  const handleSurveySubmit = async (survey: SurveySubmission) => {
    const facilityName = survey.facilityName ?? survey.facility ?? '';
    const contactName = survey.contactName ?? survey.name ?? '';
    const cameraCountSpec = survey.nodes ?? survey.cameras ?? '';
    const preferredDate = survey.preferredDate ?? survey.date;
    const newLead: LeadItem = {
      id: `demo-lead-${Date.now()}`,
      contactName,
      phone: survey.phone ?? '',
      email: survey.email ?? '',
      facilityName,
      location: facilityName,
      region: facilityName,
      status: 'SURVEY_BOOKED',
      source: survey.source ?? 'Website Survey',
      assignedStaff: 'Unassigned',
      age: 'Just now',
      slaStatus: 'Demo request',
      cameraPayload: cameraCountSpec,
      cameraCountSpec,
      valuation: 'Pending estimate',
      surveyDate: preferredDate,
      notes: survey.notes,
      timeline: ['Demo survey request received in this browser session'],
    };
    setLeads((previous) => [newLead, ...previous]);

    showToast('Demo survey added to this page. Refreshing will clear it.');
  };

  const handleAdminLogin = (credentials: { email: string; password: string }) => {
    setAdminEmail(credentials.email);
    setActivePage('admin-dashboard');
    showToast('Demo console opened. Refreshing will clear session changes.');
  };

  const handleAdminLogout = () => {
    setAdminEmail(null);
    setActivePage('overview-and-3d-showcase');
  };

  const handleUpdateLead = (updated: LeadItem) => {
    setLeads((previous) =>
      previous.map((lead) => (lead.id === updated.id ? updated : lead)),
    );
    showToast(`Demo lead ${updated.contactName} updated on this page.`);
  };

  const handleAddLead = (leadData: Partial<LeadItem>) => {
    const newLead: LeadItem = {
      id: `demo-lead-${Date.now()}`,
      contactName: leadData.contactName ?? 'Demo Contact',
      phone: leadData.phone ?? '',
      email: leadData.email ?? '',
      facilityName: leadData.facilityName ?? 'Demo Facility',
      location: leadData.region,
      region: leadData.region ?? 'Demo Region',
      status: leadData.status ?? 'NEW',
      source: leadData.source ?? 'Staff entry',
      assignedStaff: leadData.assignedStaff ?? 'Unassigned',
      age: 'Just now',
      cameraCountSpec: leadData.cameraCountSpec ?? 'Not specified',
      valuation: leadData.valuation ?? 'Pending estimate',
      notes: leadData.notes,
      timeline: leadData.timeline ?? ['Demo lead created in this browser session'],
    };
    setLeads((previous) => [newLead, ...previous]);
    showToast(`Demo lead for ${newLead.facilityName} added to this page.`);
  };

  const totalQuoteCount =
    quoteItems.reduce((total, item) => total + (item.quantity ?? 1), 0) +
    customConfigs.length;
  const pageTransitionKey =
    activePage === 'admin-dashboard'
      ? `${activePage}-${adminEmail ? 'signed-in' : 'signed-out'}`
      : activePage;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container antialiased">
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-3.5 px-4 rounded-lg bg-surface-container-high/95 backdrop-blur-md text-on-surface border border-primary shadow-2xl flex items-center gap-3 animate-fade-in font-label-mono-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {activePage !== 'admin-dashboard' && (
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          quoteCount={totalQuoteCount}
          onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
          onOpenSurveyModal={() => handleOpenSurveyModal()}
          adminEmail={adminEmail}
          onLogout={handleAdminLogout}
        />
      )}

      <main className={`flex-1 w-full ${activePage === 'admin-dashboard' ? '' : 'pt-28'}`}>
        <div
          key={pageTransitionKey}
          className="app-page-enter"
        >
        {activePage === 'overview-and-3d-showcase' && (
          <OverviewShowcase
            onNavigate={setActivePage}
            onOpenSurveyModal={() => handleOpenSurveyModal()}
          />
        )}

        {activePage === 'hardware-catalog' && (
          <HardwareCatalog
            items={products}
            isLoading={false}
            loadError={null}
            onAddToQuote={handleAddToQuote}
            onOpenCadModal={setCadModalItem}
          />
        )}

        {activePage === 'installation-and-engineering-services' && (
          <InstallationEngineering
            onNavigate={setActivePage}
            onBookSurvey={handleSurveySubmit}
          />
        )}

        {activePage === 'system-configurator-and-estimator' && (
          <SystemConfigurator
            onBookSurvey={(prefill) => handleOpenSurveyModal(prefill)}
            onAddConfigToQuote={handleAddConfigToQuote}
          />
        )}

        {activePage === 'contact-and-site-survey' && (
          <InstallationEngineering
            onNavigate={setActivePage}
            onBookSurvey={handleSurveySubmit}
          />
        )}

        {activePage === 'admin-dashboard' &&
          (adminEmail ? (
            <AdminDashboard
              onNavigate={setActivePage}
              leads={leads}
              staff={staff}
              onUpdateLead={handleUpdateLead}
              onAddLead={handleAddLead}
            />
          ) : (
            <AdminLogin
              error={null}
              isSubmitting={false}
              onBack={() => setActivePage('overview-and-3d-showcase')}
              onSubmit={handleAdminLogin}
            />
          ))}
        </div>
      </main>

      {activePage !== 'admin-dashboard' && <Footer />}

      {activePage !== 'admin-dashboard' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            disabled
            aria-label="WhatsApp contact is unavailable until the business number is configured"
            title="Business WhatsApp number pending"
            className="flex cursor-not-allowed items-center gap-2 rounded-full border border-[#3d494c] bg-[#181c24] px-4 py-3 text-sm font-semibold text-[#869397] shadow-lg opacity-90"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
            <span>WhatsApp number pending</span>
          </button>
        </div>
      )}

      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        customConfigs={customConfigs}
        onRemoveItem={handleRemoveQuoteItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearQuote={handleClearQuote}
        onProceedToSurvey={() => handleOpenSurveyModal()}
      />

      <SiteSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        onSubmit={handleSurveySubmit}
        prefillData={surveyPrefillData}
      />

      <CadViewerModal
        isOpen={Boolean(cadModalItem)}
        onClose={() => setCadModalItem(null)}
        item={cadModalItem}
        onAddToQuote={handleAddToQuote}
      />
    </div>
  );
}
