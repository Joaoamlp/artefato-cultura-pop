// Regras e textos compartilhados. Nada é salvo fora da sessão atual.
export const CONFIG = {
  initialCredits: 2,
  adReward: 1,
  adAppearDelay: 2000,
  adSeconds: 5,
  secondAdDelay: 4500,
  finalDelay: 3500,
  startingBid: 120000,
  soldAfter: 4,
  creditPackPrice: 5,
  creditPackAmount: 1,
  premiumPrice: 10,
  premiumPlusPrice: 5,
};
export function initialState() {
  return { room: 0, credits: CONFIG.initialCredits, realBalance: 0, moneySpent: 0, premiumOwned: false, premiumPlusOwned: false, premiumTrapRevealed: false, exitCommented: false, earned: 0, ads: 0, products: [], purchasedProducts: [], merchAdSeen: false, works: [], commercial: 0, reception: [], bids: 0, price: CONFIG.startingBid, attempts: 0, watchedPainting: false, secondAdSeen: false, secondAdClosed: false, context: false, finished: false };
}
const unique = (list, item) => list.includes(item) ? list : [...list, item];
export function canAdvance(state) {
  if (state.room === 1) return state.reception.length >= 2;
  if (state.room === 2) return state.secondAdClosed;
  if (state.room === 4) return state.bids >= CONFIG.soldAfter;
  if (state.room === 5) return state.exitCommented;
  return state.room < 6;
}
export const planPrice = () => CONFIG.premiumPrice;
export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
export const reais = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value);

// Cada interação altera somente os campos necessários da sessão.
export function reducer(state, action) {
  switch (action.type) {
    case 'reset': return initialState();
    case 'next': return canAdvance(state) ? { ...state, room: state.room + 1 } : state;
    case 'reception': return { ...state, reception: unique(state.reception, action.id), commercial: state.commercial + (action.id === 'guide' ? 0 : 1) };
    case 'observe': return { ...state, works: unique(state.works, action.id), context: state.context || action.id === 'night' };
    case 'product': return { ...state, products: unique(state.products, action.id), commercial: state.commercial + 1 };
    case 'buy-product': {
      if (state.purchasedProducts.includes(action.id)) return state;
      const product = products.find(item => item.id === action.id);
      const price = Number(product.price.replace('.', '').replace(',', '.'));
      return { ...state, purchasedProducts: [...state.purchasedProducts, action.id], moneySpent: Math.round((state.moneySpent + price) * 100) / 100, credits: state.credits + 1, earned: state.earned + 1, commercial: state.commercial + 1 };
    }
    case 'ad': {
      if (action.purpose === 'painting' && state.watchedPainting) return state;
      if (action.purpose === 'second' && state.secondAdClosed) return state;
      if (action.purpose === 'merch' && state.merchAdSeen) return state;
      return { ...state, ads: state.ads + 1, credits: state.credits + CONFIG.adReward, earned: state.earned + CONFIG.adReward, commercial: state.commercial + 1,
        watchedPainting: state.watchedPainting || action.purpose === 'painting',
        works: action.purpose === 'painting' ? unique(state.works, 'attention') : state.works,
        secondAdClosed: state.secondAdClosed || action.purpose === 'second',
        merchAdSeen: state.merchAdSeen || action.purpose === 'merch',
        attempts: state.attempts + (action.purpose === 'credits' ? 1 : 0) };
    }
    case 'second-ad': return { ...state, secondAdSeen: true };
    case 'bid': return state.bids >= CONFIG.soldAfter ? state : { ...state, bids: state.bids + 1, price: Math.round(state.price * 1.8), commercial: state.commercial + 1 };
    case 'attempt': return { ...state, attempts: state.attempts + 1, commercial: state.commercial + 1 };
    case 'buy-credits': return { ...state, credits: state.credits + CONFIG.creditPackAmount, realBalance: state.realBalance - CONFIG.creditPackPrice, commercial: state.commercial + 1 };
    case 'buy-premium':
      if (state.premiumOwned || state.credits < CONFIG.premiumPrice) return state;
      return { ...state, credits: state.credits - CONFIG.premiumPrice, premiumOwned: true, commercial: state.commercial + 1 };
    case 'reveal-premium-plus': return state.premiumOwned ? { ...state, premiumTrapRevealed: true, commercial: state.commercial + (state.premiumTrapRevealed ? 0 : 1) } : state;
    case 'buy-premium-plus':
      if (!state.premiumOwned || !state.premiumTrapRevealed || state.premiumPlusOwned || state.credits < CONFIG.premiumPlusPrice) return state;
      return { ...state, credits: state.credits - CONFIG.premiumPlusPrice, premiumPlusOwned: true, commercial: state.commercial + 1 };
    case 'comment-exit': return state.room === 5 ? { ...state, exitCommented: true } : state;
    case 'finish': return { ...state, finished: true };
    default: return state;
  }
}
export const rooms = [null,
  ['Recepção', 'Toda visita começa com uma oferta.'],
  ['O preço da atenção', 'Uma obra. Alguns segundos. Vários patrocinadores.'],
  ['Van Gogh™', 'A imagem permanece. O contexto é vendido separadamente.'],
  ['O valor do olhar', 'O quadro é o mesmo. A cada lance, ele vale mais.'],
  ['Cultura em planos', 'As melhores obras estão logo ali. Atrás dos termos de uso.'],
  ['Fim da visita', 'Obrigado por oferecer a sua atenção.'],
];
export const receptionItems = {
  turnstile: ['Acesso autorizado*', 'Então a entrada compra o direito de entrar, mas não o direito de ver tudo. Ótimo começo.'],
  sponsor: ['Um oferecimento de Capital®', 'Curioso: a empresa aparece maior que qualquer artista e nem ajudou a produzir as obras.'],
  premium: ['Visita Premium', 'Pagar para não ser interrompido... transformaram o silêncio em benefício exclusivo.'],
  shop: ['A saída passa pela loja', 'Eu nem vi a exposição e já posso levar uma lembrança dela. A mercadoria chegou antes da experiência.'],
  guide: ['Bem-vindo ao museu', 'Aqui, o seu olhar tem valor. Explore pelo menos dois elementos da recepção para abrir a exposição. Não é preciso comprar nada.'],
};
export const products = [
  { id: 'mug', name: 'Caneca', price: '39,90', text: 'Uma obra-prima reduzida a recipiente de café. Pelo menos a caneca não finge que isso é contemplação.', sale: 'Mais vendido' },
  { id: 'shirt', name: 'Camiseta', price: '89,90', text: 'A angústia do artista, agora nos tamanhos P, M e G. A biografia ficou fora da coleção.', sale: 'Oferta limitada' },
  { id: 'pillow', name: 'Almofada', price: '69,90', text: 'Claro. Não preciso entender a obra; basta ela combinar com o sofá.' },
  { id: 'bag', name: 'Bolsa', price: '59,90', text: 'Uma experiência profunda, lavável à máquina. Isso resume bem esta sala.' },
  { id: 'phone', name: 'Capa de celular', price: '49,90', text: 'A imagem protege a tela. Pena que ninguém aqui parece interessado em proteger o significado.' },
  { id: 'magnet', name: 'Ímã', price: '14,90', text: 'Toda essa inquietação artística terminou presa à porta de uma geladeira.' },
  { id: 'puzzle', name: 'Quebra-cabeça', price: '79,90', text: 'Mil peças da imagem e nenhuma do contexto. Conveniente.', sale: 'Compre 2, leve 3' },
];
export const buyerLines = ['Nunca vi essa obra, mas disseram que vai valorizar.', 'Não combina com minha casa. Vai direto para o depósito.', 'O importante é que só existem três.', 'Se ficou mais cara, deve ter ficado melhor.'];
export const aboutText = 'O jogo apresenta algumas formas pelas quais arte e mercado se relacionam atualmente: publicidade, assinaturas, venda de produtos derivados, construção de prestígio e especulação financeira. A proposta não é afirmar que toda comercialização da arte é negativa, mas questionar o que acontece quando o valor econômico passa a ocupar o lugar da experiência, do contexto e da reflexão.';
