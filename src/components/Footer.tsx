import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="w-full bg-[#0a0e16] border-t border-[#262a33]/60 mt-16">
      <div className="  px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#262a33]/40">
          {/* Brand & Architecture */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                alt="AegisVision CCTV Logo"
                className="h-7 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XWnhzJ4E_o9oOcNW1TyZmlw2IuH_MGsXe2TFUIHNZ_sOGLlyeRh3zk3L4aqYmvTgsaklsy8Li9aqD1AiYYBi3oyyt2uER9RNET-KA1-Bje2qyx2ebP3BdJYEXY163OUTvfVn5OujZSaoPgD7BnttOa68KTP8el1C-9MqL3dqppmxupVYF0-iWCJTt9eO5_1NeRLyk0nqfxIP_yfqt62U_GUdKeUpWG8jTANk-CqgwzYAxUF8MZZu6FI2g"
              />
              <span className="text-[20px] text-[#dfe2ee] tracking-wider uppercase font-bold">
                AEGIS<span className="text-[#4cd7f6]">VISION</span>
              </span>
            </div>
            <p className="text-[#bcc9cd] text-[13px] leading-relaxed ">
              High-assurance enterprise perimeter telemetry, zero-latency situational awareness, and
              AI-accelerated surveillance systems engineered for critical infrastructure and commercial facilities.
            </p>
            <div className="space-y-2 pt-2">
              <span className="font-mono text-[10px] text-[#869397] uppercase tracking-wider block">
                Operational Architecture
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#1c2028] px-2.5 py-1 rounded font-mono text-[10px] text-[#adc6ff] border border-[#3d494c]/40">
                  NestJS API Core
                </span>
                <span className="bg-[#1c2028] px-2.5 py-1 rounded font-mono text-[10px] text-[#adc6ff] border border-[#3d494c]/40">
                  PostgreSQL Audit Trails
                </span>
                <span className="bg-[#1c2028] px-2.5 py-1 rounded font-mono text-[10px] text-[#adc6ff] border border-[#3d494c]/40">
                  WebGL 3D Telemetry
                </span>
              </div>
            </div>
          </div>

          {/* Certified Compliance */}
          <div className="space-y-3">
            <span className="font-mono text-[12px] text-[#4cd7f6] uppercase tracking-wider block font-semibold">
              Certified Compliance
            </span>
            <ul className="space-y-2 text-[13px] text-[#bcc9cd]">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified</span>
                <span>NDAA Section 889 Compliant</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified</span>
                <span>UL Listed 294 / 2808</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified</span>
                <span>ISO/IEC 27001 InfoSec</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4edea3] text-[16px]">verified</span>
                <span>ONVIF Profile S, G &amp; T</span>
              </li>
            </ul>
          </div>

          {/* Regional Service Depots */}
          <div className="space-y-3">
            <span className="font-mono text-[12px] text-[#4cd7f6] uppercase tracking-wider block font-semibold">
              Regional Service Depots
            </span>
            <ul className="space-y-2 text-[13px] text-[#bcc9cd]">
              <li>
                <span className="text-[#dfe2ee] font-semibold">North America:</span> NY, TX, CA Hubs
              </li>
              <li>
                <span className="text-[#dfe2ee] font-semibold">EMEA:</span> London, Frankfurt, Dubai
              </li>
              <li>
                <span className="text-[#dfe2ee] font-semibold">APAC:</span> Singapore, Tokyo Rapid-Dispatch
              </li>
              <li>
                <span className="text-[#dfe2ee] font-semibold">SLA:</span> 4-Hour On-Site Critical Response
              </li>
            </ul>
          </div>

          {/* Commercial Security Intel */}
          <div className="space-y-3">
            <span className="font-mono text-[12px] text-[#4cd7f6] uppercase tracking-wider block font-semibold">
              Commercial Security Intel
            </span>
            <p className="text-[13px] text-[#bcc9cd]">
              Receive direct alerts on firmware zero-days, NDAA advisories, and technical whitepapers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  className="bg-[#181c24] text-[#dfe2ee] placeholder:text-[#869397] font-mono text-[11px] px-3 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-[#4cd7f6] border border-[#3d494c]/60 w-full"
                  placeholder="engineer@enterprise.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#00424f] hover:text-[#003640] px-3 rounded-r font-mono transition-colors flex items-center justify-center"
                  type="submit"
                  aria-label="Subscribe to security updates"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
              {subscribed ? (
                <span className="text-[11px] text-[#4edea3] font-mono block">
                  Encrypted brief subscription confirmed.
                </span>
              ) : (
                <span className="text-[11px] text-[#869397] font-mono block">
                  Strict zero-marketing telemetric brief.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#869397]">
          <div className="flex flex-wrap items-center gap-6">
            <span>© 2025 AEGISVISION SECURITY INFRASTRUCTURE INC.</span>
            <a className="hover:text-[#dfe2ee] transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-[#dfe2ee] transition-colors" href="#security">Security Whitepapers</a>
            <a className="hover:text-[#dfe2ee] transition-colors" href="#status">System Status</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#4edea3] font-semibold">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
