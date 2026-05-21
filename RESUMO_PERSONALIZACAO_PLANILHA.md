# Personalização feita a partir da planilha Ferronorte

## O que foi preservado
- Registro de trechos.
- Grade de inspeção por dormente.
- Sistema de siglas e cores: A, G, L1, L2, L3, V e R.
- Dashboard atual com desempenho, críticos, malhas/clusters, marcações e exportação.

## O que foi acrescentado

### 1. Cadastro de trecho mais próximo do padrão da planilha
Foram adicionados campos para:
- Ponto padrão / ponto de monitoramento.
- Equipamento ou segmento, por exemplo `031+470 ao 031+570`.
- Sentido/lado, por exemplo `Carregado curva direita / Sentido crescente`.
- Ano de prospecção.
- Quantidade de dormentes prospectados.
- Quantidade de inservíveis na prospecção.
- Taxa de referência de inservíveis.

Esses campos vieram da estrutura observada nas abas de pontos de monitoramento, inspeções e prospecção por trecho.

### 2. Nova aba: Ensaios e fissuras
Foi criada uma aba própria para dados técnicos complementares, sem substituir a inspeção principal.

#### HardScan
Permite cadastrar:
- Data.
- Dormente.
- Equipamento.
- Valores 1 a 4.
- Média individual.
- Observação.

O sistema calcula média quando o usuário preencher os valores e mostra gráfico de média HardScan por dormente/amostra.

#### Fissuras
Permite cadastrar:
- Data.
- Dormente.
- Lado: LE, LD ou Centro.
- Comprimento lateral em mm.
- Comprimento superior em mm.
- Abertura em mm.
- Classe: Não marcado, CA, CB, CC, CD, CE ou Ruína por fissura.
- Observação.

A classe é sugerida automaticamente a partir de abertura e comprimento, inspirada nas regras das abas `Prospecção por vídeo` e `Monitoramento Fissura`.

### 3. Novos gráficos no dashboard
Além dos gráficos já existentes, foram adicionados:
- Taxa de inservíveis por prospecção.
- HardScan médio por trecho.
- Fissuras por classe.
- Novos críticos e novas ruínas por inspeção.

### 4. Novos indicadores gerenciais
No dashboard foram acrescentados cartões para:
- Taxa de prospecção.
- HardScan médio.
- Fissuras críticas.
- Regulares adjacentes a críticos.

### 5. Exportação Excel ampliada
A exportação do dashboard agora inclui:
- Dados filtrados da inspeção.
- Ranking dos trechos.
- Prospecção / referência Ferronorte.
- HardScan por trecho.
- Fissuras por classe.

## Abas da planilha usadas como referência
- `Pontos Monitoramento`
- `Inspeção abril 26`
- `Análise Curva`
- `Análise Tangente`
- `Prospecção por vídeo`
- `Prospecção Trecho`
- `Base Monitoramento`
- `HardScan 13 a 15-05-25`
- `Monitoramento Fissura`
- `Cronograma Inspeção`

## Observação importante
A lógica principal de classificação por cor/sigla não foi removida. Os novos módulos servem para enriquecer a experiência do especialista e dar mais contexto técnico aos gráficos e relatórios.
