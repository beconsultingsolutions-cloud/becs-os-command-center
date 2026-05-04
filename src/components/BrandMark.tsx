type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className="brand-mark" data-testid="brand-becs-os">
      <svg
        aria-label="BECS OS mark"
        className="brand-mark__icon"
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="8" width="32" height="32" rx="7" stroke="currentColor" strokeWidth="3" />
        <path d="M16 18h16.5c3 0 5.5 2.4 5.5 5.4S35.5 29 32.5 29H16V18Z" stroke="currentColor" strokeWidth="3" />
        <path d="M16 29h12.5c2.7 0 5 2.1 5 5s-2.3 5-5 5H16V29Z" stroke="currentColor" strokeWidth="3" />
        <path d="M16 8v32" stroke="currentColor" strokeWidth="3" />
      </svg>
      {!compact && (
        <div className="brand-mark__text">
          <p data-testid="text-brand-title">BECS OS</p>
          <span data-testid="text-brand-subtitle">Command Center</span>
        </div>
      )}
    </div>
  );
}
