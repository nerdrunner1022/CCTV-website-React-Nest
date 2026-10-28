import React, { useState, useMemo } from 'react';
import { HardwareItem } from '../types';

interface HardwareCatalogProps {
  items: HardwareItem[];
  isLoading: boolean;
  loadError: string | null;
  onAddToQuote: (item: HardwareItem) => void;
  onOpenCadModal: (item: HardwareItem) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const HardwareCatalog: React.FC<HardwareCatalogProps> = ({
  items,
  isLoading,
  loadError,
  onAddToQuote,
  onOpenCadModal,
  searchQuery = '',
  setSearchQuery = () => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Hardware');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  // Filters State
  const [resFilters, setResFilters] = useState<Record<string, boolean>>({
    '4k': true,
    '8mp-16mp': true,
    '5mp': true,
    thermal: true
  });

  const [selectedFormFactor, setSelectedFormFactor] = useState<string | null>(null);

  const [ingressFilters, setIngressFilters] = useState({
    ik10: false,
    ip67: false,
    heated: false
  });

  const [nightProtocol, setNightProtocol] = useState<string>('all');

  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const categories = [
    'All Hardware',
    '4K AI Smart Cameras',
    'NVR/DVR Server Appliances',
    'Thermal & Night Vision',
    'Multi-Sensor Panoramic',
    'Access Control & Audio',
    'Structured Cabling & Mounts'
  ];

  // Filtering and Sorting logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      if (selectedCategory !== 'All Hardware' && item.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchSeries = item.series.toLowerCase().includes(q);
        const matchSpecs = item.specs.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchSku && !matchSeries && !matchSpecs) return false;
      }

      // Resolution match
      if (!resFilters[item.resolution]) {
        return false;
      }

      // Form factor match
      if (selectedFormFactor && item.formFactor !== selectedFormFactor) {
        return false;
      }

      // Ingress match
      if (ingressFilters.ik10 && !item.ingress.ik10) return false;
      if (ingressFilters.ip67 && !item.ingress.ip67) return false;
      if (ingressFilters.heated && !item.ingress.heated) return false;

      // Night tech match
      if (nightProtocol !== 'all' && item.nightTech !== nightProtocol) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'res_high') {
        const score = (res: string) => (res === '4k' ? 4 : res === 'thermal' ? 3 : 2);
        return score(b.resolution) - score(a.resolution);
      }
      return 0; // recommended / default
    });
  }, [items, selectedCategory, searchQuery, resFilters, selectedFormFactor, ingressFilters, nightProtocol, sortBy]);

  const handleResetFilters = () => {
    setResFilters({ '4k': true, '8mp-16mp': true, '5mp': true, thermal: true });
    setSelectedFormFactor(null);
    setIngressFilters({ ik10: false, ip67: false, heated: false });
    setNightProtocol('all');
    setSelectedCategory('All Hardware');
    setSearchQuery('');
  };

  const handleAdd = (item: HardwareItem) => {
    onAddToQuote(item);
    setAddedNoticeId(item.id);
    setTimeout(() => {
      setAddedNoticeId((curr) => (curr === item.id ? null : curr));
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pt-28">
      {/* Command Strip / Telemetry Sub-Header */}
      <section className="w-full bg-[#0a0e16] px-6 lg:px-12 py-6 border-b border-[#262a33]">
        <div className="  flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl lg:text-[40px] text-[#dfe2ee] tracking-tight font-extrabold">
              Find the right camera
            </h1>
            <p className="text-[15px] text-[#bcc9cd]  leading-relaxed">
              Browse reliable cameras for your home or business. Not sure what you need?
              Our team can help you choose.
            </p>
          </div>

        </div>
      </section>

      {(isLoading || loadError || (!isLoading && items.length === 0)) && (
        <div
          className={`mx-6 mt-6 rounded border p-4 text-sm lg:mx-12 ${
            loadError
              ? 'border-error/40 bg-error-container/20 text-error'
              : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
          }`}
          role={loadError ? 'alert' : 'status'}
        >
          {isLoading
            ? 'Loading inventory from the local catalog…'
            : loadError
              ? `The catalog could not be loaded: ${loadError}`
              : 'No active products are in the catalog yet. Seed the local database to populate inventory.'}
        </div>
      )}

      {/* Filter & Controls Toolbar */}
      <section className="sticky top-20 z-40 w-full bg-[#0f131c]/95 backdrop-blur-xl shadow-md py-4 px-6 lg:px-12 border-b border-[#262a33]">
        <div className="  flex flex-col gap-4">
          {/* Search, Autocomplete & Sort Level */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Interactive Search Container with Dropdown Autocomplete */}
            <div className="relative flex-1 ">
              <div className="flex items-center bg-[#262a33] rounded px-3 py-2.5 shadow-sm border border-[#3d494c]/60 focus-within:ring-2 focus-within:ring-[#4cd7f6] focus-within:bg-[#31353e] transition-all">
                <span className="material-symbols-outlined text-[#869397] text-xl mr-2">manage_search</span>
                <input
                  autoComplete="off"
                  className="w-full bg-transparent font-mono text-[12px] text-[#dfe2ee] placeholder:text-[#869397] focus:outline-none"
                  id="catalogSearch"
                  placeholder="Search cameras..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#869397] hover:text-[#dfe2ee] text-sm p-1"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
                <div className="flex items-center gap-1.5 ml-2 pl-3 bg-[#181c24] px-2 py-0.5 rounded text-[#869397] font-mono text-[10px] border border-[#3d494c]/40">
                  <span>CMD+K</span>
                </div>
              </div>

              {/* Autocomplete Dropdown Panel */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#262a33] rounded shadow-2xl p-3 z-50 border border-[#3d494c]">
                  <div className="font-mono text-[10px] text-[#869397] px-2 py-1 uppercase tracking-wider flex justify-between border-b border-[#3d494c]/40 pb-2">
                    <span>Matching Hardware Archetypes</span>
                    <span className="text-[#4cd7f6]">Click to inspect</span>
                  </div>
                  <div className="flex flex-col mt-2 space-y-1">
                    {items.slice(0, 4).map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          setSearchQuery(h.name);
                          setSearchFocused(false);
                        }}
                        className="flex items-center justify-between p-2 rounded text-left hover:bg-[#1c2028] text-[#dfe2ee] font-mono text-[11px] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#4cd7f6] text-base">videocam</span>
                          <span>{h.name}</span>
                        </span>
                        <span className="text-[#869397] text-[10px]">SKU: {h.sku}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-[#262a33] px-3 py-2 rounded border border-[#3d494c]/60">
                <span className="material-symbols-outlined text-[#869397] text-lg">swap_vert</span>
                <label htmlFor="catalogSort" className="text-sm text-[#869397] hidden sm:inline">Sort:</label>
                <select
                  id="catalogSort"
                  className="bg-transparent font-mono text-[11px] text-[#dfe2ee] focus:outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option className="bg-[#262a33] text-[#dfe2ee]" value="recommended">
                    Recommended
                  </option>
                  <option className="bg-[#262a33] text-[#dfe2ee]" value="res_high">
                    Highest resolution
                  </option>
                  <option className="bg-[#262a33] text-[#dfe2ee]" value="price_low">
                    Price: low to high
                  </option>
                  <option className="bg-[#262a33] text-[#dfe2ee]" value="price_high">
                    Price: high to low
                  </option>
                </select>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="catalogCategory" className="text-sm text-[#bcc9cd]">
              Shop by category
            </label>
            <select
              id="catalogCategory"
              className="max-w-full rounded border border-[#3d494c]/60 bg-[#262a33] px-3 py-2 text-sm text-[#dfe2ee]"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Body: Sidebar + Dynamic Product Matrix */}
      <div className="  w-full px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 gap-6 items-start">
          <details className="rounded-xl border border-[#262a33] bg-[#181c24]">
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-[#dfe2ee]">
              <span className="material-symbols-outlined mr-2 align-middle text-[#4cd7f6]">filter_alt</span>
              More ways to filter
            </summary>
            <div className="grid grid-cols-1 gap-6 border-t border-[#262a33] p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center justify-between sm:col-span-2 lg:col-span-4">
                <span className="text-sm text-[#bcc9cd]">Choose technical features if you have a specific need.</span>
              <button
                onClick={handleResetFilters}
                className="text-sm text-[#4cd7f6] hover:text-[#acedff] cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Filter Block 1: Resolution */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-widest flex items-center justify-between font-bold">
                <span>Resolution</span>
                <span className="material-symbols-outlined text-xs text-[#869397]">expand_more</span>
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-[#bcc9cd]">
                <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1c2028] cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resFilters['4k']}
                      onChange={(e) => setResFilters({ ...resFilters, '4k': e.target.checked })}
                      className="accent-[#4cd7f6] rounded-sm w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>4K Ultra HD (3840×2160)</span>
                  </span>
                  <span className="text-[#869397] text-xs">42</span>
                </label>
                <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1c2028] cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resFilters['8mp-16mp']}
                      onChange={(e) => setResFilters({ ...resFilters, '8mp-16mp': e.target.checked })}
                      className="accent-[#4cd7f6] rounded-sm w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>8MP – 16MP Multi-Sensor</span>
                  </span>
                  <span className="text-[#869397] text-xs">19</span>
                </label>
                <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1c2028] cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resFilters['5mp']}
                      onChange={(e) => setResFilters({ ...resFilters, '5mp': e.target.checked })}
                      className="accent-[#4cd7f6] rounded-sm w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>5MP Tactical Starlight</span>
                  </span>
                  <span className="text-[#869397] text-xs">31</span>
                </label>
                <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#1c2028] cursor-pointer transition-colors">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={resFilters['thermal']}
                      onChange={(e) => setResFilters({ ...resFilters, thermal: e.target.checked })}
                      className="accent-[#4cd7f6] rounded-sm w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Dual Spectrum (Thermal + Optical)</span>
                  </span>
                  <span className="text-[#869397] text-xs">8</span>
                </label>
              </div>
            </div>

            {/* Filter Block 2: Form Factor */}
            <div className="space-y-2.5 pt-2">
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-widest flex items-center justify-between font-bold">
                <span>02 // Form Factor</span>
                <span className="material-symbols-outlined text-xs text-[#869397]">expand_more</span>
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <button
                  onClick={() => setSelectedFormFactor(selectedFormFactor === 'ptz' ? null : 'ptz')}
                  className={`flex items-center gap-2 p-2 rounded transition-colors text-left border ${
                    selectedFormFactor === 'ptz'
                      ? 'bg-[#06b6d4]/20 border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#262a33] border-transparent text-[#dfe2ee] hover:bg-[#1c2028]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#4cd7f6]">videocam</span>
                  <span>PTZ Speed</span>
                </button>
                <button
                  onClick={() => setSelectedFormFactor(selectedFormFactor === 'dome' ? null : 'dome')}
                  className={`flex items-center gap-2 p-2 rounded transition-colors text-left border ${
                    selectedFormFactor === 'dome'
                      ? 'bg-[#06b6d4]/20 border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#262a33] border-transparent text-[#dfe2ee] hover:bg-[#1c2028]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#4cd7f6]">circle</span>
                  <span>Dome Vandal</span>
                </button>
                <button
                  onClick={() => setSelectedFormFactor(selectedFormFactor === 'bullet' ? null : 'bullet')}
                  className={`flex items-center gap-2 p-2 rounded transition-colors text-left border ${
                    selectedFormFactor === 'bullet'
                      ? 'bg-[#06b6d4]/20 border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#262a33] border-transparent text-[#dfe2ee] hover:bg-[#1c2028]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#4cd7f6]">crop_landscape</span>
                  <span>Bullet Long</span>
                </button>
                <button
                  onClick={() => setSelectedFormFactor(selectedFormFactor === 'panoramic' ? null : 'panoramic')}
                  className={`flex items-center gap-2 p-2 rounded transition-colors text-left border ${
                    selectedFormFactor === 'panoramic'
                      ? 'bg-[#06b6d4]/20 border-[#4cd7f6] text-[#4cd7f6]'
                      : 'bg-[#262a33] border-transparent text-[#dfe2ee] hover:bg-[#1c2028]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm text-[#4cd7f6]">panorama</span>
                  <span>Panoramic</span>
                </button>
              </div>
            </div>

            {/* Filter Block 3: Deployment Environment */}
            <div className="space-y-2.5 pt-2">
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-widest flex items-center justify-between font-bold">
                <span>03 // Ingress &amp; Deployment</span>
                <span className="material-symbols-outlined text-xs text-[#869397]">expand_more</span>
              </span>
              <div className="space-y-2">
                <label className="flex items-center justify-between bg-[#262a33] p-2 rounded cursor-pointer border border-[#3d494c]/40">
                  <span className="font-mono text-[11px] text-[#dfe2ee] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4edea3] text-sm">shield</span>
                    IK10 Vandal-Proof
                  </span>
                  <input
                    type="checkbox"
                    checked={ingressFilters.ik10}
                    onChange={(e) => setIngressFilters({ ...ingressFilters, ik10: e.target.checked })}
                    className="accent-[#4edea3] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between bg-[#262a33] p-2 rounded cursor-pointer border border-[#3d494c]/40">
                  <span className="font-mono text-[11px] text-[#dfe2ee] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6] text-sm">water_drop</span>
                    IP67 / IP68 Submersible
                  </span>
                  <input
                    type="checkbox"
                    checked={ingressFilters.ip67}
                    onChange={(e) => setIngressFilters({ ...ingressFilters, ip67: e.target.checked })}
                    className="accent-[#4cd7f6] cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between bg-[#262a33] p-2 rounded cursor-pointer border border-[#3d494c]/40">
                  <span className="font-mono text-[11px] text-[#dfe2ee] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#adc6ff] text-sm">ac_unit</span>
                    Heated Enclosure (-40°C)
                  </span>
                  <input
                    type="checkbox"
                    checked={ingressFilters.heated}
                    onChange={(e) => setIngressFilters({ ...ingressFilters, heated: e.target.checked })}
                    className="accent-[#adc6ff] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Filter Block 4: Night Vision Protocol */}
            <div className="space-y-2.5 pt-2">
              <span className="font-mono text-[10px] text-[#4cd7f6] uppercase tracking-widest flex items-center justify-between font-bold">
                <span>04 // Night Vision Protocol</span>
                <span className="material-symbols-outlined text-xs text-[#869397]">expand_more</span>
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-[#bcc9cd]">
                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1c2028] cursor-pointer">
                  <input
                    type="radio"
                    name="night_tech"
                    checked={nightProtocol === 'all'}
                    onChange={() => setNightProtocol('all')}
                    className="accent-[#4cd7f6]"
                  />
                  <span>All Night Protocols</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1c2028] cursor-pointer">
                  <input
                    type="radio"
                    name="night_tech"
                    checked={nightProtocol === 'smart-matrix-ir'}
                    onChange={() => setNightProtocol('smart-matrix-ir')}
                    className="accent-[#4cd7f6]"
                  />
                  <span>Smart Matrix IR (Up to 200m)</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1c2028] cursor-pointer">
                  <input
                    type="radio"
                    name="night_tech"
                    checked={nightProtocol === 'starlight'}
                    onChange={() => setNightProtocol('starlight')}
                    className="accent-[#4cd7f6]"
                  />
                  <span>Full Color 24/7 Starlight+</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1c2028] cursor-pointer">
                  <input
                    type="radio"
                    name="night_tech"
                    checked={nightProtocol === 'thermal-core'}
                    onChange={() => setNightProtocol('thermal-core')}
                    className="accent-[#4cd7f6]"
                  />
                  <span>Radiometric Thermal Core</span>
                </label>
              </div>
            </div>

            {/* Diagnostic Mini Panel */}
            <div className="p-3 bg-[#0a0e16] rounded-lg space-y-2 border border-[#262a33]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#869397] uppercase">Active Feed Link</span>
                <span className="text-[#4edea3] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> LIVE
                </span>
              </div>
              <div className="h-1 w-full bg-[#262a33] rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4cd7f6] to-[#4edea3] w-3/4"></div>
              </div>
              <span className="text-[10px] text-[#869397] font-mono block leading-tight">
                NDAA Title 889 Part B compliant microcode verified for federal and enterprise use.
              </span>
            </div>
            </div>
          </details>

          {/* Product Matrix */}
          <section className="space-y-6">
            {/* Live Status Announcement Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-[#181c24] px-4 py-3 rounded-xl gap-3 border border-[#262a33]">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]"></span>
                </span>
                <span className="text-sm text-[#dfe2ee]">
                  {filteredItems.length} cameras
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#869397]">
                <span className="text-[#4cd7f6] font-semibold">Browse and compare options</span>
              </div>
            </div>

            {/* Grid of Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isLoading && !loadError && filteredItems.length === 0 && items.length > 0 && (
                <p className="col-span-full rounded border border-[#262a33] bg-[#181c24] p-6 text-sm text-[#bcc9cd]">
                  No products match these filters.
                </p>
              )}
              {filteredItems.map((product) => {
                const isNotice = addedNoticeId === product.id;

                return (
                  <article
                    key={product.id}
                    className="bg-[#181c24] rounded-xl p-5 shadow-xl hover:shadow-2xl flex flex-col justify-between group transition-all duration-200 border border-[#262a33] hover:border-[#4cd7f6]/50"
                  >
                    <div>
                      {/* Visual Mockup & Telemetry Stamp */}
                      <div className="relative w-full h-52 bg-[#0a0e16] rounded-lg overflow-hidden mb-4 border border-[#262a33]">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16] via-transparent to-transparent"></div>

                        {/* HUD Stamps */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#0a0e16]/85 backdrop-blur-md px-2 py-1 rounded text-[#4cd7f6] font-mono text-[10px] border border-[#4cd7f6]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                          <span>{product.badge}</span>
                        </div>
                        <div className="absolute top-2.5 right-2.5 bg-[#1bbd85]/80 text-[#00452e] font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {product.statusBadge}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[10px] text-[#bcc9cd]">
                          <span className="bg-[#262a33]/90 px-2 py-0.5 rounded">{product.resLabel}</span>
                          <span className="bg-[#262a33]/90 px-2 py-0.5 rounded text-[#4edea3] font-bold">
                            {product.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Title, SKU & Price */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-[10px] text-[#869397] uppercase tracking-wider block">
                            {product.series}
                          </span>
                          <h3 className="text-lg text-[#dfe2ee] font-bold group-hover:text-[#4cd7f6] transition-colors leading-snug">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xl text-[#4cd7f6] font-black">
                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="font-mono text-[10px] text-[#869397] block">MSRP / USD</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-4">
                        {product.specs.slice(0, 3).map((spec, i) => (
                          <span
                            key={i}
                            className="bg-[#262a33] px-2.5 py-1.5 rounded text-xs text-[#dfe2ee] border border-[#3d494c]/30"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>

                    </div>

                    <div className="pt-3 border-t border-[#262a33]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onOpenCadModal(product)}
                          className="flex items-center justify-center gap-1.5 bg-[#1c2028] hover:bg-[#262a33] text-[#4cd7f6] text-sm py-2.5 px-3 rounded transition-all border border-[#3d494c]/50 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">view_in_ar</span>
                          <span>View details</span>
                        </button>

                        <button
                          onClick={() => handleAdd(product)}
                          className={`flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 px-3 rounded shadow-md transition-all cursor-pointer ${
                            isNotice
                              ? 'bg-[#4edea3] text-[#003824]'
                              : 'bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {isNotice ? 'check' : 'add_circle'}
                          </span>
                          <span>{isNotice ? 'Added!' : 'Add to quote'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="bg-[#181c24] p-12 text-center rounded-xl border border-[#262a33]">
                <span className="material-symbols-outlined text-4xl text-[#869397] mb-2">search_off</span>
                <h3 className="text-lg font-bold text-[#dfe2ee]">No cameras found</h3>
                <p className="text-sm text-[#bcc9cd] mt-1 mb-4">
                  Adjust your search terms or reset the resolution and ingress filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#06b6d4] text-[#00424f] font-mono text-xs px-4 py-2 rounded font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Technical Telemetry Banner: Enterprise Staging */}
            <section className="bg-gradient-to-r from-[#181c24] via-[#1c2028] to-[#181c24] rounded-xl p-6 shadow-xl border border-[#262a33] relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 ">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4cd7f6]">terminal</span>
                    <span className="font-mono text-[10px] text-[#4cd7f6] uppercase font-bold tracking-widest">
                      Custom Engineering &amp; Staging Depots
                    </span>
                  </div>
                  <h4 className="text-lg text-[#dfe2ee] font-bold">Pre-Configured IP Schemes &amp; Burn-In Testing</h4>
                  <p className="text-[13px] text-[#bcc9cd] leading-relaxed">
                    Every AegisVision enterprise order passes through our 72-hour thermal chamber stress test,
                    pre-flashed with hardened cryptographic certificates, customized static VLAN IPs, and automated
                    ONVIF Profile T configuration.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => alert('NDAA Title 889 Compliance Matrix Packet (PDF) queued for download.')}
                    className="px-5 py-2.5 rounded bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-mono text-[11px] uppercase tracking-wider transition-colors border border-[#3d494c]/60 cursor-pointer"
                  >
                    Download NDAA Matrix
                  </button>
                  <button
                    onClick={() => alert('Custom staged deployment pipeline opened.')}
                    className="px-5 py-2.5 rounded bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] font-mono text-[11px] uppercase font-bold tracking-wider shadow-md transition-colors cursor-pointer"
                  >
                    Deploy Staged Build
                  </button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </div>
  );
};
