'use client';

export default function FooterSection({ title, children }) {
  return (
    <div>
      {title && (
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
