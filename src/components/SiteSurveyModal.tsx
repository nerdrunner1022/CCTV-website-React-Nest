import React, { useState } from 'react';

interface SiteSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  prefillData?: any;
}

export const SiteSurveyModal: React.FC<SiteSurveyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prefillData,
}) => {
  const [facility, setFacility] = useState(prefillData?.facility || 'Industrial Distribution Hub');
  const [contactName, setContactName] = useState('Jordan Miller, Chief Security Officer');
  const [phone, setPhone] = useState('+1 (555) 839-2041');
  const [email, setEmail] = useState('jmiller@aerologistix.com');
  const [nodes, setNodes] = useState(prefillData?.cameras || '32 AI Optical Nodes');
  const [preferredDate, setPreferredDate] = useState('2025-05-20');
  const [notes, setNotes] = useState('Require exterior parapet PTZ mounts and cold storage thermal monitoring.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      contactName,
      facilityName: facility,
      phone,
      email,
      nodes,
      preferredDate,
      notes,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-surface-container-lowest/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low  w-full rounded-xl p-6 lg:p-8 shadow-2xl flex flex-col gap-6 border border-surface-container-high animate-scale-in">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <div>
              <span className="font-label-mono-sm text-xs text-primary uppercase tracking-widest block font-bold">
                EXPEDITED FIELD DISPATCH
              </span>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                Schedule Rapid On-Site Survey
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface text-xl cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-6 rounded-lg bg-surface-container-lowest border border-tertiary/40 flex flex-col items-center text-center gap-4">
            <span className="w-12 h-12 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </span>
            <div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                Survey Window Reserved!
              </h3>
              <p className="font-body-sm text-sm text-on-surface-variant mt-2 leading-relaxed">
                Your request has been routed to our Lead Operations Engineer. A formal calendar invite and NDA token have been dispatched to <strong className="text-primary font-mono">{email}</strong>.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-mono-sm text-xs font-bold uppercase rounded transition-all cursor-pointer shadow-md mt-2"
            >
              Close &amp; Return to Console
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Facility / Site Name
                </label>
                <input
                  required
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  placeholder="e.g. Apex Marine Terminal"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Estimated Cameras / Nodes
                </label>
                <input
                  required
                  type="text"
                  value={nodes}
                  onChange={(e) => setNodes(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                  placeholder="e.g. 24 Nodes"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Contact Person &amp; Title
                </label>
                <input
                  required
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  placeholder="e.g. Jordan Miller, CSO"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Preferred Inspection Date
                </label>
                <input
                  required
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Direct Contact Phone
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                  placeholder="+1 (555) 019-2041"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                  Enterprise Corporate Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  placeholder="security@enterprise.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-mono-sm text-xs text-outline uppercase font-semibold">
                Perimeter Concerns / Architecture Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-surface-container p-3 rounded text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary resize-none"
                placeholder="High-bay racking, gate LPR integration, fiber run distance..."
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
              <span className="font-label-mono-sm text-xs text-outline flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                BICSI RCDD Certified Inspection
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-mono-sm text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-mono-sm text-xs font-bold uppercase rounded shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Confirm &amp; Transmit
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
