# Integração Supabase — Degradação de dormentes

Este projeto já está com as variáveis do Supabase preenchidas nos lugares certos:

- `.env.local` para rodar no seu computador.
- `.env.production` para build/publicação.
- `.github/workflows/deploy.yml` para GitHub Pages.
- `src/supabaseClient.js` lendo as variáveis do Vite e também aceitando nomes `NEXT_PUBLIC_` caso você copie do botão **Connect** do Supabase.

## 1. Criar a tabela no Supabase

No painel do Supabase:

1. Abra o projeto **Degradação de dormentes**.
2. Clique em **SQL Editor** no menu lateral.
3. Clique em **New query**.
4. Cole todo o conteúdo do arquivo `supabase/schema.sql`.
5. Clique em **Run**.

Esse SQL cria a tabela `app_state`, mantém o RLS ligado e cria as policies para o site ler e salvar os dados.

## 2. Rodar no computador

Na pasta do projeto, rode:

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal.

## 3. Salvar os dados no Supabase

No site:

1. Faça uma alteração nos dados.
2. Clique em **Salvar**.
3. O app salva no navegador e também no Supabase.

Para conferir no Supabase:

1. Vá em **Table Editor**.
2. Abra a tabela `app_state`.
3. Deve aparecer uma linha com `app_key = dormentes-main`.
4. Os dados ficam no campo `tracks`.

## 4. Sobre segurança/RLS

O RLS fica ligado. Como o site ainda não tem tela de login, a policy atual permite que o app público leia e atualize apenas a linha `dormentes-main`.

Para deixar os dados realmente privados por usuário, o próximo passo é adicionar login do Supabase Auth e trocar as policies para `authenticated` com identificação de usuário.

## 5. Chaves usadas

A chave configurada é `sb_publishable_...`, que é a chave pública correta para frontend.

Não use no frontend chaves chamadas `service_role`, `secret` ou `sb_secret_...`.
