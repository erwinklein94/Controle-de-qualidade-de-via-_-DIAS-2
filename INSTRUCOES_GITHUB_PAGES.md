# Publicação no GitHub Pages

Este projeto foi ajustado para funcionar no GitHub Pages como site estático.

## Opção recomendada: GitHub Actions

1. Crie um repositório no GitHub.
2. Envie todos os arquivos e pastas deste pacote para a branch `main`.
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, selecione **Source: GitHub Actions**.
5. Faça um commit/push na branch `main`.
6. O workflow `.github/workflows/deploy.yml` vai instalar as dependências, gerar a pasta `dist` e publicar o site automaticamente.

## Opção alternativa: publicar pela pasta `docs`

Este pacote também inclui a pasta `docs/`, já gerada com o build estático.

Use esta opção se quiser publicar sem rodar build no GitHub:

1. Envie a pasta `docs/` para o repositório.
2. Abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha branch `main` e pasta `/docs`.
5. Salve.

## Por que isso foi ajustado

- `vite.config.js` usa `base: './'`, evitando erro de caminho em repositórios como `usuario.github.io/nome-do-repositorio/`.
- O build gera `404.html`, útil para evitar tela quebrada em recarregamento de páginas internas.
- O build gera `.nojekyll`, evitando interferência do processamento Jekyll do GitHub Pages.
- A pasta `node_modules/` não deve ser enviada ao GitHub.

## Teste local

```bash
npm ci
npm run build
npm run preview
```
