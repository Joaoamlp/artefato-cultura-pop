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
- Leia as falas na faixa inferior. Você pode fechá-las ou clicar no próximo objeto.
- Use as **portas dentro do cenário** para mudar de sala.
- O botão de mostrar objetos destaca os pontos interativos.
- No celular, arraste o cenário horizontalmente; a câmera também acompanha o destino de Alex.
- Tab e Enter permitem selecionar objetos. Há uma opção de reduzir movimento.

Explore dois elementos da recepção, observe a pintura e feche os anúncios, visite a sala de produtos, acompanhe quatro lances, tente acessar os planos ou assista a anúncios duas vezes e saia pela passagem lateral. Na sala final, examine o recibo sobre o pedestal.

## Arquivos e personalização

- `src/App.jsx`: controle de Alex, caminhada, falas, anúncios, terminal de assinatura e recibo final. As ações acontecem somente depois de chegar ao destino. Clicar em outro destino cancela a ação anterior.
- `src/MuseumScene.jsx`: cenários SVG, personagem, objetos clicáveis e portas. O mundo usa coordenadas de 1200 × 680; cada `Spot` define a área clicável e a posição até onde Alex caminha.
- `src/Artwork.jsx`: pinturas originais em SVG.
- `src/game.js`: regras de progressão, estatísticas e textos. `CONFIG` controla créditos, tempo de anúncios e lances.
- `style.css`: cores, interface, animação de caminhada e comportamento responsivo.
- `tests/game.test.js`: percurso completo, barreira de assinatura, contagem e reinício.
- `index.html` e `src/main.jsx`: inicialização da aplicação.

Estatísticas existem apenas na sessão atual. Obras e produtos contam itens únicos; créditos obtidos excluem os 2 iniciais. Os anúncios são simulados e não abrem sites externos. Os planos sempre custam mais que o saldo, mas o jogador consegue concluir a visita sem comprar nada. A duração depende da exploração e da leitura, sem esperas artificiais além dos curtos anúncios narrativos.
