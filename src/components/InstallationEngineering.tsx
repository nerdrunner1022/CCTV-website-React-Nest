import React, { useState } from 'react';
import { PageView } from '../types';

interface InstallationEngineeringProps {
  onNavigate: (page: PageView) => void;
  onBookSurvey: (leadData?: any) => void;
}

export const InstallationEngineering: React.FC<InstallationEngineeringProps> = ({
  onNavigate,
  onBookSurvey,
}) => {
  const [facilityType, setFacilityType] = useState('warehouse');
  const [cameraCount, setCameraCount] = useState(24);
  const [surveyDate, setSurveyDate] = useState('2025-05-15');
  const [sqFootage, setSqFootage] = useState('75,000 sq ft');
  const [contactName, setContactName] = useState('Marcus Vance, Director of Security');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [email, setEmail] = useState('vance.security@industrialcorp.com');
  const [submitted, setSubmitted] = useState(false);

  const poeDraw = cameraCount * 15;
  const estStorage = cameraCount <= 16 ? '24TB RAID-5' : cameraCount <= 32 ? '48TB RAID-6' : cameraCount <= 64 ? '96TB RAID-6' : '192TB SAN';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookSurvey({
      name: contactName,
      facility: `${facilityType.toUpperCase()} Facility (${sqFootage})`,
      phone,
      email,
      cameras: `${cameraCount} Nodes (${estStorage})`,
      source: 'Installation & Engineering Page',
      date: surveyDate,
    });
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Telemetric Status Ribbon */}
      <section className="w-full bg-surface-container-lowest px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-label-mono-sm text-label-mono-sm text-tertiary">
              FIELD FLEET ACTIVE: 48 RAPID-TEAMS DISPATCHED
            </span>
          </div>
          <span className="text-outline hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
            <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
            <span>BICSI RCDD #204918 CERTIFIED SUPERVISORS ON-SITE</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
          <span>
            AVERAGE ROLLOUT SLA: <span className="text-on-surface font-bold">99.98% ON-SCHEDULE</span>
          </span>
          <span className="text-outline">|</span>
          <span className="text-secondary font-mono">REG-CODE: C-7/C-10 LOW VOLTAGE</span>
        </div>
      </section>

      {/* Hero Header Section with Glassmorphic Telemetry Overlay */}
      <section className="relative w-full   px-6 lg:px-12 py-12 lg:py-16 overflow-hidden">
        {/* Ambient Luminous Gradient Underlay */}
        <div className="absolute -top-32 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded w-fit">
              <span className="material-symbols-outlined text-primary text-base">engineering</span>
              <span className="font-label-mono-sm text-label-mono-sm text-primary tracking-widest uppercase">
                Field Engineering Division
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">///</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                DOC.REV 2025.4
              </span>
            </div>

            <h1 className="font-display-hero text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-none">
              Certified Enterprise CCTV Installation &amp;{' '}
              <span className="text-primary underline decoration-primary-container decoration-4 underline-offset-8">
                Infrastructure Engineering
              </span>
            </h1>

            <p className="font-body-lg text-lg text-on-surface-variant  leading-relaxed">
              From single-facility deployment to multi-site national rollout. Fully licensed, insured, and BICSI/OSHA certified master technicians delivering mil-spec physical telemetry conduits and optical sensory nodes.
            </p>

            {/* Rapid Badges Stack */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded border border-surface-container-high">
                <span className="material-symbols-outlined text-tertiary text-lg">shield</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface">OSHA-30 Certified Crews</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded border border-surface-container-high">
                <span className="material-symbols-outlined text-primary text-lg">cable</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface">Cat6A Plenum &amp; OM4 Fiber</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded border border-surface-container-high">
                <span className="material-symbols-outlined text-secondary text-lg">military_tech</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface">NDAA &amp; UL 2043 Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded border border-surface-container-high">
                <span className="material-symbols-outlined text-tertiary text-lg">verified</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface">$10M Umbrella Liability</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#survey-form"
                className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-headline-sm text-label-mono-lg px-6 py-3.5 rounded shadow-xl transition-all cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                <span>BOOK EXPEDITED ON-SITE SURVEY</span>
              </a>
              <a
                href="#service-matrix"
                className="inline-flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono-lg text-label-mono-lg px-6 py-3.5 rounded transition-all cursor-pointer border border-surface-container-highest font-semibold"
              >
                <span className="material-symbols-outlined text-lg">dataset</span>
                <span>COMPARE SLAs &amp; TIERS</span>
              </a>
            </div>
          </div>

          {/* Asymmetrical Hero Visual Element with live feed metrics */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-2xl border border-surface-container-high">
              <img
                className="w-full h-80 object-cover opacity-80"
                alt="Tactical network engineer terminating fiber optic cables in modern enterprise server room"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIaWMTQS_lcuae0UkaHeyulDYpaAHu0UeO6DgZUhl9WIPH3yHyVidVoFH9zTso-zLFqOc0p6zXYp9aoU8SWHxmYU_Jo4i0smXtmP4CHmTneyuBptnUDCr1pePcHwawavwxIi80Kt8xNT-Wbw1xBP_UlpENr_W-cDAiLuNlr34MTiTumk95Ee0vdQQPDo2rSjJSH6EBtxJPYZ1FnY9Y4VRO4Tce90sEqCxf2Hyd5VN9WJOk9wCTdxYvoA"
              />

              {/* Tactical HUD Frame Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded font-label-mono-sm text-label-mono-sm text-primary flex items-center gap-1.5 border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    ACTIVE RIGGING // SITE_ID: NYC-DC-04
                  </span>
                  <span className="bg-surface-container-lowest/90 backdrop-blur-md px-2 py-1 rounded font-label-mono-sm text-label-mono-sm text-on-surface-variant border border-surface-container-high">
                    FPS: 60 | LATENCY: 4ms
                  </span>
                </div>

                <div className="bg-surface-container/95 backdrop-blur-lg p-4 rounded shadow-lg flex flex-col gap-2 border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-base text-on-surface font-bold">
                      Optic Spine Rigging
                    </span>
                    <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-bold">
                      100% FLUKETESTER VERIFIED
                    </span>
                  </div>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Rigorous OTDR loss testing &lt; 0.15 dB/km across dual redundant armored lines.
                  </p>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-tertiary h-full rounded-full w-11/12"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Telemetry Card */}
            <div className="absolute -bottom-6 -left-6 bg-surface-container-high/95 backdrop-blur-xl p-4 rounded-lg shadow-2xl hidden sm:flex items-center gap-4 border border-surface-container-highest">
              <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">satellite_alt</span>
              </div>
              <div>
                <span className="font-label-mono-sm text-label-mono-sm text-outline block">COVERAGE FIDELITY</span>
                <span className="font-headline-sm text-lg text-on-surface font-bold">360° Zero-Blindspot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Installation Workflow Section */}
      <section className="w-full bg-surface-container-low py-16 px-6 lg:px-12 border-y border-surface-container-high/40">
        <div className="  flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">timeline</span>
                <span>Standard Operating Procedure</span>
              </div>
              <h2 className="font-headline-lg text-3xl lg:text-4xl font-bold text-on-surface tracking-tight">
                4-Step Mission-Critical Workflow
              </h2>
              <p className="font-body-md text-base text-on-surface-variant  mt-2 leading-relaxed">
                Our deployment doctrine removes single points of failure through pre-construction simulation, mil-spec physical assembly, hardened network configuration, and AI vector training.
              </p>
            </div>
            <div className="bg-surface-container px-4 py-2 rounded flex items-center gap-3 border border-surface-container-high">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold">
                TUV ISO 9001:2015 AUDITED DEPLOYMENT PIPELINE
              </span>
            </div>
          </div>

          {/* Bento Grid 4 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phase 01 */}
            <div className="bg-surface-container hover:bg-surface-container-high transition-all p-6 rounded-xl flex flex-col justify-between gap-6 group shadow-md border border-surface-container-high">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-lg text-label-mono-sm text-primary bg-primary/10 px-2.5 py-1 rounded font-bold">
                    01 // HEATMAP
                  </span>
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">
                    radar
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    Precision Site Survey &amp; RF Heatmapping
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mt-3 leading-relaxed">
                    Drone exterior elevation audits, full 3D building architectural LiDAR modeling, and sensor-cone blind spot eradication calculations prior to any physical penetrations.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4 bg-surface-container-lowest/60 p-3 rounded">
                <span className="font-label-mono-sm text-label-mono-sm text-outline">PRIMARY DELIVERABLE:</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  3D CAD Coverage Vector Heatmap
                </span>
              </div>
            </div>

            {/* Phase 02 */}
            <div className="bg-surface-container hover:bg-surface-container-high transition-all p-6 rounded-xl flex flex-col justify-between gap-6 group shadow-md border border-surface-container-high">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-lg text-label-mono-sm text-secondary bg-secondary-container/20 px-2.5 py-1 rounded font-bold">
                    02 // RIGGING
                  </span>
                  <span className="material-symbols-outlined text-secondary text-2xl group-hover:scale-110 transition-transform">
                    bolt
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
                    Structured Cabling &amp; Hardware Rigging
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mt-3 leading-relaxed">
                    Plenum-rated shielded Cat6A/fiber optic backbones, weather-sealed EMT and rigid conduits, seismic brackets, and industrial PoE++ power distributions rated for sustained loads.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4 bg-surface-container-lowest/60 p-3 rounded">
                <span className="font-label-mono-sm text-label-mono-sm text-outline">PRIMARY DELIVERABLE:</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Fluke DSX-8000 Certified Certs
                </span>
              </div>
            </div>

            {/* Phase 03 */}
            <div className="bg-surface-container hover:bg-surface-container-high transition-all p-6 rounded-xl flex flex-col justify-between gap-6 group shadow-md border border-surface-container-high">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-lg text-label-mono-sm text-tertiary bg-tertiary/10 px-2.5 py-1 rounded font-bold">
                    03 // HARDENING
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-2xl group-hover:scale-110 transition-transform">
                    terminal
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">
                    Network Architecture &amp; VMS Hardening
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mt-3 leading-relaxed">
                    Air-gapped 802.1Q VLAN segmentation, NextGen zero-trust firewall routing, cryptographic PostgreSQL audit trail logging, and local RAID 6 failover storage orchestration.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4 bg-surface-container-lowest/60 p-3 rounded">
                <span className="font-label-mono-sm text-label-mono-sm text-outline">PRIMARY DELIVERABLE:</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  NIST 800-53 Pen-Test Signoff
                </span>
              </div>
            </div>

            {/* Phase 04 */}
            <div className="bg-surface-container hover:bg-surface-container-high transition-all p-6 rounded-xl flex flex-col justify-between gap-6 group shadow-md border border-surface-container-high">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-mono-lg text-label-mono-sm text-primary bg-primary-container/20 px-2.5 py-1 rounded font-bold">
                    04 // TRAINING
                  </span>
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">
                    model_training
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    AI Calibration &amp; Handover Training
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mt-3 leading-relaxed">
                    Perimeter tripwire tuning, edge false-positive reduction, biometric access coordination, multi-platform remote viewing clients, and 24/7 SOC escalation protocols.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4 bg-surface-container-lowest/60 p-3 rounded">
                <span className="font-label-mono-sm text-label-mono-sm text-outline">PRIMARY DELIVERABLE:</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Full Operator Credential Pack &amp; Runbook
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface-container rounded-xl border border-surface-container-high">
            <div className="flex flex-col">
              <span className="font-label-mono-sm text-label-mono-sm text-outline">RUNS PULLED YTD</span>
              <span className="font-display-hero text-3xl font-extrabold text-primary">2.4M ft</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Shielded CMP Plenum Specs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-mono-sm text-label-mono-sm text-outline">FIRST-PASS INSPECTION</span>
              <span className="font-display-hero text-3xl font-extrabold text-tertiary">99.4%</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Municipal Code Compliance</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-mono-sm text-label-mono-sm text-outline">MEAN TIME TO DEPLOY</span>
              <span className="font-display-hero text-3xl font-extrabold text-secondary">72 hrs</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Turnkey Up to 32 Nodes</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-mono-sm text-label-mono-sm text-outline">CRITICAL SLA DISPATCH</span>
              <span className="font-display-hero text-3xl font-extrabold text-on-surface">&lt; 4 hrs</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Guaranteed Truck Roll</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Service Packages Comparison Table */}
      <section className="w-full   px-6 lg:px-12 py-16" id="service-matrix">
        <div className="flex flex-col gap-4 text-center   mb-12">
          <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest font-bold">
            SLA Engineering Tiers
          </span>
          <h2 className="font-headline-lg text-3xl lg:text-4xl font-bold text-on-surface">
            Engineered Deployment Packages
          </h2>
          <p className="font-body-md text-base text-on-surface-variant">
            Every tier includes professional cabling, certified termination, and direct access to Level-3 engineering leads. Select the scale appropriate to your risk profile.
          </p>
        </div>

        {/* Pricing / Service Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tier 1: Commercial Standard */}
          <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between gap-8 relative shadow-lg border border-surface-container-high">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-sm text-label-mono-sm text-secondary bg-surface-container-high px-3 py-1 rounded font-semibold">
                  TIER I // SMB &amp; RETAIL
                </span>
                <span className="material-symbols-outlined text-outline">storefront</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Commercial Standard</h3>
                <p className="font-body-sm text-sm text-on-surface-variant mt-2 leading-relaxed">
                  For commercial storefronts, single-story logistics, and local professional offices requiring high-definition audit clarity.
                </p>
              </div>
              <div className="flex items-baseline gap-2 bg-surface-container-low p-4 rounded border border-surface-container-high">
                <span className="font-display-hero-mobile text-3xl text-on-surface font-bold">4 – 16</span>
                <span className="font-label-mono-md text-label-mono-sm text-outline uppercase font-semibold">
                  Sensory Channels
                </span>
              </div>
              {/* Feature Breakdown */}
              <ul className="flex flex-col gap-3 font-body-sm text-sm text-on-surface">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Complimentary 2D Site Survey &amp; Lens Matrix</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>EMT Conduit &amp; Direct-Burial Drop Lines</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>iOS, Android &amp; Web Desktop Console</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>2-Year Workmanship &amp; Rigging Warranty</span>
                </li>
                <li className="flex items-center gap-3 text-outline">
                  <span className="material-symbols-outlined text-outline text-lg">remove</span>
                  <span>Redundant NVR Storage Matrix</span>
                </li>
                <li className="flex items-center gap-3 text-outline">
                  <span className="material-symbols-outlined text-outline text-lg">remove</span>
                  <span>Guaranteed 4-Hour On-Site SLA</span>
                </li>
              </ul>
            </div>
            <a
              href="#survey-form"
              className="w-full text-center py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono-sm text-label-mono-sm uppercase tracking-wider rounded transition-colors font-bold border border-surface-container-highest"
            >
              Configure Tier I Deployment
            </a>
          </div>

          {/* Tier 2: Enterprise High-Security (Featured) */}
          <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between gap-8 relative shadow-2xl scale-100 lg:-translate-y-2 border-2 border-primary/40">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-mono-sm text-label-mono-sm uppercase px-4 py-1 rounded-full font-bold shadow-md">
              MOST REQUESTED ARCHITECTURE
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-sm text-label-mono-sm text-primary bg-primary/10 px-3 py-1 rounded font-semibold">
                  TIER II // CAMPUS &amp; FACTORY
                </span>
                <span className="material-symbols-outlined text-primary">domain</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Enterprise High-Security</h3>
                <p className="font-body-sm text-sm text-on-surface-variant mt-2 leading-relaxed">
                  For multi-building campuses, manufacturing facilities, corporate headquarters, and high-turnover fulfillment centers.
                </p>
              </div>
              <div className="flex items-baseline gap-2 bg-surface-container p-4 rounded border border-surface-container-high">
                <span className="font-display-hero-mobile text-3xl text-primary font-bold">16 – 64</span>
                <span className="font-label-mono-md text-label-mono-sm text-outline uppercase font-semibold">
                  Sensory Channels
                </span>
              </div>
              {/* Feature Breakdown */}
              <ul className="flex flex-col gap-3 font-body-sm text-sm text-on-surface">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>LiDAR Aerial Drone Heatmap &amp; RF Simulation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>OM4 Multi-Mode Optical Backbone Distribution</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Isolated L2/L3 Secure VLAN &amp; 802.1X Auth</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>RAID 6 Local Archival with Encrypted Cloud Sync</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>5-Year All-Inclusive Workmanship Warranty</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span className="font-semibold text-tertiary">8-Hour Rapid Dispatch SLA</span>
                </li>
              </ul>
            </div>
            <a
              href="#survey-form"
              className="w-full text-center py-3.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-headline-sm text-label-mono-sm uppercase tracking-wider rounded transition-all shadow-lg font-bold"
            >
              Configure Tier II Deployment
            </a>
          </div>

          {/* Tier 3: Critical Infrastructure Custom */}
          <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between gap-8 relative shadow-lg border border-surface-container-high">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary bg-surface-container-high px-3 py-1 rounded font-semibold">
                  TIER III // DEFENSE &amp; DATA CENTERS
                </span>
                <span className="material-symbols-outlined text-tertiary">security</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Critical Infrastructure</h3>
                <p className="font-body-sm text-sm text-on-surface-variant mt-2 leading-relaxed">
                  For utilities, defense contractors, data server farms, and government installations demanding complete failover resiliency.
                </p>
              </div>
              <div className="flex items-baseline gap-2 bg-surface-container-low p-4 rounded border border-surface-container-high">
                <span className="font-display-hero-mobile text-3xl text-on-surface font-bold">64+</span>
                <span className="font-label-mono-md text-label-mono-sm text-outline uppercase font-semibold">
                  High-Bandwidth Matrix
                </span>
              </div>
              {/* Feature Breakdown */}
              <ul className="flex flex-col gap-3 font-body-sm text-sm text-on-surface">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Full Electromagnetic &amp; RF Counter-Interference Audit</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Active-Active Dual Hot-Standby VMS Server Clusters</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>FIPS 140-3 Hardware Cryptographic Enclaves</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Custom Perimeter Thermal + Radar Edge Stacks</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span>Lifetime Structural Conformance &amp; Conduit Guarantee</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
                  <span className="font-bold text-primary">Strict 4-Hour On-Site Emergency SOC SLA</span>
                </li>
              </ul>
            </div>
            <a
              href="#survey-form"
              className="w-full text-center py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-mono-sm text-label-mono-sm uppercase tracking-wider rounded transition-colors font-bold border border-surface-container-highest"
            >
              Engage Custom Engineering Team
            </a>
          </div>
        </div>
      </section>

      {/* Technical Installation Photo Showcase & Credentials */}
      <section className="w-full bg-surface-container-lowest py-16 px-6 lg:px-12 border-t border-surface-container-high/40">
        <div className="  flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest block mb-2 font-bold">
                On-Site Rigging Standards
              </span>
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
                Hardware Rigging &amp; Structured Conduits in the Field
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-semibold">
                BICSI CORPORATE MEMBER ID #48201
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo 1 */}
            <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg flex flex-col border border-surface-container-high">
              <img
                className="w-full h-56 object-cover"
                alt="Close up photograph of meticulously organized industrial server rack with color coded blue and black Cat6A patch panels"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDElgKEf2gSS5WjmGiWf9SAqoAgCSlKdW9AO6TokHUNUnqKIPqw_trafS9cfCiC3Ts94OAd17Cx3xTzKhfTTjS3kPSDS_uY9vM0xDEvr8ZpdxPoYl-zYg0R8B6UCeOd6n15060d6d9wJMFWGACDFW2_GEC2JDJt88xA-cM4r9kTVlYTdmTW1y36MJyL51g1v5yu8mC_cf8o-a4hS3ywkQNriTT5I84RoKCfgbSnzQHMHq6FP1q9t8hHGQ"
              />
              <div className="p-5 flex flex-col gap-2">
                <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold">
                  STRUCTURED CABLING // 10G BACKBONE
                </span>
                <span className="font-headline-sm text-base font-bold text-on-surface">
                  Zero-Bend-Radius Fiber Distribution
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Every drop is Velcro-bundled, strain-relieved, and terminated to EIA/TIA 568.2-D standards with laser-printed telecommunication tags.
                </p>
              </div>
            </div>

            {/* Photo 2 */}
            <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg flex flex-col border border-surface-container-high">
              <img
                className="w-full h-56 object-cover"
                alt="Industrial PTZ dome camera mounted on rigid galvanized steel exterior parapet bracket"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSUf67FbblF8IDWAzjCgNGsH01MPwA_EVjGLm155wQHkdsy70c0AULmVQXS4f2YEajIF9pfqLzGlSRbmWB239aN3jPtjSXGSdyP10UcsSq7JVO0Qoes5r0U6FhTQDAnsFhNkj-3qvKpAJnfoRxi5522OO6TgoE50CS90wHlgI54dXwZUMIb7A1phptyQ6clkef55CAARa1O7PjKIjOrKoV7yKbHZg53c8N8Yb37Y2P3SgpQ0hbXJC5MA"
              />
              <div className="p-5 flex flex-col gap-2">
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                  EXTERIOR PARAPET RIGGING
                </span>
                <span className="font-headline-sm text-base font-bold text-on-surface">
                  Seismic &amp; Weather-Sealed Bracing
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  NEMA 4X / IP67 watertight junctions equipped with dual gas-tube surge suppression for sustained exterior longevity.
                </p>
              </div>
            </div>

            {/* Photo 3 */}
            <div className="bg-surface-container rounded-xl overflow-hidden shadow-lg flex flex-col border border-surface-container-high">
              <img
                className="w-full h-56 object-cover"
                alt="Enterprise security operations center SOC showing multi-panel video walls"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ0e5P5zRIiDhJJV1p7OHeIoTMgpzIa9so72VObbWnQJQyb3VfwGL5qI6Zwp5Fw8KE6RVy2YqWCPVDKmV7s7ys1P6k4juNBO1sDNkiBfi35XNfqy15DJosv4M2l7pTRP1qAiAIAFwdatG0ZvUlNHisTxPZYjbg3wSMB-7nggQKqc_WZwIK-0EJX5RmgBfq3XVD323Qqc4_27beyE41l5JSQiuA86tiuBDw6mNxP7lleCwGKjed7I2Trw"
              />
              <div className="p-5 flex flex-col gap-2">
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-bold">
                  VMS SOC COMMISSIONING
                </span>
                <span className="font-headline-sm text-base font-bold text-on-surface">
                  Failover Archival &amp; Video Walls
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Sub-second video decoding matrices configured with automated PostgreSQL audit logs and biometric perimeter controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Site Survey & Consultation Booking Form + Credentials Showcase */}
      <section className="w-full   px-6 lg:px-12 py-16" id="survey-form">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 bg-surface-container rounded-xl p-8 lg:p-10 shadow-2xl flex flex-col gap-8 border border-surface-container-high">
            <div>
              <div className="flex items-center gap-2 text-primary font-label-mono-sm text-label-mono-sm uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">schedule_send</span>
                <span>Direct Field Dispatch</span>
              </div>
              <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
                Schedule On-Site Engineering Survey
              </h2>
              <p className="font-body-md text-base text-on-surface-variant mt-2 leading-relaxed">
                Our Senior Field Architect will inspect your structure, generate a 3D coverage model, test line drops, and deliver a formal fixed-bid quote within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-tertiary/40 flex flex-col gap-4 text-center items-center">
                <span className="w-12 h-12 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                    Survey Dispatch Transmitted!
                  </h3>
                  <p className="font-body-sm text-sm text-on-surface-variant mt-1">
                    Engineering Team Lead David K. Chen has been assigned to ticket <strong className="text-primary font-mono">SRV-2025-91</strong>. You will receive an encrypted confirmation package shortly.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="px-4 py-2 bg-primary-container text-on-primary-container rounded font-label-mono-sm text-label-mono-sm font-bold uppercase tracking-wider hover:bg-primary transition-colors"
                  >
                    View in Admin Pipeline
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-surface-container-high text-on-surface rounded font-label-mono-sm text-label-mono-sm hover:bg-surface-container-highest transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Facility Type Selector */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                    01 // FACILITY CLASSIFICATION
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'warehouse', label: 'Logistics Hub', icon: 'warehouse' },
                      { id: 'office', label: 'Office Campus', icon: 'apartment' },
                      { id: 'retail', label: 'Retail Center', icon: 'shopping_cart' },
                      { id: 'healthcare', label: 'Health / Gov', icon: 'local_hospital' },
                      { id: 'datacenter', label: 'Data Center', icon: 'dns' },
                      { id: 'residential', label: 'Estate / Private', icon: 'cottage' },
                    ].map((f) => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => setFacilityType(f.id)}
                        className={`p-3 rounded text-center font-label-mono-sm text-label-mono-sm transition-all flex flex-col items-center gap-1.5 border cursor-pointer ${
                          facilityType === f.id
                            ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-md'
                            : 'bg-surface-container-low text-on-surface border-surface-container-high hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{f.icon}</span>
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera Count Slider */}
                <div className="flex flex-col gap-3 bg-surface-container-low p-4 rounded-lg border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                      02 // ESTIMATED CAMERA NODES NEEDED
                    </label>
                    <span className="font-label-mono-lg text-label-mono-sm text-primary font-bold bg-surface-container px-3 py-1 rounded border border-surface-container-high">
                      {cameraCount} Cameras
                    </span>
                  </div>
                  <input
                    className="w-full accent-primary h-2 bg-surface-container-high rounded cursor-pointer"
                    max={128}
                    min={4}
                    step={4}
                    type="range"
                    value={cameraCount}
                    onChange={(e) => setCameraCount(Number(e.target.value))}
                  />
                  <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                    <span>Min: 4 Nodes</span>
                    <span className="text-secondary font-mono font-semibold">
                      Est. PoE Draw: {poeDraw}W | Storage: {estStorage}
                    </span>
                    <span>128+ Nodes</span>
                  </div>
                </div>

                {/* Preferred Date & Facility Square Footage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                      03 // PREFERRED SURVEY DATE
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                      required
                      type="date"
                      value={surveyDate}
                      onChange={(e) => setSurveyDate(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                      04 // APPROXIMATE SQ. FOOTAGE
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-label-mono-sm text-label-mono-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                      placeholder="e.g. 75,000 sq ft or 3-story"
                      required
                      type="text"
                      value={sqFootage}
                      onChange={(e) => setSqFootage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                      05 // CONTACT PERSON / TITLE
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-label-mono-sm text-label-mono-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                      placeholder="Marcus Vance, Director of Security"
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                      06 // DIRECT PHONE OR EXTENSION
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-label-mono-sm text-label-mono-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                      placeholder="+1 (555) 019-2831"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase font-semibold">
                    07 // ENTERPRISE CORPORATE EMAIL
                  </label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-label-mono-sm text-label-mono-sm p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high"
                    placeholder="vance.security@industrialcorp.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="w-full py-4 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-headline-sm text-label-mono-lg uppercase tracking-wider rounded transition-all shadow-xl flex items-center justify-center gap-2 mt-2 font-bold cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>TRANSMIT DISPATCH &amp; LOCK SURVEY WINDOW</span>
                </button>
                <span className="font-label-mono-sm text-label-mono-sm text-outline text-center">
                  NDAA Section 889 Compliant Systems Only. Non-Disclosure Agreement (NDA) automatically attached.
                </span>
              </form>
            )}
          </div>

          {/* Right Column: Technician Credentials & Security Director Endorsements */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Field Director Profile Card */}
            <div className="bg-surface-container rounded-xl p-6 shadow-xl flex flex-col gap-6 border border-surface-container-high">
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/40"
                  alt="David K. Chen portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuYaQcocmOfVgdVXFTuS3BSLZ-RBrL1eQBqXWQIIggcFAqiTdADBroeH7VQrJVAikmkqyZmFggccY0YvhjVROasCKRkd1FMfLMsb8ZQtGqQjSnw_2EN8ioy2mEcGjb4JA9jjPtYEwBdP5rEKdwFTeYLtCCf78DJtVGFY5vUZ5Un-jtjBNmhZI9U2eRwE6xA8ASOheSUAu6nTIsaEqomOhNHIQkhxlv6n9Ht1WN0zNQtdeagaLTcKwtyw"
                />
                <div>
                  <span className="font-headline-sm text-lg font-bold text-on-surface block">
                    David K. Chen, RCDD
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-primary font-bold uppercase">
                    VP of Infrastructure Operations
                  </span>
                  <span className="font-label-mono-sm text-xs text-outline block">
                    22 Years Enterprise Low-Voltage Command
                  </span>
                </div>
              </div>

              <blockquote className="bg-surface-container-low p-4 rounded-lg font-body-sm text-sm text-on-surface-variant italic border-l-2 border-primary leading-relaxed">
                “Surveillance is only as reliable as the conduit carrying the light. We don't do zip-ties or exposed drywall snakes. Every single port we terminate undergoes dual-channel OTDR attenuation certification before power is ever applied to an optical sensor.”
              </blockquote>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-surface-container-high p-3 rounded flex flex-col border border-surface-container-highest">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">LICENSE #</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-bold">
                    C7/C10 #899401
                  </span>
                </div>
                <div className="bg-surface-container-high p-3 rounded flex flex-col border border-surface-container-highest">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">BICSI CREDENTIAL</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-bold">
                    RCDD / ESS Master
                  </span>
                </div>
                <div className="bg-surface-container-high p-3 rounded flex flex-col border border-surface-container-highest">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">BONDED COVERAGE</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-bold">
                    $10M Fidelity
                  </span>
                </div>
                <div className="bg-surface-container-high p-3 rounded flex flex-col border border-surface-container-highest">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline">CLEARANCE</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                    DoD / Secret Capable
                  </span>
                </div>
              </div>
            </div>

            {/* Enterprise Client Testimonial */}
            <div className="bg-surface-container-low rounded-xl p-6 shadow-lg flex flex-col gap-4 border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label-mono-sm text-label-mono-sm text-tertiary font-bold">
                  VERIFIED DEPLOYMENT
                </span>
              </div>
              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                “AegisVision pulled over 120,000 feet of Cat6A plenum through our distribution warehouse in 4 business days. The Fluke test reports were pristine, and their 3D CAD coverage eliminated two chronic blind spots at our rail siding.”
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-surface-container-high font-label-mono-sm text-xs">
                <span className="text-on-surface font-bold">Jameson Logistics Global</span>
                <span className="text-outline">48 Nodes Commissioned</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
