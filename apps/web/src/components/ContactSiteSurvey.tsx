import React from 'react';

interface ContactSiteSurveyProps {
  onOpenSurveyModal: () => void;
}

export const ContactSiteSurvey: React.FC<ContactSiteSurveyProps> = ({
  onOpenSurveyModal,
}) => (
  <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-20">
    <div className="lg:col-span-7">
      <span className="inline-flex items-center gap-2 rounded border border-primary/20 bg-surface-container px-3 py-1.5 font-label-mono-sm text-xs font-bold uppercase tracking-widest text-primary">
        <span className="material-symbols-outlined text-base">contact_support</span>
        Contact &amp; Site Survey
      </span>
      <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-on-surface lg:text-5xl">
        Let’s plan the right security system for your space.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
        Tell us about your property, the areas you want to monitor, and your camera requirements.
        A site survey request helps shape a practical CCTV plan around your needs.
      </p>
      <ol className="mt-8 space-y-4 text-sm text-on-surface-variant">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">edit_note</span>
          Share your site details and approximate camera count.
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          Choose a preferred date for the survey.
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">architecture</span>
          Use the details to plan a system suited to your property.
        </li>
      </ol>
    </div>

    <div className="flex flex-col justify-center rounded-xl border border-surface-container-high bg-surface-container-low p-6 shadow-xl sm:p-8 lg:col-span-5">
      <span className="material-symbols-outlined text-3xl text-primary">fact_check</span>
      <h2 className="mt-4 text-2xl font-bold text-on-surface">Request a site survey</h2>
      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        A few details are enough to get started. You can include your preferred date and any
        coverage concerns in the request form.
      </p>
      <button
        className="mt-6 inline-flex items-center justify-center gap-2 rounded bg-primary-container px-5 py-3 font-label-mono-sm text-xs font-bold uppercase tracking-wider text-on-primary-container shadow-md transition-all"
        onClick={onOpenSurveyModal}
        type="button"
      >
        <span className="material-symbols-outlined text-base">calendar_month</span>
        Schedule a site survey
      </button>
      <p className="mt-4 text-xs leading-relaxed text-outline">
        Demo mode: requests are kept in this browser session and are not sent to a server.
      </p>
    </div>
  </section>
);
