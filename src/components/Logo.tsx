import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="brand-logo-container">
      {/* Official Saffa Bubur Bayi Logo from Google Drive */}
      <img
        src="https://lh3.googleusercontent.com/d/1CQA9uRMs3qCNkti_QpI3q-g22bzWLC8j"
        alt="Saffa Bubur Bayi"
        className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full bg-white p-0.5 shadow-md border border-pink-100"
        referrerPolicy="no-referrer"
        id="logo-image-element"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-display font-extrabold text-2xl text-slate-800 tracking-tight">
          Saffa<span className="text-rose-500">.</span>
        </span>
        <span className="text-[11px] uppercase tracking-widest font-black text-emerald-600">
          Bubur Bayi
        </span>
      </div>
    </div>
  );
}
