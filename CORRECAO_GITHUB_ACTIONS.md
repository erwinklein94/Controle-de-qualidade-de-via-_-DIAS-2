# Correção do GitHub Actions

O erro `npm error code ETIMEDOUT` apontando para `packages.applied-caas-gateway...internal.api.openai.org` acontecia porque o `package-lock.json` estava com alguns pacotes apontando para um registry interno usado durante a preparação do projeto.

Foi corrigido para usar o registry público:

```txt
https://registry.npmjs.org/
```

Também foi ajustado o workflow em `.github/workflows/deploy.yml` para forçar o npm a usar o registry público antes do `npm ci`.

Depois de subir estes arquivos para o GitHub, vá em **Actions** e rode o workflow novamente.
