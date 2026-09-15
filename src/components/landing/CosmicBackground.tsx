import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Space Base Canvas */}
      <div className="absolute inset-0 bg-[#040805]" />

      {/* Cosmic Nebula Gradients */}
      <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] animate-pulse duration-10000" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[130px] animate-pulse duration-7000" />
      <div className="absolute top-2/3 -left-40 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse duration-9000" />
      <div className="absolute -bottom-20 right-1/4 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]" />

      {/* Subtle Star Grid */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 120px 80px, #34d399, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 220px 190px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 340px 110px, #a855f7, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 450px 290px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 580px 70px, #34d399, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 700px 220px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 850px 140px, #38bdf8, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 980px 280px, #ffffff, rgba(0,0,0,0))
          `,
          backgroundSize: '1100px 400px',
        }}
      />

      {/* Futuristic Cyber Perspective Grid (subtle at bottom) */}
      <div 
        className="absolute bottom-0 inset-x-0 h-96 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(52, 211, 153, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(52, 211, 153, 0.2) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
        }}
      />

      {/* Ambient Vignette Border */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />
    </div>
  );
};
