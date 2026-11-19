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
- **Equipamentos:** cards com modelo, MAC, IP e zonas; adicionar sem duplicar.
- **Aba Zona:** por zona, favoritar (vai para o topo), Source, volume, mute, habilitar/desabilitar (cinza, 0 % e mudo) e *Configurações avançadas* (grave, médio, agudo, balanço, memorizar último volume).
- **Aba Source:** lista numerada; habilitar/desabilitar, renomear (reflete nas zonas) e ganho.
- **Configurações (engrenagem):** grupos de zonas com as regras de cada modelo (SMA4 até 2, SMA6 até 3, mínimo 2 zonas, zona em um só grupo). Rede e Informações aparecem como "Em breve".
- **Estado em memória:** os valores se mantêm ao navegar entre as telas e são reiniciados ao recarregar a página.

## Limitações e suposições
- Grave, médio e agudo usam a faixa confirmada de **−7 a +7 dB**. Balanço e ganho (−10 a +10, sem unidade) são **demonstrativos**. Tudo em `src/config/audioLimits.ts`.
- 4 Sources fictícias por equipamento; o efeito de *Memorizar último volume* ainda não foi definido.
- MACs (`02:DE:40:…`) e IPs (`192.0.2.x`) fictícios.
- Ainda não há fotos do SMA4/SMA6 no Figma; a miniatura é um placeholder.
- Lista completa de decisões e hipóteses: [docs/decisions.md](docs/decisions.md).

## Estrutura
```
src/config      zonas e limite de grupos por modelo, faixas de EQ/ganho, limite de nome
src/data        equipamentos e Sources fictícios
src/state       estado global (reducer), selectors.ts e groupRules.ts
src/components  componentes de UI (cada um com seu .css)
src/pages       DiscoveryPage, DeviceControlPage (abas Zona | Source), DeviceSettingsPage
src/styles      tokens.css (Design System) e global.css
```

## Documentação
- [CLAUDE.md](CLAUDE.md): regras permanentes para desenvolvimento com o Claude. **Comece por aqui.**
- [docs/product-brief.md](docs/product-brief.md): visão, escopo e o que está fora do escopo.
- [docs/interactions.md](docs/interactions.md): fluxos, estados e comportamentos.
- [docs/data-model.md](docs/data-model.md): entidades, campos e regras de consistência.
- [docs/design-system.md](docs/design-system.md): tokens e componentes verificados no Figma.
- [docs/decisions.md](docs/decisions.md): decisões, hipóteses e pendências.
- [docs/qa-checklist.md](docs/qa-checklist.md): checklist de validação com os resultados.
