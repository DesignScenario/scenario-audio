# Modelo de dados — Scenario Audio (protótipo)

Fonte da verdade: `src/types/index.ts`. Todo o estado fica **em memória** no `AppStateProvider` (`src/state/AppState.tsx`) e é reiniciado ao recarregar a página.

## Entidades

```
AddedDevice (equipamento adicionado)
├── id, model (SMA4 | SMA6), mac, ip
├── zones:   ZoneState[]   (quantidade = MODEL_ZONES[model])
├── sources: SourceState[] (lista de demonstração, src/data/mockDevices.ts)
└── groups:  ZoneGroup[]   (máximo = MODEL_GROUP_LIMIT[model])
```

| Entidade | Campo | Significado |
|---|---|---|
| `DiscoveredDevice` | `id`, `model`, `mac`, `ip` | Resultado da varredura simulada. MAC `02:DE:40:…` e IP `192.0.2.x` (faixa de documentação) |
| `ZoneState` | `id`, `number`, `name` | Identificação. `number` define a ordem dentro de favoritas e não favoritas |
| | `enabled` | Zona habilitada. Desabilitada = mudo + controles operacionais bloqueados |
| | `favorite` | Favorita: aparece no topo da aba Zona |
| | `volume` | **Último volume definido** (0–100). Nunca é zerado por mute ou por desabilitar |
| | `muted` | Mute do usuário. Preservado ao desabilitar/reabilitar |
| | `sourceId` | Source selecionada. Pode apontar para uma Source desabilitada |
| | `equalizer` | `bass`, `mid`, `treble` (−7…+7 dB) e `balance` (−10…+10, demonstrativo) |
| | `rememberLastVolume` | Switch "Memorizar último volume" (só visual no protótipo) |
| `SourceState` | `id`, `number`, `name`, `enabled`, `gain` | `number` = posição na lista; `gain` em escala demonstrativa (`GAIN_LIMITS`) |
| `ZoneGroup` | `id`, `zoneIds` | O nome "Grupo N" é **derivado da posição** (`groupName`) e não é armazenado |

Estado de navegação (`State` em `AppState.tsx`): `openDeviceId`, `deviceView` (`control` | `settings`) e `controlTab` (`zona` | `source`). O accordion aberto e o rascunho de grupo são estado local de interface (não são dados de controle).

## Valores derivados (`src/state/selectors.ts`)
| Função | Regra |
|---|---|
| `effectiveVolume(zone)` | `enabled && !muted ? volume : 0`: o que a zona toca de fato |
| `sortZonesForDisplay(zones)` | Favoritas primeiro e, em cada grupo, pela numeração. Não altera o estado, só a ordem de exibição (cards com `key = zone.id`) |
| `selectableSources(sources)` | Sources habilitadas, oferecidas para novas seleções |

## Regras de consistência (aplicadas no reducer)
| Regra | Onde |
|---|---|
| Quantidade de zonas e limite de grupos vêm do modelo | `MODEL_ZONES`, `MODEL_GROUP_LIMIT` em `src/config/audioLimits.ts` |
| Cada equipamento tem zonas, Sources e grupos próprios | `createAddedDevice` cria cópias novas por equipamento |
| Equipamento não é adicionado duas vezes | `addDevice` ignora id repetido |
| Zona desabilitada ignora Source, volume, mute, EQ e memorizar | `updateEnabledZone` |
| Favoritar e habilitar funcionam com a zona desabilitada | `toggleZoneFavorite`, `setZoneEnabled` |
| Só Source habilitada pode ser selecionada | `setZoneSource` |
| Desabilitar Source **não** altera as zonas que a usam | `setSourceEnabled` (hipótese, ver `decisions.md`) |
| Nome de Source: sem espaços nas pontas, não vazio, até `SOURCE_NAME_MAX` | `renameSource` |
| Volume 0–100 e ganho dentro de `GAIN_LIMITS` | `clamp` no reducer |
| Grupos: limite do modelo, mínimo 2 zonas, zona em um só grupo | `addGroup` e `setGroupZone` usando `src/state/groupRules.ts` |

## Regras de grupos (`src/state/groupRules.ts`)
Funções puras, usadas pelo reducer (para aplicar) e pela interface (para explicar):

| Função | Retorna |
|---|---|
| `groupLimit(model)` | 2 (SMA4) ou 3 (SMA6) |
| `canAddGroup(model, groups)` | Se ainda cabe um grupo |
| `zoneOwner(groups, zoneId)` | Grupo que contém a zona |
| `isZoneBlockedFor(groups, groupId, zoneId)` | Zona está em **outro** grupo |
| `canSaveDraft(zoneIds)` | Rascunho tem ≥ `GROUP_MIN_ZONES` (2) |
| `canUncheck(group, zoneId)` | Desmarcar não deixa o grupo com < 2 |
| `canCreateGroup(model, groups, zoneIds, validZoneIds)` | Todas as regras juntas para criar |
| `groupName(groups, id)` | "Grupo N" pela posição |
