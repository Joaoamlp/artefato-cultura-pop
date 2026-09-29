import React from 'react';
import Artwork from './Artwork.jsx';
import { canAdvance, money, products } from './game.js';

// Coordenadas do mundo: 1200 × 680. Os pés dos personagens ficam na origem.
export function Character({ x = 0, y = 0, walking = false, facing = 1, kind = 'alex', scale = 1 }) {
  const coat = kind === 'alex' ? '#d36648' : kind === 'guide' ? '#6a8d80' : '#444752';
  return <g className={kind === 'alex' ? 'player' : ''} transform={`translate(${x} ${y})`}>
    <ellipse cy="1" rx="28" ry="8" fill="#192529" opacity=".22" />
    <g transform={`scale(${scale * facing} ${scale})`}>
      <g className={walking ? 'walking-body' : ''}>
        <g className="leg leg-left"><path d="M-15-48L-17-5H-3L2-47" fill="#344a59" stroke="#253442" strokeWidth="3" /><path d="M-18-10L-24-4V1H-2V-9" fill="#ede1c9" stroke="#303a40" strokeWidth="3" /></g>
        <g className="leg leg-right"><path d="M3-47L7-5H21L17-48" fill="#40586b" stroke="#253442" strokeWidth="3" /><path d="M7-9V1H32V-4L21-10" fill="#ede1c9" stroke="#303a40" strokeWidth="3" /></g>
        <path d="M-14-95Q0-102 16-94L25-47Q2-40-23-48Z" fill={coat} stroke="#3d4242" strokeWidth="3" />
        <path d="M-17-91Q-32-75-29-54" fill="none" stroke={coat} strokeWidth="14" strokeLinecap="round" /><circle cx="-28" cy="-51" r="6" fill="#c8936f" />
        <path d="M16-91Q31-74 27-58" fill="none" stroke={coat} strokeWidth="13" strokeLinecap="round" /><circle cx="27" cy="-54" r="6" fill="#c8936f" />
        <path d="M-5-101V-90H7V-103" fill="#bd8466" />
        <ellipse cy="-115" rx="20" ry="24" fill="#d8a27c" stroke="#453b37" strokeWidth="2.5" />
        <path d="M-21-112Q-29-139-8-145Q18-151 23-128L18-114L11-130Q-2-116-15-124L-17-111Z" fill="#303333" />
        <circle cx="9" cy="-116" r="2" fill="#263338" /><path d="M10-107l6-1" stroke="#7c4a3d" strokeWidth="2" />
        {kind === 'alex' ? <><path d="M-13-96L21-53" stroke="#e2c38b" strokeWidth="6" /><rect x="9" y="-64" width="22" height="27" rx="5" fill="#d8b879" stroke="#66543e" strokeWidth="3" /><path d="M-7-91L0-76L8-92" fill="#ecd8b4" /></> : <><path d="M-6-96L0-81L8-96" fill="#fff1cf" /><rect x="5" y="-80" width="10" height="7" fill="#e9d8a9" /></>}
      </g>
    </g>
  </g>;
}

function Spot({ label, x, y, w, h, to, onInteract, children, className = '', disabled = false }) {
  return <g className={`world-hotspot ${className}`} role="button" tabIndex={disabled ? -1 : 0} aria-label={label} aria-disabled={disabled || undefined}
    onClick={event => { event.stopPropagation(); if (!disabled) onInteract(to); }}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); if (!disabled) onInteract(to); } }}>
    <title>{label}</title>{children}
    <rect className="hit-area" x={x} y={y} width={w} height={h} rx="8" />
    <g className="spot-label" pointerEvents="none"><rect x={x + w / 2 - 94} y={y - 30} width="188" height="25" rx="5" /><text x={x + w / 2} y={y - 13} textAnchor="middle">{label}</text></g>
  </g>;
}
function Picture({ x, y, w = 160, kind }) {
  return <g><path d={`M${x+w/2} 84L${x+12} ${y}M${x+w/2} 84L${x+w-12} ${y}`} stroke="#a39b80" fill="none" /><foreignObject x={x} y={y} width={w} height={w * .83}><Artwork kind={kind} /></foreignObject><rect x={x + w/2 - 29} y={y + w*.83 + 8} width="58" height="15" rx="2" fill="#f1e6c9" /></g>;
}
function Plant({ x, y }) { return <g transform={`translate(${x} ${y})`}><ellipse cy="6" rx="35" ry="10" fill="#283e3a" opacity=".18" /><path d="M-23-36H23L16 4H-16Z" fill="#b47853" stroke="#765a42" strokeWidth="3" /><path d="M0-36V-124M0-52Q-40-69-31-102Q-3-96 0-52M0-71Q36-81 29-123Q1-112 0-71M0-96Q-26-106-17-145Q5-130 0-96" fill="#557762" stroke="#3d634f" strokeWidth="4" /></g>; }
function Pedestal({ x, y }) { return <g transform={`translate(${x} ${y})`}><path d="M-31-90L10-100L39-85L-3-74Z" fill="#ece0c3" /><path d="M-31-90V-4L-3 12V-74Z" fill="#b7aa8c" /><path d="M-3-74L39-85V-1L-3 12Z" fill="#d3c4a5" /></g>; }
function Door({ state, interact }) {
  const ready = canAdvance(state);
  return <Spot label={ready ? 'Entrar na próxima sala' : 'Examinar a porta'} x={1040} y={206} w={126} h={228} to={{ id: 'exit', x: 1092, y: 489 }} onInteract={interact}>
    <path d="M1040 434V213Q1103 173 1166 213V434Z" fill="#c4ad86" stroke="#77664e" strokeWidth="6" />
    <path d="M1053 429V222Q1103 189 1153 222V429Z" fill={ready ? '#6d8b80' : '#4f605c'} />
    <path d="M1066 423V228L1109 216V414Z" fill="#203e3b" opacity=".6" /><path d="M1060 434L1156 434L1195 475L1015 475Z" fill="#dce5b7" opacity={ready ? '.25' : '.05'} />
    <circle cx="1137" cy="327" r="5" fill="#e8cf83" /><rect x="1066" y="166" width="75" height="26" rx="4" fill={ready ? '#dfd997' : '#b4b29a'} /><text x="1103" y="183" textAnchor="middle" fontSize="12" fill="#394b45">{state.room === 5 ? 'SAÍDA →' : 'GALERIA →'}</text>
  </Spot>;
}
function Architecture({ room }) {
  const dark = room === 4;
  const blank = room === 6;
  return <>
    <defs><linearGradient id="wall" x2="0" y2="1"><stop stopColor={dark ? '#3b4844' : blank ? '#ebe9df' : '#d8cfad'} /><stop offset="1" stopColor={dark ? '#263832' : blank ? '#d9ded7' : '#c8bea0'} /></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stopColor={dark ? '#635c4f' : '#a3a48c'} /><stop offset="1" stopColor={dark ? '#393e38' : '#788d80'} /></linearGradient><linearGradient id="light" x2="0" y2="1"><stop stopColor="#fff4c9" stopOpacity=".36" /><stop offset="1" stopColor="#fff4c9" stopOpacity="0" /></linearGradient><pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".65" fill="#403a30" opacity=".055" /></pattern></defs>
    <rect width="1200" height="680" fill="url(#wall)" />
    <path d="M0 0L77 64V423L0 468Z" fill={dark ? '#23342f' : '#b3b094'} /><path d="M1200 0L1168 64V423L1200 468Z" fill="#7d8b77" opacity=".45" />
    <path d="M0 0H1200L1168 66H77Z" fill={dark ? '#1c2b28' : '#ece1be'} />
    <path d="M0 38H1200M77 66H1168" stroke="#9c9d82" strokeWidth="4" />
    <path d="M0 466L77 415H1168L1200 466V680H0Z" fill="url(#floor)" />
    <path d="M77 398H1168V418H77Z" fill={dark ? '#1b2b26' : '#8f987d'} /><path d="M78 397H1167" stroke="#f4e2b1" strokeWidth="3" opacity=".5" />
    {[0,160,320,480,640,800,960,1120,1280].map((x,i)=><path key={x} d={`M${115+i*132} 420L${x-90} 680`} stroke="#4a665e" strokeWidth="1.4" opacity=".38" />)}
    {[454,508,583,677].map(y=><path key={y} d={`M0 ${y}H1200`} stroke="#4a665e" strokeWidth="1.3" opacity=".4" />)}
    {[245,585,930].map(x=><g key={x}><path d={`M${x} 70L${x-160} 408H${x+160}Z`} fill="url(#light)" /><path d={`M${x-21} 62H${x+21}L${x+14} 76H${x-14}Z`} fill="#46564a" /><ellipse cx={x} cy="76" rx="14" ry="3" fill="#ffe8ad" /></g>)}
    <rect width="1200" height="680" fill="url(#grain)" pointerEvents="none" />
  </>;
}

export default function MuseumScene({ state, actor, interact, walk, hints, sceneRef }) {
  const room = state.room || 1;
  const obj = (id, x, y) => ({ id, x, y });
  return <svg ref={sceneRef} className={`museum-world room-${room} ${hints ? 'show-hints' : ''}`} viewBox="0 0 1200 680" aria-label={`Cenário do museu, sala ${room}. Clique no chão para caminhar.`} onClick={event => {
    if (event.target.closest('[role="button"]')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 1200;
    const y = (event.clientY - rect.top) / rect.height * 680;
    if (y > 427) walk(x, y);
  }}>
    <Architecture room={room} />
    {room === 1 && <>
      <text x="588" y="127" textAnchor="middle" fontFamily="Georgia" fontSize="36" letterSpacing="7" fill="#53604d">MUSEU S/A</text><text x="588" y="151" textAnchor="middle" fontSize="11" letterSpacing="4" fill="#6d725b">ARTE PARA TODOS. TERMOS SE APLICAM.</text>
      <Spot label="Ler o patrocinador" x={113} y={158} w={139} h={205} to={obj('sponsor',201,484)} onInteract={interact}><path d="M111 157H253V361H111Z" fill="#668276" stroke="#435f52" strokeWidth="5" /><path d="M113 314H252V360H113Z" fill="#dfcb87" /><text x="183" y="185" textAnchor="middle" fontSize="10" fill="#eee2b4">APRESENTADO POR</text><text x="183" y="247" textAnchor="middle" fontFamily="Georgia" fontSize="29" fill="#f7e5a9">capital®</text><text x="183" y="338" textAnchor="middle" fontSize="11" fill="#354f42">Seu olhar tem valor.</text></Spot>
      <Spot label="Examinar visita Premium" x={316} y={193} w={126} h={141} to={obj('premium',370,480)} onInteract={interact}><rect x="317" y="193" width="122" height="141" fill="#e8d9a8" stroke="#9c8256" strokeWidth="6" /><text x="378" y="222" textAnchor="middle" fontSize="11" fill="#6d664b">VISITA</text><text x="378" y="253" textAnchor="middle" fontSize="22" fontFamily="Georgia" fill="#334d42">Premium</text><path d="M340 267H415" stroke="#9c8256" /><text x="378" y="294" textAnchor="middle" fontSize="13" fill="#6d664b">5 créditos</text></Spot>
      <Spot label="Conversar com a guia" x={508} y={252} w={179} h={190} to={obj('guide',565,516)} onInteract={interact}><Character x={605} y={411} kind="guide" /><path d="M486 367H707L724 384H475Z" fill="#b09267" stroke="#6a5e49" strokeWidth="3" /><path d="M475 384H724V456H475Z" fill="#987953" stroke="#6a5e49" strokeWidth="3" /><path d="M495 395H706V442H495Z" fill="#ad8b5c" /><text x="600" y="422" textAnchor="middle" fontSize="13" letterSpacing="3" fill="#f5e2b4">RECEPÇÃO</text><rect x="660" y="344" width="37" height="22" rx="2" fill="#344e47" /></Spot>
      <Spot label="Olhar a loja do museu" x={774} y={195} w={174} h={201} to={obj('shop',850,494)} onInteract={interact}><path d="M775 208Q860 152 947 208V396H775Z" fill="#4b6359" stroke="#a99268" strokeWidth="7" /><text x="861" y="229" textAnchor="middle" fontFamily="Georgia" fontSize="23" fill="#eddda9">LOJA</text><path d="M792 301H930M792 360H930" stroke="#b69a71" strokeWidth="7" />{[811,854,897].map(x=><g key={x}><rect x={x} y="273" width="21" height="26" rx="3" fill="#d1b36d" /><path d={`M${x+21} 278h8v14h-8`} fill="none" stroke="#d1b36d" strokeWidth="4" /><rect x={x} y="322" width="25" height="33" fill="#ad6e4e" /></g>)}</Spot>
      <Spot label="Examinar a catraca" x={896} y={420} w={104} h={114} to={obj('turnstile',950,573)} onInteract={interact}><path d="M918 531V435H966V531" fill="#8caaa0" stroke="#4e6960" strokeWidth="4" /><path d="M916 438L938 424L983 436L965 450Z" fill="#c0cbc0" stroke="#4e6960" strokeWidth="3" /><circle cx="944" cy="477" r="10" fill="#365b51" /><path d="M944 477L889 469M944 477L968 514M944 477L977 450" stroke="#d0d7c4" strokeWidth="8" strokeLinecap="round" /></Spot>
      <Plant x={118} y={450} /><Plant x={1000} y={426} />
    </>}
    {room === 2 && <>
      <text x="595" y="135" textAnchor="middle" fontFamily="Georgia" fontSize="30" fill="#5e634e">O tempo de olhar</text>
      <Spot label="Observar a pintura" x={425} y={178} w={326} h={231} to={obj('painting',596,515)} onInteract={interact}><Picture x={434} y={180} w={306} /><text x="587" y="469" textAnchor="middle" fontSize="12" fill="#364b43">Lia Campos · 2026</text></Spot>
      <Spot label="Ler aviso de publicidade" x={178} y={236} w={129} h={142} to={obj('ad-sign',244,496)} onInteract={interact}><rect x="180" y="237" width="124" height="137" fill="#d5c381" stroke="#957e4d" strokeWidth="5" /><text x="242" y="273" textAnchor="middle" fontSize="15" fill="#4a5847">CONTEMPLAÇÃO</text><text x="242" y="298" textAnchor="middle" fontSize="14" fill="#4a5847">com intervalos</text><text x="242" y="343" textAnchor="middle" fontSize="25" fill="#6c7752">m+</text></Spot>
      <path d="M377 553H758L780 571H360Z" fill="#ac8153" stroke="#5c5945" strokeWidth="4" /><path d="M390 571V604M744 571V604" stroke="#46574d" strokeWidth="9" /><Plant x={934} y={441} />
    </>}
    {room === 3 && <>
      <path d="M88 105H1010V162H88Z" fill="#bf6544" /><text x="548" y="141" textAnchor="middle" fontFamily="Georgia" fontSize="28" fill="#fff1c6">Van Gogh™ — uma obra em cada sacola.</text>
      <Spot label="Observar Noite em circulação" x={492} y={196} w={157} h={144} to={obj('night',570,482)} onInteract={interact}><Picture x={494} y={196} w={152} kind="night" /></Spot>
      <path d="M130 186H425V396H130ZM710 186H997V396H710Z" fill="#6a6c50" stroke="#a98f60" strokeWidth="9" /><path d="M134 286H421M714 286H993M134 391H421M714 391H993" stroke="#bea06b" strokeWidth="9" />
      {products.map((product,i)=>{const x=[177,303,185,752,872,759,876][i]; const y=[218,212,321,216,217,322,321][i];return <Spot key={product.id} label={`Examinar ${product.name}`} x={x-12} y={y-10} w={90} h={81} to={obj(`product:${product.id}`,x+25,490)} onInteract={interact}><foreignObject x={x} y={y} width="68" height="65"><div className={`merch-object ${product.id}`} /></foreignObject><rect x={x+1} y={y+62} width="66" height="17" fill="#f1d88e" /><text x={x+34} y={y+74} textAnchor="middle" fontSize="10" fill="#4c4f3b">R$ {product.price}</text></Spot>})}
      <path d="M402 518H761L789 538H378Z" fill="#d0ac72" stroke="#7b684d" strokeWidth="4" /><path d="M393 538V584H772V538" fill="#ac8559" /><text x="581" y="565" textAnchor="middle" fontSize="20" fill="#fff0c1">COMPRE DOIS, LEVE TRÊS</text><text x="556" y="371" textAnchor="middle" fontSize="10" fill="#64654e">O contexto é vendido separadamente.</text>
    </>}
    {room === 4 && <>
      <path d="M87 90H414V423L365 385L331 419L290 386L249 419L203 386L151 419L87 388Z" fill="#754839" /><path d="M109 94V389M159 94V390M211 94V390M265 94V390M318 94V390M370 94V390" stroke="#9b6250" strokeWidth="13" opacity=".4" />
      <Spot label="Observar obra do leilão" x={168} y={189} w={212} h={195} to={obj('auction',264,472)} onInteract={interact}><g opacity={1-state.bids*.12}><Picture x={177} y={190} w={195} kind="auction" /></g><text x="276" y="397" textAnchor="middle" fontSize={14-state.bids} fill="#ecd8a7">Helena Duarte</text>{state.bids<2&&<text x="276" y="416" textAnchor="middle" fontSize="10" fill="#dac89b">Um estudo sobre memória e tempo.</text>}</Spot>
      <rect x="467" y="149" width="494" height="137" rx="4" fill="#1c2d29" stroke="#bca477" strokeWidth={2+state.bids} /><text x="714" y="179" textAnchor="middle" fill="#d4c190" fontSize="13" letterSpacing="4">LOTE 024 · {state.bids>=4?'ARREMATADO':'LANCE ATUAL'}</text><text x="714" y="243" textAnchor="middle" fill="#f6d98d" fontFamily="Georgia" fontSize={35+state.bids*5}>{money(state.price)}</text>
      <Spot label="Conversar com o leiloeiro" x={824} y={297} w={129} h={161} to={obj('auctioneer',890,509)} onInteract={interact}><Character x={888} y={433} kind="guide" /><path d="M835 376H940V452H835Z" fill="#90694d" stroke="#594c3b" strokeWidth="4" /><path d="M825 371H950V383H825Z" fill="#bea071" /><path d="M910 353l-12-16M886 330l22 13" stroke="#654e37" strokeWidth="9" /></Spot>
      {[436,542,648,754].map((x,i)=><Spot key={i} label={`Ouvir comprador ${i+1}`} x={x-33} y={382} w={75} h={157} to={obj(`bid:${i}`,x-3,572)} onInteract={interact}><Character x={x} y={537} kind="buyer" scale={.9} /><circle cx={x+30} cy="422" r="16" fill="#dfc38a" stroke="#6e664a" strokeWidth="3" /><text x={x+30} y="427" textAnchor="middle" fontSize="15" fill="#34433b">{i+1}</text></Spot>)}
      {state.bids>=4&&<g pointerEvents="none"><g transform="rotate(-12 278 272)"><rect x="149" y="248" width="254" height="53" fill="#d9c89d" stroke="#a9573d" strokeWidth="4" /><text x="276" y="285" textAnchor="middle" fill="#a9573d" fontSize="33" letterSpacing="7">VENDIDO</text></g><text x="598" y="328" textAnchor="middle" fill="#dfc99a" fontSize="13">Destino: coleção privada. Acesso público: nenhum.</text></g>}
    </>}
    {room === 5 && <>
      <g opacity=".3" className="locked-art"><Picture x={214} y={164} w={186} /><Picture x={474} y={164} w={186} kind="night" /><Picture x={741} y={164} w={186} kind="auction" /></g>
      <path d="M128 404H972V437H128Z" fill="#566f66" /><path d="M131 400V128H972V400" fill="none" stroke="#536c63" strokeWidth="10" />{[165,256,347,438,529,620,711,802,893,966].map(x=><path key={x} d={`M${x} 133V401`} stroke="#788d80" strokeWidth="7" />)}
      <rect x="307" y="187" width="478" height="101" rx="5" fill="#344e45" stroke="#d1bc83" strokeWidth="4" /><text x="546" y="225" textAnchor="middle" fontFamily="Georgia" fontSize="29" fill="#f0ddaa">A cultura está logo ali.</text><text x="546" y="256" textAnchor="middle" fontSize="14" fill="#d1c899">Do outro lado da sua assinatura.</text>
      <Spot label="Usar terminal Museu+" x={568} y={342} w={129} h={176} to={obj('terminal',631,558)} onInteract={interact}><path d="M584 505L604 383H659L684 505Z" fill="#b2b59a" stroke="#526a5e" strokeWidth="4" /><rect x="570" y="347" width="121" height="80" rx="8" fill="#324f46" stroke="#94a791" strokeWidth="5" /><text x="630" y="377" textAnchor="middle" fontSize="23" fill="#eed692">m+</text><text x="630" y="405" textAnchor="middle" fontSize="10" fill="#e7deb9">CONSULTAR PLANOS</text></Spot>
      <Spot label="Assistir anúncio por crédito" x={263} y={338} w={136} h={190} to={obj('credit-ad',328,562)} onInteract={interact}><path d="M284 402L269 527M376 402L391 527" stroke="#7b654c" strokeWidth="7" /><rect x="266" y="341" width="128" height="130" fill="#d7b96d" stroke="#8e7749" strokeWidth="5" /><text x="330" y="376" textAnchor="middle" fontSize="12" fill="#3c5446">SUA ATENÇÃO</text><text x="330" y="399" textAnchor="middle" fontSize="12" fill="#3c5446">VALE CRÉDITOS</text><path d="M319 414L344 430L319 446Z" fill="#4f6957" /></Spot>
    </>}
    {room === 6 && <>
      <text x="611" y="234" textAnchor="middle" fontFamily="Georgia" fontSize="35" fill="#647368">Você chegou ao fim</text><text x="611" y="280" textAnchor="middle" fontFamily="Georgia" fontSize="35" fill="#647368">da experiência gratuita.</text><text x="611" y="332" textAnchor="middle" fontSize="12" letterSpacing="3" fill="#7d897b">O QUE FICOU DO SEU OLHAR?</text><Pedestal x={610} y={485} /><Spot label="Ler recibo da visita" x={565} y={357} w={91} h={151} to={obj('receipt',606,553)} onInteract={interact}><path d="M585 377H630V409L625 405L620 410L615 405L610 410L605 405L600 410L595 405L590 410L585 405Z" fill="#faf2dc" stroke="#b7b5a2" /><path d="M594 386H620M594 392H620M594 398H612" stroke="#899381" strokeWidth="2" /></Spot>
    </>}
    {room < 6 && <Door state={state} interact={interact} />}
    <g pointerEvents="none"><Character x={actor.x} y={actor.y} walking={actor.walking} facing={actor.facing} /><g className="player-label" transform={`translate(${actor.x} ${actor.y})`}><text className="player-name" y="24" textAnchor="middle">ALEX · VOCÊ</text></g></g>
    {actor.walking && <ellipse cx={actor.x} cy={actor.y} rx="13" ry="5" fill="none" stroke="#f5dfad" strokeWidth="2" pointerEvents="none" />}
    <path d="M0 662H1200V680H0Z" fill="#213e35" opacity=".17" pointerEvents="none" />
  </svg>;
}
