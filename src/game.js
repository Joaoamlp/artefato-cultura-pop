// Regras e textos compartilhados. Nada é salvo fora da sessão atual.
export const CONFIG = { initialCredits: 2, adReward: 1, adSeconds: 3, secondAdDelay: 4500, finalDelay: 3500, startingBid: 120000, soldAfter: 4 };
export function initialState() {
  return { room: 0, credits: CONFIG.initialCredits, earned: 0, ads: 0, products: [], works: [], commercial: 0, reception: [], bids: 0, price: CONFIG.startingBid, attempts: 0, watchedPainting: false, secondAdSeen: false, secondAdClosed: false, context: false, finished: false };
}
const unique = (list, item) => list.includes(item) ? list : [...list, item];
export function canAdvance(state) {
  if (state.room === 1) return state.reception.length >= 2;
  if (state.room === 2) return state.secondAdClosed;
  if (state.room === 4) return state.bids >= CONFIG.soldAfter;
  if (state.room === 5) return state.attempts >= 2;
  return state.room < 6;
}
export const planPrice = state => Math.max(10, state.credits + 3);
export const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);

// Cada interação altera somente os campos necessários da sessão.
export function reducer(state, action) {
  switch (action.type) {
    case 'reset': return initialState();
    case 'next': return canAdvance(state) ? { ...state, room: state.room + 1 } : state;
    case 'reception': return { ...state, reception: unique(state.reception, action.id), commercial: state.commercial + (action.id === 'guide' ? 0 : 1) };
    case 'observe': return { ...state, works: unique(state.works, action.id), context: state.context || action.id === 'night' };
    case 'product': return { ...state, products: unique(state.products, action.id), commercial: state.commercial + 1 };
    case 'ad': {
      if (action.purpose === 'painting' && state.watchedPainting) return state;
      if (action.purpose === 'second' && state.secondAdClosed) return state;
      return { ...state, ads: state.ads + 1, credits: state.credits + CONFIG.adReward, earned: state.earned + CONFIG.adReward, commercial: state.commercial + 1,
        watchedPainting: state.watchedPainting || action.purpose === 'painting',
        works: action.purpose === 'painting' ? unique(state.works, 'attention') : state.works,
        secondAdClosed: state.secondAdClosed || action.purpose === 'second',
        attempts: state.attempts + (action.purpose === 'credits' ? 1 : 0) };
    }
    case 'second-ad': return { ...state, secondAdSeen: true };
    case 'bid': return state.bids >= CONFIG.soldAfter ? state : { ...state, bids: state.bids + 1, price: Math.round(state.price * 1.8), commercial: state.commercial + 1 };
    case 'attempt': return { ...state, attempts: state.attempts + 1, commercial: state.commercial + 1 };
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
  turnstile: ['Acesso autorizado*', 'A entrada dá acesso ao museu. Algumas obras são vendidas separadamente.'],
  sponsor: ['Um oferecimento de Capital®', 'Exposição cultural apresentada por uma empresa que não financiou nenhum dos artistas.'],
  premium: ['Visita Premium', 'Conhecimento gratuito. Experiência completa mediante assinatura. Observar sem anúncios: 5 créditos.'],
  shop: ['A saída passa pela loja', 'Leve uma lembrança daquilo que você ainda nem viu. Descrição completa da obra: 4 créditos.'],
  guide: ['Bem-vindo ao museu', 'Aqui, o seu olhar tem valor. Explore pelo menos dois elementos da recepção para abrir a exposição. Não é preciso comprar nada.'],
};
export const products = [
  { id: 'mug', name: 'Caneca', price: '39,90', text: 'Leve uma obra-prima. Ou pelo menos uma caneca.', sale: 'Mais vendido' },
  { id: 'shirt', name: 'Camiseta', price: '89,90', text: 'A angústia do artista agora está disponível nos tamanhos P, M e G.', sale: 'Oferta limitada' },
  { id: 'pillow', name: 'Almofada', price: '69,90', text: 'Você não precisa entender a obra para combinar com a sua sala.' },
  { id: 'bag', name: 'Bolsa', price: '59,90', text: 'Uma experiência profunda — lavável à máquina.' },
  { id: 'phone', name: 'Capa de celular', price: '49,90', text: 'Uma imagem para proteger a sua tela. Quem protege o seu significado?' },
  { id: 'magnet', name: 'Ímã', price: '14,90', text: 'Uma constelação de sentimentos, presa à sua geladeira.' },
  { id: 'puzzle', name: 'Quebra-cabeça', price: '79,90', text: 'A imagem se encaixa em mil peças. A história não vem na caixa.', sale: 'Compre 2, leve 3' },
];
export const buyerLines = ['Nunca vi essa obra, mas disseram que vai valorizar.', 'Não combina com minha casa. Vai direto para o depósito.', 'O importante é que só existem três.', 'Se ficou mais cara, deve ter ficado melhor.'];
export const aboutText = 'O jogo apresenta algumas formas pelas quais arte e mercado se relacionam atualmente: publicidade, assinaturas, venda de produtos derivados, construção de prestígio e especulação financeira. A proposta não é afirmar que toda comercialização da arte é negativa, mas questionar o que acontece quando o valor econômico passa a ocupar o lugar da experiência, do contexto e da reflexão.';
