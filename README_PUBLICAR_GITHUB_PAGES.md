# Publicação no GitHub Pages - correção da tela branca

Esta pasta já contém o site pronto, compilado e estático.

## Como publicar

1. Extraia este ZIP.
2. Abra a pasta extraída.
3. Envie para o repositório do GitHub **os arquivos que estão aqui dentro**, deixando o `index.html` diretamente na raiz do repositório.
4. No GitHub, vá em **Settings > Pages**.
5. Em **Build and deployment**, selecione:
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
6. Clique em **Save**.
7. Aguarde alguns minutos e atualize a página com **Ctrl + F5**.

## Importante

O site não deve ficar dentro de uma subpasta como `dist`, `docs` ou `Controle-de-qualidade...` quando a publicação estiver configurada para `/ (root)`.

A estrutura correta na raiz do repositório é:

```text
index.html
404.html
.nojekyll
assets/
README_PUBLICAR_GITHUB_PAGES.md
```

## Por que a tela ficou branca

A tela branca normalmente acontece quando o GitHub Pages publica o arquivo `index.html` de desenvolvimento do Vite, que tenta carregar `/src/main.jsx`. O GitHub Pages não processa React/Vite automaticamente nesse modo. Esta versão já está compilada e carrega os arquivos da pasta `assets/` corretamente.
