# FLOWERS — reprodução da referência

Página estática em HTML, CSS e JavaScript puro. Abra `index.html` diretamente no navegador. Fontes e imagens estão na pasta `assets`; não há instalação ou build.

Para servir por HTTP local neste computador:

```powershell
python -m http.server 4174 --bind ::1
```

Acesse `http://localhost:4174`. Verificações básicas: `node check.mjs`.

## Análise visual

- Referência: 736 × 1179 px; composição central com aproximadamente 650 px de largura, margem superior de 102 px.
- Capa: aproximadamente 650 × 366 px; foto de peônias, navegação sobreposta e título à esquerda.
- Apresentação: aproximadamente 650 × 297 px; fundo creme, texto à esquerda e fotografia à direita.
- Catálogo: aproximadamente 650 × 312 px; fundo verde-sálvia, introdução lateral e três fotografias verticais.
- Cores-base: papel `#f3f2ee`, creme `#e7dfd4`, sálvia `#ccc9b6`, texto `#424237` e marfim `#f6f0e4`.
- Títulos em Cormorant Garamond Light; corpo em Times New Roman. A família original não pode ser identificada com certeza pelo raster.
- Medidas desktop proporcionais à largura do conteúdo usando `cqw`; até 600 px, navegação recolhível e catálogo em uma coluna.
- Setas vetoriais simples em SVG, sem biblioteca externa.

## Comportamentos

Links navegam para as seções. O menu mobile abre, fecha ao navegar e responde a Escape. Os cartões e links informativos abrem um diálogo nativo, com fechamento por botão, Escape ou clique externo.

`motion.js` usa GSAP 3.13 (ScrollTrigger, SplitText) e Lenis 1.3, copiados em `vendor/`. Rolagem suave, entrada da página, zoom e parallax do hero, "FLOWERS" revelado letra a letra, títulos por linha, cartões revelados por máscara (também ao filtrar) e a sombra botânica balançando devagar, como numa brisa. Com `prefers-reduced-motion` ou sem as bibliotecas, a página fica estática e completa.

A referência não especifica interações nem layout mobile. Essas adaptações são inferências. Entrega, contatos e pedidos são demonstrativos; nenhum envio ou pagamento é realizado.

## Imagens e fidelidade

`assets/reference.jpg` é a referência fornecida. O CSS mostra somente os recortes fotográficos da apresentação e dos cartões; os textos da página são HTML selecionável.

`assets/peonies.png` foi gerada com a ferramenta integrada imagegen. A imagem original foi usada como referência fotográfica. Prompt aplicado:

> Use case: photorealistic-natural. The input is a website screenshot used ONLY as photographic reference. Generate ONLY the clean wide hero photograph from its TOP section, edge to edge, landscape aspect ratio 16:9. Closely recreate the dense arrangement of pale blush pink peonies, giant fully opened peony centered slightly right, creamy ivory peony on left, dusty dark olive green leaves, cropped pink flowers along edges, a round closed peony bud low left-center. Warm muted vintage film coloring, soft natural light, beige undertones, realistic delicate petal texture. Match original photographic layout and subject scale as closely as possible. NO text, NO logo, NO lettering, NO buttons, NO website, NO frames, NO collage, NO white margins. Single full bleed floral photograph. Save generated asset for website use.

A capa, a fonte e as sombras decorativas são aproximações. Os demais recortes mantêm a resolução limitada da referência. Para uma reprodução pixel a pixel, são necessários os arquivos fotográficos e tipográficos originais.

## Verificação realizada

- Inspeção visual desktop em 736 px e mobile em 390 px, com capturas completas em `preview-desktop.png` e `preview-mobile.png`.
- Largura do documento conferida em 320, 390, 736 e 1440 px; sem rolagem horizontal.
- Menu mobile, navegação ao catálogo, diálogo do buquê clássico, detalhes de entrega e contatos testados.
- Escape fecha o diálogo e restaura o foco no cartão de origem.
- Fontes e imagens locais carregadas; nenhum erro ou aviso no console durante a verificação.
- `node check.mjs` passou.
