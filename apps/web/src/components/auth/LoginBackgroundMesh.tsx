import React from 'react';

/**
 * Decorative abstract wireframe / mesh wave graphics for the login background.
 * Left mesh: Flowing dark red / orange glowing wireframe wave (bottom-left)
 * Right mesh: Flowing purple / magenta glowing wireframe wave (upper-right)
 */
export const LoginBackgroundMesh: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* ========================================================================= */}
      {/* LEFT MESH GRAPHIC: Dark Red / Orange glowing wireframe wave (lower-left) */}
      {/* ========================================================================= */}
      <div className="absolute -bottom-24 -left-28 sm:-left-16 w-[480px] sm:w-[620px] lg:w-[750px] h-[450px] sm:h-[550px] opacity-85">
        {/* Soft underlying red/orange radial glow */}
        <div className="absolute inset-0 bg-radial from-red-600/25 via-orange-600/10 to-transparent blur-3xl transform -rotate-12" />

        <svg
          viewBox="0 0 700 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform -rotate-6"
        >
          <defs>
            <linearGradient id="redOrangeGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2200" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff6a00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#cc1100" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="redOrangeGrad2" x1="20%" y1="80%" x2="90%" y2="20%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#ff8c00" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8b0000" stopOpacity="0.0" />
            </linearGradient>
            <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing Wireframe / Mesh Ribs */}
          {Array.from({ length: 32 }).map((_, i) => {
            const yOffset = i * 11;
            const curveAmp = 120 + i * 5;
            const cp1x = 140 + i * 8;
            const cp1y = 480 - i * 6;
            const cp2x = 380 - i * 4;
            const cp2y = 180 + i * 7;
            const endx = 650;
            const endy = 80 + yOffset * 0.7;

            return (
              <path
                key={`left-mesh-${i}`}
                d={`M 20 ${500 - i * 4} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endx} ${endy}`}
                stroke="url(#redOrangeGrad1)"
                strokeWidth={i % 3 === 0 ? '1.2' : '0.75'}
                strokeOpacity={0.25 + (i / 32) * 0.55}
                filter={i % 6 === 0 ? 'url(#redGlow)' : undefined}
              />
            );
          })}

          {/* Cross-mesh vertical transverse curves */}
          {Array.from({ length: 18 }).map((_, j) => {
            const startX = 60 + j * 32;
            const startY = 480 - j * 8;
            const midX = 180 + j * 24;
            const midY = 320 - j * 12;
            const endX = 320 + j * 16;
            const endY = 140 - j * 4;

            return (
              <path
                key={`left-cross-${j}`}
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                stroke="url(#redOrangeGrad2)"
                strokeWidth="0.6"
                strokeOpacity={0.2 + (j / 18) * 0.35}
              />
            );
          })}
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT MESH GRAPHIC: Purple / Magenta glowing wireframe wave (upper-right) */}
      {/* ========================================================================= */}
      <div className="absolute -top-20 -right-24 sm:-right-12 w-[500px] sm:w-[650px] lg:w-[800px] h-[480px] sm:h-[600px] opacity-85">
        {/* Soft underlying purple/magenta radial glow */}
        <div className="absolute inset-0 bg-radial from-purple-700/25 via-fuchsia-600/10 to-transparent blur-3xl transform rotate-12" />

        <svg
          viewBox="0 0 750 550"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform rotate-6"
        >
          <defs>
            <linearGradient id="purpleMagentaGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="purpleMagentaGrad2" x1="90%" y1="20%" x2="10%" y2="90%">
              <stop offset="0%" stopColor="#c026d3" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#9333ea" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.0" />
            </linearGradient>
            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing Wireframe / Mesh Ribs */}
          {Array.from({ length: 34 }).map((_, i) => {
            const startX = 720 - i * 5;
            const startY = 20 + i * 9;
            const cp1x = 520 - i * 6;
            const cp1y = 120 + i * 4;
            const cp2x = 340 + i * 5;
            const cp2y = 380 - i * 6;
            const endX = 60 + i * 4;
            const endY = 480 - i * 4;

            return (
              <path
                key={`right-mesh-${i}`}
                d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                stroke="url(#purpleMagentaGrad1)"
                strokeWidth={i % 3 === 0 ? '1.2' : '0.75'}
                strokeOpacity={0.25 + (i / 34) * 0.55}
                filter={i % 6 === 0 ? 'url(#purpleGlow)' : undefined}
              />
            );
          })}

          {/* Cross-mesh transverse curves */}
          {Array.from({ length: 20 }).map((_, j) => {
            const startX = 680 - j * 26;
            const startY = 50 + j * 12;
            const midX = 480 - j * 20;
            const midY = 220 + j * 8;
            const endX = 240 - j * 10;
            const endY = 420 + j * 4;

            return (
              <path
                key={`right-cross-${j}`}
                d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                stroke="url(#purpleMagentaGrad2)"
                strokeWidth="0.6"
                strokeOpacity={0.2 + (j / 20) * 0.35}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
