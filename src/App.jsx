import React, { useEffect, useReducer, useRef, useState } from 'react';
import MuseumScene, { Character } from './MuseumScene.jsx';
import Artwork from './Artwork.jsx';
import { CONFIG, initialState, reducer, canAdvance, planPrice, money, reais, rooms, receptionItems, products, buyerLines, aboutText } from './game.js';

const entry = () => ({ x: 157, y: 570, walking: false, facing: 1 });
const introductions = [null,
  ['Alex', 'Bonito por fora. Vamos ver quanto tempo demora até tentarem me vender alguma coisa.'],
  ['Alex', 'Finalmente, uma pintura. Tomara que me deixem olhar para ela em paz.'],
  ['Alex', 'Espera… isto é uma galeria ou uma loja de presentes com um quadro no meio?'],
  ['Alex', 'Todo mundo encara o preço. Quase ninguém olha para a pintura. Isso diz bastante.'],
  ['Alex', 'As obras estão ali, mas a grade faz questão de lembrar quem pode chegar perto.'],
  ['Alex', 'No fim, até o meu olhar ganhou recibo. Vamos ver a conta.'],
];
const adCopy = {
  painting: ['SABÃO BRILHO TOTAL', 'Sabão melhor de todos, limpa tudo!', 'Até a dúvida sobre quem aprovou este slogan.'],
  second: ['MUSEU+ PREMIUM', 'Você ainda está olhando?', 'Assine para contemplar sem interrupções.'],
  merch: ['LOJA VAN GOGH™', 'Gostou dessa obra?', 'Por que não leva um de nossos produtos inspirados? Arte passa. A lembrancinha fica.'],
  credits: ['CAFÉ ACORDA JÁ', 'Mais energia para ver mais anúncios!', 'Café fictício. Cansaço bastante real.'],
};
const npcTargets = new Set(['guide', 'auctioneer', 'bid:0', 'bid:1', 'bid:2', 'bid:3']);
const artworkTargets = new Set(['painting', 'night', 'auction', 'premium-art:mineral', 'premium-art:tide', 'premium-art:garden']);

function FocusVisual({ target }) {
  if (target === 'premium-art:mineral') return <Artwork kind="mineral" />;
  if (target === 'premium-art:tide') return <Artwork kind="tide" />;
  if (target === 'premium-art:garden') return <Artwork kind="garden" />;
  if (target === 'night' || target.startsWith('premium-art:night')) return <Artwork kind="night" />;
  if (target === 'auction' || target.startsWith('premium-art:auction')) return <Artwork kind="auction" />;
  return <Artwork />;
}
const artworkTitle = target => ({
  painting: 'O tempo de olhar · Lia Campos',
  night: 'Noite em circulação · pintura original',
  auction: 'Estudo de permanência · Helena Duarte',
  'premium-art:mineral': 'Ritmo mineral · Joana Reis',
  'premium-art:tide': 'Arquivo de maré · Caio Luz',
  'premium-art:garden': 'Jardim elétrico · Nina Vale',
}[target] || 'Obra em exposição');

// Caminhar e interagir são separados: a ação só acontece ao chegar ao objeto.
export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [actor, setActor] = useState(entry);
  const [speech, setSpeech] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [ad, setAd] = useState(null);
  const [hints, setHints] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null);
  const [focusedArtwork, setFocusedArtwork] = useState(null);
  const [shoppingProduct, setShoppingProduct] = useState(null);
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
    const showAuras = event => {
      if (event.code !== 'Space' || event.target.closest?.('button, input, textarea, select, [role="button"]')) return;
      event.preventDefault();
      setHints(true);
    };
    const hideAuras = event => {
      if (event.code !== 'Space') return;
      event.preventDefault();
      setHints(false);
    };
    const clearAuras = () => setHints(false);
    window.addEventListener('keydown', showAuras);
    window.addEventListener('keyup', hideAuras);
    window.addEventListener('blur', clearAuras);
    return () => {
      window.removeEventListener('keydown', showAuras);
      window.removeEventListener('keyup', hideAuras);
      window.removeEventListener('blur', clearAuras);
    };
  }, []);
  useEffect(() => {
    clearTimeout(moveTimer.current); pendingMove.current++;
    setActor(entry()); setOverlay(null); setAd(null); setActiveTarget(null); setFocusedArtwork(null); setShoppingProduct(null);
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
    if (!ad) return;
    if (!ad.visible) {
      const timer = setTimeout(() => {
        setAd(current => current ? { ...current, visible: true } : null);
        if (ad.purpose === 'painting') say('Alex', 'Eu não tive nem tempo de apreciar a obra. Mal comecei a entender as cores e já enfiaram uma propaganda na minha frente.');
        if (ad.purpose === 'second') say('Alex', 'Outra vez? Parece que toda vez que a obra começa a dizer alguma coisa, alguém decide interrompê-la.');
      }, CONFIG.adAppearDelay);
      return () => clearTimeout(timer);
    }
    if (ad.remaining <= 0) return;
    const timer = setTimeout(() => setAd(current => current ? { ...current, remaining: current.remaining - 1 } : null), 1000);
    return () => clearTimeout(timer);
  }, [ad]);
  useEffect(() => {
    if (state.room !== 2 || !state.watchedPainting || state.secondAdSeen || overlay || ad) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'second-ad' });
      setAd({ purpose: 'second', visible: false, remaining: CONFIG.adSeconds });
    }, CONFIG.secondAdDelay);
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
    setSpeech(null); setActiveTarget(null); setFocusedArtwork(null); setShoppingProduct(null);
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
  function startAd(purpose) { setSpeech(null); setAd({ purpose, visible: false, remaining: CONFIG.adSeconds }); }
  function closeAd() {
    if (!ad || ad.remaining > 0) return;
    dispatch({ type: 'ad', purpose: ad.purpose }); setAd(null);
    say('Alex', ad.purpose === 'painting' ? 'Pronto. Cinco segundos vendidos para que eu pudesse voltar a olhar. Que generosidade.' : ad.purpose === 'second' ? '...respira fundo... Agora sim. Sem a interrupção, as cores parecem se relacionar de outro jeito. O significado da obra muda quando eu finalmente tenho tempo para ficar diante dela.' : ad.purpose === 'merch' ? 'Nem a própria obra escapou da vitrine. Gostar dela, para o museu, só conta quando termina em compra.' : 'Ganhei um crédito. Eles ficaram com cinco segundos da minha vida — parece um ótimo negócio para alguém.');
  }
  function interact(target) {
    walk(target.x, target.y, () => {
      const id = target.id;
      setActiveTarget(id);
      if (id === 'exit') {
        if (state.room === 5 && !state.exitCommented) {
          dispatch({ type: 'comment-exit' });
          say('Alex', state.premiumPlusOwned ? 'Não acredito. Eu paguei pelo Premium, descobri o Plus escondido, paguei de novo — e a saída sempre esteve aberta. Cobrar duas vezes para remover uma parede que eles mesmos construíram é ainda pior do que eu pensava.' : state.premiumOwned ? 'A saída estava aqui o tempo todo, mas as obras continuam atrás da parede. O Premium não comprou acesso; comprou apenas a oportunidade de descobrir outra cobrança.' : 'Então sair é gratuito, mas olhar para as obras não. Pelo menos a porta deixa claro qual experiência este museu considera dispensável.');
        } else if (canAdvance(state)) dispatch({ type: 'next' });
        else say('Alex', state.room === 1 ? 'Melhor olhar mais um pouco antes de seguir. Este lugar já está dizendo bastante sobre si mesmo.' : state.room === 2 ? 'A porta só abre depois dos anúncios. Até a saída depende da publicidade.' : state.room === 4 ? 'O espetáculo ainda não acabou. Falta ouvir quem está comprando preço em vez de pintura.' : 'A porta Premium continua fechada. Posso alimentar a máquina ou insistir até liberarem a saída lateral.');
      } else if (state.room === 1 && receptionItems[id]) {
        dispatch({ type: 'reception', id });
        say(id === 'guide' ? 'Guia' : 'Alex', receptionItems[id][1], receptionItems[id][0]);
      } else if (id === 'painting') {
        setFocusedArtwork(id);
        if (!state.watchedPainting) startAd('painting');
        else say('Alex', 'Agora consigo reparar nas cores. A obra pede tempo; a plataforma quer retenção. As duas coisas não cabem tão bem na mesma moldura.', 'O tempo de olhar · Lia Campos');
      } else if (id === 'ad-sign') say('Alex', '“Sua contemplação continuará após o anúncio.” Incrível: conseguiram pôr um patrocinador até no silêncio.');
      else if (id.startsWith('product:')) {
        const product = products.find(p => p.id === id.split(':')[1]);
        setShoppingProduct(product);
        dispatch({ type: 'product', id: product.id }); say('Alex', product.text, `${product.name} · R$ ${product.price} (fictício)`);
      } else if (id === 'night') {
        setFocusedArtwork(id);
        dispatch({ type: 'observe', id: 'night' });
        if (!state.merchAdSeen && state.purchasedProducts.length < products.length) startAd('merch');
        else say('Alex', 'A imagem sobreviveu, mas a história foi sumindo pelo caminho. Aqui ela está em toda parte — e, ao mesmo tempo, não está de verdade em lugar nenhum.', 'Noite em circulação · pintura original');
      } else if (id === 'auction') {
        setFocusedArtwork(id);
        dispatch({ type: 'observe', id: 'auction' }); say('Alex', 'É um estudo delicado sobre memória e tempo. Só que, a cada lance, o preço cresce e a obra parece encolher.', 'Estudo de permanência · Helena Duarte');
      } else if (id === 'auctioneer') say('Leiloeiro', state.bids >= CONFIG.soldAfter ? 'Vendido! A obra será armazenada em uma coleção privada.' : 'Não quero a pintura. Quero possuir o que os outros desejam. Quem dá mais?');
      else if (id.startsWith('bid:')) {
        const index = Number(id.split(':')[1]);
        if (state.bids < CONFIG.soldAfter) { dispatch({ type: 'bid' }); say(`Comprador ${index+1}`, buyerLines[index], `Novo lance: ${money(Math.round(state.price*1.8))}`); }
        else say(`Comprador ${index+1}`, 'Negócio fechado. Agora a obra pode valorizar longe dos olhos do público.');
      } else if (id === 'terminal') setOverlay('plans');
      else if (id === 'premium-banner') {
        dispatch({ type: 'reveal-premium-plus' });
        say('Alex', 'Não, isso é um absurdo! Eu paguei pelo Premium e agora descubro um “plus” microscópico escondido na placa? Venderam uma promessa e trancaram a obra atrás de outra assinatura. Vou voltar à máquina de planos para pegar meu dinheiro de volta — e ela vai ter que explicar muito bem essa cobrança.');
      }
      else if (id === 'credit-machine') setOverlay('credits');
      else if (id === 'credit-ad') startAd('credits');
      else if (id.startsWith('premium-art:')) {
        const art = id.split(':')[1];
        setFocusedArtwork(id);
        dispatch({ type: 'observe', id });
        say('Alex', art === 'mineral' ? 'Agora a parede sumiu e a textura finalmente tem espaço para respirar. Era isto que estavam vendendo duas vezes.' : art === 'tide' ? 'Sem anúncio por cima, consigo acompanhar o movimento da imagem sem ser arrancado dela.' : 'Cor, silêncio e tempo. Nada disso precisava de um plano; a barreira é que foi fabricada.', artworkTitle(id));
      }
      else if (id === 'receipt') { dispatch({ type: 'finish' }); setOverlay('receipt'); }
    });
  }
  function buyPremium() {
    if (state.credits < planPrice(state)) {
      dispatch({ type: 'attempt' }); setOverlay(null);
      say('Alex', `Tenho ${state.credits} créditos e o Premium custa ${planPrice(state)}. Inventaram uma moeda nova só para o preço parecer menos real.`);
      return;
    }
    dispatch({ type: 'buy-premium' }); setOverlay(null); setActiveTarget(null);
    say('Alex', `Premium comprado por ${planPrice(state)} créditos. Mesmo assim a parede não abriu. Talvez aquela placa explique o que estão escondendo.`);
  }
  function buyPremiumPlus() {
    if (state.credits < CONFIG.premiumPlusPrice) {
      dispatch({ type: 'attempt' }); setOverlay(null);
      say('Alex', `Agora querem mais ${CONFIG.premiumPlusPrice} créditos pelo Premium Plus. O primeiro plano serviu apenas para me vender o segundo.`);
      return;
    }
    dispatch({ type: 'buy-premium-plus' }); setOverlay(null); setActiveTarget(null);
    say('Alex', `Premium Plus assinado por mais ${CONFIG.premiumPlusPrice} créditos. A parede desapareceu. Então não faltava acesso — faltava só mais uma cobrança.`);
  }
  function buyCredits() {
    dispatch({ type: 'buy-credits' });
  }
  function buyProduct() {
    if (!shoppingProduct || state.purchasedProducts.includes(shoppingProduct.id)) return;
    dispatch({ type: 'buy-product', id: shoppingProduct.id });
    say('Alex', `Pronto, comprei ${shoppingProduct.name.toLowerCase()} e ganhei 1 crédito. A obra continua na parede, mas agora o museu pode dizer que levei um pedaço dela para casa.`, `${shoppingProduct.name} · compra fictícia concluída · +1 crédito`);
    setShoppingProduct(null);
  }
  function leaveProduct() {
    setShoppingProduct(null); setSpeech(null); setActiveTarget(null);
  }
  function closeOverlay() { setOverlay(null); setActiveTarget(null); }
  function restart() {
    clearTimeout(moveTimer.current); pendingMove.current++; setOverlay(null); setSpeech(null); setAd(null); setActiveTarget(null); setFocusedArtwork(null); setShoppingProduct(null); dispatch({ type: 'reset' });
  }
  let objective = state.room === 1 ? `Explore a recepção · ${Math.min(state.reception.length,2)}/2` : state.room === 2 ? state.secondAdClosed ? 'A porta da galeria está aberta' : 'Aproxime-se da pintura' : state.room === 3 ? `Produtos adquiridos · ${state.purchasedProducts.length}/${products.length}` : state.room === 4 ? `Acompanhe o leilão · ${state.bids}/4 lances` : state.room === 5 ? state.premiumPlusOwned ? 'Contemple as obras ou use a saída' : state.premiumTrapRevealed ? `Premium Plus · ${CONFIG.premiumPlusPrice} créditos` : state.premiumOwned ? 'Examine a placa das obras' : `Premium custa ${CONFIG.premiumPrice} créditos · a saída está aberta` : 'Examine o recibo no pedestal';
  const totalMoneySpent = state.moneySpent - state.realBalance;
  const stats = [[state.ads,'Anúncios assistidos'],[state.earned,'Créditos obtidos'],[state.products.length,'Produtos examinados'],[state.purchasedProducts.length,'Produtos comprados'],[reais(totalMoneySpent),'Dinheiro gasto'],[state.works.length,'Obras observadas'],[state.commercial,'Interações comerciais']];
  const npcSpeech = speech && npcTargets.has(activeTarget);
  const artworkModal = focusedArtwork && artworkTargets.has(focusedArtwork) && !overlay;
  const barSpeech = speech && !npcSpeech ? speech : null;

  return <main className="game-shell">
    <header className="game-header"><div className="game-brand">MUSEU <span>S/A</span><small><span>UMA AVENTURA SOBRE ARTE E MERCADO</span><b>APONTAR. CLICAR. QUESTIONAR.</b></small></div><div className="game-options"><button className="aura-button" onPointerDown={()=>setHints(true)} onPointerUp={()=>setHints(false)} onPointerCancel={()=>setHints(false)} onPointerLeave={()=>setHints(false)} onKeyDown={event=>{if(event.code==='Space'){event.preventDefault();setHints(true);}}} onKeyUp={event=>{if(event.code==='Space'){event.preventDefault();setHints(false);}}} aria-label="Segure Espaço para destacar objetos interativos" aria-keyshortcuts="Space" aria-pressed={hints}><kbd>ESPAÇO</kbd><span>{hints?'Auras visíveis':'Segure para ver'}</span></button><button onClick={() => setReduced(value=>!value)} aria-label="Reduzir movimento" aria-pressed={reduced}>≈ <span>{reduced?'Movimento reduzido':'Reduzir movimento'}</span></button><button onClick={() => setOverlay('about')} aria-label="Sobre o projeto">?</button></div></header>
    <section className="game-frame" aria-label="Jogo Museu S/A">
      <div className="scene-hud"><div><span className="chapter">{state.room ? `CAPÍTULO 0${state.room} / 06` : 'UMA VISITA NADA COMUM'}</span><h1 ref={titleRef} tabIndex={-1}>{state.room ? rooms[state.room][0] : 'Museu S/A'}</h1></div><div className="balances" aria-live="polite"><div className="wallet"><span>◈</span> {state.credits}<small>CRÉDITOS</small></div>{totalMoneySpent > 0 && <div className="wallet spent">{reais(totalMoneySpent)}<small>DINHEIRO GASTO</small></div>}</div></div>
      <div className={`world-viewport ${!state.room?'title-world':''}`} ref={viewportRef} inert={!state.room || overlay || ad || artworkModal ? true : undefined}>
        <MuseumScene state={state} actor={actor} interact={interact} walk={walk} hints={hints} sceneRef={sceneRef} activeTarget={activeTarget} speech={npcSpeech ? speech : null} onSpeechClose={()=>{setSpeech(null);setActiveTarget(null);}} />
      </div>
      {!state.room && <div className="title-screen"><span className="title-kicker">UMA AVENTURA POINT & CLICK</span><h2>Todo olhar<br />tem seu <em>preço.</em></h2><p>Uma exposição sobre arte, atenção e mercado.<br />Entre no museu com Alex. Descubra o que está à venda.</p><button className="primary" onClick={() => dispatch({type:'next'})}>Começar a visita <span>→</span></button><small>CLIQUE PARA CAMINHAR · EXPLORE · CONVERSE</small></div>}
      {state.room > 0 && <div className="objective"><span className="objective-dot" />{objective}<span className="mobile-pan">Arraste para explorar ↔</span></div>}
      {artworkModal && <div className={`interaction-popover artwork-modal ${focusedArtwork === 'painting' ? 'chapter-two-artwork' : ''}`} role="dialog" aria-modal="true" aria-label={artworkTitle(focusedArtwork)}>{!ad && (focusedArtwork !== 'painting' || state.secondAdClosed) && <button className="focus-close" onClick={()=>{setFocusedArtwork(null);setActiveTarget(null);}} aria-label="Fechar obra em foco">×</button>}<div className="focus-visual"><FocusVisual target={focusedArtwork} /></div><span className="artwork-caption">{artworkTitle(focusedArtwork)}</span></div>}
      {ad?.visible && <div className={`world-ad ${ad.purpose === 'painting' || ad.purpose === 'second' || ad.purpose === 'merch' ? 'painting-ad' : ''}`} role="dialog" aria-modal="true" aria-label="Publicidade simulada"><span>PUBLICIDADE SIMULADA · {adCopy[ad.purpose][0]}</span><h2>{adCopy[ad.purpose][1]}</h2><p>{adCopy[ad.purpose][2]}</p><button className="primary" disabled={ad.remaining>0} onClick={closeAd}>{ad.remaining > 0 ? `Fechar em ${ad.remaining}s` : 'Fechar anúncio · +1 crédito'}</button></div>}
    </section>
    {barSpeech && <section className={`dialogue-bar is-active ${barSpeech.speaker === 'Alex' ? 'alex-speaking' : ''}`} aria-label="Falas e instruções" aria-live="polite">
      <div className="portrait"><svg viewBox="-42 -151 84 119" aria-hidden="true"><Character kind={barSpeech?.speaker==='Guia'||barSpeech?.speaker==='Leiloeiro'?'guide':barSpeech?.speaker?.startsWith('Comprador')?'buyer':'alex'} /></svg></div>
      <div className="speech-content"><span className="speaker">{barSpeech.speaker}<small>{barSpeech.title}</small></span><p>{barSpeech.text}</p></div>
      {shoppingProduct ? <div className="dialogue-actions"><button className="buy-item" onClick={buyProduct} disabled={state.purchasedProducts.includes(shoppingProduct.id)}>{state.purchasedProducts.includes(shoppingProduct.id) ? 'Já comprado ✓' : `Comprar · R$ ${shoppingProduct.price} · +1 crédito`}</button><button onClick={leaveProduct}>Sair sem comprar</button></div> : <button className="speech-close" onClick={()=>{setSpeech(null);setActiveTarget(null);}} aria-label="Fechar fala">Continuar ▸</button>}
    </section>}
    {state.room===6 && state.finished && !speech && <button className="receipt-prompt" onClick={()=>setOverlay('receipt')}>Ver recibo da visita ▸</button>}
    <footer className="game-footer"><span>CLIQUE PARA CAMINHAR · CLIQUE PARA INTERAGIR · SEGURE ESPAÇO PARA REVELAR</span><span>Alex se aproxima dos objetos antes de interagir.</span><span>{state.room ? `SALA ${state.room} DE 6` : '05–10 MIN'}</span></footer>
    {overlay && <dialog className="game-dialog" ref={overlayRef} aria-labelledby="overlay-title" onCancel={closeOverlay}><button className="close-overlay" onClick={closeOverlay} aria-label="Fechar janela">×</button>
      {overlay==='plans' ? <><span className="chapter">TERMINAL DE ACESSO · MUSEU+</span><h2 id="overlay-title">{state.premiumTrapRevealed ? 'O Premium ganhou um Plus.' : 'Cultura em planos.'}</h2><p>{state.premiumTrapRevealed ? 'A opção Premium desapareceu. Para chegar às obras, agora é necessário assinar o Premium Plus.' : 'A única opção à venda é o Premium. As demais existem para fazer a escolha parecer maior.'}</p><div className="plan-options"><button disabled><strong>Gratuito</strong><span>Corredor e anúncios</span><b>Seu plano atual</b></button><button disabled><strong>Básico</strong><span>Temporariamente indisponível</span><b>—</b></button>{state.premiumTrapRevealed ? <button className="premium-plan plus-plan" onClick={buyPremiumPlus} disabled={state.premiumPlusOwned}><strong>Premium Plus</strong><span>O acesso que você pensou já ter comprado</span><b>{state.premiumPlusOwned ? 'ADQUIRIDO' : `${CONFIG.premiumPlusPrice} créditos`}</b></button> : <button className="premium-plan" onClick={buyPremium} disabled={state.premiumOwned}><strong>Premium</strong><span>Acesso anunciado às obras</span><b>{state.premiumOwned ? 'ADQUIRIDO' : `${CONFIG.premiumPrice} créditos`}</b></button>}<button disabled><strong>Ultra</strong><span>Em breve, talvez</span><b>—</b></button></div><p>Seu saldo: <b>{state.credits} créditos</b>.</p><small>Cancele quando quiser. Se encontrar o botão.<br />Algumas obras podem deixar o catálogo sem aviso prévio.</small><p className="fiction">Compra e dinheiro inteiramente fictícios. Nenhum pagamento real é processado.</p></> : overlay==='credits' ? <><span className="chapter">MÁQUINA DE CRÉDITOS · OPERAÇÃO SIMULADA</span><h2 id="overlay-title">Dinheiro entra. Créditos aparecem.</h2><p>Você tem <b>{state.credits} créditos</b>. Cada novo crédito custa exatamente {reais(CONFIG.creditPackPrice)}.</p><div className="exchange-rate"><span>{reais(CONFIG.creditPackPrice)}</span><b>→</b><strong>◈ {CONFIG.creditPackAmount} crédito</strong></div><button className="primary" onClick={buyCredits}>Comprar 1 crédito por {reais(CONFIG.creditPackPrice)}</button><p className="debt-readout">Dinheiro gasto: <b>{reais(totalMoneySpent)}</b></p><small>É uma simulação narrativa. O jogo não solicita dados nem realiza pagamentos.</small></> : overlay==='receipt' ? <><span className="chapter">RECIBO DA SUA ATENÇÃO</span><h2 id="overlay-title">O que ficou da visita?</h2><div className="receipt-stats">{stats.map(([n,label])=><div key={label}><span>{label}</span><b>{n}</b></div>)}</div><p className="last-question">Neste museu, você viu arte ou apenas as formas de vendê-la?</p><p className="receipt-ad">Gostou da crítica ao consumo?<br /><b>Visite nossa loja oficial.</b><small>Propaganda fictícia. Até a crítica pode virar produto.</small></p><div className="end-actions"><button className="primary" onClick={restart}>Reiniciar a experiência ↻</button><button onClick={()=>setOverlay('about')}>Sobre o projeto</button></div></> : <><span className="chapter">SOBRE O PROJETO</span><h2 id="overlay-title">Museu S/A</h2><p>{aboutText}</p><p>Você controla Alex com cliques ou toques. Ele caminha até os objetos e conversa com as pessoas do museu. A saída de cada sala é uma porta dentro do cenário.</p><button className="primary" onClick={closeOverlay}>Voltar ao museu</button></>}
    </dialog>}
  </main>;
}
