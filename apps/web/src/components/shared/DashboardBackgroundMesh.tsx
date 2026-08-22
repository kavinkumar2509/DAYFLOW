import React from 'react';

/**
 * Ambient background mesh waves for the dashboard shell to match the login page atmosphere
 */
export const DashboardBackgroundMesh: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Lower-Left Orange/Red Ambient Glow Wave */}
      <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] opacity-40">
        <div className="absolute inset-0 bg-radial from-orange-600/20 via-red-600/10 to-transparent blur-3xl transform -rotate-12" />
        <svg
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-60"
        >
          <defs>
            <linearGradient id="dashOrangeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#ff8c00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b0000" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 20 }).map((_, i) => (
            <path
              key={`dash-left-${i}`}
              d={`M 0 ${600 - i * 15} C ${150 + i * 8} ${500 - i * 10}, ${300 - i * 6} ${300 + i * 10}, 600 ${100 + i * 12}`}
              stroke="url(#dashOrangeGrad)"
              strokeWidth="0.8"
              strokeOpacity={0.15 + (i / 20) * 0.35}
            />
          ))}
        </svg>
      </div>

      {/* Upper-Right Purple/Violet Ambient Glow Wave */}
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-40">
        <div className="absolute inset-0 bg-radial from-purple-700/20 via-fuchsia-600/10 to-transparent blur-3xl transform rotate-12" />
        <svg
          viewBox="0 0 700 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-60"
        >
          <defs>
            <linearGradient id="dashPurpleGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 20 }).map((_, i) => (
            <path
              key={`dash-right-${i}`}
              d={`M 700 ${50 + i * 14} C ${500 - i * 8} ${180 + i * 6}, ${300 + i * 6} ${400 - i * 8}, 0 ${550 - i * 10}`}
              stroke="url(#dashPurpleGrad)"
              strokeWidth="0.8"
              strokeOpacity={0.15 + (i / 20) * 0.35}
            />
          ))}
        </svg>
      </div>

      {/* Subtle Central Ambient Radial Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-purple-950/15 via-transparent to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};
