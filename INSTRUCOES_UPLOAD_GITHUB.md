# Como enviar para o GitHub

Use este pacote em vez de qualquer ZIP antigo com `node_modules`.

## O que enviar

Envie todos os arquivos e pastas deste pacote, principalmente:

- `.github/`
- `src/`
- `public/`
- `scripts/`
- `docs/`
- `.gitignore`
- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `README.md`
- `INSTRUCOES_GITHUB_PAGES.md`

## O que NÃO enviar

Não envie:

- `node_modules/`

A pasta `node_modules` é gerada automaticamente e pode quebrar o projeto no GitHub.

## Publicar no GitHub Pages

### Recomendado: GitHub Actions

1. Suba este pacote no repositório.
2. Vá em **Settings > Pages**.
3. Em **Build and deployment**, escolha **GitHub Actions**.
4. Faça push na branch `main`.
5. O GitHub Actions vai rodar `npm ci`, gerar `dist` e publicar.

### Alternativa: pasta `/docs`

1. Suba este pacote no repositório, incluindo a pasta `docs/`.
2. Vá em **Settings > Pages**.
3. Escolha **Deploy from a branch**.
4. Selecione branch `main` e pasta `/docs`.

## Rodar no computador

```bash
npm ci
npm run dev
```

## Gerar o site final

```bash
npm run build
```
