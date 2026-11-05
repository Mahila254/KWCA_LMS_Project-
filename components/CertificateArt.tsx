import { useId } from "react";
import type { CertificateDesign } from "@/lib/certificateDesigns";

/*
 * Savanna scenes behind the certificate, in the warm earth tones of the
 * KWCA logo. Drawn at A4 landscape proportions (1188 x 840). The white
 * certificate card covers the middle, so every scene keeps its subjects
 * (giraffe, baobabs, acacias, suns) in the margins around the card:
 * x 0-154 and 1034-1188, y 0-71 and 769-840.
 */

const W = 1188;
const H = 840;

const C = {
  night: "#3a1d14",
  umber: "#5e2e1c",
  rust: "#a7462a",
  terracotta: "#c2612f",
  orange: "#de8a3e",
  ochre: "#c9923f",
  sand: "#ebc58a",
  cream: "#f6e6c8",
  paper: "#fbf3e4",
  ink: "#1f1510",
};

/** A gently rolling hill line across the page, filled down to the bottom. */
function hill(y: number, amp: number, waves: number, phase: number) {
  const steps = 60;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const yy =
      y +
      amp * Math.sin((i / steps) * Math.PI * 2 * waves + phase) +
      amp * 0.35 * Math.sin((i / steps) * Math.PI * 2 * waves * 2.3 + phase * 1.7);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${yy.toFixed(1)} `;
  }
  return `${d}L${W} ${H} L0 ${H} Z`;
}

function Acacia({
  x,
  y,
  s = 1,
  fill = C.ink,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <path d="M-5 0 L-3 -60 L-31 -100 L-26 -104 L-1 -73 L1 -98 L6 -98 L4 -67 L28 -106 L33 -101 L6 -58 L6 0 Z" />
      <ellipse cx="-30" cy="-108" rx="46" ry="11" />
      <ellipse cx="26" cy="-111" rx="52" ry="12" />
      <ellipse cx="-2" cy="-119" rx="56" ry="12" />
      <ellipse cx="44" cy="-103" rx="26" ry="7" />
      <ellipse cx="-58" cy="-102" rx="22" ry="6" />
      <ellipse cx="8" cy="-127" rx="30" ry="7" />
    </g>
  );
}

function Baobab({
  x,
  y,
  s = 1,
  fill = C.ink,
  bandFill,
  bandId,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  bandFill?: string;
  bandId?: string;
}) {
  const trunk =
    "M-48 0 C-53 -80 -45 -170 -32 -230 C-30 -246 -26 -258 -22 -262 L22 -262 C26 -258 30 -246 32 -230 C45 -170 53 -80 48 0 Z";
  // A branching crown: each limb forks in two, four times over, the way a
  // baobab's bare branches fan out against the sky.
  const branches: [number, number, number, number, number][] = [];
  function grow(x: number, y: number, angle: number, len: number, w: number, depth: number) {
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    branches.push([x, y, x2, y2, w]);
    if (depth === 0) return;
    grow(x2, y2, angle - 0.42, len * 0.7, w * 0.62, depth - 1);
    grow(x2, y2, angle + 0.38, len * 0.66, w * 0.62, depth - 1);
  }
  grow(-14, -256, -2.25, 70, 12, 4);
  grow(0, -258, -1.6, 66, 11, 4);
  grow(14, -256, -0.92, 70, 12, 4);

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke={fill} strokeLinecap="round">
        {branches.map(([x1, y1, x2, y2, w], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={w} />
        ))}
      </g>
      <path d={trunk} fill={fill} />
      {bandFill && bandId && (
        <>
          <clipPath id={bandId}>
            <path d={trunk} />
          </clipPath>
          <g clipPath={`url(#${bandId})`} fill={bandFill}>
            {[-70, -130, -190].map((by) => (
              <g key={by}>
                <rect x="-60" y={by} width="120" height="3" />
                <rect x="-60" y={by + 17} width="120" height="3" />
                {Array.from({ length: 12 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${-60 + i * 10} ${by + 14} l5 -9 l5 9 z`}
                  />
                ))}
              </g>
            ))}
          </g>
        </>
      )}
    </g>
  );
}

function Giraffe({
  x,
  y,
  s = 1,
  fill = C.ink,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      fill={fill}
      stroke={fill}
      strokeLinecap="round"
    >
      <line x1="24" y1="-150" x2="18" y2="0" strokeWidth="8" />
      <line x1="38" y1="-150" x2="36" y2="0" strokeWidth="8" />
      <line x1="104" y1="-170" x2="102" y2="0" strokeWidth="8" />
      <line x1="118" y1="-170" x2="122" y2="0" strokeWidth="8" />
      <ellipse
        cx="70"
        cy="-168"
        rx="58"
        ry="30"
        transform="rotate(-10 70 -168)"
        stroke="none"
      />
      <polygon points="96,-190 124,-178 172,-318 156,-328" stroke="none" />
      <ellipse
        cx="178"
        cy="-326"
        rx="22"
        ry="9.5"
        transform="rotate(22 178 -326)"
        stroke="none"
      />
      <line x1="160" y1="-332" x2="156" y2="-350" strokeWidth="3.5" />
      <line x1="166" y1="-333" x2="165" y2="-351" strokeWidth="3.5" />
      <ellipse
        cx="151"
        cy="-332"
        rx="8"
        ry="3"
        transform="rotate(-25 151 -332)"
        stroke="none"
      />
      <line x1="14" y1="-178" x2="4" y2="-112" strokeWidth="3" />
      <ellipse cx="3" cy="-106" rx="3.5" ry="8" stroke="none" />
    </g>
  );
}

function Antelope({
  x,
  y,
  s = 1,
  fill = C.ink,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      fill={fill}
      stroke={fill}
      strokeLinecap="round"
    >
      <line x1="10" y1="-38" x2="7" y2="0" strokeWidth="4" />
      <line x1="18" y1="-38" x2="20" y2="0" strokeWidth="4" />
      <line x1="44" y1="-40" x2="44" y2="0" strokeWidth="4" />
      <line x1="52" y1="-40" x2="56" y2="0" strokeWidth="4" />
      <ellipse cx="30" cy="-43" rx="30" ry="12" stroke="none" />
      <polygon points="48,-50 58,-46 70,-80 62,-84" stroke="none" />
      <ellipse
        cx="73"
        cy="-82"
        rx="10"
        ry="5"
        transform="rotate(25 73 -82)"
        stroke="none"
      />
      <path d="M64 -86 C60 -102 67 -112 61 -124" fill="none" strokeWidth="2.5" />
      <path d="M68 -86 C66 -102 73 -110 69 -122" fill="none" strokeWidth="2.5" />
      <line x1="1" y1="-46" x2="-4" y2="-34" strokeWidth="3" />
    </g>
  );
}

function Birds({
  points,
  stroke = C.ink,
}: {
  points: [number, number, number][];
  stroke?: string;
}) {
  return (
    <g fill="none" stroke={stroke} strokeLinecap="round" strokeLinejoin="round">
      {points.map(([x, y, s], i) => (
        <path
          key={i}
          d={`M${x} ${y} q${6 * s} ${-7 * s} ${12 * s} 0 q${6 * s} ${-7 * s} ${12 * s} 0`}
          strokeWidth={2.4 * Math.max(s, 0.7)}
        />
      ))}
    </g>
  );
}

function Hut({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-18" y="-24" width="36" height="24" fill={C.umber} />
      <rect x="-5" y="-15" width="10" height="15" fill={C.ink} />
      <polygon points="-27,-21 0,-50 27,-21" fill={C.ochre} />
      <g stroke={C.umber} strokeWidth="1.5">
        <line x1="0" y1="-50" x2="-15" y2="-21" />
        <line x1="0" y1="-50" x2="0" y2="-21" />
        <line x1="0" y1="-50" x2="15" y2="-21" />
      </g>
    </g>
  );
}

function Tuft({
  x,
  y,
  s = 1,
  stroke = C.ink,
}: {
  x: number;
  y: number;
  s?: number;
  stroke?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
    >
      <path d="M0 0 Q-10 -20 -18 -34" />
      <path d="M0 0 Q-3 -24 -4 -42" />
      <path d="M0 0 Q5 -22 12 -38" />
      <path d="M0 0 Q12 -14 22 -24" />
      <path d="M0 0 Q-14 -10 -26 -16" />
    </g>
  );
}

function Aloe({
  x,
  y,
  s = 1,
  fill = C.rust,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
}) {
  const leaf = "M-3 0 C-6 -20 -10 -42 -4 -60 C0 -42 4 -20 3 0 Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      {[-55, -30, -10, 10, 30, 55].map((angle) => (
        <path key={angle} d={leaf} transform={`rotate(${angle})`} />
      ))}
    </g>
  );
}

/** A soft paper grain over the whole scene. */
function Grain({ id, opacity = 0.22 }: { id: string; opacity?: number }) {
  return (
    <>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 1.4 -0.55"
        />
      </filter>
      <rect width={W} height={H} filter={`url(#${id})`} opacity={opacity} />
    </>
  );
}

function SavannaDusk({ uid }: { uid: string }) {
  return (
    <>
      <defs>
        <pattern
          id={`${uid}-spots`}
          width="26"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <rect width="26" height="22" fill={C.ink} />
          <path
            d="M3 3 h8 l2 5 -3 5 h-7 l-2 -5 z M15 1 h7 l2 6 -4 4 h-5 l-2 -5 z M8 14 h8 l3 4 -3 4 h-9 l-1 -4 z"
            fill={C.ochre}
          />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={C.night} />
      <circle cx="1090" cy="118" r="112" fill={C.sand} />
      <path d={hill(95, 22, 1.3, 0.4)} fill={C.umber} />
      <path d={hill(210, 34, 1.1, 2.1)} fill={C.rust} />
      <path d={hill(330, 30, 1.6, 4.0)} fill={C.terracotta} />
      <path d={hill(450, 36, 1.2, 1.2)} fill={C.orange} />
      <path d={hill(560, 28, 1.5, 3.3)} fill={C.sand} />
      <path d={hill(660, 32, 1.1, 5.1)} fill={C.terracotta} />
      <path d={hill(770, 20, 1.8, 2.6)} fill={C.rust} />
      <Giraffe x={-4} y={842} s={0.8} fill={`url(#${uid}-spots)`} />
      <Acacia x={1118} y={846} s={1.25} />
      <Tuft x={1062} y={838} s={1.1} />
      <Birds
        points={[
          [70, 60, 1],
          [104, 42, 0.8],
          [128, 70, 0.7],
        ]}
        stroke={C.sand}
      />
      <Grain id={`${uid}-grain`} />
    </>
  );
}

function BaobabMorning({ uid }: { uid: string }) {
  return (
    <>
      <rect width={W} height={H} fill={C.paper} />
      <circle cx="1104" cy="96" r="62" fill={C.ochre} />
      <path d={hill(735, 14, 1.4, 1.0)} fill={C.sand} />
      <path d={hill(790, 10, 2.0, 3.2)} fill={C.ochre} opacity="0.55" />
      <Baobab
        x={70}
        y={842}
        s={1.55}
        bandFill={C.ochre}
        bandId={`${uid}-band-a`}
      />
      <Baobab x={1124} y={812} s={0.62} bandFill={C.ochre} bandId={`${uid}-band-b`} />
      <Acacia x={1060} y={790} s={0.45} />
      <Hut x={1150} y={830} s={0.9} />
      <Tuft x={1080} y={836} s={0.9} />
      <Tuft x={150} y={838} s={1} />
      <Birds
        points={[
          [1050, 180, 1.1],
          [1090, 200, 0.85],
          [1124, 228, 0.7],
          [1150, 252, 0.6],
        ]}
      />
      <Grain id={`${uid}-grain`} opacity={0.14} />
    </>
  );
}

function PatternedDunes({ uid }: { uid: string }) {
  const rays = Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2);
  return (
    <>
      <defs>
        <pattern
          id={`${uid}-zig`}
          width="28"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 12 L7 4 L14 12 L21 4 L28 12"
            fill="none"
            stroke={C.cream}
            strokeWidth="2"
            opacity="0.7"
          />
        </pattern>
        <pattern
          id={`${uid}-diamond`}
          width="30"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M15 3 L24 11 L15 19 L6 11 Z"
            fill="none"
            stroke={C.cream}
            strokeWidth="2"
            opacity="0.6"
          />
        </pattern>
        <pattern
          id={`${uid}-dots`}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="9" cy="9" r="2.4" fill={C.ochre} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={C.paper} />
      <g stroke={C.orange} strokeWidth="3" strokeLinecap="round">
        {rays.map((a, i) => (
          <line
            key={i}
            x1={78 + Math.cos(a) * 66}
            y1={92 + Math.sin(a) * 66}
            x2={78 + Math.cos(a) * (i % 2 ? 96 : 112)}
            y2={92 + Math.sin(a) * (i % 2 ? 96 : 112)}
          />
        ))}
      </g>
      <circle cx="78" cy="92" r="56" fill={C.orange} />
      <circle cx="1122" cy="70" r="40" fill={C.terracotta} opacity="0.85" />
      <path d={hill(560, 30, 1.2, 0.6)} fill={C.sand} />
      <path d={hill(560, 30, 1.2, 0.6)} fill={`url(#${uid}-zig)`} />
      <path d={hill(640, 26, 1.5, 2.4)} fill={C.ochre} />
      <path d={hill(640, 26, 1.5, 2.4)} fill={`url(#${uid}-diamond)`} />
      <path d={hill(715, 22, 1.1, 4.4)} fill={C.terracotta} />
      <path d={hill(715, 22, 1.1, 4.4)} fill={`url(#${uid}-zig)`} />
      <path d={hill(785, 16, 1.7, 1.9)} fill={C.umber} />
      <path d={hill(785, 16, 1.7, 1.9)} fill={`url(#${uid}-diamond)`} />
      <rect x="1040" y="250" width="140" height="120" fill={`url(#${uid}-dots)`} />
      <rect x="10" y="260" width="130" height="110" fill={`url(#${uid}-dots)`} />
      <Acacia x={60} y={600} s={1.05} fill={C.umber} />
      <Acacia x={1128} y={630} s={0.95} fill={C.umber} />
      <Aloe x={118} y={712} s={1.1} />
      <Aloe x={1074} y={732} s={0.9} />
      <Grain id={`${uid}-grain`} opacity={0.14} />
    </>
  );
}

function SunDisc({ uid }: { uid: string }) {
  const stripes = [C.rust, C.orange, C.cream, C.sand, C.terracotta, C.cream, C.orange];
  const disc = (cx: number, cy: number, r: number, clip: string) => (
    <>
      <clipPath id={clip}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {stripes.map((color, i) => (
          <rect
            key={i}
            x={cx - r}
            y={cy - r + (i * 2 * r) / stripes.length}
            width={2 * r}
            height={(2 * r) / stripes.length + 1}
            fill={color}
          />
        ))}
        <circle cx={cx} cy={cy + r * 0.12} r={r * 0.55} fill={C.cream} />
      </g>
    </>
  );

  return (
    <>
      <rect width={W} height={H} fill="#c97a2b" />
      {disc(80, 600, 250, `${uid}-disc-a`)}
      {disc(1120, 150, 130, `${uid}-disc-b`)}
      <path d={hill(800, 10, 2.2, 0.8)} fill={C.ink} />
      <Acacia x={92} y={812} s={1.35} />
      <Antelope x={20} y={806} s={0.9} />
      <Acacia x={1112} y={820} s={0.9} />
      <Antelope x={1176} y={812} s={0.7} flip />
      <Tuft x={150} y={806} s={1} />
      <Grain id={`${uid}-grain`} opacity={0.26} />
    </>
  );
}

export default function CertificateArt({
  design,
}: {
  design: CertificateDesign;
}) {
  const uid = useId().replace(/:/g, "");
  const Scene = {
    "savanna-dusk": SavannaDusk,
    "baobab-morning": BaobabMorning,
    "patterned-dunes": PatternedDunes,
    "sun-disc": SunDisc,
  }[design];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <Scene uid={uid} />
    </svg>
  );
}
