import React from 'react';

/**
 * CoralReefBackground - Subtle Red Sea Coral Reef & Marine Waves Watermark
 * Renders delicate, authentic coral reef silhouettes (شِعاب البحر الأحمر المرجانية)
 * and undulating marine currents lightly in the background (3-5% opacity).
 */
export const CoralReefBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.035] sm:opacity-[0.045] mix-blend-multiply"
      aria-hidden="true"
    >
      {/* Top Left Coral Colony & Sea Fans */}
      <svg
        className="absolute -top-12 -left-16 w-96 h-96 text-[#0C3552]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {/* Branching Acropora Coral (شعب مرجانية متفرعة) */}
        <path d="M 100 190 Q 95 150 70 120 Q 55 100 45 60 Q 40 40 50 30" strokeLinecap="round" />
        <path d="M 70 120 Q 85 95 90 65 Q 92 45 88 25" strokeLinecap="round" />
        <path d="M 90 65 Q 110 50 115 30" strokeLinecap="round" />
        <path d="M 100 190 Q 105 145 130 115 Q 150 90 160 55 Q 165 35 155 20" strokeLinecap="round" />
        <path d="M 130 115 Q 115 90 115 70 Q 115 50 125 35" strokeLinecap="round" />
        <path d="M 100 190 Q 100 130 100 80 Q 100 50 105 20" strokeLinecap="round" />
        <circle cx="50" cy="30" r="3" fill="currentColor" />
        <circle cx="88" cy="25" r="3" fill="currentColor" />
        <circle cx="115" cy="30" r="3" fill="currentColor" />
        <circle cx="155" cy="20" r="3" fill="currentColor" />
        <circle cx="125" cy="35" r="3" fill="currentColor" />
      </svg>

      {/* Center Right Sea Fan (Gorgonian / مروحة البحر) & Coastal Sand Accent */}
      <svg
        className="absolute top-1/3 -right-20 w-[450px] h-[450px] text-[#C29B63]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      >
        {/* Fan structure */}
        <path d="M 20 180 Q 60 140 100 120 Q 140 100 180 80" />
        <path d="M 20 180 Q 40 120 70 80 Q 100 50 140 30" />
        <path d="M 20 180 Q 70 130 120 100 Q 160 80 190 60" />
        <path d="M 20 180 Q 50 100 80 50 Q 110 20 150 10" />
        <path d="M 20 180 Q 80 150 130 130 Q 170 120 200 110" />
        {/* Cross mesh lines evoking Red Sea delicate corals */}
        <path d="M 60 140 Q 50 110 60 80 Q 70 50 90 30" strokeDasharray="3 3" />
        <path d="M 100 120 Q 90 90 100 60 Q 110 30 130 15" strokeDasharray="3 3" />
        <path d="M 140 100 Q 130 70 140 40 Q 150 20 170 10" strokeDasharray="3 3" />
      </svg>

      {/* Bottom Center Red Sea Soft Corals & Sea Grass */}
      <svg
        className="absolute -bottom-16 left-1/4 w-[500px] h-72 text-[#028090]"
        viewBox="0 0 300 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M 20 100 Q 25 60 15 30 Q 10 10 30 5" strokeLinecap="round" />
        <path d="M 40 100 Q 45 70 35 40 Q 30 20 50 10" strokeLinecap="round" />
        <path d="M 60 100 Q 75 60 85 30 Q 90 10 75 0" strokeLinecap="round" />
        <path d="M 90 100 Q 95 65 110 35 Q 120 15 105 5" strokeLinecap="round" />
        <path d="M 140 100 Q 130 60 145 30 Q 155 10 170 5" strokeLinecap="round" />
        <path d="M 170 100 Q 180 70 175 40 Q 170 20 190 10" strokeLinecap="round" />
        <path d="M 210 100 Q 200 65 220 30 Q 230 10 245 0" strokeLinecap="round" />
        <path d="M 250 100 Q 265 60 255 30 Q 250 10 270 5" strokeLinecap="round" />
      </svg>

      {/* Mid Left Subtle Marine Waves (تيارات بحرية) */}
      <svg
        className="absolute top-2/3 -left-20 w-96 h-64 text-[#0C3552]"
        viewBox="0 0 200 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M 0 30 Q 50 10 100 30 T 200 30" strokeLinecap="round" />
        <path d="M 0 50 Q 50 30 100 50 T 200 50" strokeLinecap="round" />
        <path d="M 0 70 Q 50 50 100 70 T 200 70" strokeLinecap="round" />
      </svg>
    </div>
  );
};
