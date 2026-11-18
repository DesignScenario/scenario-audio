# Interações — Scenario Audio (protótipo)

Legenda da coluna **Origem**: **B** = definido no briefing · **H** = hipótese adotada no protótipo (ver `decisions.md`).

## 1. Navegação
| Ação | Resposta da interface | Origem |
|---|---|---|
| Abrir o app | Tela **Scenario Audio** com as seções *Encontrados na rede* e *Meus equipamentos* | B (seções: H) |
| Clicar num card em *Meus equipamentos* | Abre a tela de controle do equipamento | B |
| Clicar em ← (voltar) na tela de controle | Volta para a tela de equipamentos | B |
| Trocar de tela | A página volta ao topo e o título da aba do navegador muda | H |

Navegação por estado (`openDeviceId`), sem URL própria. Recarregar a página volta ao início (ver §6).

## 2. Descoberta (tela inicial)
| Estado | O que aparece | Origem |
|---|---|---|
| Inicial (antes da busca) | Ícone de busca, título "Encontre seus equipamentos", texto e botão primário **Procurar equipamentos** | B |
| Buscando | Linha "Procurando equipamentos…" com a lupa animada; placeholder em shimmer até o 1º resultado; os equipamentos aparecem **um a um** (~0,9 s e depois a cada ~0,65 s) | B (revelação progressiva: H, inspirada nas telas de busca Bluetooth do Embrace Power) |
| Com resultados | "Busca concluída · N equipamentos" + ação **Procurar novamente**; lista de cards | B |
| Sem resultados | "Nenhum equipamento encontrado", 3 dicas e botão **Procurar novamente** | B |
| Com adicionados | Cards em *Meus equipamentos* com modelo, MAC e "X de Y zonas ativas"; na lista da rede, o botão vira **Adicionado** (desabilitado) | B |

- O contador "ENCONTRADOS NA REDE: N" segue o padrão `app/subtítulo` do Figma.
- O **estado vazio** é demonstrável em *Opções de demonstração → Simular rede sem equipamentos* (recurso só do protótipo; H).
- Tempos e lista fictícia: `src/config/audioLimits.ts` (`SCAN_TIMING`) e `src/data/mockDevices.ts`.

### Card de equipamento encontrado
Miniatura 64 px (placeholder, ver design-system), **modelo**, **MAC**, número de zonas e o botão **Adicionar**.

### Adicionar e duplicidade
| Ação | Resposta | Origem |
|---|---|---|
| Clicar em **Adicionar** | O equipamento entra em *Meus equipamentos* com borda de destaque por ~2,4 s; o botão vira **Adicionado**; leitores de tela anunciam "SMA6 … adicionado" | B (destaque/anúncio: H) |
| Clicar de novo / procurar novamente | O botão continua **Adicionado** e desabilitado; o reducer ignora `addDevice` de id repetido | B |

## 3. Tela de controle
- Cabeçalho: modelo (título) + "MAC …" (subtítulo em caixa alta) + voltar. **B**
- Abas **Zonas** | **Equalização** (`app/menu/abas`). Zonas abre por padrão. Setas ←/→, Home e End alternam as abas. **H**

### 3.1 Zonas
| Item | Comportamento | Origem |
|---|---|---|
| Quantidade | SMA4 = 4 cards, SMA6 = 6 cards, gerados por `MODEL_ZONES` | B |
| Card | Nome ("Zona N"), valor em % (22 px), slider de volume + ícone de alto-falante, rodapé com toggle | B |
| Volumes iniciais | 65, 40, 80, 25, 55, 70 % (em ordem) | B (valores: H) |
| Alterar volume | Arraste, clique ou teclado (setas ±1, PgUp/PgDn, Home/End); o valor e o preenchimento amarelo atualizam na hora | B |
| Independência | Cada zona tem estado próprio; alterar uma não afeta as outras | B |
| Resumo | "ZONAS: N · X ATIVAS" acima da grade | H |

### 3.2 Habilitar / desabilitar zona (avançado)
| Ação | Resposta | Origem |
|---|---|---|
| Desligar o toggle "Zona ativa" | Card com borda tracejada e fundo preto; nome e valor em cinza; slider `disabled` em cinza; aparece "Volume bloqueado: ative a zona para ajustar." (associada ao slider por `aria-describedby`); rodapé "Zona desabilitada" | B |
| Religar | O slider volta a funcionar **com o volume anterior preservado** | B (preservação: H) |

O toggle fica no rodapé do card, menor e com menos peso visual que o slider, para não competir com a ação principal. **H**

### 3.3 Equalização
| Controle | Faixa (demonstrativa) | Inicial | Exibição | Origem |
|---|---|---|---|---|
| Grave | −10 a +10, passo 1 | 0 | "+4 dB", "0 dB", "−3 dB" | B (faixa/unidade: H) |
| Médio | idem | 0 | idem | idem |
| Agudo | idem | 0 | idem | idem |
| Balanço | −10 (E) a +10 (D) | 0 | "E 2", "Centro", "D 3"; escala Esquerda / Centro / Direita | B (faixa: H) |

- Sliders bipolares: o preenchimento amarelo vai do centro (marca branca) até o valor.
- O valor fica amarelo quando sai do neutro e cinza no neutro.
- **Restaurar padrão** volta tudo a 0; fica desabilitado quando já está no neutro. **H**
- A equalização é **do equipamento** (todas as zonas). O texto do painel explica isso. **B**
- Nota fixa: "Faixas de ajuste demonstrativas — ainda não são as especificações do equipamento."

## 4. Responsividade
| Largura | Descoberta | Grade de zonas |
|---|---|---|
| < 600 px | Uma coluna: *Meus equipamentos* acima de *Encontrados na rede*; margem lateral 31 px (16 px abaixo de 380 px) | 1 coluna |
| 600–1023 px | Uma coluna | 2 colunas |
| ≥ 960 px | Duas colunas: rede à esquerda, adicionados à direita | — |
| ≥ 1024 px | — | SMA6 em 3 colunas (2×3); SMA4 em 2 colunas (2×2, máx. 840 px) |

Conteúdo limitado a 1120 px e centralizado no desktop. Não há escala proporcional da interface.

## 5. Feedback e estados
- Hover / active em botões, abas, cards e toggles; thumb do slider cresce no hover e no arraste.
- `:focus-visible` com anel amarelo de 2 px em todos os controles.
- Em telas de toque (`pointer: coarse`), o thumb passa a 20 px; slider e toggle têm área de toque maior que o desenho.
- Loading: lupa animada + shimmer. Animações respeitam `prefers-reduced-motion`.

## 6. Persistência
Estado em memória (`AppStateProvider`): equipamentos adicionados, volumes, zonas habilitadas e EQ **se mantêm ao navegar** entre as telas durante a sessão. Recarregar a página reinicia tudo (H; não há armazenamento local).
