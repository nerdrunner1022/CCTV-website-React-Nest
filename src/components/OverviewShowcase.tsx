import React, { useState, useEffect } from 'react';
import { PageView } from '../types';

interface OverviewShowcaseProps {
  onNavigate: (page: PageView) => void;
  onOpenSurveyModal: () => void;
}

export const OverviewShowcase: React.FC<OverviewShowcaseProps> = ({
  onNavigate,
  onOpenSurveyModal
}) => {
  // 3D Viewport Angle state: 'front' | 'iso' | 'top' | 'zoom'
  const [angle, setAngle] = useState<'front' | 'iso' | 'top' | 'zoom'>('front');
  const [thermalActive, setThermalActive] = useState(false);
  const [nightActive, setNightActive] = useState(false);
  const [matrixLayout, setMatrixLayout] = useState<'grid' | 'focus' | 'fullscreen'>('grid');
  const [focusedFeedIndex, setFocusedFeedIndex] = useState(0);

  // UTC Live Clock State
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const str = 'LIVE ' + now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
      setLiveTime(str);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const anglesList: ('front' | 'iso' | 'top' | 'zoom')[] = ['front', 'iso', 'top', 'zoom'];
  const handleCycleAngle = () => {
    const currentIndex = anglesList.indexOf(angle);
    const nextIndex = (currentIndex + 1) % anglesList.length;
    setAngle(anglesList[nextIndex]);
  };

  // Image transform styles based on angle
  const getAngleTransform = () => {
    switch (angle) {
      case 'iso':
        return 'scale(1.08) perspective(600px) rotateY(-22deg) rotateX(12deg)';
      case 'top':
        return 'scale(1.15) perspective(600px) rotateX(48deg)';
      case 'zoom':
        return 'scale(1.6) translate(0px, 10px)';
      case 'front':
      default:
        return 'scale(1) rotate(0deg)';
    }
  };

  // Status text for the 3D viewport
  const getTelemetryStatus = () => {
    if (thermalActive) return { text: 'THERMAL CALIBRATED', color: 'text-[#ffb4ab]' };
    if (nightActive) return { text: 'NIGHT-VISION IR [850nm]', color: 'text-[#4edea3]' };
    return { text: 'ONLINE 60FPS', color: 'text-[#4edea3]' };
  };

  const statusInfo = getTelemetryStatus();

  const feeds = [
    {
      id: 'CAM-01',
      title: 'CAM-01 // PERIMETER NORTH',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZ6Wnmn4H31X1WVOx0fFaky7MoP5Xhr4Sx96GIvJHceVONIDOFRaj0zkNj2JlzhFHlQ15bYzwno2gpcs9-wB9LxGPOIEUfu_T3ftNJPoWwwmhRobrSd5IgIP-x3sbOLJ8VtypwkndUtrq8CoEKtofg_vPc8QcHGCN0AzJM8qlGZvAFCgYQWDF805DjVOQa2its6KQgIB3CLzebQHzdhejWG7eD1iH_L9uHSje7_fKcRg_u8k4Y1XCNg',
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
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1qSs7jsMOh52ZNF2tXXxvhjoTQeAkzxzx11lZ0nYUVRcGmGTu7CAz0FVlo7gaD3weg8IUpgNKetfg2vGAXYjlZGpxtoapwrcsg7qu200tHPt93sBtHC5UV3E04AHKVidZFUTwef6D91RVvi0AxTgxDvjdxE5QVC5glaxNEWmtWwgcZyK9SLzKaOsvFhS72oQcv4yQkqNIPuePLoX4Dgi0Z-rCpgt5oChxz-K6Vg6YMgfqspJX3EAcqg',
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
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCOwPBbh4mbv1y3Tvx7WRacT14EzpUpIdNqtdHvxX0uWFV_ruGbycXHXuYYwHz1i8cF8xBhtMHWsTpYCDjiAK0kn8o2aQy0YrhXMSDWEnrzMTyzatFQp7Y5s6I1UxgNYI8kp8W391swty9a100lO-fc0ROHEoHbYWIVDuaWKEsy2hoWHMYbfGshCkwxOZo5CgjTlpVZTc1yxo6cN9TdxxYf_yjQcpBVKAktEZxw_PvnQvpSwZDrG4vNFA',
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
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB8jozOlk73N4QeZIgnK-lDw9DVAINAYURZ9L6G1ppg8PNs8jm3Ntt7ymVUeWzhw3DDKuQqdLZyB5JcarkyQAvqX4pqDKnhwjxo0PVUo_QqErj5ZEolo0LRDWFM92LEHjo5oX_qkJ5DxeRPG1Yuar4LMTVVVNxd6SFn7ERI0nNTkVrHE5kmk4dIvPloyIy4j0uMf8XJLoaJaUUyFssUeAwG2csxTen5Wm8gHF52l-sG72rXW1v15CK1LQ',
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
  ];

  return (
    <div className="flex flex-col w-full pt-28">
      {/* Top Ambient Telemetry Sub-Band */}
      <section className="w-full bg-[#0a0e16] px-6 lg:px-12 py-3 border-b border-[#262a33]/50">
        <div className="  flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#869397]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#dfe2ee]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
              NODE: DC-US-EAST-04
            </span>
            <span className="hidden sm:inline">
              BITRATE: <span className="text-[#4edea3]">38.4 Mbps (AGGREGATE)</span>
            </span>
            <span className="hidden md:inline">
              QUANTUM ENCRYPTION: <span className="text-[#adc6ff]">ENABLED</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#bcc9cd]">FIRMWARE PATCH: v4.19.0-NDAA</span>
            <span className="bg-[#1c2028] px-2 py-0.5 rounded text-[#4edea3] font-semibold">
              SYSTEM CERTIFIED
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section with 3D Model Viewport */}
      <section className="relative w-full px-6 lg:px-12 py-12 lg:py-20 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-[#0566d9]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="  grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start bg-[#262a33] px-3 py-1.5 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#4cd7f6] text-sm">precision_manufacturing</span>
              <span className="font-mono text-[10px] uppercase text-[#4cd7f6] tracking-wider font-semibold">
                MISSION-CRITICAL PERIMETER DEFENSE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] text-[#dfe2ee] font-extrabold tracking-tight leading-[1.1]">
              Next-Generation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4cd7f6] via-[#acedff] to-[#adc6ff]">
                Optical Surveillance
              </span>{' '}
              &amp; Autonomous Threat Intelligence
            </h1>

            <p className="text-[17px] text-[#bcc9cd] leading-relaxed ">
              Commercial grade 4K Ultra HD AI PTZ &amp; Dome cameras engineered for mission-critical
              infrastructure, enterprise logistics, and residential estate security.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('system-configurator-and-estimator')}
                className="inline-flex items-center justify-center gap-2 bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] font-bold font-mono text-[13px] px-6 py-3.5 rounded shadow-xl hover:shadow-[0_0_24px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                <span>Configure Custom Setup</span>
              </button>

              <button
                onClick={() => onNavigate('hardware-catalog')}
                className="inline-flex items-center justify-center gap-2 bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-bold font-mono text-[13px] px-6 py-3.5 rounded shadow-md border border-[#3d494c]/60 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
                <span>Explore Hardware Catalog</span>
              </button>
            </div>

            {/* Metric Counter Callout */}
            <div className="grid grid-cols-3 gap-4 pt-4 bg-[#181c24] p-4 rounded border border-[#262a33]">
              <div>
                <span className="font-mono text-[10px] text-[#869397] block uppercase">OPTICAL LATENCY</span>
                <span className="text-2xl lg:text-[28px] text-[#4edea3] font-bold tracking-tight block">
                  &lt; 8ms
                </span>
                <span className="font-mono text-[11px] text-[#bcc9cd]">Zero Frame Drop</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#869397] block uppercase">TARGET LOCK</span>
                <span className="text-2xl lg:text-[28px] text-[#4cd7f6] font-bold tracking-tight block">
                  0.04s
                </span>
                <span className="font-mono text-[11px] text-[#bcc9cd]">Neural Engine V3</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#869397] block uppercase">PERIMETER MTBF</span>
                <span className="text-2xl lg:text-[28px] text-[#adc6ff] font-bold tracking-tight block">
                  120K hrs
                </span>
                <span className="font-mono text-[11px] text-[#bcc9cd]">Continuous Run</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Model Display Panel */}
          <div className="lg:col-span-6">
            <div className="bg-[#1c2028] rounded-xl overflow-hidden shadow-2xl border border-[#262a33] relative flex flex-col">
              {/* Top HUD Bar */}
              <div className="bg-[#0a0e16] px-4 py-2.5 flex items-center justify-between border-b border-[#262a33]">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#dfe2ee]">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">view_in_ar</span>
                  <span className="font-bold tracking-wider">3D TELEMETRIC VIEWPORT: AEGIS SENTINEL-X PRO PTZ</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
              </div>

              {/* 3D Interactive Canvas Stage */}
              <div
                id="viewport-stage"
                onClick={handleCycleAngle}
                className="relative w-full h-[420px] bg-[#0a0e16] overflow-hidden flex items-center justify-center select-none group cursor-pointer"
                title="Click to cycle perspective angle"
              >
                {/* Simulated Hardware Image with angle morphing */}
                <img
                  id="ptz-model-img"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out filter brightness-95 contrast-110"
                  style={{ transform: getAngleTransform() }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJGzYXQ8ryuEPwKLmw8a5X_ZL0FrFBGC2sIa0MZNTWKo5kSnW0QCrlnScTJz1g-TMsIYpl9a4S9AP2_d8EK9jyhlWZWsC8s7PNa9mjA3h2nrtqkiWpVZm6H5ldTgJUU2P_GHpe176ApPYCJqVYtvvjBuTFBwU9yFAhhOTQxG8GOoY5oMfjjiFAF5grr0_0LZH9TJ3pdT4HNqoIIpGZl170Yc271v7sPwEG-QxEUouMRec_85f6pBKSag"
                  alt="Aegis Sentinel-X Pro PTZ 3D viewport"
                />

                {/* Night Vision Layer */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color bg-[#1bbd85] ${
                    nightActive ? 'opacity-90' : 'opacity-0'
                  }`}
                />

                {/* Thermal Gradient Layer */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-hue bg-gradient-to-t from-[#0566d9] via-[#93000a] to-[#4cd7f6] ${
                    thermalActive ? 'opacity-75' : 'opacity-0'
                  }`}
                />

                {/* Optical Reticle HUD Elements */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-[#4cd7f6]/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-[#4cd7f6]/5 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-[#4cd7f6]"></div>
                    <div className="absolute top-2 font-mono text-[9px] text-[#4cd7f6] tracking-widest">
                      [ TARGET RETICLE LOCKED ]
                    </div>
                    <div className="absolute -left-6 text-[#4cd7f6] text-[10px] font-mono">Y: +14.2°</div>
                    <div className="absolute -right-6 text-[#4cd7f6] text-[10px] font-mono">X: 184.8°</div>
                  </div>
                </div>

                {/* Top Overlay Telemetry Chips */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-mono text-[10px]">
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#4cd7f6] border border-[#4cd7f6]/20">
                    FOCAL: 4.8 - 120mm
                  </span>
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#dfe2ee]">
                    30X OPTICAL ZOOM
                  </span>
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#dfe2ee]">
                    IR RANGE: 150 METERS
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 font-mono text-[10px]">
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#4edea3]">
                    AI SENSOR: HUMAN/VEHICLE ACTIVE
                  </span>
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#869397]">
                    GIMBAL PAN: 360° CONT.
                  </span>
                  <span className="bg-[#0f131c]/80 backdrop-blur-md px-2.5 py-1 rounded text-[#869397]">
                    TILT: -15° ~ 90° AUTO-FLIP
                  </span>
                </div>

                {/* Drag / Click Hint Overlay */}
                <div className="absolute bottom-4 left-4 font-mono text-[10px] bg-[#262a33]/80 backdrop-blur px-3 py-1 rounded text-[#869397] flex items-center gap-1.5 pointer-events-none border border-[#3d494c]/40">
                  <span className="material-symbols-outlined text-[14px]">3d_rotation</span>
                  <span>INTERACTIVE VIEWPORT // CLICK TO CYCLE PERSPECTIVE</span>
                </div>
              </div>

              {/* Bottom Viewport Controls Toolbar */}
              <div
                className="bg-[#262a33] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#3d494c]/40"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#869397] uppercase mr-1">Angles:</span>
                  <button
                    onClick={() => setAngle('front')}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                      angle === 'front'
                        ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
                        : 'bg-[#1c2028] text-[#bcc9cd] hover:text-[#dfe2ee]'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setAngle('iso')}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                      angle === 'iso'
                        ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
                        : 'bg-[#1c2028] text-[#bcc9cd] hover:text-[#dfe2ee]'
                    }`}
                  >
                    45° Iso
                  </button>
                  <button
                    onClick={() => setAngle('top')}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                      angle === 'top'
                        ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
                        : 'bg-[#1c2028] text-[#bcc9cd] hover:text-[#dfe2ee]'
                    }`}
                  >
                    Top-Down
                  </button>
                  <button
                    onClick={() => setAngle('zoom')}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                      angle === 'zoom'
                        ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-sm'
                        : 'bg-[#1c2028] text-[#bcc9cd] hover:text-[#dfe2ee]'
                    }`}
                  >
                    Lens Macro
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setThermalActive(!thermalActive)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[11px] transition-colors ${
                      thermalActive
                        ? 'bg-[#93000a] text-[#ffdad6] font-bold'
                        : 'bg-[#1c2028] text-[#ffb4ab] hover:bg-[#353942]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">device_thermostat</span>
                    <span>Thermal SIM</span>
                  </button>
                  <button
                    onClick={() => setNightActive(!nightActive)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-[11px] transition-colors ${
                      nightActive
                        ? 'bg-[#4edea3] text-[#003824] font-bold'
                        : 'bg-[#1c2028] text-[#4edea3] hover:bg-[#353942]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">nights_stay</span>
                    <span>Night IR</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Trust Bar */}
      <section className="w-full bg-[#181c24] py-8 px-6 lg:px-12 border-y border-[#262a33]">
        <div className="  flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xl text-[#dfe2ee] font-bold">Trusted by 1,400+ High-Assurance Sites</span>
            <span className="text-[13px] text-[#bcc9cd]">
              Defense contractors, container terminals, tier-4 colocation vaults, and corporate logistics networks.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1c2028] px-3.5 py-2 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#4edea3] text-lg">gavel</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold text-[#dfe2ee]">NDAA COMPLIANT</span>
                <span className="font-mono text-[9px] text-[#869397]">Section 889 Federal</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1c2028] px-3.5 py-2 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#4cd7f6] text-lg">water_drop</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold text-[#dfe2ee]">IP67 INGRESS</span>
                <span className="font-mono text-[9px] text-[#869397]">Submersible Hermetic</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1c2028] px-3.5 py-2 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#adc6ff] text-lg">shield</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold text-[#dfe2ee]">IK10 VANDAL-PROOF</span>
                <span className="font-mono text-[9px] text-[#869397]">20 Joules Impact Rating</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1c2028] px-3.5 py-2 rounded border border-[#3d494c]/40">
              <span className="material-symbols-outlined text-[#4edea3] text-lg">lock</span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold text-[#dfe2ee]">CYBER-HARDENED</span>
                <span className="font-mono text-[9px] text-[#869397]">FIPS 140-3 Validated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Feeds Widget (Multi-channel simulated CCTV matrix) */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#0f131c]">
        <div className="  flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#4cd7f6] mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
                <span>REAL-TIME SOC TELEMETRY</span>
              </div>
              <h2 className="text-3xl lg:text-[40px] text-[#dfe2ee] font-bold tracking-tight">
                Active Matrix Telemetry
              </h2>
              <p className="text-[15px] text-[#bcc9cd] mt-1">
                Live synthetic multi-channel feeds streaming with edge neural detection and bounding box telemetry.
              </p>
            </div>

            {/* Layout Switcher */}
            <div className="flex items-center gap-3 bg-[#262a33] px-4 py-2 rounded border border-[#3d494c]/50">
              <span className="font-mono text-[11px] text-[#869397]">LAYOUT:</span>
              <button
                onClick={() => setMatrixLayout('grid')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'grid' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                2x2 GRID
              </button>
              <span className="text-[#869397]">/</span>
              <button
                onClick={() => setMatrixLayout('focus')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'focus' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                FOCUS 1+3
              </button>
              <span className="text-[#869397]">/</span>
              <button
                onClick={() => setMatrixLayout('fullscreen')}
                className={`font-mono text-[11px] transition-colors ${
                  matrixLayout === 'fullscreen' ? 'text-[#4cd7f6] font-bold' : 'text-[#bcc9cd] hover:text-[#dfe2ee]'
                }`}
              >
                FULLSCREEN
              </button>
            </div>
          </div>

          {/* Feeds Rendering according to layout */}
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
                    <span className="text-[#4edea3]">{liveTime}</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between font-mono text-[10px] text-[#bcc9cd]">
                    <span>{feed.resolution}</span>
                    <span className="text-[#4cd7f6] font-bold">{feed.fps}</span>
                    <span>{feed.bitrate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matrixLayout === 'focus' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Primary Focused Feed (8 cols) */}
              <div className="lg:col-span-8 relative rounded-xl overflow-hidden bg-[#0a0e16] aspect-video group shadow-2xl border border-[#4cd7f6]/60">
                <img
                  className="w-full h-full object-cover brightness-95 contrast-110"
                  src={feeds[focusedFeedIndex].image}
                  alt={feeds[focusedFeedIndex].alt}
                />
                {feeds[focusedFeedIndex].overlay}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-4 flex items-center justify-between font-mono text-[12px] text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                    <span className="font-bold tracking-wider">{feeds[focusedFeedIndex].title}</span>
                    <span className="bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] px-2 py-0.5 rounded font-bold ml-2">
                      PRIMARY MONITOR
                    </span>
                  </div>
                  <span className="text-[#4edea3]">{liveTime}</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-4 flex items-center justify-between font-mono text-[11px] text-[#bcc9cd]">
                  <span>{feeds[focusedFeedIndex].resolution}</span>
                  <span className="text-[#4cd7f6] font-bold">{feeds[focusedFeedIndex].fps}</span>
                  <span>{feeds[focusedFeedIndex].bitrate}</span>
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
                        <span className="text-[#4edea3] text-[9px]">LIVE</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 flex justify-between font-mono text-[9px] text-[#bcc9cd]">
                        <span>{feed.fps}</span>
                        <span className="text-[#4cd7f6]">CLICK TO FOCUS</span>
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
                src={feeds[focusedFeedIndex].image}
                alt={feeds[focusedFeedIndex].alt}
              />
              {feeds[focusedFeedIndex].overlay}
              <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-5 flex items-center justify-between font-mono text-[13px] text-white">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                  <span className="font-bold tracking-wider">{feeds[focusedFeedIndex].title}</span>
                  <span className="bg-[#4edea3]/20 text-[#4edea3] text-[11px] px-2.5 py-0.5 rounded font-bold">
                    FULLSCREEN TELEMETRIC FEED
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#4edea3] font-bold">{liveTime}</span>
                  <button
                    onClick={() => setMatrixLayout('grid')}
                    className="bg-[#262a33] hover:bg-[#353942] text-white px-2.5 py-1 rounded text-xs"
                  >
                    Exit Fullscreen
                  </button>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent p-5 flex items-center justify-between font-mono text-[12px] text-[#bcc9cd]">
                <span>{feeds[focusedFeedIndex].resolution}</span>
                <span className="text-[#4cd7f6] font-bold">{feeds[focusedFeedIndex].fps}</span>
                <span>{feeds[focusedFeedIndex].bitrate}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Services Highlights */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#181c24] border-t border-[#262a33]">
        <div className="  flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase text-[#adc6ff] tracking-widest block mb-2 font-semibold">
                END-TO-END CAPABILITIES
              </span>
              <h2 className="text-3xl lg:text-[40px] text-[#dfe2ee] font-bold">Engineered For Zero Vulnerabilities</h2>
            </div>
            <p className="text-[15px] text-[#bcc9cd] ">
              From direct Tier-1 optical sensor distribution to on-site certified physical installation and private cloud VMS architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start bg-[#06b6d4]/20 px-3 py-1 rounded border border-[#06b6d4]/30">
                <span className="material-symbols-outlined text-[#4cd7f6] text-sm">calculate</span>
                <span className="font-mono text-[10px] text-[#4cd7f6] uppercase font-bold">
                  TELEMETRY BUDGET CALCULATOR
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
