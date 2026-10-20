/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, HardwareItem, LeadItem } from './types';
import { INITIAL_LEADS, HARDWARE_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OverviewShowcase } from './components/OverviewShowcase';
import { HardwareCatalog } from './components/HardwareCatalog';
import { InstallationEngineering } from './components/InstallationEngineering';
import { SystemConfigurator } from './components/SystemConfigurator';
import { AdminDashboard } from './components/AdminDashboard';
import { SiteSurveyModal } from './components/SiteSurveyModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { CadViewerModal } from './components/CadViewerModal';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('overview-and-3d-showcase');
  const [quoteItems, setQuoteItems] = useState<HardwareItem[]>([
    { ...HARDWARE_ITEMS[0], quantity: 4 },
    { ...HARDWARE_ITEMS[1], quantity: 2 },
  ]);
  const [customConfigs, setCustomConfigs] = useState<any[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);

  // Modals & Drawers
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [surveyPrefillData, setSurveyPrefillData] = useState<any>(null);
  const [cadModalItem, setCadModalItem] = useState<HardwareItem | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Add hardware item to BOM quote
  const handleAddToQuote = (item: HardwareItem) => {
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to BOM specification ledger.`);
  };

  // Add custom config from estimator
  const handleAddConfigToQuote = (configSummary: any) => {
    setCustomConfigs((prev) => [...prev, configSummary]);
    showToast(`Configured topology architecture added to project specifications.`);
  };

  // Remove from quote
  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Update item quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setQuoteItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = (i.quantity || 1) + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as HardwareItem[]
    );
  };

  // Clear quote
  const handleClearQuote = () => {
    setQuoteItems([]);
    setCustomConfigs([]);
    showToast('BOM ledger cleared.');
  };

  // Book survey trigger from anywhere
  const handleOpenSurveyModal = (prefill?: any) => {
    setSurveyPrefillData(prefill || null);
    setIsSurveyModalOpen(true);
  };

  // Ingest new survey lead into pipeline
  const handleSurveySubmit = (surveyData: any) => {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      contactName: surveyData.contactName || 'New Client Stakeholder',
      facilityName: surveyData.facilityName || 'Commercial Facility',
      region: 'Tri-State Area',
      phone: surveyData.phone || '+1 (555) 019-2041',
      email: surveyData.email || 'contact@client.com',
      status: 'SURVEY_SCHEDULED',
      source: surveyData.source || 'Website Site Survey Form',
      assignedStaff: 'David K. Chen (Technician)',
      valuation: '$48,000',
      cameraCountSpec: surveyData.cameras || surveyData.nodes || '24 Nodes, 4K AI Domes',
      age: 'Just now',
      timeline: [
        `Survey window confirmed for ${surveyData.date || surveyData.preferredDate || 'Upcoming Window'}`,
        'Initial CAD Heatmap generation queued',
        'Lead created via AegisVision Portal',
      ],
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDmLaSX43QeNOit9PE36i6hvoOvMT9_G5j9WMTP-yRnSssVvlpAwxzClp7w3IsLrp9vq-ZxYvbZf-MZVkR124AVJ_Y0WM4OHumY54gZlsE1wUZtgNFpXb7vt0KaGfdF5jXrArNsqqcHsv4xLSwxGkd4WUj78QHjcl701r-zDiHS3fYAXBT2x2yMu7Us-RfjDP8Q7oKa3qhxR4IUUxA4n4dZCtpn9ZRhFw_8eTguh27hR-6OfF1t-wXmFA',
    };

    setLeads((prev) => [newLead, ...prev]);
    showToast(`Survey booked! Lead assigned to David K. Chen in Admin Console.`);
  };

  // Update existing lead
  const handleUpdateLead = (updated: LeadItem) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    showToast(`Lead ${updated.contactName} updated in operational database.`);
  };

  // Add manual lead in Admin
  const handleAddLead = (leadData: Partial<LeadItem>) => {
    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      contactName: leadData.contactName || 'New Entity',
      facilityName: leadData.facilityName || 'Facility',
      region: leadData.region || 'Metropolitan Area',
      phone: leadData.phone || '+1 (555) 000-0000',
      email: leadData.email || 'client@corp.com',
      status: leadData.status || 'NEW',
      source: leadData.source || 'Direct Dispatch',
      assignedStaff: leadData.assignedStaff || 'Unassigned',
      valuation: leadData.valuation || '$25,000',
      cameraCountSpec: leadData.cameraCountSpec || '16 Nodes',
      age: 'Just now',
      timeline: ['Lead ingested manually into system'],
      imageUrl:
        leadData.imageUrl ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDmLaSX43QeNOit9PE36i6hvoOvMT9_G5j9WMTP-yRnSssVvlpAwxzClp7w3IsLrp9vq-ZxYvbZf-MZVkR124AVJ_Y0WM4OHumY54gZlsE1wUZtgNFpXb7vt0KaGfdF5jXrArNsqqcHsv4xLSwxGkd4WUj78QHjcl701r-zDiHS3fYAXBT2x2yMu7Us-RfjDP8Q7oKa3qhxR4IUUxA4n4dZCtpn9ZRhFw_8eTguh27hR-6OfF1t-wXmFA',
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`New lead ${newLead.facilityName} created in Admin Pipeline.`);
  };

  const totalQuoteCount =
    quoteItems.reduce((acc, item) => acc + (item.quantity || 1), 0) + customConfigs.length;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md selection:bg-primary-container selection:text-on-primary-container antialiased">
      {/* Top Global Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-3.5 px-4 rounded-lg bg-surface-container-high/95 backdrop-blur-md text-on-surface border border-primary shadow-2xl flex items-center gap-3 animate-fade-in font-label-mono-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>{toast}</span>
        </div>
      )}

      {/* Render Public Header if NOT in Admin Dashboard */}
      {activePage !== 'admin-dashboard' && (
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          quoteCount={totalQuoteCount}
          onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
          onOpenSurveyModal={() => handleOpenSurveyModal()}
        />
      )}

      {/* Main Screen Router */}
      <main className={`flex-1 w-full ${activePage === 'admin-dashboard' ? '' : 'pt-28'}`}>
        {activePage === 'overview-and-3d-showcase' && (
          <OverviewShowcase
            onNavigate={setActivePage}
            onOpenSurveyModal={() => handleOpenSurveyModal()}
          />
        )}

        {activePage === 'hardware-catalog' && (
          <HardwareCatalog
            quoteCount={totalQuoteCount}
            onAddToQuote={handleAddToQuote}
            onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
            onOpenCadModal={(item) => setCadModalItem(item)}
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
            onNavigate={setActivePage}
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

        {activePage === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={setActivePage}
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onAddLead={handleAddLead}
          />
        )}
      </main>

      {/* Render Public Footer if NOT in Admin Dashboard */}
      {activePage !== 'admin-dashboard' && <Footer />}

      {/* Global Modals & Drawers */}
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
