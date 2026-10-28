import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { PageView } from '../types';

const ThreeCameraViewer = lazy(() =>
  import('./ThreeCameraViewer').then(({ ThreeCameraViewer: Viewer }) => ({ default: Viewer })),
);

interface OverviewShowcaseProps {
  onNavigate: (page: PageView) => void;
  onOpenSurveyModal: () => void;
}

export const OverviewShowcase: React.FC<OverviewShowcaseProps> = ({
  onNavigate,
  onOpenSurveyModal
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [matrixLayout, setMatrixLayout] = useState<'grid' | 'focus' | 'fullscreen'>('grid');
  const [focusedFeedIndex, setFocusedFeedIndex] = useState(0);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const revealItems = page.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    page.classList.add('motion-ready');
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      page.classList.remove('motion-ready');
    };
  }, []);

  const feeds = [
    {
      id: 'CAM-01',
      title: 'CAM-01 // PERIMETER NORTH',
      image:
        '/assets/demo-yard.svg',
      alt: 'CCTV view of high-security perimeter fence with patrol vehicle',
      resolution: 'RES: 3840x2160 (4K)',
      fps: 'FPS: 59.94',
      bitrate: 'H.265+ // 8,192 kbps',
      overlay: (
        <div className="absolute top-[28%] left-[42%] w-32 h-24 bg-[#4cd7f6]/10 border border-[#4cd7f6] rounded flex flex-col justify-between p-1 shadow-[0_0_12px_rgba(6,182,212,0.3)] pointer-events-none">
          <span className="font-mono text-[9px] bg-[#4cd7f6] text-[#003640] font-bold px-1 py-0.2 self-start rounded">
            VEHICLE: 98.4%
          </span>
          <span className="font-mono text-[8px] text-[#4cd7f6] self-end">SPD: 14 KM/H</span>
        </div>
      )
    },
    {
      id: 'CAM-02',
      title: 'CAM-02 // SERVER VAULT LEVEL -2',
      image:
        '/assets/demo-server.svg',
      alt: 'Enterprise server room corridor security camera',
      resolution: 'RES: 3840x2160 (4K)',
      fps: 'FPS: 60.00',
      bitrate: 'H.265+ // 9,450 kbps',
      overlay: (
        <div className="absolute top-[20%] left-[30%] w-20 h-40 bg-[#4edea3]/10 border border-[#4edea3] rounded flex flex-col justify-between p-1 shadow-[0_0_12px_rgba(78,222,163,0.3)] pointer-events-none">
          <span className="font-mono text-[9px] bg-[#4edea3] text-[#003824] font-bold px-1 py-0.2 self-start rounded">
            PERSON: AUTH
          </span>
          <span className="font-mono text-[8px] text-[#4edea3] self-end">BADGE #092</span>
        </div>
      )
    },
    {
      id: 'CAM-03',
      title: 'CAM-03 // LOADING BAY 03',
      image:
        '/assets/demo-installation.svg',
      alt: 'Logistics warehouse loading dock bay 03',
      resolution: 'RES: 2560x1440 (2K QHD)',
      fps: 'FPS: 59.91',
      bitrate: 'H.265+ // 6,100 kbps',
      overlay: (
        <div className="absolute top-[60%] inset-x-8 h-0.5 bg-[#ffb4ab]/80 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[9px] bg-[#93000a] text-[#ffdad6] font-bold px-2 py-0.5 rounded shadow">
            PERIMETER TRIPWIRE ACTIVE
          </span>
        </div>
      )
    },
    {
      id: 'CAM-04',
      title: 'CAM-04 // RECEPTION WEST TURNSTILES',
      image:
        '/assets/demo-control-room.svg',
      alt: 'Modern corporate lobby turnstiles CCTV view',
      resolution: 'RES: 3840x2160 (4K)',
      fps: 'FPS: 60.00',
      bitrate: 'H.265+ // 7,890 kbps',
      overlay: (
        <div className="absolute bottom-12 right-4 bg-[#262a33]/90 backdrop-blur px-2.5 py-1.5 rounded flex items-center gap-2 pointer-events-none border border-[#3d494c]/50">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span className="font-mono text-[10px] text-[#dfe2ee]">FLOW RATE: 42 PPM</span>
        </div>
      )
    }
  ] as const;
  const focusedFeed = feeds[focusedFeedIndex] ?? feeds[0];

  return (
    <div ref={pageRef} className="flex flex-col w-full">
      {/* Hero Section with 3D Model Viewport */}
      <section className="relative w-full px-6 lg:px-12 py-12 lg:py-20 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#0566d9]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="  grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col gap-6" data-reveal="hero-copy">
            <div className="inline-flex items-center gap-2 self-start bg-[#262a33] px-3 py-1.5 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#4cd7f6] text-sm">precision_manufacturing</span>
              <span className="font-mono text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
                Simple, dependable security for your property
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] text-[#dfe2ee] font-extrabold tracking-tight leading-[1.1]">
              Feel safer with a security system{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4cd7f6] via-[#acedff] to-[#adc6ff]">
                built around you
              </span>
            </h1>

            <p className="text-[17px] text-[#bcc9cd] leading-relaxed ">
              We help homes and businesses choose, install and maintain CCTV systems that fit
              their space, budget and everyday needs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('system-configurator-and-estimator')}
                className="inline-flex items-center justify-center gap-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] font-bold font-mono text-[13px] px-6 py-3.5 rounded shadow-xl hover:shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                <span>Plan My System</span>
              </button>

              <button
                onClick={() => onNavigate('hardware-catalog')}
                className="inline-flex items-center justify-center gap-2 bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-bold font-mono text-[13px] px-6 py-3.5 rounded shadow-md border border-[#3d494c]/60 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                <span>Browse Cameras</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-[#bcc9cd]">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4edea3] text-lg">check_circle</span>Friendly expert advice</span>
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4edea3] text-lg">check_circle</span>Careful installation</span>
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4edea3] text-lg">check_circle</span>Ongoing support</span>
            </div>
          </div>

          {/* Cursor-responsive 3D camera */}
          <div className="lg:col-span-6" data-reveal="rise">
            <Suspense
              fallback={
                <div className="flex h-[420px] w-full items-center justify-center text-sm text-[#bcc9cd] sm:h-[520px]">
                  Loading 3D camera preview…
                </div>
              }
            >
              <ThreeCameraViewer />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Quick Trust Bar */}
      <section className="w-full bg-[#181c24] py-8 px-6 lg:px-12 border-y border-[#262a33]">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between" data-reveal="rise">
          <h2 className="text-xl font-bold text-[#dfe2ee]">Security solutions for homes and businesses</h2>
          <div className="flex flex-wrap gap-4 text-sm text-[#bcc9cd]">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4edea3]">home</span>Options for different spaces</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#4cd7f6]">lightbulb</span>Advice to help you choose</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[#adc6ff]">handyman</span>Installation support</span>
          </div>
        </div>
      </section>

      {/* Live Demo Feeds Widget (Multi-channel simulated CCTV matrix) */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#0f131c]">
        <div className="flex flex-col gap-8" data-reveal="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#4cd7f6] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
                <span>CAMERA EXAMPLES</span>
              </div>
              <h2 className="text-3xl lg:text-[40px] text-[#dfe2ee] font-bold tracking-tight">
                Example camera views
              </h2>
              <p className="text-[15px] text-[#bcc9cd] mt-1">
                See the kinds of areas a well-planned system can help you keep an eye on.
              </p>
            </div>

            {/* Layout Switcher */}
            <div className="flex items-center gap-3 bg-[#262a33] px-4 py-2 rounded border border-[#3d494c]/50">
              <span className="text-sm text-[#869397]">View:</span>
              <button
                onClick={() => setMatrixLayout('grid')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'grid' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                All views
              </button>
              <span className="text-[#869397]">/</span>
              <button
                onClick={() => setMatrixLayout('focus')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'focus' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                Focus one
              </button>
              <span className="text-[#869397]">/</span>
              <button
                onClick={() => setMatrixLayout('fullscreen')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'fullscreen' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                Large view
              </button>
            </div>
          </div>

          {/* Feeds Rendering according to layout */}
          <div key={`${matrixLayout}-${focusedFeedIndex}`} className="motion-feed-enter">
          {matrixLayout === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feeds.map((feed, idx) => (
                <div
                  key={feed.id}
                  onClick={() => {
                    setFocusedFeedIndex(idx);
                    setMatrixLayout('focus');
                  }}
                  className="relative rounded-xl overflow-hidden bg-[#0a0e16] aspect-video group shadow-lg border border-[#262a33] cursor-pointer hover:border-[#4cd7f6]/60 transition-all"
                >
                  <img
                    className="w-full h-full object-cover brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-500"
                    src={feed.image}
                    alt={feed.alt}
                  />
                  {feed.overlay}
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-3 flex items-center justify-between font-mono text-[11px] text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                      <span className="font-bold tracking-wider">{feed.title}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-sm text-white">
                    {feed.title.replace(/^CAM-\d+ \/\/ /, '')}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>

          {matrixLayout === 'focus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Primary Focused Feed (8 cols) */}
              <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-[#0a0e16] aspect-video group shadow-2xl border border-[#4cd7f6]/60">
                <img
                  className="w-full h-full object-cover brightness-95 contrast-110"
                  src={focusedFeed.image}
                  alt={focusedFeed.alt}
                />
                {focusedFeed.overlay}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-4 flex items-center justify-between font-mono text-[12px] text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                    <span className="font-bold tracking-wider">{focusedFeed.title}</span>
                    <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] px-2 py-0.5 rounded font-bold ml-2">
                      PRIMARY MONITOR
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-sm text-white">
                  {focusedFeed.title.replace(/^CAM-\d+ \/\/ /, '')}
                </div>
              </div>

              {/* 3 Secondary Feeds (4 cols stacked) */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                {feeds.map((feed, idx) => {
                  if (idx === focusedFeedIndex) return null;
                  return (
                    <div
                      key={feed.id}
                      onClick={() => setFocusedFeedIndex(idx)}
                      className="relative rounded-lg overflow-hidden bg-[#0a0e16] aspect-video group shadow-md border border-[#262a33] hover:border-[#4cd7f6] cursor-pointer transition-all"
                    >
                      <img className="w-full h-full object-cover brightness-90" src={feed.image} alt={feed.alt} />
                      <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-2 flex items-center justify-between font-mono text-[10px] text-white">
                        <span className="font-semibold truncate">{feed.title}</span>
                        <span className="text-[#4edea3] text-[9px]">Camera view</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white">
                        Select to view larger
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matrixLayout === 'fullscreen' && (
            <div className="relative rounded-xl overflow-hidden bg-[#0a0e16] w-full h-[580px] shadow-2xl border border-[#4cd7f6]">
              <img
                className="w-full h-full object-cover brightness-95"
                src={focusedFeed.image}
                alt={focusedFeed.alt}
              />
              {focusedFeed.overlay}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-5 flex items-center justify-between font-mono text-[13px] text-white">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                  <span className="font-bold tracking-wider">{focusedFeed.title}</span>
                  <span className="bg-[#4edea3]/20 text-[#4edea3] text-[11px] px-2.5 py-0.5 rounded font-bold">
                  CAMERA VIEW
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMatrixLayout('grid')}
                    className="bg-[#262a33] hover:bg-[#353942] text-white px-2.5 py-1 rounded text-xs"
                  >
                    Exit Fullscreen
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-5 text-sm text-white">
                {focusedFeed.title.replace(/^CAM-\d+ \/\/ /, '')}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Services Highlights */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#181c24] border-t border-[#262a33]">
        <div className="flex flex-col gap-12" data-reveal="rise">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase text-[#adc6ff] tracking-widest block mb-2 font-semibold">
                HOW WE CAN HELP
              </span>
              <h2 className="text-3xl lg:text-[40px] text-[#dfe2ee] font-bold">The right support, from planning to installation</h2>
            </div>
            <p className="text-[15px] text-[#bcc9cd] ">
              From direct Tier-1 optical sensor distribution to on-site certified physical installation and private cloud VMS architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal="cards">
            {/* Service Card 1 */}
            <div className="bg-[#1c2028] p-8 rounded-xl flex flex-col justify-between hover:bg-[#262a33] transition-all group shadow-md hover:shadow-xl border border-[#262a33]">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#0a0e16] flex items-center justify-center text-[#4cd7f6] group-hover:bg-[#4cd7f6] group-hover:text-[#003640] transition-colors">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl text-[#dfe2ee] font-bold">Hardware Sales &amp; Distribution</h3>
                  <span className="font-mono text-[11px] text-[#869397]">TIER-1</span>
                </div>
                <p className="text-[14px] text-[#bcc9cd] leading-relaxed">
                  Direct manufacturer partnerships, wholesale enterprise volume pricing, verified NDAA silicon chain of
                  custody, and rapid-dispatch factory warranty replacement.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>OEM Wholesale Price Matrix</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>Pre-Provisioned MAC &amp; Secure Certs</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>Advance Hardware RMA Coverage</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('hardware-catalog')}
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-[#4cd7f6] hover:text-[#acedff] group-hover:translate-x-1 transition-all cursor-pointer font-bold"
                >
                  <span>EXPLORE HARDWARE SKUS</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-[#1c2028] p-8 rounded-xl flex flex-col justify-between hover:bg-[#262a33] transition-all group shadow-md hover:shadow-xl border border-[#262a33]">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#0a0e16] flex items-center justify-center text-[#adc6ff] group-hover:bg-[#adc6ff] group-hover:text-[#002e6a] transition-colors">
                  <span className="material-symbols-outlined text-3xl">engineering</span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl text-[#dfe2ee] font-bold">Turnkey Engineering &amp; Installation</h3>
                  <span className="font-mono text-[11px] text-[#869397]">BICSI</span>
                </div>
                <p className="text-[14px] text-[#bcc9cd] leading-relaxed">
                  BICSI-certified field technicians, single-mode optical fiber trunklines, Cat6A shielded runs, rigid
                  galvanized conduit piping, and pristine rack cable dressing.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>OTDR Fiber Testing &amp; Fluke Certification</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>Explosion-Proof &amp; Marine Enclosures</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>Lightning Surge &amp; Grounding Architecture</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('installation-and-engineering-services')}
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-[#adc6ff] hover:text-[#d8e2ff] group-hover:translate-x-1 transition-all cursor-pointer font-bold"
                >
                  <span>FIELD ENGINEERING SPECS</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-[#1c2028] p-8 rounded-xl flex flex-col justify-between hover:bg-[#262a33] transition-all group shadow-md hover:shadow-xl border border-[#262a33]">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#0a0e16] flex items-center justify-center text-[#4edea3] group-hover:bg-[#4edea3] group-hover:text-[#003824] transition-colors">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl text-[#dfe2ee] font-bold">AI Video Analytics &amp; Cloud VMS</h3>
                  <span className="font-mono text-[11px] text-[#869397]">EDGE-AI</span>
                </div>
                <p className="text-[14px] text-[#bcc9cd] leading-relaxed">
                  Deep-learning License Plate Recognition (LPR), multi-zone tripwires, thermal heatmapping, and
                  microservice NestJS cloud VMS with automated incident escalation.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>99.8% LPR Accuracy at 120 mph</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>Automated Webhook &amp; REST Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#dfe2ee]">
                    <span className="material-symbols-outlined text-[#4edea3] text-[18px]">check_circle</span>
                    <span>End-to-End Zero Knowledge Encryption</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onOpenSurveyModal}
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-[#4edea3] hover:text-[#6ffbbe] group-hover:translate-x-1 transition-all cursor-pointer font-bold"
                >
                  <span>SCHEDULE LIVE AI TEST</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Estimator Callout Banner */}
      <section className="w-full px-6 lg:px-12 py-12">
        <div className="  bg-gradient-to-r from-[#1c2028] to-[#262a33] p-8 lg:p-12 rounded-xl shadow-2xl relative overflow-hidden border border-[#3d494c]/50">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#4cd7f6]/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10" data-reveal="rise">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start bg-[#06b6d4]/20 px-3 py-1 rounded border border-[#06b6d4]/30">
                <span className="material-symbols-outlined text-[#4cd7f6] text-sm">calculate</span>
                <span className="font-mono text-[10px] text-[#4cd7f6] uppercase font-bold">
                  SYSTEM ESTIMATOR
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-[36px] text-[#dfe2ee] font-bold">
                Calculate Commercial System Footprint &amp; Bandwidth in Real Time
              </h3>

              <p className="text-[15px] text-[#bcc9cd]  leading-relaxed">
                Input camera count, storage retention requirements (30/60/90 days), and sensor resolution to generate
                an itemized bill of materials (BOM) and bandwidth calculation instantly.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-[11px] text-[#bcc9cd]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check</span>
                  INSTANT PDF SPEC EXPORT
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check</span>
                  NVR STORAGE SIZING INCLUDED
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check</span>
                  NO REGISTRATION REQUIRED
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <div className="bg-[#0a0e16] p-6 rounded-xl w-full  flex flex-col gap-4 shadow-xl border border-[#262a33]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#869397] uppercase">ESTIMATE PREVIEW</span>
                  <span className="bg-[#4edea3]/20 text-[#4edea3] px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                    TIER 2 SITE
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[11px] text-[#bcc9cd] block">Typical 16-Cam 4K AI Array:</span>
                  <span className="text-[26px] text-[#dfe2ee] font-extrabold block">$14,850 - $22,400</span>
                  <span className="font-mono text-[10px] text-[#869397] block mt-1">
                    Includes NDAA Hub, PoE++ Switches &amp; Fluke Cert
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('system-configurator-and-estimator')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] font-mono text-[12px] font-bold uppercase tracking-wider py-3 rounded transition-all shadow-md cursor-pointer"
                >
                  <span>Launch Full Configurator</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
