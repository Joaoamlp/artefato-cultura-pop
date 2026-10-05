# Museu S/A — aventura point-and-click

Jogo React + Vite em que você controla **Alex**, um visitante dentro de um museu 2D. Todas as salas são cenários com arquitetura, objetos, personagens e portas. Não há backend, cadastro ou compras reais.

## Rodar

Requer Node.js 22.12+ (ou 20.19+).

```sh
npm install
npm run dev
```

Abra o endereço mostrado no terminal. A aplicação React usa servidor local.

```sh
npm test
npm run build
npm run preview
```

## Como jogar

- Clique ou toque no chão para caminhar.
- Clique em um objeto ou personagem: Alex se aproxima antes de interagir.
- A faixa inferior só aparece quando Alex tem uma observação ou reação relevante.
- Use as **portas dentro do cenário** para mudar de sala.
- Segure **Espaço** (ou mantenha pressionado o botão correspondente) para iluminar os pontos interativos; as auras desaparecem ao soltar.
- No celular, arraste o cenário horizontalmente; a câmera também acompanha o destino de Alex.
- Tab e Enter permitem selecionar objetos. Há uma opção de reduzir movimento.

Explore dois elementos da recepção, observe a pintura e feche os dois anúncios, visite a sala de produtos e acompanhe quatro lances. Ao observar a obra da sala Van Gogh™, a loja anuncia seus produtos; cada tipo comprado registra o valor gasto e concede 1 crédito. No capítulo 5, o Premium custa 10 créditos. Depois da compra, as letras miúdas revelam o Premium Plus, que custa mais 5 créditos. Ao assinar os dois planos, a parede de acesso desaparece e revela três obras inéditas, sem anúncios ou interrupções. A máquina vende cada crédito por R$ 5 fictícios e mostra o saldo atual. A saída permanece disponível independentemente das assinaturas e leva ao encerramento no capítulo 6.

## Arquivos e personalização

- `src/App.jsx`: controle de Alex, caminhada, falas, anúncios, câmbio fictício, terminal de assinatura e recibo final. As ações acontecem somente depois de chegar ao destino. Clicar em outro destino cancela a ação anterior.
- `src/MuseumScene.jsx`: cenários SVG, personagem, objetos clicáveis e portas. O mundo usa coordenadas de 1200 × 680; cada `Spot` define a área clicável e a posição até onde Alex caminha.
- `src/Artwork.jsx`: pinturas originais em SVG.
- `src/game.js`: regras de progressão, estatísticas e textos. `CONFIG` controla créditos, tempo de anúncios e lances.
- `style.css`: cores, interface, animação de caminhada e comportamento responsivo.
- `tests/game.test.js`: percurso completo, barreira de assinatura, contagem e reinício.
- `index.html` e `src/main.jsx`: inicialização da aplicação.

Estatísticas existem apenas na sessão atual. Obras, produtos examinados e produtos comprados contam itens únicos. O HUD mostra os créditos e unifica compras da loja e da máquina sob o indicador **Dinheiro gasto**. As obras são abertas integralmente em um visor próprio. No capítulo 2, a pintura permanece visível por 2 segundos antes de o anúncio se sobrepor a ela; o visor não pode ser fechado até o segundo anúncio terminar. Toda compra e todo valor em reais são estritamente fictícios: nenhum dado financeiro é solicitado.

Os valores centrais ficam em `CONFIG`, no início de `src/game.js`: preço de cada crédito, preços do Premium e Premium Plus, duração dos anúncios e lances. Textos de Alex e das interações ficam em `src/App.jsx` e `src/game.js`; cores e efeitos de foco/aura ficam em `style.css`.
