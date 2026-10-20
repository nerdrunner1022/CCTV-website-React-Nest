import React, { useState } from 'react';
import { PageView } from '../types';

interface SystemConfiguratorProps {
  onNavigate: (page: PageView) => void;
  onBookSurvey: (leadData?: any) => void;
  onAddConfigToQuote: (configSummary: any) => void;
}

export const SystemConfigurator: React.FC<SystemConfiguratorProps> = ({
  onNavigate,
  onBookSurvey,
  onAddConfigToQuote,
}) => {
  // Config state
  const [propertyType, setPropertyType] = useState('warehouse');
  const [sqft, setSqft] = useState(85000);
  const [domeCount, setDomeCount] = useState(12);
  const [ptzCount, setPtzCount] = useState(2);
  const [thermalCount, setThermalCount] = useState(1);
  const [storageType, setStorageType] = useState<'on-prem' | 'hybrid-cloud'>('on-prem');
  const [retentionDays, setRetentionDays] = useState<30 | 60 | 90>(60);
  const [slaType, setSlaType] = useState<'self' | 'turnkey' | 'soc'>('turnkey');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Prices
  const domePrice = 540;
  const ptzPrice = 1850;
  const thermalPrice = 3400;

  const totalDomesCost = domeCount * domePrice;
  const totalPtzCost = ptzCount * ptzPrice;
  const totalThermalCost = thermalCount * thermalPrice;
  const totalHardwareOnly = totalDomesCost + totalPtzCost + totalThermalCost;

  // Storage calculation
  const totalCameras = domeCount + ptzCount + thermalCount;
  const baseStorageTB = Math.max(16, Math.ceil((totalCameras * 2.2 * (retentionDays / 30)) / 16) * 16);
  const storageCost = storageType === 'on-prem' ? (baseStorageTB <= 32 ? 2450 : baseStorageTB <= 64 ? 2950 : 4200) : 0;
  const storageMonthly = storageType === 'hybrid-cloud' ? totalCameras * 18 : 0;

  // Rigging / Cabling cost
  let cablingCost = 0;
  let slaMonthly = 0;
  if (slaType === 'self') {
    cablingCost = 0;
    slaMonthly = 0;
  } else if (slaType === 'turnkey') {
    cablingCost = 1500 + totalCameras * 90;
    slaMonthly = 0;
  } else if (slaType === 'soc') {
    cablingCost = 1800 + totalCameras * 110;
    slaMonthly = 450;
  }

  const hardwareSubtotal = totalHardwareOnly + storageCost;
  const totalInvestment = hardwareSubtotal + cablingCost;
  const totalMonthly = storageMonthly + slaMonthly;
  const monthlyLeaseEstimate = Math.round((totalInvestment / 36) * 1.08);

  const poeBudget = domeCount * 12 + ptzCount * 45 + thermalCount * 25;
  const trunkBandwidth = Math.round(domeCount * 6.5 + ptzCount * 12 + thermalCount * 8);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleExportPdf = () => {
    showToast(`PDF Spec Sheet generated: CFG-${Math.floor(1000 + Math.random() * 9000)}-NDAA downloaded.`);
    onAddConfigToQuote({
      name: `Custom Topology (${totalCameras} Nodes, ${propertyType.toUpperCase()})`,
      domes: domeCount,
      ptzs: ptzCount,
      thermals: thermalCount,
      storage: `${baseStorageTB}TB RAID-5`,
      totalInvestment,
      monthly: totalMonthly,
    });
  };

  const handleBookSurvey = () => {
    onBookSurvey({
      facility: `${propertyType.toUpperCase()} (${sqft.toLocaleString()} sq ft)`,
      cameras: `${totalCameras} Nodes (${domeCount} Domes, ${ptzCount} PTZs, ${thermalCount} Thermal)`,
      storage: `${baseStorageTB}TB (${storageType})`,
      sla: slaType.toUpperCase(),
      source: 'System Configurator & Estimator',
    });
  };

  const handleSendProcure = () => {
    showToast(`BOM RFP transmitted to Aegis Enterprise Sales Desk & Purchasing Portal.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* System Architecture Breadcrumb & Live Caliper Header */}
      <div className="w-full bg-surface-container-lowest px-6 lg:px-12 py-4 border-b border-surface-container-high/40">
        <div className="  flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-mono-sm text-label-mono-sm uppercase tracking-widest font-bold">
              CFG-ENGINE v4.8
            </span>
            <div className="flex items-center gap-2 font-label-mono-sm text-label-mono-sm text-outline">
              <span>SPEC_BUILDER</span>
              <span className="text-on-surface-variant">/</span>
              <span className="text-primary font-semibold">ENTERPRISE_BOM_CALCULATOR</span>
            </div>
          </div>
          <div className="flex items-center gap-6 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span>
                AUTOSAVE: <span className="text-on-surface font-semibold">SYNCHRONIZED</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-outline">CURRENCY:</span>
              <span className="text-primary font-bold">USD ($)</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-outline">COMPLIANCE:</span>
              <span className="text-tertiary font-bold">NDAA 889 / UL294</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Configurator Workspace Grid */}
      <div className="  w-full px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Multi-Step Configuration Controls (7 cols on xl) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            {/* Section Intro Banner */}
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden shadow-sm border border-surface-container-high">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest font-bold">
                    TACTICAL ESTIMATION ENGINE
                  </span>
                  <h1 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                    Perimeter Telemetry Architect
                  </h1>
                  <p className="font-body-sm text-sm text-on-surface-variant">
                    Configure enterprise sensors, automated storage arrays, and deployment SLAs. Real-time pricing reflects current enterprise contract rates.
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl opacity-80">tune</span>
              </div>
            </div>

            {/* STEP 1: Property Type & Size */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-5 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    01
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-base lg:text-lg font-bold text-on-surface">
                      Site Profile &amp; Enclosure Footprint
                    </h2>
                    <span className="font-label-mono-sm text-xs text-outline">SELECT OPERATIONAL ENVIRONMENT</span>
                  </div>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-semibold">
                  STEP 1 / 4
                </span>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'warehouse', label: 'Warehouse', desc: 'High-Bay / Port', icon: 'warehouse', defaultSqft: 85000 },
                  { id: 'retail', label: 'Retail Strip', desc: 'High Footfall', icon: 'storefront', defaultSqft: 22000 },
                  { id: 'hq', label: 'Corporate HQ', desc: 'Multi-Floor Campus', icon: 'corporate_fare', defaultSqft: 140000 },
                  { id: 'estate', label: 'Mansion / Estate', desc: 'Private Perimeter', icon: 'chalet', defaultSqft: 18000 },
                ].map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => {
                      setPropertyType(prop.id);
                      setSqft(prop.defaultSqft);
                    }}
                    type="button"
                    className={`text-left p-3.5 rounded-lg transition-all flex flex-col justify-between gap-3 group border cursor-pointer ${
                      propertyType === prop.id
                        ? 'bg-surface-container-high border-primary shadow-sm'
                        : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${
                          propertyType === prop.id ? 'text-primary' : 'text-outline group-hover:text-primary'
                        }`}
                      >
                        {prop.icon}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          propertyType === prop.id ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      >
                        {propertyType === prop.id && (
                          <span className="material-symbols-outlined text-surface text-xs font-bold">check</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface block font-bold leading-tight">
                        {prop.label}
                      </span>
                      <span className="font-label-mono-sm text-xs text-outline">{prop.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* SQFT Slider */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-3 border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <label className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                    <span className="material-symbols-outlined text-sm">straighten</span>
                    Total Monitored Coverage Footprint
                  </label>
                  <div className="flex items-baseline gap-1 bg-surface-container px-3 py-1 rounded border border-surface-container-high">
                    <span className="font-label-mono-lg text-label-mono-sm text-primary font-bold">
                      {sqft.toLocaleString()}
                    </span>
                    <span className="font-label-mono-sm text-xs text-outline">SQ FT</span>
                  </div>
                </div>
                <input
                  className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg cursor-pointer"
                  max={300000}
                  min={5000}
                  step={5000}
                  type="range"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                />
                <div className="flex items-center justify-between font-label-mono-sm text-xs text-outline">
                  <span>5,000 sq ft (Compact)</span>
                  <span>150,000 sq ft</span>
                  <span>300,000+ sq ft (Mega-Site)</span>
                </div>
              </div>
            </div>

            {/* STEP 2: Camera Quantities & Quality */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-5 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    02
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-base lg:text-lg font-bold text-on-surface">
                      Optical &amp; Thermal Sensor Quantities
                    </h2>
                    <span className="font-label-mono-sm text-xs text-outline">
                      HIGH-ASSURANCE PERIMETER TELEMETRY
                    </span>
                  </div>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-semibold">
                  STEP 2 / 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sensor Unit 1 */}
                <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between gap-4 border border-surface-container-high">
                  <div className="space-y-2">
                    <div className="h-28 rounded bg-surface-container-lowest overflow-hidden relative border border-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt="AEGIS D-900 Ultra"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCodP2oWDuoYQSbkMt7-dqLUSPnUXT3ZYg6T9hF1YRRd59A8Gah29C8AFqlEgm1S1t_HxmvUTSziaCftu7wBRCaG1ORvi7fDRCErs8ArZRg6zIxcc8hUBFVxdWxQzndMpzVcmSu7xUnfMkHqRQX6Ua12Th3RgL1HjSc1GVE1JKBRiUsQ1MVNZQZc-YByhDICs8nZ0Tfg9DFYaJ-xGEnSwcC90izi1fdltWG54uxK-i12_jjUAlxzWXI7w"
                      />
                      <span className="absolute top-2 left-2 bg-surface/85 backdrop-blur px-2 py-0.5 rounded font-label-mono-sm text-[10px] text-primary font-bold">
                        4K AI DOME
                      </span>
                    </div>
                    <div>
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                        AEGIS D-900 Ultra
                      </span>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                        Sony Starvis 2 sensor, built-in neural classification, IP67 vandal-proof.
                      </p>
                    </div>
                    <div className="font-label-mono-sm text-xs text-outline flex items-center justify-between pt-1">
                      <span>Unit Rate</span>
                      <span className="text-on-surface font-semibold">$540 / unit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container p-2 rounded border border-surface-container-high">
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setDomeCount(Math.max(0, domeCount - 1))}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <div className="flex items-baseline gap-1">
                      <span className="font-label-mono-lg text-label-mono-sm text-primary font-bold">
                        {domeCount}
                      </span>
                      <span className="font-label-mono-sm text-xs text-outline">UNITS</span>
                    </div>
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setDomeCount(domeCount + 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                {/* Sensor Unit 2 */}
                <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between gap-4 border border-surface-container-high">
                  <div className="space-y-2">
                    <div className="h-28 rounded bg-surface-container-lowest overflow-hidden relative border border-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt="AEGIS P-400 Pan-Tilt"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIAeZApvo5NvSiXx3z7SA3VBsZxbmrLeEG_t7eYl-wjo-1xKMf-fJ72UCdu0tUAcKaO_eiYfzLRI32BQXbwAEYJH3etbLH55CwJ-nBzatV7drvGcuALUdffxH4c_U65r3sTQGOBDfKLIExM7-EFjvw5mZXBH2196BVRVqNbx-ybprZs42ZYGJatbZvliXhlxzPpIJGS1IVPBQBmgCnI24bCfhy-80v4xbaakron7EgYRD0IGxSwIg5kg"
                      />
                      <span className="absolute top-2 left-2 bg-surface/85 backdrop-blur px-2 py-0.5 rounded font-label-mono-sm text-[10px] text-secondary font-bold">
                        32X PTZ TURRET
                      </span>
                    </div>
                    <div>
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                        AEGIS P-400 Pan-Tilt
                      </span>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                        32x optical zoom, continuous 360 rotation, laser IR 250m perimeter reach.
                      </p>
                    </div>
                    <div className="font-label-mono-sm text-xs text-outline flex items-center justify-between pt-1">
                      <span>Unit Rate</span>
                      <span className="text-on-surface font-semibold">$1,850 / unit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container p-2 rounded border border-surface-container-high">
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setPtzCount(Math.max(0, ptzCount - 1))}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <div className="flex items-baseline gap-1">
                      <span className="font-label-mono-lg text-label-mono-sm text-secondary font-bold">
                        {ptzCount}
                      </span>
                      <span className="font-label-mono-sm text-xs text-outline">UNITS</span>
                    </div>
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setPtzCount(ptzCount + 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>

                {/* Sensor Unit 3 */}
                <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between gap-4 border border-surface-container-high">
                  <div className="space-y-2">
                    <div className="h-28 rounded bg-surface-container-lowest overflow-hidden relative border border-surface-container-high">
                      <img
                        className="w-full h-full object-cover"
                        alt="AEGIS T-100 Dual-Ray"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBms8TdZDgLGBIHr5tHsPCAB2adkPpKcZ0DkUdAILQt9VfFy_naj1V74wxGFKRrRNwVwrT_qInGEKjFdcSb69FmMteI-9nCBcQoYhjcEexsR2PPF2lrDTiA_lvopHi1uS4GX32qScVdiCjsNijau3FH9yQlvf9W4-H5ni9zCSQYrpvpF8P_bYqRloJ1QFlCzoIid-j5_L0LTKdNeOIgd6BsjLATbd5-_hb63TV-Z7Rstw8-HfaBUeB9WQ"
                      />
                      <span className="absolute top-2 left-2 bg-surface/85 backdrop-blur px-2 py-0.5 rounded font-label-mono-sm text-[10px] text-tertiary font-bold">
                        THERMAL RADAR
                      </span>
                    </div>
                    <div>
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                        AEGIS T-100 Dual-Ray
                      </span>
                      <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2 mt-1">
                        Uncooled microbolometer sensor, zero-light intrusion trigger, radiometric scan.
                      </p>
                    </div>
                    <div className="font-label-mono-sm text-xs text-outline flex items-center justify-between pt-1">
                      <span>Unit Rate</span>
                      <span className="text-on-surface font-semibold">$3,400 / unit</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-surface-container p-2 rounded border border-surface-container-high">
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setThermalCount(Math.max(0, thermalCount - 1))}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <div className="flex items-baseline gap-1">
                      <span className="font-label-mono-lg text-label-mono-sm text-tertiary font-bold">
                        {thermalCount}
                      </span>
                      <span className="font-label-mono-sm text-xs text-outline">UNITS</span>
                    </div>
                    <button
                      className="w-8 h-8 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                      onClick={() => setThermalCount(thermalCount + 1)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Storage & Retention Requirements */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-5 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    03
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-base lg:text-lg font-bold text-on-surface">
                      Storage Architecture &amp; Retention Window
                    </h2>
                    <span className="font-label-mono-sm text-xs text-outline">
                      TELEMETRY ARCHIVAL SPECIFICATION
                    </span>
                  </div>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-semibold">
                  STEP 3 / 4
                </span>
              </div>

              {/* Storage Topologies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setStorageType('on-prem')}
                  type="button"
                  className={`p-4 rounded-lg text-left flex items-start gap-4 transition-all border cursor-pointer ${
                    storageType === 'on-prem'
                      ? 'bg-surface-container-high border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl shrink-0 mt-0.5 ${
                      storageType === 'on-prem' ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    dns
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold">
                        On-Prem NVR Appliance
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          storageType === 'on-prem' ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      ></span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Enterprise rackmount SAS RAID-5 chassis, zero recurring egress fees, air-gapped security.
                    </p>
                    <span className="font-label-mono-sm text-xs text-primary block pt-1 font-semibold">
                      $2,950 base unit
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setStorageType('hybrid-cloud')}
                  type="button"
                  className={`p-4 rounded-lg text-left flex items-start gap-4 transition-all border cursor-pointer ${
                    storageType === 'hybrid-cloud'
                      ? 'bg-surface-container-high border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl shrink-0 mt-0.5 ${
                      storageType === 'hybrid-cloud' ? 'text-secondary' : 'text-outline'
                    }`}
                  >
                    cloud_sync
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold">
                        Hybrid Cloud Direct
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          storageType === 'hybrid-cloud' ? 'bg-secondary' : 'bg-surface-container-highest'
                        }`}
                      ></span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Edge caching with geodistributed encrypted replication. Instant multi-site browser playback.
                    </p>
                    <span className="font-label-mono-sm text-xs text-secondary block pt-1 font-semibold">
                      $18 / camera / mo
                    </span>
                  </div>
                </button>
              </div>

              {/* Retention Days Selector & Storage Calculations */}
              <div className="bg-surface-container-low p-4 rounded-lg flex flex-col gap-4 border border-surface-container-high">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider font-semibold">
                    Continuous 24/7 Buffer Retention
                  </span>
                  <div className="flex items-center gap-2">
                    {[30, 60, 90].map((days) => (
                      <button
                        key={days}
                        onClick={() => setRetentionDays(days as any)}
                        type="button"
                        className={`px-4 py-1.5 rounded font-label-mono-sm text-label-mono-sm transition-all font-bold cursor-pointer ${
                          retentionDays === days
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {days} DAYS
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Telemetry Readout Box */}
                <div className="bg-surface-container-lowest p-3.5 rounded flex items-center justify-between flex-wrap gap-4 border border-surface-container-high">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">memory</span>
                    <div>
                      <span className="font-label-mono-sm text-xs text-outline block">
                        COMPUTED PAYLOAD VOLUME
                      </span>
                      <span className="font-label-mono-md text-label-mono-sm text-tertiary font-bold tracking-wide">
                        {baseStorageTB} TB RAID-5 (4x {Math.ceil(baseStorageTB / 3)}TB Enterprise SAS)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-label-mono-sm text-xs text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span>H.265+ Smart Codec (4K @ 20 FPS)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: Installation & Maintenance Tier */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-5 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-primary/10 text-primary font-label-mono-sm text-label-mono-sm flex items-center justify-center font-bold">
                    04
                  </span>
                  <div>
                    <h2 className="font-headline-sm text-base lg:text-lg font-bold text-on-surface">
                      Deployment &amp; Service SLA Level
                    </h2>
                    <span className="font-label-mono-sm text-xs text-outline">
                      PHYSICAL RIGGING &amp; TELEMETRY SOC DISPATCH
                    </span>
                  </div>
                </div>
                <span className="font-label-mono-sm text-label-mono-sm px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-semibold">
                  STEP 4 / 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setSlaType('self')}
                  type="button"
                  className={`p-4 rounded-lg text-left flex flex-col justify-between gap-4 transition-all group border cursor-pointer ${
                    slaType === 'self'
                      ? 'bg-surface-container-high border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        handyman
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${
                          slaType === 'self' ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      ></span>
                    </div>
                    <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                      Self-Install Kit
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Pre-flashed IP configuration, terminated cables, standard warranty. Self-rigged by facility team.
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="font-label-mono-sm text-xs text-tertiary block font-bold">
                      $0 Rigging Fee
                    </span>
                    <span className="font-label-mono-sm text-xs text-outline">$0/mo Recurring</span>
                  </div>
                </button>

                <button
                  onClick={() => setSlaType('turnkey')}
                  type="button"
                  className={`p-4 rounded-lg text-left flex flex-col justify-between gap-4 transition-all group border cursor-pointer ${
                    slaType === 'turnkey'
                      ? 'bg-surface-container-high border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-primary">engineering</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${
                          slaType === 'turnkey' ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      ></span>
                    </div>
                    <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                      Turnkey Rigging
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Certified master low-voltage union riggers, conduit runs, optical tuning, and commissioning.
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="font-label-mono-sm text-xs text-primary block font-bold">
                      Standard Labor Included
                    </span>
                    <span className="font-label-mono-sm text-xs text-outline">Factory 3-Yr Warranty</span>
                  </div>
                </button>

                <button
                  onClick={() => setSlaType('soc')}
                  type="button"
                  className={`p-4 rounded-lg text-left flex flex-col justify-between gap-4 transition-all group border cursor-pointer ${
                    slaType === 'soc'
                      ? 'bg-surface-container-high border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container-high hover:border-outline'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        shield
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${
                          slaType === 'soc' ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      ></span>
                    </div>
                    <span className="font-label-mono-md text-label-mono-sm text-on-surface font-bold block">
                      24/7 Managed NOC SLA
                    </span>
                    <p className="font-body-sm text-xs text-on-surface-variant">
                      Dedicated cyber defense center dispatch, 4-hour on-site lens swap, automatic firmware zero-day patching.
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="font-label-mono-sm text-xs text-secondary block font-bold">
                      Priority Rigging
                    </span>
                    <span className="font-label-mono-sm text-xs text-primary font-bold">
                      +$450/mo SLA Retainer
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real-Time Summary & Architecture Blueprint (5 cols on xl) */}
          <div className="xl:col-span-5 flex flex-col gap-6 xl:sticky xl:top-32">
            {/* Live Architecture Blueprint Card */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-4 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">schema</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface uppercase tracking-wider font-bold">
                    SYSTEM TOPOLOGY BLUEPRINT
                  </span>
                </div>
                <span className="font-label-mono-sm text-xs text-tertiary flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                  REALTIME
                </span>
              </div>

              {/* Interactive Topology Diagram Canvas/SVG */}
              <div className="bg-surface-container-lowest p-4 rounded-lg relative overflow-hidden border border-surface-container-high">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none"></div>
                <svg
                  className="w-full h-44 text-outline-variant"
                  fill="none"
                  viewBox="0 0 460 160"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Grid background lines */}
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.15" x1="0" x2="460" y1="40" y2="40"></line>
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.15" x1="0" x2="460" y1="80" y2="80"></line>
                  <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.15" x1="0" x2="460" y1="120" y2="120"></line>

                  {/* Connecting Bus Lines */}
                  <path d="M 90 40 L 160 40 L 160 80" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2"></path>
                  <path d="M 90 80 L 160 80" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2"></path>
                  <path d="M 90 120 L 160 120 L 160 80" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2"></path>

                  {/* Core Bus Trunk */}
                  <path d="M 230 80 L 290 80" stroke="#06B6D4" strokeDasharray="6 3" strokeWidth="2.5"></path>
                  <path d="M 360 80 L 400 80" stroke="#4EDEA3" strokeWidth="2"></path>

                  {/* Nodes: Cameras */}
                  <g transform="translate(15, 25)">
                    <rect fill="#1C2028" height="30" rx="4" width="75" stroke="#31353E" strokeWidth="1"></rect>
                    <circle cx="16" cy="15" fill="#4CD7F6" r="4"></circle>
                    <text fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" x="26" y="19">
                      DOMES ({domeCount})
                    </text>
                  </g>
                  <g transform="translate(15, 65)">
                    <rect fill="#1C2028" height="30" rx="4" width="75" stroke="#31353E" strokeWidth="1"></rect>
                    <circle cx="16" cy="15" fill="#ADC6FF" r="4"></circle>
                    <text fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" x="26" y="19">
                      PTZs ({ptzCount})
                    </text>
                  </g>
                  <g transform="translate(15, 105)">
                    <rect fill="#1C2028" height="30" rx="4" width="75" stroke="#31353E" strokeWidth="1"></rect>
                    <circle cx="16" cy="15" fill="#4EDEA3" r="4"></circle>
                    <text fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" x="26" y="19">
                      THRM ({thermalCount})
                    </text>
                  </g>

                  {/* Node: PoE Switch Core */}
                  <g transform="translate(160, 60)">
                    <rect fill="#262A33" height="40" rx="4" width="70" stroke="#06B6D4" strokeWidth="1"></rect>
                    <text fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" x="10" y="19">
                      PoE+ SW
                    </text>
                    <text fill="#4CD7F6" fontFamily="JetBrains Mono" fontSize="8" x="10" y="32">
                      802.3bt/1G
                    </text>
                  </g>

                  {/* Node: NVR / Edge Storage */}
                  <g transform="translate(290, 60)">
                    <rect fill="#262A33" height="40" rx="4" width="70" stroke="#4EDEA3" strokeWidth="1"></rect>
                    <text fill="#DFE2EE" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" x="8" y="19">
                      CORE NVR
                    </text>
                    <text fill="#4EDEA3" fontFamily="JetBrains Mono" fontSize="8" x="8" y="32">
                      {baseStorageTB}TB R-5
                    </text>
                  </g>

                  {/* Node: Secure Gateway Router */}
                  <g transform="translate(400, 60)">
                    <circle cx="20" cy="20" fill="#1C2028" r="18" stroke="#ADC6FF" strokeWidth="1.5"></circle>
                    <text fill="#ADC6FF" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" x="11" y="24">
                      SOC
                    </text>
                  </g>
                </svg>

                <div className="flex items-center justify-between text-[11px] font-label-mono-sm text-outline pt-2 border-t border-surface-container-high/40">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    PoE Budget: <span className="text-on-surface font-semibold">{poeBudget}W / 480W</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Trunk Bandwidth:{' '}
                    <span className="text-on-surface font-semibold">{trunkBandwidth} Mbps</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Live Bill of Materials & Cost Breakdown */}
            <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-6 shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/40">
                <div>
                  <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                    ESTIMATED INVESTMENT
                  </span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Bill of Materials (BOM)
                  </h3>
                </div>
                <span className="material-symbols-outlined text-outline">receipt_long</span>
              </div>

              {/* Dynamic Line Items */}
              <div className="space-y-3 font-label-mono-sm text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/30">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">01</span>
                    <span className="text-on-surface">
                      {domeCount}x 4K AI Smart Domes (D-900)
                    </span>
                  </div>
                  <span className="text-on-surface font-semibold">${totalDomesCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/30">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary font-bold">02</span>
                    <span className="text-on-surface">{ptzCount}x 32X Optical PTZs (P-400)</span>
                  </div>
                  <span className="text-on-surface font-semibold">${totalPtzCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/30">
                  <div className="flex items-center gap-2">
                    <span className="text-tertiary font-bold">03</span>
                    <span className="text-on-surface">{thermalCount}x Thermal Radar (T-100)</span>
                  </div>
                  <span className="text-on-surface font-semibold">
                    ${totalThermalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-surface-container-high/30">
                  <div className="flex items-center gap-2">
                    <span className="text-outline font-bold">04</span>
                    <span className="text-on-surface">
                      Storage {storageType === 'on-prem' ? `NVR Appliance (${baseStorageTB}TB)` : `Cloud Sync Buffer`}
                    </span>
                  </div>
                  <span className="text-on-surface font-semibold">
                    {storageType === 'on-prem' ? `$${storageCost.toLocaleString()}` : `$0 upfront ($${storageMonthly}/mo)`}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-outline font-bold">05</span>
                    <span className="text-on-surface">
                      {slaType === 'self'
                        ? 'Self-Install Flash & Pre-Wire Pack'
                        : slaType === 'turnkey'
                        ? 'Turnkey Union Rigging & Cat6A Conduits'
                        : '24/7 Managed NOC Deployment'}
                    </span>
                  </div>
                  <span className="text-on-surface font-semibold">
                    ${cablingCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Total Calculation Ledger */}
              <div className="bg-surface-container-low p-4 rounded-lg space-y-3 border border-surface-container-high">
                <div className="flex items-center justify-between font-label-mono-sm text-xs text-on-surface-variant">
                  <span>Hardware Subtotal:</span>
                  <span className="text-on-surface font-bold">${hardwareSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-label-mono-sm text-xs text-on-surface-variant">
                  <span>Rigging &amp; Commissioning:</span>
                  <span className="text-on-surface font-bold">${cablingCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-label-mono-sm text-xs text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">event_repeat</span>
                    Recurring Cloud / SLA Retainer:
                  </span>
                  <span className="font-bold">${totalMonthly} / mo</span>
                </div>

                {/* Total Hero Display */}
                <div className="pt-3 flex items-end justify-between border-t border-surface-container-high">
                  <div>
                    <span className="font-label-mono-sm text-xs text-outline uppercase block font-semibold">
                      Total System Investment
                    </span>
                    <span className="font-headline-lg text-3xl font-bold text-primary tracking-tight leading-none">
                      ${totalInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-label-mono-sm text-xs text-outline block">Financing Options</span>
                    <span className="font-label-mono-md text-sm text-on-surface font-bold">
                      ${monthlyLeaseEstimate} / mo
                    </span>
                    <span className="text-[10px] text-outline font-label-mono-sm block">
                      36-mo Lease-to-Own
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Call-to-Actions */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleExportPdf}
                  className="w-full bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary py-3 rounded font-label-mono-sm text-label-mono-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                  <span>Export PDF Specification Sheet</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBookSurvey}
                    className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-2.5 rounded font-label-mono-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-surface-container-highest cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-primary text-base">calendar_month</span>
                    <span>Book Site Survey</span>
                  </button>
                  <button
                    onClick={handleSendProcure}
                    className="w-full bg-surface-container-high hover:bg-surface-bright text-on-surface py-2.5 rounded font-label-mono-sm text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-surface-container-highest cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-secondary text-base">
                      send_and_archive
                    </span>
                    <span>Send to Procurement</span>
                  </button>
                </div>
              </div>

              {/* Export Status Feedback Toast */}
              {toastMessage && (
                <div className="p-3 rounded bg-tertiary-container text-on-tertiary-container font-label-mono-sm text-xs flex items-center gap-2 transition-all animate-fade-in border border-tertiary">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>{toastMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quick Specs Bar / Engineering Metrics */}
      <div className="w-full bg-surface-container-lowest mt-12 py-8 px-6 lg:px-12 border-t border-surface-container-high/40">
        <div className="  grid grid-cols-2 md:grid-cols-4 gap-6 font-label-mono-sm text-xs">
          <div className="space-y-1">
            <span className="text-outline uppercase block font-semibold">Cabling Type</span>
            <span className="text-on-surface font-semibold">Shielded Cat6A STP Solid Bare Copper</span>
            <span className="text-outline block text-[11px]">Plenum-rated CMP certified</span>
          </div>
          <div className="space-y-1">
            <span className="text-outline uppercase block font-semibold">Encryption Standard</span>
            <span className="text-on-surface font-semibold">TLS 1.3 / AES-256 Frame Stream</span>
            <span className="text-tertiary block text-[11px]">FIPS 140-3 Hardware Enclave</span>
          </div>
          <div className="space-y-1">
            <span className="text-outline uppercase block font-semibold">Redundancy Architecture</span>
            <span className="text-on-surface font-semibold">Dual Hot-Swap Power Supplies</span>
            <span className="text-outline block text-[11px]">N+1 Failover NVR Standby</span>
          </div>
          <div className="space-y-1">
            <span className="text-outline uppercase block font-semibold">Estimated Delivery</span>
            <span className="text-on-surface font-semibold">4 - 6 Business Days</span>
            <span className="text-primary block text-[11px]">Immediate Dispatch from Regional Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
