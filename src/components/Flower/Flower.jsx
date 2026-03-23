// Colores por categoría
const COLORS = {
  "violencia-sexual": {
    outer:  "#c4b5fd", // violet-300
    inner:  "#a78bfa", // violet-400
    center: "#7c3aed", // violet-600
    glow:   "#ddd6fe",
  },
  aborto: {
    outer:  "#fda4af", // rose-300
    inner:  "#fb7185", // rose-400
    center: "#e11d48", // rose-600
    glow:   "#fecdd3",
  },
  "embarazo-parto": {
    outer:  "#fde68a", // amber-200
    inner:  "#fcd34d", // amber-300
    center: "#d97706", // amber-600
    glow:   "#fef3c7",
  },
};

// ── Flor SVG principal ────────────────────────────────────────────────────────
export function FlowerSVG({ categoria, size = 80, className = "" }) {
  const c = COLORS[categoria] || COLORS["violencia-sexual"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse key={angle} cx="50" cy="20" rx="12" ry="26" fill={c.outer} opacity="0.92" transform={`rotate(${angle} 50 50)`} />
      ))}
      {[30, 90, 150, 210, 270, 330].map((angle) => (
        <ellipse key={`i${angle}`} cx="50" cy="30" rx="8" ry="17" fill={c.inner} opacity="0.65" transform={`rotate(${angle} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="14" fill={c.center} />
      <circle cx="45" cy="44" r="5" fill="white" opacity="0.22" />
    </svg>
  );
}

// ── Flor con tallo para el prado ──────────────────────────────────────────────
export function FlowerOnStem({ categoria, size = 80, stemHeight = 120, className = "" }) {
  const c = COLORS[categoria] || COLORS["violencia-sexual"];
  // stemH en unidades del viewBox (escala relativa al size de la flor)
  const sh = Math.round(stemHeight * (100 / size));
  const totalH = 100 + sh;

  // Posiciones de hojas en el tallo
  const leaf1Y = 100 + Math.round(sh * 0.3);
  const leaf2Y = 100 + Math.round(sh * 0.62);

  return (
    <svg
      width={size}
      height={size + stemHeight}
      viewBox={`0 0 100 ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tallo */}
      <path
        d={`M 50 90 Q 48 ${100 + sh * 0.5} 50 ${totalH}`}
        stroke="#6ee7b7"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hoja izquierda */}
      <ellipse cx="38" cy={leaf1Y} rx="16" ry="7"
        fill="#34d399" opacity="0.85"
        transform={`rotate(-35 38 ${leaf1Y})`}
      />
      {/* Hoja derecha */}
      <ellipse cx="63" cy={leaf2Y} rx="16" ry="7"
        fill="#34d399" opacity="0.85"
        transform={`rotate(35 63 ${leaf2Y})`}
      />

      {/* Pétalos exteriores */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse key={angle} cx="50" cy="20" rx="12" ry="26"
          fill={c.outer} opacity="0.92"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Pétalos interiores */}
      {[30, 90, 150, 210, 270, 330].map((angle) => (
        <ellipse key={`i${angle}`} cx="50" cy="30" rx="8" ry="17"
          fill={c.inner} opacity="0.65"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {/* Centro */}
      <circle cx="50" cy="50" r="14" fill={c.center} />
      <circle cx="45" cy="44" r="5" fill="white" opacity="0.22" />
    </svg>
  );
}

// ── Pétalo individual (para animación de caída) ───────────────────────────────
export function PetalShape({ color, size = 11 }) {
  return (
    <svg
      width={size}
      height={size * 1.7}
      viewBox="0 0 20 34"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="10" cy="17" rx="9" ry="16" fill={color} opacity="0.82" />
    </svg>
  );
}

// ── Pétalos cayendo (se muestran cuando isPlaying = true) ────────────────────
const PETAL_CONFIG = [
  { delay: "0s",    dur: "2.8s", dx: -110, dy: -90,  size: 11 },
  { delay: "0.5s",  dur: "3.2s", dx: -80,  dy: -60,  size: 9  },
  { delay: "1.1s",  dur: "2.5s", dx: -140, dy: -100, size: 12 },
  { delay: "0.3s",  dur: "3.5s", dx: -65,  dy: -45,  size: 8  },
  { delay: "1.7s",  dur: "2.9s", dx: -120, dy: -80,  size: 10 },
  { delay: "0.8s",  dur: "3.1s", dx: -55,  dy: -70,  size: 9  },
  { delay: "2.1s",  dur: "2.6s", dx: -95,  dy: -110, size: 11 },
  { delay: "1.4s",  dur: "3.4s", dx: -75,  dy: -55,  size: 8  },
];

export function FallingPetals({ categoria }) {
  const c = COLORS[categoria] || COLORS["violencia-sexual"];

  return (
    <>
      {PETAL_CONFIG.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: "35px",
            right: "35px",
            width: `${p.size}px`,
            height: `${p.size * 1.7}px`,
            backgroundColor: c.outer,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            animation: `petalDrift ${p.dur} ${p.delay} infinite ease-in-out`,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

export default FlowerSVG;
