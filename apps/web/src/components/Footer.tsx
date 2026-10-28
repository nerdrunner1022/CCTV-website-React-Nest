import React from 'react';

export const Footer: React.FC = () => (
  <footer className="mt-16 w-full border-t border-[#262a33]/60 bg-[#0a0e16]">
    <div className="flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-12">
      <div className="flex items-center gap-3">
        <img
          alt="AegisVision security camera logo"
          className="h-8 w-8 object-contain"
          src="/assets/aegisvision-mark.svg"
        />
        <span className="text-[18px] font-bold tracking-wider text-[#dfe2ee]">
          AEGIS<span className="text-[#4cd7f6]">VISION</span>
        </span>
      </div>
      <p className="text-sm text-[#bcc9cd]">
        Security cameras and installation, planned around your space.
      </p>
      <span className="text-xs text-[#869397]">
        © {new Date().getFullYear()} AegisVision
      </span>
    </div>
  </footer>
);
