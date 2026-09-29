import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer, canAdvance, planPrice, CONFIG } from '../src/game.js';

test('percurso completo nunca exige gastar créditos', () => {
  let state = initialState();
  const act = (type, extra = {}) => { state = reducer(state, { type, ...extra }); };
  act('next'); assert.equal(state.room, 1);
  act('next'); assert.equal(state.room, 1);
  act('reception', { id: 'guide' }); act('reception', { id: 'guide' });
  assert.equal(canAdvance(state), false);
  act('reception', { id: 'sponsor' }); act('next'); assert.equal(state.room, 2);
  act('ad', { purpose: 'painting' }); assert.equal(canAdvance(state), false);
  act('second-ad'); act('ad', { purpose: 'second' }); act('next'); assert.equal(state.room, 3);
  act('next'); assert.equal(state.room, 4);
  for (let i = 0; i < CONFIG.soldAfter; i++) act('bid');
  const soldPrice = state.price; act('bid'); assert.equal(state.price, soldPrice);
  act('next'); assert.equal(state.room, 5);
  act('attempt'); act('attempt'); assert.equal(state.credits, 4);
  act('next'); assert.equal(state.room, 6);
  act('finish'); assert.equal(state.finished, true);
  act('next'); assert.equal(state.room, 6);
  act('reset'); assert.deepEqual(state, initialState());
});

test('preços continuam acima do saldo e anúncios liberam a passagem', () => {
  let state = { ...initialState(), room: 5 };
  for (let i = 0; i < 25; i++) {
    state = reducer(state, { type: 'ad', purpose: 'credits' });
    assert.ok(planPrice(state) - 1 > state.credits);
  }
  assert.equal(canAdvance(state), true);
  assert.equal(state.ads, 25); assert.equal(state.earned, 25); assert.equal(state.credits, 27);
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
