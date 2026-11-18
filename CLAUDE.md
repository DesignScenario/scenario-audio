# CLAUDE.md — Scenario Audio

## O que é
Protótipo web navegável do **Scenario Audio**, app da Scenario Automation para localizar, adicionar e controlar os amplificadores multi-room **SMA4 (4 zonas)** e **SMA6 (6 zonas)**.
**Estágio: protótipo de UX/UI**, não a aplicação final. O objetivo é validar layout e experiência.

## Stack e comandos
- Vite 6 + React 19 + TypeScript + CSS puro (sem Tailwind, sem libs de UI, sem router).
- `npm install` · `npm run dev` (http://localhost:5173) · `npm run build` (tsc + build) · `npm run lint`.

## Estrutura
```
src/
  config/audioLimits.ts   zonas por modelo, limites DEMONSTRATIVOS de volume/EQ, tempos da varredura
  data/mockDevices.ts     equipamentos fictícios (MACs 02:DE:40:…) e criação das zonas
  state/AppState.tsx      useReducer + Context: varredura, adicionados, zonas, EQ, tela aberta
  types/index.ts          DeviceModel, ZoneState, EqualizerState, AddedDevice…
  components/             um componente por arquivo, com o .css ao lado
  pages/                  DiscoveryPage, DeviceControlPage
  styles/tokens.css       TODOS os tokens visuais (cores, tipografia, medidas), com origem anotada
  styles/global.css       reset, foco, layout de página
  assets/                 SVGs exportados do Figma
docs/                     product-brief, interactions, design-system, decisions, qa-checklist
```

## Regras de código
- A quantidade de zonas vem de `MODEL_ZONES[model]`. Nunca crie lógica específica para SMA4 ou SMA6.
- Dados de demonstração ficam em `src/data/`, limites em `src/config/`. Nenhum dos dois vai para componentes.
- Todo estado de controle passa pelo reducer de `AppState.tsx`; componentes visuais recebem props.
- A equalização é **por dispositivo** (`AddedDevice.equalizer`). Se virar por zona, mova-a para `ZoneState`.
- Controles acessíveis: `input type="range"` nativo, `role="switch"` no toggle, abas WAI-ARIA, `:focus-visible`.
- CSS: use apenas `var(--token)` de `tokens.css`. Valor novo → crie um token com a origem anotada (`[figma]`, `[figma-raw]`, `[adaptado]`, `[provisório]`).

## Design System (Embrace Power)
- Referência: Figma `hjBAF72Al9BTYAKXzFZfdJ` (páginas EMBRACE POWER e E-APP – DESIGN SYSTEM). Detalhes em `docs/design-system.md`.
- Tema escuro (fundo preto), Figtree SemiBold, destaque `#FFCC33`, botões com contorno branco e raio 4px.
- Não invente cores, fontes ou componentes. Antes de criar algo novo, procure no Figma (MCP do Figma) e registre o que foi verificado.
- Não use emojis como ícones nem imagens externas aleatórias.

## Restrições desta fase
- **Não** implementar comunicação real com hardware, Wi-Fi, Bluetooth, rede local, protocolos, backend, banco de dados, APIs, autenticação ou firmware.
- **Não** tratar limites de EQ e balanço como especificação oficial (ver `docs/decisions.md`).
- Não antecipar funcionalidades fora do briefing (`docs/product-brief.md`).

## Antes de alterar algo relevante
1. Leia `docs/interactions.md` (comportamento) e `docs/decisions.md` (hipóteses abertas).
2. Depois da mudança, atualize o doc afetado e o `docs/qa-checklist.md`. Marque itens só depois de testá-los de verdade.
