import React, { useEffect, useReducer, useRef, useState } from 'react';
import MuseumScene, { Character } from './MuseumScene.jsx';
import { CONFIG, initialState, reducer, canAdvance, planPrice, money, rooms, receptionItems, products, buyerLines, aboutText } from './game.js';

const entry = () => ({ x: 157, y: 570, walking: false, facing: 1 });
const introductions = [null,
  ['Alex', 'Um museu inteiro para explorar. Vou falar com a guia e dar uma olhada ao redor.'],
  ['Alex', 'Finalmente, uma pintura. Quero chegar mais perto.'],
  ['Alex', 'Acho que entrei na loja… Mas esta também é uma sala da exposição.'],
  ['Alex', 'Todo mundo está olhando para os números. E a pintura?'],
  ['Alex', 'Consigo ver as obras atrás da grade. Deve haver um jeito de continuar.'],
  ['Alex', 'Tanto espaço. E nenhuma obra. Só um recibo no pedestal.'],
];

// Caminhar e interagir são separados: a ação só acontece ao chegar ao objeto.
export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [actor, setActor] = useState(entry);
  const [speech, setSpeech] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [ad, setAd] = useState(null);
  const [hints, setHints] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const moveTimer = useRef(null);
  const sceneRef = useRef(null);
  const viewportRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const pendingMove = useRef(0);
  const say = (speaker, text, title) => setSpeech({ speaker, text, title });

  useEffect(() => { document.body.classList.toggle('reduce-motion', reduced); }, [reduced]);
  useEffect(() => {
    clearTimeout(moveTimer.current); pendingMove.current++;
    setActor(entry()); setOverlay(null); setAd(null);
    if (state.room) say(...introductions[state.room]); else setSpeech(null);
    viewportRef.current?.scrollTo({ left: 0 });
    titleRef.current?.focus();
    return () => clearTimeout(moveTimer.current);
  }, [state.room]);

  useEffect(() => {
    if (!overlay) return;
    const dialog = overlayRef.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, [overlay]);

  useEffect(() => {
    if (!ad || ad.remaining <= 0) return;
    const timer = setTimeout(() => setAd(current => current ? { ...current, remaining: current.remaining - 1 } : null), 1000);
    return () => clearTimeout(timer);
  }, [ad]);
  useEffect(() => {
    if (state.room !== 2 || !state.watchedPainting || state.secondAdSeen || overlay || ad) return;
    const timer = setTimeout(() => dispatch({ type: 'second-ad' }), CONFIG.secondAdDelay);
    return () => clearTimeout(timer);
  }, [state.room, state.watchedPainting, state.secondAdSeen, overlay, ad]);
  useEffect(() => {
    if (state.room !== 6 || state.finished) return;
    const timer = setTimeout(() => dispatch({ type: 'finish' }), CONFIG.finalDelay);
    return () => clearTimeout(timer);
  }, [state.room, state.finished]);

  function walk(x, y, action) {
    if (!state.room || overlay || ad) return;
    clearTimeout(moveTimer.current);
    const token = ++pendingMove.current;
    const targetX = Math.max(72, Math.min(1130, x));
    const targetY = Math.max(482, Math.min(629, y));
    const duration = reduced ? 0 : Math.min(1250, Math.max(230, Math.hypot(targetX-actor.x, targetY-actor.y)*1.55));
    sceneRef.current?.style.setProperty('--walk-duration', `${duration}ms`);
    setSpeech(null);
    setActor({ x: targetX, y: targetY, walking: !reduced, facing: targetX >= actor.x ? 1 : -1 });
    // Em celulares, a câmera acompanha o destino dentro do cenário rolável.
    const viewport = viewportRef.current;
    if (viewport && sceneRef.current) {
      const destination = targetX / 1200 * sceneRef.current.getBoundingClientRect().width - viewport.clientWidth/2;
      viewport.scrollTo({ left: Math.max(0, destination), behavior: reduced ? 'instant' : 'smooth' });
    }
    moveTimer.current = setTimeout(() => {
      if (token !== pendingMove.current) return;
      setActor(current => ({ ...current, walking: false }));
      action?.();
    }, duration);
  }
  function startAd(purpose) { setSpeech(null); setAd({ purpose, remaining: CONFIG.adSeconds }); }
  function closeAd() {
    if (!ad || ad.remaining > 0) return;
    dispatch({ type: 'ad', purpose: ad.purpose }); setAd(null);
    say('Alex', ad.purpose === 'painting' ? 'Agora sim. Só eu e a pintura… por enquanto.' : 'Ganhei um crédito. Quanto valeu o meu tempo?');
  }
  function interact(target) {
    walk(target.x, target.y, () => {
      const id = target.id;
      if (id === 'exit') {
        if (canAdvance(state)) dispatch({ type: 'next' });
        else say('Alex', state.room === 1 ? 'Antes de seguir, vou explorar pelo menos dois objetos ou conversar com a guia.' : state.room === 2 ? 'Vou observar a pintura e fechar os anúncios antes de sair.' : state.room === 4 ? 'O leilão ainda está acontecendo. Vou ouvir os compradores.' : 'Vou consultar o terminal ou assistir a anúncios. Depois de duas tentativas, posso usar a saída lateral.');
      } else if (state.room === 1 && receptionItems[id]) {
        dispatch({ type: 'reception', id });
        say(id === 'guide' ? 'Guia' : 'Alex', receptionItems[id][1], receptionItems[id][0]);
      } else if (id === 'painting') {
        if (!state.watchedPainting) startAd('painting');
        else say('Alex', 'O olhar precisa de tempo. A plataforma precisa de retenção. Nem sempre os dois interesses cabem na mesma moldura.', 'O tempo de olhar · Lia Campos');
      } else if (id === 'ad-sign') say('Alex', '“Sua contemplação continuará após o anúncio.” Até o silêncio tem patrocinador.');
      else if (id.startsWith('product:')) {
        const product = products.find(p => p.id === id.split(':')[1]);
        dispatch({ type: 'product', id: product.id }); say('Alex', product.text, `${product.name} · R$ ${product.price} (fictício)`);
      } else if (id === 'night') {
        dispatch({ type: 'observe', id: 'night' }); say('Alex', 'Uma imagem pode continuar famosa enquanto a história de quem a criou desaparece. Aqui a estampa está em tudo. Mas o contexto ficou fora da embalagem.', 'Noite em circulação · pintura original');
      } else if (id === 'auction') {
        dispatch({ type: 'observe', id: 'auction' }); say('Alex', 'Um estudo sobre memória e tempo. A cada lance, o preço ocupa mais espaço que a história da pintura.', 'Estudo de permanência · Helena Duarte');
      } else if (id === 'auctioneer') say('Leiloeiro', state.bids >= CONFIG.soldAfter ? 'Vendido! A obra será armazenada em uma coleção privada.' : 'Não quero a pintura. Quero possuir o que os outros desejam. Quem dá mais?');
      else if (id.startsWith('bid:')) {
        const index = Number(id.split(':')[1]);
        if (state.bids < CONFIG.soldAfter) { dispatch({ type: 'bid' }); say(`Comprador ${index+1}`, buyerLines[index], `Novo lance: ${money(Math.round(state.price*1.8))}`); }
        else say(`Comprador ${index+1}`, 'Negócio fechado. Agora a obra pode valorizar longe dos olhos do público.');
      } else if (id === 'terminal') setOverlay('plans');
      else if (id === 'credit-ad') startAd('credits');
      else if (id === 'receipt') { dispatch({ type: 'finish' }); setOverlay('receipt'); }
    });
  }
  function attempt() {
    dispatch({ type: 'attempt' }); setOverlay(null);
    say('Terminal Museu+', `Saldo insuficiente: ${state.credits} créditos. O Básico custa ${planPrice(state)-1}; o Premium, ${planPrice(state)}.${state.attempts >= 1 ? ' A passagem de acesso limitado está liberada, à direita.' : ' Você pode tentar novamente ou assistir a um anúncio.'}`);
  }
  function restart() {
    clearTimeout(moveTimer.current); pendingMove.current++; setOverlay(null); setSpeech(null); setAd(null); dispatch({ type: 'reset' });
  }
  let objective = state.room === 1 ? `Explore a recepção · ${Math.min(state.reception.length,2)}/2` : state.room === 2 ? state.secondAdClosed ? 'A porta da galeria está aberta' : 'Aproxime-se da pintura' : state.room === 3 ? 'Explore os objetos e encontre a obra' : state.room === 4 ? `Acompanhe o leilão · ${state.bids}/4 lances` : state.room === 5 ? canAdvance(state) ? 'Saia pela passagem à direita' : `Procure uma forma de acesso · ${state.attempts}/2` : 'Examine o recibo no pedestal';
  const stats = [[state.ads,'Anúncios assistidos'],[state.earned,'Créditos obtidos'],[state.products.length,'Produtos examinados'],[state.works.length,'Obras observadas'],[state.commercial,'Interações comerciais']];

  return <main className="game-shell">
    <header className="game-header"><div className="game-brand">MUSEU <span>S/A</span><small>UMA AVENTURA SOBRE ARTE E MERCADO</small></div><div className="game-options"><button onClick={() => setHints(value=>!value)} aria-label="Mostrar objetos interativos" aria-pressed={hints}>◉ <span>Mostrar objetos</span></button><button onClick={() => setReduced(value=>!value)} aria-label="Reduzir movimento" aria-pressed={reduced}>≈ <span>{reduced?'Movimento reduzido':'Reduzir movimento'}</span></button><button onClick={() => setOverlay('about')} aria-label="Sobre o projeto">?</button></div></header>
    <section className="game-frame" aria-label="Jogo Museu S/A">
      <div className="scene-hud"><div><span className="chapter">{state.room ? `CAPÍTULO 0${state.room} / 06` : 'UMA VISITA NADA COMUM'}</span><h1 ref={titleRef} tabIndex={-1}>{state.room ? rooms[state.room][0] : 'Museu S/A'}</h1></div><div className="wallet" aria-live="polite"><span>◈</span> {state.credits}<small>CRÉDITOS</small></div></div>
      <div className={`world-viewport ${!state.room?'title-world':''}`} ref={viewportRef} inert={!state.room || overlay || ad ? true : undefined}>
        <MuseumScene state={state} actor={actor} interact={interact} walk={walk} hints={hints} sceneRef={sceneRef} />
      </div>
      {!state.room && <div className="title-screen"><span className="title-kicker">UMA AVENTURA POINT & CLICK</span><h2>Todo olhar<br />tem seu <em>preço.</em></h2><p>Uma exposição sobre arte, atenção e mercado.<br />Entre no museu com Alex. Descubra o que está à venda.</p><button className="primary" onClick={() => dispatch({type:'next'})}>Começar a visita <span>→</span></button><small>CLIQUE PARA CAMINHAR · EXPLORE · CONVERSE</small></div>}
      {state.room > 0 && <div className="objective"><span className="objective-dot" />{objective}<span className="mobile-pan">Arraste para explorar ↔</span></div>}
      {ad && <div className="world-ad" role="dialog" aria-label="Publicidade simulada"><span>PUBLICIDADE SIMULADA · MUSEU+</span><h2>Seu olhar merece<br />um patrocinador.</h2><p>Sua contemplação continuará após o anúncio.</p><button className="primary" disabled={ad.remaining>0} onClick={closeAd}>{ad.remaining > 0 ? `Aguarde ${ad.remaining}s` : 'Fechar anúncio · +1 crédito'}</button></div>}
      {state.room===2 && state.secondAdSeen && !state.secondAdClosed && !ad && <div className="second-ad" role="dialog" aria-label="Segundo anúncio simulado"><small>UMA MENSAGEM DO PATROCINADOR</small><strong>Você ainda está olhando?</strong><button onClick={()=>{dispatch({type:'ad',purpose:'second'});say('Alex','Até para ficar em silêncio diante de uma obra eu preciso fechar uma propaganda.');}}>Fechar anúncio · +1 crédito ×</button></div>}
    </section>
    <section className="dialogue-bar" aria-label="Falas e instruções" aria-live="polite">
      <div className="portrait"><svg viewBox="-42 -151 84 119" aria-hidden="true"><Character kind={speech?.speaker==='Guia'?'guide':'alex'} /></svg></div>
      <div className="speech-content"><span className="speaker">{actor.walking ? 'ALEX' : speech?.speaker || 'ALEX'}<small>{speech?.title}</small></span><p>{actor.walking ? 'Indo até lá…' : speech?.text || (state.room ? 'Clique no chão para caminhar. Clique em uma obra, objeto ou pessoa para interagir.' : 'Hoje eu só queria ver um pouco de arte.')}</p></div>
      {speech && !actor.walking && <button className="speech-close" onClick={()=>setSpeech(null)} aria-label="Fechar fala">Continuar ▸</button>}
      {state.room===6 && state.finished && !speech && <button className="speech-close" onClick={()=>setOverlay('receipt')}>Ver recibo ▸</button>}
    </section>
    <footer className="game-footer"><span>APONTAR. CLICAR. QUESTIONAR.</span><span>Alex se aproxima dos objetos antes de interagir.</span><span>{state.room ? `SALA ${state.room} DE 6` : '05–10 MIN'}</span></footer>
    {overlay && <dialog className="game-dialog" ref={overlayRef} aria-labelledby="overlay-title" onCancel={()=>setOverlay(null)}><button className="close-overlay" onClick={()=>setOverlay(null)} aria-label="Fechar janela">×</button>
      {overlay==='plans' ? <><span className="chapter">TERMINAL DE ACESSO · MUSEU+</span><h2 id="overlay-title">Cultura em planos.</h2><p>A cultura está a apenas uma assinatura de distância.</p><div className="plan-options">{[['Gratuito','Corredor e anúncios','Seu plano atual'],['Básico','Algumas obras com anúncios',`${planPrice(state)-1} créditos`],['Premium','Obras famosas',`${planPrice(state)} créditos`],['Ultra','Resolução original',`${planPrice(state)+5} créditos`]].map(([name,desc,cost],i)=><button key={name} disabled={i===0} onClick={attempt}><strong>{name}</strong><span>{desc}</span><b>{cost}</b></button>)}</div><p>Seu saldo: <b>{state.credits} créditos</b>.</p><small>Cancele quando quiser. Se encontrar o botão.<br />Algumas obras podem deixar o catálogo sem aviso prévio.</small><p className="fiction">Planos fictícios. Nenhum pagamento é realizado.</p></> : overlay==='receipt' ? <><span className="chapter">RECIBO DA SUA ATENÇÃO</span><h2 id="overlay-title">O que ficou da visita?</h2><div className="receipt-stats">{stats.map(([n,label])=><div key={label}><span>{label}</span><b>{n}</b></div>)}</div><p className="last-question">Neste museu, você viu arte ou apenas as formas de vendê-la?</p><p className="receipt-ad">Gostou da crítica ao consumo?<br /><b>Visite nossa loja oficial.</b><small>Propaganda fictícia. Até a crítica pode virar produto.</small></p><div className="end-actions"><button className="primary" onClick={restart}>Reiniciar a experiência ↻</button><button onClick={()=>setOverlay('about')}>Sobre o projeto</button></div></> : <><span className="chapter">SOBRE O PROJETO</span><h2 id="overlay-title">Museu S/A</h2><p>{aboutText}</p><p>Você controla Alex com cliques ou toques. Ele caminha até os objetos e conversa com as pessoas do museu. A saída de cada sala é uma porta dentro do cenário.</p><button className="primary" onClick={()=>setOverlay(null)}>Voltar ao museu</button></>}
    </dialog>}
  </main>;
}
