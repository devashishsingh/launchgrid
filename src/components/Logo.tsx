/**
 * BLYOI — Premium brand mark.
 * Concept: A perfect disc (your life / your world) framed by a thin sage ring.
 * A bold "B" is carved into the disc as architectural negative space — the spine
 * is unbroken, the two bowls are open arcs. A single cyan dot ("your stake")
 * sits like punctuation in the upper-right, marking the moment of ownership.
 *
 * Editorial, geometric, never-seen-before. Reads as a B at any scale.
 */
export default function Logo({
  size = 36,
  className = "",
  variant = "dark",
}: {
  size?: number;
  className?: string;
  /** "dark" → on navy bg (sage mark). "light" → on white bg (navy mark). "mono" → currentColor. */
  variant?: "dark" | "light" | "mono";
}) {
  const stroke =
    variant === "light" ? "#171e19" : variant === "mono" ? "currentColor" : "#b7c6c2";
  const fill =
    variant === "light" ? "#ffffff" : variant === "mono" ? "transparent" : "#171e19";
  const dot =
    variant === "light" ? "#171e19" : variant === "mono" ? "currentColor" : "#d5f4f9";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Blyoi"
      role="img"
    >
      {/* Outer disc — the world / your life */}
      <circle cx="32" cy="32" r="29" fill={fill} stroke={stroke} strokeWidth="2" />

      {/* "B" spine — unbroken vertical, signalling resolve */}
      <rect x="20" y="14" width="3" height="36" fill={stroke} />

      {/* Upper bowl */}
      <path
        d="M23 15.5 H33 A7.5 7.5 0 0 1 33 30.5 H23"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="square"
      />

      {/* Lower bowl — slightly larger for editorial asymmetry */}
      <path
        d="M23 30.5 H36 A9 9 0 0 1 36 48.5 H23"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="square"
      />

      {/* Ownership dot — your stake, the punctuation closing the statement */}
      <circle cx="49.5" cy="16.5" r="2.5" fill={dot} />
    </svg>
  );
}
