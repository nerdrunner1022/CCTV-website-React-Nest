import React, { useState } from 'react';
import { HardwareItem } from '../types';

interface CadViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HardwareItem | null;
  onAddToQuote: (item: HardwareItem) => void;
}

export const CadViewerModal: React.FC<CadViewerModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToQuote,
}) => {
  const [activeAngle, setActiveAngle] = useState<'iso' | 'front' | 'internal' | 'exploded'>('iso');
  const [renderMode, setRenderMode] = useState<'shaded' | 'wireframe' | 'hud'>('hud');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!isOpen || !item) return null;

  const imageSrc = item.imageUrl || item.image || '';
  const fov = item.fov || '112° Horizontal';
  const ipRating = item.ipRating || (item.ingress?.ip67 ? 'IP67 / IK10' : 'IP66 Industrial');
  const irRange = item.irRange || '60m Smart Matrix IR';
  const sensor = item.sensor || item.specs?.[0] || 'Sony Starvis CMOS';
  const resText = item.resLabel || item.resolution || '4K UHD';

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low  w-full rounded-xl overflow-hidden shadow-2xl flex flex-col border border-surface-container-high animate-scale-in">
        {/* Header */}
        <div className="p-4 px-6 bg-surface-container border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <div>
              <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                AEGIS 3D CAD ENGINE // TELEMETRY CALIPER
              </span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                {item.name} ({item.sku})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container-high text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Viewport & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Main 3D Viewport (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest relative flex items-center justify-center p-8 overflow-hidden select-none">
            {/* Background CAD Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1c2028_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-surface-container-lowest/40 pointer-events-none"></div>

            {/* Tactical Caliper Overlay */}
            <div className="absolute top-4 left-4 font-label-mono-sm text-xs text-outline space-y-1 z-10">
              <div className="text-primary font-bold">FOV: {fov}</div>
              <div>ZOOM: {zoomLevel}%</div>
              <div>IP_RATING: {ipRating}</div>
              <div>IR_RANGE: {irRange}</div>
            </div>

            <div className="absolute top-4 right-4 font-label-mono-sm text-xs text-tertiary z-10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              RENDER: {renderMode.toUpperCase()}
            </div>

            {/* Central 3D Visualizer Simulation */}
            <div
              className="relative transition-all duration-700 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel / 100}) ${
                  activeAngle === 'iso'
                    ? 'rotateY(-25deg) rotateX(15deg)'
                    : activeAngle === 'front'
                    ? 'rotateY(0deg) rotateX(0deg)'
                    : activeAngle === 'internal'
                    ? 'rotateY(45deg) rotateX(-20deg)'
                    : 'rotateY(60deg) rotateX(25deg)'
                }`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt={item.name}
                  className={` max-h-full object-contain filter drop-shadow-[0_0_24px_rgba(6,182,212,0.3)] transition-all duration-500 ${
                    renderMode === 'wireframe'
                      ? 'contrast-200 hue-rotate-90 saturate-200 invert'
                      : renderMode === 'hud'
                      ? 'contrast-125'
                      : ''
                  }`}
                />

                {/* Simulated Wireframe / Reticle HUD overlay */}
                {renderMode === 'hud' && (
                  <div className="absolute inset-0 pointer-events-none border border-primary/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-12 h-12 border border-tertiary/40 rounded-full"></div>
                    <div className="absolute top-0 w-1 h-3 bg-primary"></div>
                    <div className="absolute bottom-0 w-1 h-3 bg-primary"></div>
                    <div className="absolute left-0 h-1 w-3 bg-primary"></div>
                    <div className="absolute right-0 h-1 w-3 bg-primary"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Viewport Angle Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-container/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-surface-container-high flex items-center gap-2 z-10">
              {[
                { id: 'iso', label: 'Isometric' },
                { id: 'front', label: 'Frontal Optics' },
                { id: 'internal', label: 'Sensor Stack' },
                { id: 'exploded', label: 'Exploded Assembly' },
              ].map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => setActiveAngle(angle.id as any)}
                  className={`px-2.5 py-1 rounded font-label-mono-sm text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeAngle === angle.id
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Parameters & Spec Panel (4 cols) */}
          <div className="lg:col-span-4 bg-surface-container p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-surface-container-high">
            <div className="space-y-4">
              <div>
                <span className="font-label-mono-sm text-xs text-outline uppercase block font-semibold">
                  CHASSIS SPECIFICATIONS
                </span>
                <span className="font-headline-sm text-xl font-bold text-tertiary block mt-1">
                  ${item.price.toLocaleString()}
                </span>
              </div>

              {/* Render Modes Toggle */}
              <div className="space-y-1.5">
                <span className="font-label-mono-sm text-[11px] text-outline uppercase">
                  Shader Simulation
                </span>
                <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded border border-surface-container-high">
                  {(['shaded', 'wireframe', 'hud'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRenderMode(mode)}
                      className={`py-1 rounded font-label-mono-sm text-[11px] capitalize font-medium transition-colors cursor-pointer ${
                        renderMode === mode
                          ? 'bg-primary text-on-primary font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-label-mono-sm text-[11px] text-outline">
                  <span>Zoom Level</span>
                  <span>{zoomLevel}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={150}
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-container-highest rounded cursor-pointer"
                />
              </div>

              {/* Technical Spec List */}
              <div className="space-y-2 pt-2 border-t border-surface-container-high font-mono text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-outline">Resolution:</span>
                  <span className="text-on-surface font-semibold">{resText}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-outline">Sensor Type:</span>
                  <span className="text-on-surface font-semibold">{sensor}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-outline">Field of View:</span>
                  <span className="text-on-surface font-semibold">{fov}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-outline">Night IR Reach:</span>
                  <span className="text-on-surface font-semibold">{irRange}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span className="text-outline">Ingress Rating:</span>
                  <span className="text-tertiary font-semibold">{ipRating}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-surface-container-high flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddToQuote(item);
                  onClose();
                }}
                className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-mono-sm text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">view_in_ar</span>
                Add Node to Project BOM
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-mono-sm text-xs rounded transition-colors text-center cursor-pointer"
              >
                Close CAD Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
