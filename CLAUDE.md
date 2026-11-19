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
  config/audioLimits.ts   zonas e limite de grupos por modelo, faixas de volume/EQ/ganho, limite de nome, tempos
  data/mockDevices.ts     equipamentos (MAC 02:DE:40:…, IP 192.0.2.x) e Sources fictícios; criação de zonas
  state/AppState.tsx      reducer + Context: varredura, navegação, zonas, Sources, grupos (aplica as regras)
  state/selectors.ts      effectiveVolume, sortZonesForDisplay, selectableSources
  state/groupRules.ts     regras puras de grupos (limite, mínimo 2, exclusividade)
  types/index.ts          DeviceModel, ZoneState, SourceState, ZoneGroup, AddedDevice…
  components/             um componente por arquivo, com o .css ao lado
  pages/                  DiscoveryPage, DeviceControlPage (abas Zona | Source), DeviceSettingsPage
  styles/tokens.css       TODOS os tokens visuais (cores, tipografia, medidas), com origem anotada
  styles/global.css       reset, foco, layout de página
  assets/                 SVGs exportados do Figma
docs/                     product-brief, interactions, data-model, design-system, decisions, qa-checklist
```

## Regras de código
- Zonas e limite de grupos vêm de `MODEL_ZONES` / `MODEL_GROUP_LIMIT`. Nunca crie lógica específica para SMA4 ou SMA6.
- Dados de demonstração ficam em `src/data/`, limites em `src/config/`. Nenhum dos dois vai para componentes.
- Todo estado de controle passa pelo reducer de `AppState.tsx`; componentes visuais recebem props.
- EQ e *Memorizar último volume* são **por zona**, no accordion do card.
- `ZoneState.volume` é sempre o último volume definido; mute e zona desabilitada não o alteram (`effectiveVolume()` deriva o 0). Zona desabilitada bloqueia Source, volume, mute e avançados no reducer.
- Regras de grupos só em `state/groupRules.ts`, usadas pelo reducer e pela interface. Desabilitar Source não altera as zonas que a usam.
- Controles acessíveis: range/checkbox/select nativos, `role="switch"` no toggle, abas WAI-ARIA, `aria-pressed` em favorito/mute, `aria-expanded` no accordion, `:focus-visible`.
- CSS: use apenas `var(--token)` de `tokens.css`. Valor novo → crie um token com a origem anotada (`[figma]`, `[figma-raw]`, `[adaptado]`, `[provisório]`).

## Design System (Embrace Power)
- Referência: Figma `hjBAF72Al9BTYAKXzFZfdJ` (páginas EMBRACE POWER e E-APP – DESIGN SYSTEM). Detalhes em `docs/design-system.md`.
- Tema escuro (fundo preto), Figtree SemiBold, destaque `#FFCC33`, botões com contorno branco e raio 4px.
- Não invente cores, fontes ou componentes. Antes de criar algo novo, procure no Figma (MCP do Figma) e registre o que foi verificado.
- Não use emojis como ícones nem imagens externas aleatórias.

## Restrições desta fase
- **Não** implementar comunicação real com hardware, Wi-Fi, Bluetooth, rede local, protocolos, backend, banco de dados, APIs, autenticação ou firmware.
- Grave/médio/agudo (−7 a +7 dB) são **confirmados**; balanço e ganho **não** são especificação oficial (ver `docs/decisions.md`).
- Configurações de rede e Informações do dispositivo: só a linha "Em breve", sem tela ou fluxo.
- Não antecipar funcionalidades fora do briefing (`docs/product-brief.md`).

## Antes de alterar algo relevante
1. Leia `docs/interactions.md` (comportamento), `docs/data-model.md` (dados e regras) e `docs/decisions.md` (hipóteses abertas).
2. Depois da mudança, atualize o doc afetado e o `docs/qa-checklist.md`. Marque itens só depois de testá-los de verdade.
