export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="box-face" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="box-lid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="arrow-glow" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>

      {/* Box body */}
      <rect x="8" y="22" width="32" height="20" rx="3" fill="url(#box-face)" opacity="0.9" />

      {/* Box lid — open */}
      <path
        d="M6 22L24 14L42 22H6Z"
        fill="url(#box-lid)"
        opacity="0.95"
      />

      {/* Lid highlight */}
      <line x1="10" y1="21.5" x2="38" y2="21.5" stroke="white" strokeWidth="0.5" opacity="0.2" />

      {/* Launch arrow bursting out */}
      <path
        d="M24 4L28 12H25V18H23V12H20L24 4Z"
        fill="url(#arrow-glow)"
      />

      {/* Arrow tip sparkle */}
      <circle cx="24" cy="5" r="1" fill="white" opacity="0.7" />

      {/* Box clasp */}
      <rect x="21" y="20" width="6" height="4" rx="1" fill="white" opacity="0.15" />
    </svg>
  );
}
