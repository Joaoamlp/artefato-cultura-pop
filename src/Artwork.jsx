import React from 'react';

// Pinturas originais em SVG, sem imagens externas.
export default function Artwork({ kind = 'abstract' }) {
  let painting;
  if (kind === 'night') {
    painting = <svg className="art" viewBox="0 0 400 300" role="img" aria-label="Pintura original: céu azul com espirais douradas sobre colinas">
      <rect width="400" height="300" fill="#20344e" />
      <g fill="none" strokeLinecap="round">
        <path d="M-20 115 Q80 10 180 100 T420 55 M-20 145 Q80 40 180 130 T420 85 M-20 175 Q80 70 180 160 T420 115" stroke="#527c9c" strokeWidth="13" />
        <path d="M15 80 Q80 15 140 70 T300 50 M40 100 Q100 40 150 90 T350 70" stroke="#9bb6b3" strokeWidth="6" />
        <path d="M220 150 C340 30 390 175 290 170 C250 160 290 115 325 140" stroke="#d4bd6c" strokeWidth="9" />
        <path d="M-10 260 Q100 160 220 255 T440 210" stroke="#315a63" strokeWidth="65" />
        <path d="M0 285 Q100 220 210 290 T430 265" stroke="#162e34" strokeWidth="48" />
      </g>
      <g fill="#edce70"><circle cx="65" cy="45" r="12" /><circle cx="183" cy="40" r="8" /><circle cx="350" cy="40" r="19" /><circle cx="135" cy="170" r="7" /></g>
      <g fill="#172b2f"><path d="M50 300 L55 137 L72 182 L85 300Z" /><path d="M180 264v-35l20-15 20 15v35z" /></g>
    </svg>;
  } else if (kind === 'auction') {
    painting = <svg className="art" viewBox="0 0 400 300" role="img" aria-label="Pintura abstrata em tons de vinho, ouro e areia">
      <rect width="400" height="300" fill="#c3af83" /><rect x="48" y="30" width="140" height="240" fill="#673e38" /><circle cx="245" cy="135" r="98" fill="#a87549" /><path d="M160 300L280 0h50L210 300" fill="#29372f" /><path d="M0 230 Q200 120 400 235" fill="none" stroke="#e0c79c" strokeWidth="10" />
    </svg>;
  } else {
    painting = <svg className="art" viewBox="0 0 400 300" role="img" aria-label="Pintura abstrata: sol laranja, arco verde e formas em tons de areia">
      <rect width="400" height="300" fill="#d9c7a7" /><rect x="25" y="25" width="350" height="250" fill="#e8ddc6" /><circle cx="265" cy="95" r="62" fill="#d66b45" /><path d="M60 300V165a85 85 0 0 1 170 0v135" fill="#52634c" /><path d="M106 300V170a39 39 0 0 1 78 0v130" fill="#cfbf9d" /><path d="M225 300v-90l110-50v140" fill="#a39577" /><path d="M0 268L400 230v70H0" fill="#303f35" /><path d="M265 44v102M214 94h102" stroke="#f2b47a" strokeWidth="1" opacity=".5" />
    </svg>;
  }
  return <div className="frame">{painting}</div>;
}
