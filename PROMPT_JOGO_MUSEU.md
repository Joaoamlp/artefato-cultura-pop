# Prompt para criação do jogo “Museu S/A”

Crie um jogo web point-and-click curto, em português do Brasil, chamado provisoriamente **“Museu S/A”**. O jogo será um artefato acadêmico sobre a questão:

> “Como se dá hoje a associação entre arte e mercado?”

A experiência deve criticar a transformação da arte em produto, a quantidade exagerada de anúncios em plataformas de streaming, a comercialização de imagens artísticas, a especulação em leilões e as barreiras de acesso criadas por assinaturas.

O jogo deve ser simples, demonstrativo e durar aproximadamente 5 a 10 minutos. Não crie puzzles, combate, movimentação complexa, inventário ou árvores narrativas. A principal interação deve ser clicar em objetos, quadros, propagandas e personagens para observar pequenas animações e ler frases críticas.

## Tecnologia

Crie o jogo usando apenas:

- HTML;
- CSS;
- JavaScript puro.

Não use frameworks, bibliotecas externas, backend ou banco de dados. O projeto deve funcionar localmente abrindo o arquivo `index.html`.

Organize o código em:

- `index.html`;
- `style.css`;
- `script.js`;
- uma pasta `assets`, se necessário.

O código deve ser claro, comentado e fácil de alterar por estudantes com pouco conhecimento de programação.

## Direção visual

O jogo deve ter estética de museu contemporâneo misturada com elementos de plataformas de streaming e comércio digital.

Use:

- fundo claro nas primeiras salas;
- iluminação de galeria;
- molduras elegantes;
- placas de exposição;
- banners publicitários intrusivos;
- interfaces inspiradas em assinaturas e serviços de streaming;
- textos legíveis;
- pequenas animações em CSS.

Conforme o jogador avança, o museu deve ficar visualmente mais comercial. Os preços, anúncios e ofertas passam a ocupar mais espaço que as obras.

Não dependa de imagens externas. Crie obras fictícias com CSS, gradientes, formas geométricas ou SVGs simples. Na sala inspirada em Van Gogh, crie uma pintura original com céu noturno e pinceladas estilizadas, sem precisar copiar exatamente uma obra existente.

## Estrutura geral

O jogo deve ter:

1. Tela inicial.
2. Recepção.
3. Sala dos anúncios.
4. Sala Van Gogh™.
5. Sala do leilão.
6. Sala por assinatura.
7. Sala final.
8. Tela com estatísticas e mensagem final.

A navegação pode ser feita por botões discretos, como “Avançar”, setas laterais ou portas clicáveis.

## Tela inicial

Mostrar:

- título “Museu S/A”;
- subtítulo: “Uma exposição sobre arte, atenção e mercado”;
- botão “Entrar no museu”;
- aviso de que a experiência funciona melhor com som, somente se houver efeitos sonoros.

Adicionar uma breve instrução:

> Clique nas obras, objetos e personagens para explorar o museu.

## Recepção

Criar uma recepção aparentemente normal, mas já bastante comercial.

Incluir objetos clicáveis:

- uma catraca;
- um banner de patrocinador;
- uma placa de “Visita Premium”;
- uma loja do museu;
- uma atendente ou guia;
- uma porta para a primeira exposição.

Ao clicar, mostrar frases curtas em caixas de diálogo, como:

> “A entrada dá acesso ao museu. Algumas obras são vendidas separadamente.”

> “Exposição cultural apresentada por uma empresa que não financiou nenhum dos artistas.”

> “Conhecimento gratuito. Experiência completa mediante assinatura.”

Depois que o jogador interagir com alguns elementos, liberar a passagem para a próxima sala. Não exigir que todos os objetos sejam encontrados.

## Sala dos anúncios

Mostrar uma obra em destaque. Quando o jogador clicar nela, um anúncio deve aparecer sobre a obra.

Criar uma sequência simples:

1. O jogador clica no quadro.
2. Surge um anúncio com uma contagem regressiva curta.
3. Depois, aparece o botão “Fechar anúncio”.
4. O jogador vê a obra por alguns segundos.
5. Outro anúncio cobre parcialmente a pintura.

Usar mensagens como:

> “Sua contemplação continuará após o anúncio.”

> “Assine o plano premium para observar sem interrupções.”

> “Esta obra contém uma mensagem do nosso patrocinador.”

> “Você ainda está olhando?”

Não transforme essa interação em puzzle. O objetivo é apenas demonstrar a interrupção e causar um pequeno incômodo.

Registrar quantos anúncios o jogador assistiu.

## Sala Van Gogh™

Criar uma pintura fictícia inspirada visualmente em uma noite estrelada, cercada por muitos produtos:

- canecas;
- camisetas;
- almofadas;
- bolsas;
- capas de celular;
- ímãs;
- quebra-cabeças.

Os produtos devem ocupar mais espaço que a própria obra.

Ao clicar nos produtos, mostrar frases como:

> “Você não precisa entender a obra para combinar com a sua sala.”

> “A angústia do artista agora está disponível nos tamanhos P, M e G.”

> “Uma experiência profunda — lavável à máquina.”

> “Leve uma obra-prima. Ou pelo menos uma caneca.”

Ao clicar no quadro, mostrar um pequeno texto sobre como imagens artísticas podem continuar famosas enquanto seus contextos e significados são esquecidos.

Esse texto deve aparecer menor e de maneira menos chamativa que as promoções.

Adicionar etiquetas como:

- “Oferta limitada”;
- “Mais vendido”;
- “Compre dois, leve três”;
- “Estética pós-impressionista para sua casa”.

Registrar quantos produtos o jogador clicou.

## Sala do leilão

Criar um salão luxuoso com:

- uma pintura;
- um leiloeiro;
- três ou quatro compradores;
- um grande painel mostrando o preço atual.

A interação deve ser simples. Cada clique em um comprador aumenta automaticamente o valor da obra e mostra uma fala diferente:

> “Nunca vi essa obra, mas disseram que vai valorizar.”

> “Não combina com minha casa. Vai direto para o depósito.”

> “O importante é que só existem três.”

> “Se ficou mais cara, deve ter ficado melhor.”

> “Não quero a pintura. Quero possuir o que os outros desejam.”

Conforme o valor sobe:

- o preço deve aumentar de tamanho;
- o nome do artista deve diminuir;
- a descrição da obra deve desaparecer;
- a iluminação deve destacar mais o painel do que a pintura.

Depois de alguns lances, colocar uma grande placa de “VENDIDO” sobre a obra.

Em seguida, mostrar:

> “A obra será armazenada em uma coleção privada.”

O jogador não precisa vencer ou tomar uma decisão. Ele apenas observa o funcionamento do leilão.

## Sala por assinatura

Criar uma sala prometendo conter as melhores obras do museu. A entrada deve estar bloqueada por uma enorme paywall.

Mostrar, atrás da barreira, silhuetas ou versões desfocadas de várias pinturas.

A paywall deve apresentar planos fictícios:

- Gratuito: corredor e anúncios;
- Básico: algumas obras com anúncios;
- Premium: acesso às obras famosas;
- Ultra: imagens em resolução original.

Adicionar frases como:

> “A cultura está a apenas uma assinatura de distância.”

> “Cancele quando quiser. Se encontrar o botão.”

> “Algumas obras podem deixar o catálogo sem aviso prévio.”

O jogador deve começar com poucos créditos. Ele pode assistir a anúncios para ganhar créditos, mas o preço do plano deve continuar acima do valor disponível.

Depois de duas ou três tentativas, liberar uma pequena passagem lateral com o texto:

> “Continuar com acesso limitado.”

Não crie sistema de pagamento verdadeiro nem formulários que peçam dados pessoais.

## Sistema simples de créditos

Criar apenas uma moeda chamada “créditos”.

Mostrar um contador pequeno no canto da tela.

Regras:

- o jogador começa com 2 créditos;
- assistir a um anúncio concede 1 crédito;
- algumas ações mostram preços fictícios;
- não criar inventário;
- não criar loja funcional;
- não criar economia complexa;
- os créditos existem apenas para reforçar a monetização da experiência.

Exemplos:

- “Observar sem anúncios: 5 créditos”;
- “Descrição completa da obra: 4 créditos”;
- “Plano Museu+: 10 créditos”.

O sistema não deve impedir o jogador de concluir o jogo.

## Sala final

Criar uma sala branca e quase vazia.

No centro, colocar a mensagem:

> “Você chegou ao fim da experiência gratuita.”

Depois de alguns segundos, mostrar as estatísticas da visita:

- anúncios assistidos;
- créditos obtidos;
- produtos clicados;
- obras observadas;
- interações comerciais realizadas.

Finalizar com a pergunta:

> “Neste museu, você viu arte ou apenas as formas de vendê-la?”

Em seguida, exibir uma falsa propaganda:

> “Gostou da crítica ao consumo? Visite nossa loja oficial.”

Adicionar um botão para reiniciar a experiência.

## Textos de apoio

As mensagens devem ser curtas, irônicas e fáceis de ler. Evite longos blocos acadêmicos durante o jogo.

Na tela final, adicione um botão “Sobre o projeto”. Ao clicar, mostrar um texto curto explicando:

> O jogo apresenta algumas formas pelas quais arte e mercado se relacionam atualmente: publicidade, assinaturas, venda de produtos derivados, construção de prestígio e especulação financeira. A proposta não é afirmar que toda comercialização da arte é negativa, mas questionar o que acontece quando o valor econômico passa a ocupar o lugar da experiência, do contexto e da reflexão.

## Requisitos de interface

- O jogo deve funcionar em computadores e celulares.
- Todos os elementos clicáveis devem apresentar mudança visual ao passar o mouse.
- As caixas de diálogo devem poder ser fechadas facilmente.
- Os textos devem ter bom contraste.
- Adicione legendas para qualquer informação transmitida por áudio.
- Não use alertas nativos do navegador.
- Não permita que anúncios simulados abram páginas externas.
- As animações devem ser curtas.
- Inclua uma opção para reduzir ou desativar animações.
- Salve apenas as estatísticas da sessão atual; não é necessário usar `localStorage`.

## Restrições importantes

Não adicione:

- puzzles;
- enigmas;
- combate;
- movimentação por teclado;
- sistema de vida;
- inventário;
- diálogos longos;
- múltiplos finais;
- escolhas morais;
- login;
- compras reais;
- backend;
- dependências externas;
- funcionalidades que aumentem desnecessariamente o escopo.

A prioridade é comunicar a mensagem de forma clara por meio da ambientação e das interações simples.

## Entrega esperada

Implemente o jogo completo e funcional. Antes de finalizar:

1. Verifique se todas as salas podem ser acessadas.
2. Confirme que o jogador nunca fica preso por falta de créditos.
3. Teste o botão de reiniciar.
4. Teste o layout em telas pequenas.
5. Corrija erros no console.
6. Apresente a estrutura dos arquivos criados.
7. Explique brevemente onde alterar textos, cores e valores dos créditos.

Não entregue apenas um planejamento ou fragmentos de código. Crie todos os arquivos necessários e deixe o jogo pronto para abrir pelo `index.html`.
