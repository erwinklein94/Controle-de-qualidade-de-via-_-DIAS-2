# Validação — Identidade Visual Rumo

Reformulação do **Controle de Qualidade de Via** para o padrão visual oficial da Rumo
(brand book: https://brandbook.rumolog.com/). O trabalho corrigiu uma aplicação anterior
que usava cores *aproximadas* (off-brand) e centralizou tudo em tokens.

## Paleta — corrigida para os HEX oficiais

| Onde | Antes (off-brand) | Agora (oficial) |
|------|-------------------|-----------------|
| Azul âncora | `#003B67` | **`#003865`** |
| Azul profundo (derivado) | `#002E53` | **`#002B4D`** |
| Azul claro | `#007FB6` / `#00A9E0` | **`#32A6E6`** |
| Verde | `#00B96B` | **`#1E9F7F`** |
| Verde claro | `#00D66B` | **`#7FE06C`** |
| Amarelo (secundária) | `#FFDD00` | **`#FBD300`** |
| Erro | `#D95E44` | **`#D84545`** |
| Cinza | `#AEB8C2` | **`#BDCCD4`** |

Todos os `rgba()` correspondentes em gradientes e sombras também foram atualizados.

## Proporção das cores (regra do manual)
- **Azul `#003865` é a cor dominante** — hero, sidebar, botões primários, títulos.
- Azul-claro e verde como **acentos** (estados, item ativo de navegação, séries de gráfico).
- Secundária (amarelo) **apenas em toques** — antes o item ativo do menu era 100% amarelo;
  trocado por gradiente azul-claro → verde. Roxo: ausente (é cor da Raízen).

## Tipografia
- Fonte definida como `"Cera Pro", Verdana, Geneva, Tahoma, sans-serif` (token `--rumo-fonte`).
- ⚠️ **Cera Pro não foi embutida** (fonte paga, não redistribuível). Quem tiver a licença
  instalada vê a Cera Pro; os demais veem o **Verdana**, fallback indicado pelo próprio manual.

## Logos
- Substituídos pelos arquivos **oficiais** do brand book (os anteriores diferiam do original):
  - `rumo-logo-negativo.png` → logo branco (usado na sidebar e no hero, sobre azul).
  - `rumo-logo-positivo.png` → logo azul (contextos claros).
  - `rumo-logo-tagline-*` → versões com a assinatura "Somos o Brasil em movimento".
- Favicon regenerado a partir do logo oficial (256×256, quadrado com área de respiro).
- Versão correta por fundo: **branca sobre azul/escuro**, azul sobre claro. Sem distorção,
  recoloração ou sombra. Tamanho bem acima do mínimo de 70px.
- Aplicados em `public/assets/brand/`, `assets/brand/` e `docs/assets/brand/`.

## Componentes
- **Hero / sidebar:** azul profundo `#002B4D → #003865 → #32A6E6`, logo branco, cantos com
  chanfro sutil e sombras tingidas de azul.
- **Botões primários** em azul âncora; **sucesso** em verde.
- **Item ativo da navegação:** gradiente azul-claro → verde (texto branco, contraste AA).
- **Gráficos (Recharts):** série de linha em azul âncora, grid em cinza Rumo, demais séries
  na institucional. Tema escuro com versões clareadas (verde-claro, azul-claro) sobre azul-noite.
- **Status dos dormentes:** mantida a semântica das marcações físicas (azul/verde/amarelo/
  vermelho/cinza), alinhada à paleta oficial. Texto escuro no chip azul-claro para legibilidade AA.

## Acessibilidade
- Texto sobre azul `#003865`: branco (alto contraste).
- Amarelo nunca usado como texto sobre branco — só em fundos/badges com texto escuro.
- Chips de cor clara (azul-claro, amarelos, cinza) usam texto escuro `#052A52`.
- Tema escuro segue a regra do manual: fundos azul/verde profundos com logo e texto brancos.

## Build
- `npm run build` concluído com sucesso (Vite). Light e dark themes validados em navegador.

## Observação
Cera Pro é paga: se a empresa tiver licença web, basta adicionar um `@font-face` apontando
para os arquivos licenciados — o token `--rumo-fonte` já a prioriza no stack.
