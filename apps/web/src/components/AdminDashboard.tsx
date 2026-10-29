import React, { useState, useMemo } from 'react';
import { LeadItem, PageView } from '../types';

interface AdminDashboardProps {
  onNavigate: (page: PageView) => void;
  leads: LeadItem[];
  staff: string[];
  onUpdateLead: (lead: LeadItem) => void;
  onAddLead: (lead: Partial<LeadItem>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  leads,
  staff,
  onUpdateLead,
  onAddLead,
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'pipeline'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || 'lead-1');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isQuoteBuilderModalOpen, setIsQuoteBuilderModalOpen] = useState(false);

  const [activeModalLead, setActiveModalLead] = useState<LeadItem | null>(null);

  // New lead form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadFacility, setNewLeadFacility] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadValuation, setNewLeadValuation] = useState('$35,000');
  const [newLeadSource, setNewLeadSource] = useState('Inbound Call');

  // Assign staff selection
  const [selectedStaff, setSelectedStaff] = useState('');

  // Schedule slot state
  const [scheduleSlot, setScheduleSlot] = useState('Tomorrow, 14:00 - 16:30');

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchSource =
        sourceFilter === 'ALL' ||
        lead.source.toLowerCase().includes(sourceFilter.toLowerCase());
      return matchSearch && matchStatus && matchSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const selectedLead = useMemo(() => {
    return leads.find((l) => l.id === selectedLeadId) || leads[0];
  }, [leads, selectedLeadId]);

  const funnelStats = [
    { label: 'NEW', count: leads.filter((lead) => lead.status === 'NEW').length, color: 'bg-secondary', textColor: 'text-secondary' },
    { label: 'CONTACTED', count: leads.filter((lead) => lead.status === 'CONTACTED').length, color: 'bg-outline', textColor: 'text-outline' },
    { label: 'SURVEY', count: leads.filter((lead) => lead.status === 'SURVEY_BOOKED').length, color: 'bg-primary', textColor: 'text-primary' },
    { label: 'QUOTED', count: leads.filter((lead) => lead.status === 'QUOTED').length, color: 'bg-secondary-container', textColor: 'text-secondary-fixed' },
    { label: 'WON', count: leads.filter((lead) => lead.status === 'WON' || lead.status === 'INSTALLED').length, color: 'bg-tertiary', textColor: 'text-tertiary' },
    { label: 'LOST', count: leads.filter((lead) => lead.status === 'LOST').length, color: 'bg-error-container', textColor: 'text-error' },
  ].map((stat) => ({
    ...stat,
    percentage: leads.length ? (stat.count / leads.length) * 100 : 0,
  }));
  const countForStatus = (label: string) =>
    funnelStats.find((stat) => stat.label === label)?.count ?? 0;
  const percentageForStatus = (label: string) =>
    funnelStats.find((stat) => stat.label === label)?.percentage ?? 0;
  const activeQuotes = leads.filter((lead) => lead.status === 'QUOTED');
  const activeQuoteValue = activeQuotes.reduce(
    (total, lead) => total + (lead.estimatedValuation ?? 0),
    0,
  );
  const wonCount = countForStatus('WON');
  const conversionRate = leads.length
    ? Math.round((wonCount / leads.length) * 100)
    : 0;

  const handleOpenAssign = (lead: LeadItem) => {
    setActiveModalLead(lead);
    setSelectedStaff(
      lead.assignedStaff === 'Unassigned' || !staff.includes(lead.assignedStaff)
        ? (staff[0] ?? '')
        : lead.assignedStaff,
    );
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = () => {
    if (activeModalLead) {
      onUpdateLead({
        ...activeModalLead,
        assignedStaff: selectedStaff,
      });
    }
    setIsAssignModalOpen(false);
  };

  const handleOpenSchedule = (lead: LeadItem) => {
    setActiveModalLead(lead);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    if (activeModalLead) {
      onUpdateLead({
        ...activeModalLead,
        status: 'SURVEY_BOOKED',
        timeline: [
          `Survey slot confirmed for ${scheduleSlot}`,
          ...activeModalLead.timeline,
        ],
      });
    }
    setIsScheduleModalOpen(false);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadFacility) return;
    onAddLead({
      contactName: newLeadName,
      facilityName: newLeadFacility,
      region: 'Metropolitan Area',
      phone: newLeadPhone || '+1 (555) 000-0000',
      email: newLeadEmail || 'contact@client.com',
      status: 'NEW',
      source: newLeadSource,
      assignedStaff: 'Unassigned',
      valuation: newLeadValuation,
      cameraCountSpec: '24 Nodes, 4K AI Domes',
      age: 'Just now',
      timeline: ['Lead ingested manually via Admin Console'],
      imageUrl:
        '/assets/demo-yard.svg',
    });
    setNewLeadName('');
    setNewLeadFacility('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setIsNewLeadModalOpen(false);
  };

  const getStatusBadge = (status: LeadItem['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-secondary/15 text-secondary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            NEW
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-outline/20 text-on-surface-variant font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            CONTACTED
          </span>
        );
      case 'SURVEY_BOOKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-primary/10 text-primary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            SURVEY BOOKED
          </span>
        );
      case 'QUOTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-secondary-container/20 text-secondary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            QUOTED
          </span>
        );
      case 'WON':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-tertiary/10 text-tertiary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            WON / INSTALLED
          </span>
        );
      case 'LOST':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-mono-sm text-label-mono-sm uppercase bg-error/10 text-error font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            LOST
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.4)] z-50 flex-col justify-between py-6 border-r border-surface-container-high/40">
        <div className="flex flex-col gap-6">
          <div className="px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-surface-container flex items-center justify-center text-primary shadow-[0_0_12px_rgba(6,182,212,0.18)] border border-primary/30">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
              </div>
              <div>
                <span className="font-headline-sm text-base font-bold tracking-tight text-on-surface block leading-tight">
                  AegisVision
                </span>
                <span className="font-label-mono-sm text-xs text-primary tracking-widest uppercase block font-semibold">
                  CCTV Platform Admin
                </span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-4">
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left cursor-pointer ${
                viewMode === 'overview'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-md'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">filter_alt</span>
              <span>Leads Pipeline</span>
            </button>
            <button
              onClick={() => onNavigate('hardware-catalog')}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-body-sm text-sm text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">article</span>
              <span>Content CMS &amp; Catalog</span>
            </button>
            <button
              onClick={() => onNavigate('system-configurator-and-estimator')}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-body-sm text-sm text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">request_quote</span>
              <span>Quotes &amp; Surveys</span>
            </button>
            <button
              onClick={() => onNavigate('installation-and-engineering-services')}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-body-sm text-sm text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>AMC &amp; Contracts</span>
            </button>
            <button
              onClick={() => onNavigate('overview-and-3d-showcase')}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-primary hover:bg-surface-container transition-all font-body-sm text-sm text-left cursor-pointer mt-4"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Return to Public App</span>
            </button>
          </nav>
        </div>

        <div className="px-4 flex flex-col gap-3">
          <div className="bg-surface-container-lowest px-4 py-3 rounded flex flex-col gap-2 border border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="font-label-mono-sm text-xs text-on-surface-variant uppercase tracking-wider">
                System Health
              </span>
              <span className="font-label-mono-sm text-xs text-tertiary uppercase font-bold">
                Demo Mode
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full w-[98%]"></div>
            </div>
          </div>
          <div className="flex items-center justify-between px-2 pt-2 text-xs">
            <span className="font-label-mono-sm text-on-surface-variant">SAMPLE DATA</span>
            <span className="font-label-mono-sm text-outline">LOCAL SESSION</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen w-full">
        {/* Admin Top Header */}
        <header className="sticky top-0 min-h-16 bg-surface/85 backdrop-blur-xl shadow-sm z-40 flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 border-b border-surface-container-high/40">
          <div className="flex items-center gap-4 flex-1 ">
            <div className="flex items-center gap-2 w-full bg-surface-container-low px-3 py-2 rounded focus-within:ring-1 focus-within:ring-primary border border-surface-container-high">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
              <input
                className="bg-transparent border-0 outline-none font-body-sm text-sm text-on-surface placeholder:text-outline w-full"
                placeholder="Search telemetry, cameras, clients..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden xl:flex items-center gap-4">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container-high">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-mono-sm text-xs text-on-surface-variant uppercase font-semibold">
                  Demo Data
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-lowest border border-surface-container-high">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-mono-sm text-xs text-on-surface-variant uppercase font-semibold">
                  Session Only
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 sm:pl-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-body-sm text-sm font-semibold text-on-surface leading-none">
                    Security Operations SOC
                  </span>
                  <span className="bg-secondary-container text-on-secondary-container font-label-mono-sm text-[10px] px-1.5 py-0.5 rounded leading-none font-bold">
                    ADMIN
                  </span>
                </div>
                <span className="font-label-mono-sm text-xs text-on-surface-variant block mt-0.5">
                  soc-lead@aegisvision.com
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <button
                onClick={() => onNavigate('overview-and-3d-showcase')}
                className="flex items-center gap-1 ml-2 text-on-surface-variant hover:text-primary hover:bg-surface-container px-2 py-1.5 rounded transition-colors text-xs font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden md:inline">Exit Console</span>
              </button>
            </div>
          </div>
        </header>

        <nav
          aria-label="Admin navigation"
          className="lg:hidden sticky top-16 z-30 flex gap-2 overflow-x-auto border-b border-surface-container-high bg-surface-container-low px-3 py-2"
        >
          <button
            onClick={() => setViewMode('overview')}
            className={`shrink-0 rounded px-3 py-2 text-xs font-semibold ${viewMode === 'overview' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setViewMode('pipeline')}
            className={`shrink-0 rounded px-3 py-2 text-xs font-semibold ${viewMode === 'pipeline' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}
          >
            Leads
          </button>
          <button
            onClick={() => onNavigate('hardware-catalog')}
            className="shrink-0 rounded bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant"
          >
            Catalog
          </button>
          <button
            onClick={() => onNavigate('system-configurator-and-estimator')}
            className="shrink-0 rounded bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant"
          >
            Quotes
          </button>
          <button
            onClick={() => onNavigate('installation-and-engineering-services')}
            className="shrink-0 rounded bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant"
          >
            Services
          </button>
          <button
            onClick={() => onNavigate('overview-and-3d-showcase')}
            className="shrink-0 rounded bg-surface-container px-3 py-2 text-xs font-semibold text-on-surface-variant"
          >
            Public site
          </button>
        </nav>

        {/* Dashboard Body */}
        <div className="w-full bg-surface flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col w-full">
            {/* Top Telemetry & Control Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-surface-container-highest/40">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex w-full sm:w-fit items-center gap-1 sm:gap-2 bg-surface-container-low p-1 rounded-lg border border-surface-container-high">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`min-w-0 flex-1 sm:flex-none px-2 sm:px-3.5 py-1.5 rounded font-label-mono-md text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center sm:justify-start gap-1 sm:gap-2 cursor-pointer ${
                      viewMode === 'overview'
                        ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">monitoring</span>
                    Metrics &amp; Overview
                  </button>
                  <button
                    onClick={() => setViewMode('pipeline')}
                    className={`min-w-0 flex-1 sm:flex-none px-2 sm:px-3.5 py-1.5 rounded font-label-mono-md text-[10px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center sm:justify-start gap-1 sm:gap-2 cursor-pointer ${
                      viewMode === 'pipeline'
                        ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">view_kanban</span>
                    Leads Pipeline
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-tertiary font-label-mono-sm text-xs uppercase font-semibold border border-surface-container-high">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    DEMO SESSION
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-container font-label-mono-sm text-xs text-on-surface-variant border border-surface-container-high">
                    <span className="material-symbols-outlined text-[13px] text-primary">sync_alt</span>
                    LOCAL SESSION
                  </span>
                </div>
              </div>

              {/* Quick Action Triggers */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      leads
                        .map(
                          (l) =>
                            `"${l.contactName}","${l.facilityName}","${l.status}","${l.valuation}","${l.assignedStaff}"`
                        )
                        .join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'aegis_leads_telemetry.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-xs font-medium transition-all flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export CSV
                </button>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-xs font-medium transition-all flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Clear Search
                </button>
                <button
                  onClick={() => setIsNewLeadModalOpen(true)}
                  className="px-3.5 py-1.5 rounded bg-primary-container text-on-primary-container font-headline-sm text-xs font-semibold hover:shadow-[0_0_16px_rgba(6,182,212,0.45)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  + New Lead
                </button>
              </div>
            </div>

            {/* Primary Metric HUD (6 Tactical Nodes) */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 pt-6 pb-6">
              {/* Node 1 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    TOTAL LEADS
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-on-surface tracking-tight leading-none">
                    {leads.length.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-tertiary font-label-mono-sm text-xs">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>sample records</span>
                  </div>
                </div>
              </div>

              {/* Node 2 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    NEW (LAST 7D)
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-secondary">flare</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-secondary tracking-tight leading-none">
                    {countForStatus('NEW')}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-mono-sm text-xs">
                    <span className="text-primary font-semibold">Demo</span>
                    <span>sample leads</span>
                  </div>
                </div>
              </div>

              {/* Node 3 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    WON / INSTALLED
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-tertiary">task_alt</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-tertiary tracking-tight leading-none">
                    {wonCount}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-tertiary font-label-mono-sm text-xs">
                    <span className="px-1.5 py-0.2 rounded bg-tertiary/10">{conversionRate}% sample conversion</span>
                  </div>
                </div>
              </div>

              {/* Node 4 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    SURVEYS BOOKED
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-primary tracking-tight leading-none">
                    {countForStatus('SURVEY')}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-mono-sm text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    <span>sample requests</span>
                  </div>
                </div>
              </div>

              {/* Node 5 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    ACTIVE QUOTES
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-primary-fixed">receipt_long</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-on-surface tracking-tight leading-none">
                    {activeQuotes.length}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-primary-fixed font-label-mono-sm text-xs">
                    <span>${activeQuoteValue.toLocaleString()} sample value</span>
                  </div>
                </div>
              </div>

              {/* Node 6 */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-container-high">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-label-mono-sm text-xs uppercase tracking-wider text-outline font-semibold">
                    LOST / DROPPED
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-error">cancel</span>
                </div>
                <div>
                  <div className="font-headline-md text-2xl font-bold text-error tracking-tight leading-none">
                    {countForStatus('LOST')}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-on-surface-variant font-label-mono-sm text-xs">
                    <span>{Math.round(percentageForStatus('LOST'))}% of sample leads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid Row: Visual Status Distribution Bar & Operational Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-6">
              {/* Funnel / Pipeline Distribution Bar */}
              <div className="lg:col-span-8 bg-surface-container-low p-5 rounded-lg flex flex-col justify-between border border-surface-container-high">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
                  <div>
                    <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                      PIPELINE DISTRIBUTION ARCHITECTURE
                    </span>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Lifecycle Conversion Funnel
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-mono-sm text-xs text-on-surface-variant uppercase">
                      SLA COMPLIANCE:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-label-mono-sm text-xs font-semibold">
                      94.8%
                    </span>
                  </div>
                </div>

                {/* Segmented Multi-Bar */}
                <div className="w-full my-3">
                  <div className="h-3 w-full bg-surface-container-highest rounded-full flex overflow-hidden p-0.5 gap-0.5">
                    {funnelStats.map((stat) => (
                      <div
                        key={stat.label}
                        className={`${stat.color} h-full relative cursor-pointer`}
                        style={{ width: `${stat.percentage}%` }}
                        title={`${stat.label}: ${stat.count} (${stat.percentage}%)`}
                      />
                    ))}
                  </div>
                </div>

                {/* Funnel Breakdown Keys */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                  {funnelStats.map((stat) => (
                    <div key={stat.label} className="flex flex-col bg-surface-container px-2.5 py-1.5 rounded border border-surface-container-high">
                      <span className={`flex items-center gap-1.5 font-label-mono-sm text-xs ${stat.textColor} uppercase font-semibold`}>
                        <span className={`w-2 h-2 rounded-full ${stat.color}`} /> {stat.label}
                      </span>
                      <span className="font-headline-sm text-xs font-bold text-on-surface mt-0.5">
                        {Math.round(stat.percentage)}% <span className="text-on-surface-variant font-normal">({stat.count})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Capacity & Dispatch Matrix */}
              <div className="lg:col-span-4 bg-surface-container-low p-5 rounded-lg flex flex-col justify-between border border-surface-container-high">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                      TELEMETRY DISPATCH
                    </span>
                    <h2 className="font-headline-sm text-base font-bold text-on-surface">
                      Staff Workload
                    </h2>
                  </div>
                  <span className="font-label-mono-sm text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-surface-container-high">
                    ACTIVE POOL: 18
                  </span>
                </div>

                <div className="flex flex-col gap-3 py-1">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-medium text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Admin / Reviewers
                      </span>
                      <span className="font-label-mono-sm text-xs text-on-surface-variant">
                        4/4 Active (100%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[100%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-medium text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        Sales &amp; Estimators
                      </span>
                      <span className="font-label-mono-sm text-xs text-tertiary">
                        7/8 Engaged (87%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-tertiary h-full w-[87%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-medium text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                        Survey Technicians
                      </span>
                      <span className="font-label-mono-sm text-xs text-secondary-fixed">
                        5/6 Deployed (83%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary-container h-full w-[83%]"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="font-label-mono-sm text-xs text-primary hover:underline uppercase inline-flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    Adjust Rosters &amp; Shifts{' '}
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Operational Core: Filter Toolbar & Leads Table + Side Deep Dive */}
            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6 items-start">
              {/* Main Table Container (8 Cols on 2XL, 12 on smaller) */}
              <div className="2xl:col-span-8 flex flex-col gap-4">
                {/* Advanced Search and Dynamic Multi-Filter Bar */}
                <div className="bg-surface-container-low p-4 rounded-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between border border-surface-container-high">
                  <div className="flex items-center gap-2 bg-surface-container-highest/50 px-3 py-2 rounded flex-1 border border-surface-container-high">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      filter_list
                    </span>
                    <input
                      className="bg-transparent border-0 outline-none font-body-sm text-sm text-on-surface placeholder:text-outline w-full"
                      placeholder="Search Facility, Name, Contact, or Borough..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Dropdown Filter */}
                    <div className="relative">
                      <select
                        className="bg-surface-container text-on-surface font-body-sm text-xs px-3 py-2 rounded outline-none appearance-none pr-8 cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="ALL">Status: All Statuses</option>
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="SURVEY_BOOKED">SURVEY BOOKED</option>
                        <option value="QUOTED">QUOTED</option>
                        <option value="WON">WON / INSTALLED</option>
                        <option value="LOST">LOST</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Source Filter */}
                    <div className="relative">
                      <select
                        className="bg-surface-container text-on-surface font-body-sm text-xs px-3 py-2 rounded outline-none appearance-none pr-8 cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high"
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                      >
                        <option value="ALL">Source: All Origins</option>
                        <option value="Website">Website Survey Form</option>
                        <option value="Call">Inbound Call</option>
                        <option value="Referral">Partner Referral</option>
                        <option value="Catalog">Catalog Add-to-Quote</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('ALL');
                        setSourceFilter('ALL');
                      }}
                      className="px-2.5 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors text-xs border border-surface-container-high cursor-pointer"
                      title="Clear Filters"
                    >
                      <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                    </button>
                  </div>
                </div>

                {/* High-Density Operations Table */}
                <div className="bg-surface-container-low rounded-lg overflow-hidden border border-surface-container-high">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-high/60 text-outline font-label-mono-sm text-xs uppercase tracking-wider border-b border-surface-container-high">
                          <th className="py-3 px-4">Lead / Contact Entity</th>
                          <th className="py-3 px-4">Target Facility &amp; Region</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Origin / Channel</th>
                          <th className="py-3 px-4">Assigned Personnel</th>
                          <th className="py-3 px-4">SLA / Age</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-sm divide-y divide-surface-container-highest/20">
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            onClick={() => setSelectedLeadId(lead.id)}
                            className={`hover:bg-surface-container transition-colors group cursor-pointer ${
                              selectedLeadId === lead.id ? 'bg-surface-container-highest/30' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-on-surface leading-snug">
                                {lead.contactName}
                              </div>
                              <div className="text-on-surface-variant font-label-mono-sm text-xs flex items-center gap-1 mt-0.5">
                                <span>{lead.phone}</span>
                                <span className="text-outline">•</span>
                                <span className="truncate ">{lead.email}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="text-on-surface font-medium leading-snug">
                                {lead.facilityName}
                              </div>
                              <div className="text-on-surface-variant text-xs flex items-center gap-1 text-[12px]">
                                <span className="material-symbols-outlined text-[13px] text-primary">
                                  location_on
                                </span>
                                {lead.region}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {getStatusBadge(lead.status)}
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-label-mono-sm text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-surface-container-high">
                                {lead.source}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {lead.assignedStaff === 'Unassigned' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error/10 text-error font-label-mono-sm text-[11px] font-semibold">
                                  <span className="material-symbols-outlined text-[13px]">warning</span>
                                  Unassigned
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-mono-sm text-[10px] font-bold">
                                    {lead.assignedStaff
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join('')}
                                  </div>
                                  <span className="text-on-surface text-xs font-medium">
                                    {lead.assignedStaff}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="text-on-surface font-label-mono-sm text-xs">
                                {lead.age}
                              </div>
                              <div className="text-tertiary font-label-mono-sm text-[10px]">
                                SLA OK
                              </div>
                            </td>

                            <td
                              className="py-3.5 px-4 text-right whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                  onClick={() => handleOpenAssign(lead)}
                                  title="Reassign Staff"
                                >
                                  <span className="material-symbols-outlined text-[17px]">
                                    person_add
                                  </span>
                                </button>
                                <button
                                  className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                                  onClick={() => handleOpenSchedule(lead)}
                                  title="Schedule Survey"
                                >
                                  <span className="material-symbols-outlined text-[17px]">
                                    event_available
                                  </span>
                                </button>
                                <button
                                  className="p-1 rounded bg-primary-container text-on-primary-container hover:shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all font-label-mono-sm text-xs font-semibold px-2 flex items-center gap-1 cursor-pointer"
                                  onClick={() => {
                                    setActiveModalLead(lead);
                                    setIsQuoteBuilderModalOpen(true);
                                  }}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    request_quote
                                  </span>
                                  Quote
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Pagination & Operational Counter */}
                  <div className="bg-surface-container-highest/20 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-surface-container-high">
                    <span className="font-label-mono-sm text-on-surface-variant">
                      SHOWING <strong className="text-on-surface">{filteredLeads.length}</strong> OF{' '}
                      <strong className="text-on-surface">{leads.length}</strong> PIPELINE ENTITIES
                    </span>
                    <div className="flex items-center gap-1 font-label-mono-sm">
                      <button
                        className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-40"
                        disabled
                      >
                        PREV
                      </button>
                      <button className="px-2.5 py-1 rounded bg-primary-container text-on-primary-container font-semibold">
                        1
                      </button>
                      <button className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface">
                        2
                      </button>
                      <button className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface">
                        NEXT
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Deep-Dive Reticle / Inspector Panel (4 Cols on 2XL) */}
              <div
                className="2xl:col-span-4 bg-surface-container-low rounded-lg p-5 flex flex-col gap-5 sticky top-20 shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-surface-container-high"
                id="inspectorPanel"
              >
                {selectedLead ? (
                  <>
                    {/* Reticle Header */}
                    <div className="flex items-center justify-between border-b border-surface-container-highest/40 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                        <div>
                          <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                            TELEMETRIC DEEP DIVE
                          </span>
                          <h3 className="font-headline-sm text-base font-bold text-on-surface">
                            {selectedLead.facilityName}
                          </h3>
                        </div>
                      </div>
                      {getStatusBadge(selectedLead.status)}
                    </div>

                    {/* Facility Specs & Camera Payload */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container p-3 rounded border border-surface-container-high">
                        <span className="font-label-mono-sm text-xs text-outline uppercase block font-semibold">
                          PAYLOAD SPEC
                        </span>
                        <span className="font-headline-sm text-xs font-bold text-on-surface block mt-0.5 leading-snug">
                          {selectedLead.cameraCountSpec}
                        </span>
                      </div>
                      <div className="bg-surface-container p-3 rounded border border-surface-container-high">
                        <span className="font-label-mono-sm text-xs text-outline uppercase block font-semibold">
                          ESTIMATED VALUATION
                        </span>
                        <span className="font-headline-sm text-lg font-bold text-tertiary block mt-0.5">
                          {selectedLead.valuation}
                        </span>
                      </div>
                    </div>

                    {/* Facility Location & Visual Snapshot Frame */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-label-mono-sm uppercase font-semibold">
                          FACILITY VISUAL RECON
                        </span>
                        <span className="font-label-mono-sm text-primary font-semibold">
                          {selectedLead.region}
                        </span>
                      </div>

                      {/* Simulated Hardware / Site Viewport */}
                      <div className="relative w-full h-36 bg-surface-container rounded overflow-hidden group border border-surface-container-high">
                        <img
                          src={selectedLead.imageUrl}
                          alt="Surveillance view"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md font-label-mono-sm text-[10px] text-tertiary font-bold border border-tertiary/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                          SITE SURVEY: 14 OCT 2024 (COMPLETED)
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md font-label-mono-sm text-[10px] text-outline border border-surface-container-high">
                          CH-32 // CODEC H.265
                        </div>
                      </div>
                    </div>

                    {/* Contact Vector Details */}
                    <div className="bg-surface-container p-3 rounded flex flex-col gap-2 border border-surface-container-high">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Primary Stakeholder</span>
                        <span className="font-semibold text-on-surface">{selectedLead.contactName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Phone Vector</span>
                        <span className="font-label-mono-sm text-primary font-semibold">
                          {selectedLead.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant font-medium">Assigned Lead</span>
                        <span className="text-on-surface font-label-mono-sm font-semibold">
                          {selectedLead.assignedStaff}
                        </span>
                      </div>
                    </div>

                    {/* Activity Audit Timeline */}
                    <div className="flex flex-col gap-2">
                      <span className="font-label-mono-sm text-xs text-outline uppercase tracking-wider font-semibold">
                        EVENT AUDIT LOG
                      </span>
                      <div className="flex flex-col gap-2.5 pl-2 border-l-2 border-surface-container-highest/60">
                        {selectedLead.timeline.map((event, idx) => (
                          <div key={idx} className="flex flex-col text-xs">
                            <span className="font-medium text-on-surface">{event}</span>
                            <span className="font-label-mono-sm text-[10px] text-on-surface-variant">
                              System Verified Event
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Primary Action Buttons inside Deep Dive */}
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        className="w-full py-2.5 rounded bg-primary-container text-on-primary-container font-headline-sm text-xs font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => {
                          setActiveModalLead(selectedLead);
                          setIsQuoteBuilderModalOpen(true);
                        }}
                      >
                        <span className="material-symbols-outlined text-[18px]">request_quote</span>
                        Launch Full Quote Builder ({selectedLead.valuation})
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-surface-container-high cursor-pointer"
                          onClick={() => handleOpenSchedule(selectedLead)}
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            edit_calendar
                          </span>
                          Survey Slot
                        </button>
                        <button
                          className="py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-surface-container-high cursor-pointer"
                          onClick={() => handleOpenAssign(selectedLead)}
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            assignment_ind
                          </span>
                          Reassign
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-outline">Select a lead to inspect details</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Assign Staff */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low  w-full rounded-lg p-6 shadow-2xl flex flex-col gap-5 border border-surface-container-high animate-scale-in">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">assignment_ind</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Assign Operations Lead
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-outline hover:text-on-surface text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant">
              Reassign active ticket for{' '}
              <strong className="text-on-surface">{activeModalLead?.contactName}</strong> (
              {activeModalLead?.facilityName}).
            </p>

            <div className="flex flex-col gap-2">
              {staff.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStaff(st)}
                  className={`p-3 rounded text-left flex items-center justify-between transition-colors border cursor-pointer ${
                    selectedStaff === st
                      ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                      : 'bg-surface-container text-on-surface border-surface-container-high hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs font-mono">{st}</span>
                  {selectedStaff === st && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-mono-sm text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssign}
                className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold rounded font-label-mono-sm text-xs transition-all cursor-pointer"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Schedule Survey Slot */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low  w-full rounded-lg p-6 shadow-2xl flex flex-col gap-5 border border-surface-container-high animate-scale-in">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">event_available</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Dispatch &amp; Reserve Survey Slot
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-outline hover:text-on-surface text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant">
              Confirm technician dispatch schedule for{' '}
              <strong className="text-on-surface">{activeModalLead?.facilityName}</strong>.
            </p>

            <div className="flex flex-col gap-2">
              {[
                'Today, 14:00 - 16:30 (Immediate)',
                'Tomorrow, 09:30 - 12:00',
                'Tomorrow, 14:00 - 16:30',
                'Friday, 10:00 - 13:00',
              ].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setScheduleSlot(slot)}
                  className={`p-3 rounded text-left flex items-center justify-between transition-colors border cursor-pointer ${
                    scheduleSlot === slot
                      ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                      : 'bg-surface-container text-on-surface border-surface-container-high hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-xs font-mono">{slot}</span>
                  {scheduleSlot === slot && (
                    <span className="material-symbols-outlined text-sm">check</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-mono-sm text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSchedule}
                className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold rounded font-label-mono-sm text-xs transition-all cursor-pointer"
              >
                Lock Survey Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ingest New Lead */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low  w-full rounded-lg p-6 shadow-2xl flex flex-col gap-5 border border-surface-container-high animate-scale-in">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Ingest New Enterprise Lead
                </h3>
              </div>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-outline hover:text-on-surface text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Contact Stakeholder
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Facility Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Apex Marine Terminal"
                    value={newLeadFacility}
                    onChange={(e) => setNewLeadFacility(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Phone Vector
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-9000"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    placeholder="security@terminal.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Target Valuation
                  </label>
                  <input
                    type="text"
                    value={newLeadValuation}
                    onChange={(e) => setNewLeadValuation(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                    Lead Source
                  </label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value)}
                    className="bg-surface-container p-2.5 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Inbound Call">Inbound Call</option>
                    <option value="Website Survey Form">Website Survey Form</option>
                    <option value="Partner Referral">Partner Referral</option>
                    <option value="Catalog Add-to-Quote">Catalog Add-to-Quote</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-mono-sm text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold rounded font-label-mono-sm text-xs transition-all cursor-pointer shadow-md"
                >
                  Create &amp; Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Quote Builder Preview */}
      {isQuoteBuilderModalOpen && activeModalLead && (
        <div className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low  w-full rounded-lg p-6 shadow-2xl flex flex-col gap-5 border border-surface-container-high animate-scale-in">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Quote Builder // {activeModalLead.facilityName}
                </h3>
              </div>
              <button
                onClick={() => setIsQuoteBuilderModalOpen(false)}
                className="text-outline hover:text-on-surface text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-surface-container p-4 rounded-lg space-y-3 font-mono text-xs border border-surface-container-high">
              <div className="flex justify-between text-on-surface-variant">
                <span>STAKEHOLDER:</span>
                <span className="text-on-surface font-semibold">{activeModalLead.contactName}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>SPECIFICATION:</span>
                <span className="text-on-surface font-semibold">
                  {activeModalLead.cameraCountSpec}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>SYSTEM VALUATION:</span>
                <span className="text-tertiary font-bold text-sm">
                  {activeModalLead.valuation}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>SLA LEVEL:</span>
                <span className="text-secondary font-semibold">Tier II Enterprise (4-Hour SOC)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onUpdateLead({
                    ...activeModalLead,
                    status: 'QUOTED',
                    timeline: [
                      `Formal Quote QTE-${Math.floor(1000 + Math.random() * 9000)} issued`,
                      ...activeModalLead.timeline,
                    ],
                  });
                  setIsQuoteBuilderModalOpen(false);
                }}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary rounded font-label-mono-sm text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
                Issue &amp; Transmit Encrypted Quote Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
