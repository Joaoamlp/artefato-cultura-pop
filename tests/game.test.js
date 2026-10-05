import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer, canAdvance, planPrice, CONFIG } from '../src/game.js';

test('a rota gratuita continua chegando ao final sem comprar créditos', () => {
  let state = initialState();
  const act = (type, extra = {}) => { state = reducer(state, { type, ...extra }); };
  act('next'); assert.equal(state.room, 1);
  act('next'); assert.equal(state.room, 1);
  act('reception', { id: 'guide' }); act('reception', { id: 'guide' });
  assert.equal(canAdvance(state), false);
  act('reception', { id: 'sponsor' }); act('next'); assert.equal(state.room, 2);
  act('ad', { purpose: 'painting' }); assert.equal(canAdvance(state), false);
  act('second-ad'); act('ad', { purpose: 'second' }); act('next'); assert.equal(state.room, 3);
  assert.equal(canAdvance(state), true);
  act('ad', { purpose: 'merch' });
  act('next'); assert.equal(state.room, 4);
  for (let i = 0; i < CONFIG.soldAfter; i++) act('bid');
  const soldPrice = state.price; act('bid'); assert.equal(state.price, soldPrice);
  act('next'); assert.equal(state.room, 5);
  act('attempt'); act('attempt'); assert.equal(state.credits, 5);
  assert.equal(canAdvance(state), false);
  act('comment-exit'); assert.equal(canAdvance(state), true);
  act('next'); assert.equal(state.room, 6);
  act('finish'); assert.equal(state.finished, true);
  act('next'); assert.equal(state.room, 6);
  act('reset'); assert.deepEqual(state, initialState());
});

test('o terminal substitui Premium por Premium Plus e cobra os dois planos', () => {
  let state = { ...initialState(), room: 5 };
  state = reducer(state, { type: 'buy-premium' });
  assert.equal(state.premiumOwned, false);
  for (let i = 0; i < 8; i++) state = reducer(state, { type: 'buy-credits' });
  assert.equal(state.realBalance, -40);
  assert.equal(state.credits, 10);
  assert.equal(planPrice(state), 10);
  state = reducer(state, { type: 'buy-premium' });
  assert.equal(state.premiumOwned, true);
  assert.equal(state.credits, 0);
  assert.equal(canAdvance(state), false);
  state = reducer(state, { type: 'reveal-premium-plus' });
  for (let i = 0; i < 5; i++) state = reducer(state, { type: 'buy-credits' });
  state = reducer(state, { type: 'buy-premium-plus' });
  assert.equal(state.premiumPlusOwned, true);
  assert.equal(state.credits, 0);
  assert.equal(state.realBalance, -65);
  assert.equal(canAdvance(state), false);
  state = reducer(state, { type: 'comment-exit' });
  assert.equal(canAdvance(state), true);
  state = reducer(state, { type: 'next' }); assert.equal(state.room, 6);
});

test('estatísticas contam itens únicos e evitam recompensa duplicada', () => {
  let state = initialState();
  for (let i = 0; i < 3; i++) {
    state = reducer(state, { type: 'product', id: 'mug' });
    state = reducer(state, { type: 'observe', id: 'night' });
    state = reducer(state, { type: 'ad', purpose: 'painting' });
    state = reducer(state, { type: 'ad', purpose: 'second' });
  }
  assert.equal(state.products.length, 1); assert.equal(state.works.length, 2);
  assert.equal(state.ads, 2); assert.equal(state.earned, 2); assert.equal(state.commercial, 5);
});

test('comprar um item de cada evita o anúncio promocional da loja', () => {
  let state = { ...initialState(), room: 3 };
  for (const id of ['mug', 'shirt', 'pillow', 'bag', 'phone', 'magnet', 'puzzle']) {
    state = reducer(state, { type: 'buy-product', id });
  }
  assert.equal(state.purchasedProducts.length, 7);
  assert.equal(state.credits, 9);
  assert.equal(state.earned, 7);
  assert.equal(state.moneySpent, 404.3);
  assert.equal(state.merchAdSeen, false);
  assert.equal(canAdvance(state), true);
  const repeated = reducer(state, { type: 'buy-product', id: 'mug' });
  assert.equal(repeated.credits, 9);
  assert.equal(repeated.moneySpent, 404.3);
});
