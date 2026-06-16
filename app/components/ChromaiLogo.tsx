import { useId } from "react";

export default function ChromaiLogo({ size = 56 }: { size?: number }) {
  // unique per-instance ids so multiple logos can render without id collisions
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `${name}-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Chromai logo"
    >
      <defs>
        <linearGradient id={id("g-outer")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366f1"/>
          <stop offset="33%"  stopColor="#8b5cf6"/>
          <stop offset="66%"  stopColor="#ec4899"/>
          <stop offset="100%" stopColor="#fb923c"/>
        </linearGradient>
        <linearGradient id={id("g-inner")} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#2dd4bf"/>
          <stop offset="50%"  stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
        <radialGradient id={id("g-core")} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fff"     stopOpacity="1"/>
          <stop offset="35%"  stopColor="#c4b5fd"  stopOpacity="0.95"/>
          <stop offset="70%"  stopColor="#8b5cf6"  stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#6366f1"  stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={id("g-glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.28"/>
          <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
        </radialGradient>
        <filter id={id("f-glow")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id={id("f-core-glow")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle cx="100" cy="100" r="90" fill={`url(#${id("g-glow")})`}/>

      {/* Outer ring — clockwise 7s */}
      <g filter={`url(#${id("f-glow")})`}>
        <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-cw 7s linear infinite" }}>
          <circle cx="100" cy="100" r="70"
            fill="none" stroke={`url(#${id("g-outer")})`} strokeWidth="12"
            strokeLinecap="round" strokeDasharray="330 110" opacity="0.95"/>
          <circle cx="100" cy="100" r="70"
            fill="none" stroke={`url(#${id("g-outer")})`} strokeWidth="5"
            strokeLinecap="round" strokeDasharray="80 350" strokeDashoffset="-170" opacity="0.55"/>
        </g>
      </g>

      {/* Inner ring — counter-clockwise 5s */}
      <g filter={`url(#${id("f-glow")})`}>
        <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-ccw 5s linear infinite" }}>
          <circle cx="100" cy="100" r="50"
            fill="none" stroke={`url(#${id("g-inner")})`} strokeWidth="8"
            strokeLinecap="round" strokeDasharray="220 94" opacity="0.95"/>
          <circle cx="100" cy="100" r="50"
            fill="none" stroke={`url(#${id("g-inner")})`} strokeWidth="3"
            strokeLinecap="round" strokeDasharray="55 259" strokeDashoffset="-130" opacity="0.5"/>
        </g>
      </g>

      {/* Orbit dot outer */}
      <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-cw 7s linear infinite" }}>
        <circle cx="170" cy="100" r="5" fill="#ec4899" opacity="0.9" filter={`url(#${id("f-glow")})`}/>
      </g>
      <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-cw 7s linear infinite", animationDelay: "-3.5s" }}>
        <circle cx="170" cy="100" r="3" fill="#fb923c" opacity="0.7" filter={`url(#${id("f-glow")})`}/>
      </g>

      {/* Orbit dot inner */}
      <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-ccw 5s linear infinite" }}>
        <circle cx="150" cy="100" r="4" fill="#2dd4bf" opacity="0.9" filter={`url(#${id("f-glow")})`}/>
      </g>
      <g style={{ transformOrigin: "100px 100px", animation: "chromai-logo-ccw 5s linear infinite", animationDelay: "-1.67s" }}>
        <circle cx="150" cy="100" r="2.5" fill="#6366f1" opacity="0.75" filter={`url(#${id("f-glow")})`}/>
      </g>

      {/* Core — pulsing */}
      <g filter={`url(#${id("f-core-glow")})`}>
        <circle cx="100" cy="100" r="22" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4"
          style={{ animation: "chromai-logo-pulse-ring 2.4s ease-in-out infinite" }}/>
        <circle cx="100" cy="100" r="18" fill="#8b5cf6" opacity="0.25"
          style={{ animation: "chromai-logo-pulse-fill 2.4s ease-in-out infinite" }}/>
        <circle cx="100" cy="100" r="16" fill={`url(#${id("g-core")})`}
          style={{ animation: "chromai-logo-core 2.4s ease-in-out infinite" }}/>
        <circle cx="97" cy="97" r="5" fill="white" opacity="0.7"
          style={{ animation: "chromai-logo-shine 2.4s ease-in-out infinite" }}/>
      </g>

      <style>{`
        @keyframes chromai-logo-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes chromai-logo-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes chromai-logo-pulse-ring {
          0%,100% { r: 22; opacity: 0.4; }
          50%      { r: 30; opacity: 0; }
        }
        @keyframes chromai-logo-pulse-fill {
          0%,100% { r: 18; opacity: 0.25; }
          50%      { r: 24; opacity: 0.05; }
        }
        @keyframes chromai-logo-core {
          0%,100% { r: 16; }
          50%      { r: 17.5; }
        }
        @keyframes chromai-logo-shine {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 0.95; }
        }
      `}</style>
    </svg>
  );
}
