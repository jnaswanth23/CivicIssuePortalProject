export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {/* Ashoka Chakra inspired SVG */}
      <svg
        width="42"
        height="42"
        viewBox="0 0 100 100"
        aria-label="Civic Issue Portal Logo"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="white"
          stroke="#1e3a8a"
          strokeWidth="4"
        />
        {[...Array(24)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="10"
            stroke="#1e3a8a"
            strokeWidth="2"
            transform={`rotate(${i * 15} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="4" fill="#1e3a8a" />
      </svg>

      {/* Text */}
      <span
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#0f172a",
          whiteSpace: "nowrap",
        }}
      >
        Civic Issue Portal
      </span>
    </div>
  );
}
