export default function ArrowLeftIcon({ className = "size-4 lg:size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16.25 10H3.75m0 0 5.417 5.417M3.75 10l5.417-5.417"
        stroke="currentColor"
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
