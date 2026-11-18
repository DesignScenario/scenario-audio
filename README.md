# Scenario Audio — protótipo

Protótipo web navegável do app **Scenario Audio** (Scenario Automation), usado para validar layout e experiência de uso na configuração e no controle dos amplificadores multi-room **SMA4** (4 zonas) e **SMA6** (6 zonas). A identidade visual segue o Design System do **Embrace Power**.

**Acesse online:** https://scenario-audio.vercel.app/ (publicado pelo Vercel a cada push no `main`).

> ⚠️ É um **protótipo de interface**. Nada se comunica com equipamentos, rede, Bluetooth, backend ou APIs. Todos os dados são fictícios.

## Como executar
Requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
```
Abra **http://localhost:5173**.

Outros comandos: `npm run build` (checagem de tipos + build de produção) · `npm run preview` · `npm run lint`.

## O que é simulado
- **Busca na rede:** ao clicar em *Procurar equipamentos*, uma varredura falsa revela 1 SMA6 e 2 SMA4 em cerca de 3 s.
- **Estado vazio:** *Opções de demonstração → Simular rede sem equipamentos* (recurso só do protótipo).
- **Adicionar equipamento:** move o equipamento para *Meus equipamentos* sem duplicar.
- **Tela de controle:** volume independente por zona, habilitar/desabilitar zonas, equalização (grave, médio, agudo, balanço) com *Restaurar padrão*.
- **Estado em memória:** os valores se mantêm ao navegar entre as telas e são reiniciados ao recarregar a página.

## Limitações e suposições
- As faixas de equalização e balanço (−10 a +10) são **demonstrativas** e não representam o hardware. Estão em `src/config/audioLimits.ts`.
- MACs fictícios (`02:DE:40:…`).
- Ainda não há fotos do SMA4/SMA6 no Figma; a miniatura é um placeholder.
- A equalização é tratada como ajuste do equipamento (não por zona).
- Lista completa de decisões e hipóteses: [docs/decisions.md](docs/decisions.md).

## Estrutura
```
src/config      limites demonstrativos e zonas por modelo
src/data        equipamentos fictícios
src/state       estado global (useReducer + Context)
src/components  componentes de UI (cada um com seu .css)
src/pages       DiscoveryPage, DeviceControlPage
src/styles      tokens.css (Design System) e global.css
```

## Documentação
- [CLAUDE.md](CLAUDE.md): regras permanentes para desenvolvimento com o Claude. **Comece por aqui.**
- [docs/product-brief.md](docs/product-brief.md): visão, escopo e o que está fora do escopo.
- [docs/interactions.md](docs/interactions.md): fluxos, estados e comportamentos.
- [docs/design-system.md](docs/design-system.md): tokens e componentes verificados no Figma.
- [docs/decisions.md](docs/decisions.md): decisões, hipóteses e pendências.
- [docs/qa-checklist.md](docs/qa-checklist.md): checklist de validação com os resultados.
