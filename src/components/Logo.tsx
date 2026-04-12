export function Logo({ size = 48 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="22" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
        <text
          x="24"
          y="30"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontWeight="700"
          fontSize="22"
          fill="#D4AF37"
        >
          K
        </text>
        <circle cx="38" cy="10" r="5" fill="#7F77DD" />
      </svg>
    </div>
  );
}
