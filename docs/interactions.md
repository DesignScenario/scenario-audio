# Interações — Scenario Audio (protótipo)

Legenda da coluna **Origem**: **B** = definido no briefing · **C** = confirmado pela equipe (19/11/2026) · **H** = hipótese do protótipo (ver `decisions.md`).

## 1. Navegação
| Ação | Resposta da interface | Origem |
|---|---|---|
| Abrir o app | Tela **Scenario Audio** com *Meus equipamentos* e *Encontrados na rede* | B (seções: H) |
| Clicar num card de *Meus equipamentos* | Abre a tela do equipamento na aba **Zona** | B |
| Alternar abas **Zona** \| **Source** | Troca o conteúdo sem perder valores. Setas ←/→, Home e End movem entre as abas | B (teclado: H) |
| Clicar na **engrenagem** (topo direito) | Abre **Configurações** do equipamento | B |
| ← em Configurações | Volta para a tela do equipamento **na mesma aba** em que estava | B (manter a aba: H) |
| ← na tela do equipamento | Volta para a lista de equipamentos | B |
| Abrir outro equipamento | Começa na aba Zona | H |
| Trocar de tela | Rola ao topo e muda o título da aba do navegador | H |

Navegação por estado (`openDeviceId`, `deviceView`, `controlTab`), sem URL própria. Recarregar a página reinicia tudo.

## 2. Descoberta (tela inicial)
| Estado | O que aparece | Origem |
|---|---|---|
| Inicial | Ícone de busca, "Encontre seus equipamentos" e botão primário **Procurar equipamentos** | B |
| Buscando | "Procurando equipamentos…" com lupa animada; shimmer até o 1º resultado; equipamentos aparecem **um a um** (~0,9 s e depois a cada ~0,65 s) | B (ritmo: H) |
| Com resultados | "Busca concluída · N equipamentos" + **Procurar novamente**; cards | B |
| Sem resultados | "Nenhum equipamento encontrado", 3 dicas e **Procurar novamente** (demonstrável em *Opções de demonstração*) | B (opção: H) |
| Com adicionados | Card em *Meus equipamentos* com modelo, MAC, IP e "X de Y zonas ativas"; botão da rede vira **Adicionado** (desabilitado) | B |

Card de equipamento encontrado: miniatura (placeholder), **modelo**, **MAC**, **IP**, número de zonas e **Adicionar**. Adicionar destaca o card novo por ~2,4 s e anuncia a adição a leitores de tela. O reducer ignora `addDevice` repetido. **B**

## 3. Aba Zona
- SMA4 = 4 cards, SMA6 = 6 cards (`MODEL_ZONES`). Resumo "ZONAS: N · X ATIVAS · Y FAVORITAS". **B**
- Grade: 1 coluna < 600 px; 2 colunas até 1023 px; SMA6 em 3 colunas a partir de 1024 px. Abrir o accordion de um card não estica os vizinhos.

Ordem dentro do card: **nome + estrela + valor** → **Source** → **volume + mute** → **Configurações avançadas** → **toggle de habilitar**.

### 3.1 Favoritar
| Ação | Resposta | Origem |
|---|---|---|
| Clicar na estrela (contorno) | Estrela amarela; a zona vai para o topo | B |
| Várias favoritas | Ordenadas pela numeração; depois as não favoritas, também pela numeração | B |
| Clicar na estrela amarela | A zona volta à posição da sua numeração | B |
| Favoritar zona desabilitada | Permitido (não é controle operacional) | H |

A reordenação só muda a ordem de exibição; o card é o mesmo (`key = zone.id`) e os valores ficam no reducer.

### 3.2 Source
| Ação | Resposta | Origem |
|---|---|---|
| Abrir o select | Lista só as Sources **habilitadas** do equipamento, com os nomes atuais | B |
| Source atual foi desabilitada | Continua selecionada, aparece como "Nome (desabilitada)", contorno amarelo e aviso "Nome está desabilitada. Selecione outra Source." | B (tratamento: H) |
| Escolher outra Source | O aviso some; a Source desabilitada deixa de aparecer na lista | B |

### 3.3 Volume e mute
| Ação | Resposta | Origem |
|---|---|---|
| Arrastar / setas / PgUp / PgDn / Home / End | Volume 0–100, valor em % atualizado na hora; cada zona é independente | B |
| Botão de alto-falante (mute) | Ícone vira `volume=mute`; o valor mostra "Mudo"; o slider **mantém** o volume configurado, esmaecido | B |
| Desfazer mute | Volta ao volume anterior | B |

### 3.4 Habilitar / desabilitar zona
| Ação | Resposta | Origem |
|---|---|---|
| Desligar "Zona ativa" | Card acinzentado (`#262626`), **0 %**, ícone mudo; Source, slider, mute, EQ e Memorizar **desabilitados**; aviso "Zona mutada: ative a zona…" ligado por `aria-describedby` | C |
| Religar | Tudo volta como estava: volume, mute, Source, EQ e Memorizar | C |
| Favoritar / reabilitar com a zona desabilitada | Continuam disponíveis | B |

### 3.5 Configurações avançadas (accordion)
| Item | Comportamento | Origem |
|---|---|---|
| Accordion | Fechado por padrão; título + chevron (`menu-suspenso-24px`), `aria-expanded` | B (padrão fechado: H) |
| Grave / Médio / Agudo | −7 a +7 dB, passo 1, início em 0. Exibe "+4 dB", "0 dB", "−3 dB" | C |
| Balanço | −10 (E) a +10 (D), início em Centro. Exibe "E 2", "Centro", "D 3" | B (faixa: H, demonstrativa) |
| Restaurar padrão | Zera a EQ **desta zona**; desabilitado quando já está no neutro | H |
| Memorizar último volume | Switch por zona; só guarda a preferência no protótipo | B (efeito: H) |

Sliders bipolares: o preenchimento amarelo vai do centro até o valor. O valor fica amarelo fora do neutro.

## 4. Aba Source
Lista numerada (1…N) de cards; 1 coluna < 600 px, 2 colunas acima. **B**

| Ação | Resposta | Origem |
|---|---|---|
| Toggle | "Habilitada" / "Desabilitada"; card acinzentado quando desabilitada. Se alguma zona ainda usa a Source: "· ainda selecionada em N zonas" | B (aviso: H) |
| Ícone editar | Campo inline com o nome atual, contador "n/20", **Cancelar** e **Salvar** | B |
| Nome vazio (ou só espaços) | Salvar desabilitado e aviso "O nome não pode ficar vazio." | B |
| Enter / Salvar | Salva o nome sem espaços nas pontas; atualiza na hora os selects da aba Zona | B |
| Esc / Cancelar | Descarta a edição; o foco volta ao ícone editar | H |
| Limite | 20 caracteres (`SOURCE_NAME_MAX`, configurável) | H |
| Accordion → Ganho | Slider bipolar −10…+10 sem unidade (demonstrativo); valor "+2", "0", "−3" | B (escala: H) |

## 5. Configurações
| Item | Comportamento | Origem |
|---|---|---|
| Grupos | Funcional (§5.1) | B |
| Configurações de rede | Linha esmaecida "Em breve", sem link, tela ou fluxo | B |
| Informações do dispositivo | Idem | B |

### 5.1 Grupos
| Ação | Resposta | Origem |
|---|---|---|
| **Adicionar grupo** | Cria um rascunho "Grupo N · NOVO" (borda tracejada amarela) com um checkbox por zona (1…4 ou 1…6) | B |
| Marcar < 2 zonas no rascunho | **Salvar grupo** desabilitado; aviso "Selecione pelo menos 2 zonas…" | B |
| Salvar | O grupo passa a valer; checkboxes dessa zona ficam bloqueados nos outros grupos | B |
| Cancelar | Descarta o rascunho | H |
| Zona de outro grupo | Checkbox bloqueado (opacidade 0,4) com o motivo "NO GRUPO X" | B |
| Desmarcar num grupo salvo com 2 zonas | Bloqueado, motivo "MÍNIMO 2"; texto do card explica que é preciso excluir o grupo | B |
| Marcar zona livre num grupo salvo | Permitido | H |
| **Excluir grupo** | Remove o grupo, libera as zonas e renumera os grupos seguintes | B (renumerar: H) |
| Limite atingido (SMA4 = 2, SMA6 = 3) | Botão desabilitado e "Limite de N grupos do MODELO atingido." | B |
| Menos de 2 zonas livres | Botão desabilitado e "Não há zonas livres suficientes…" | H |

Um rascunho por vez. Grupos de 1 coluna < 600 px, 2 até 1023 px e 3 acima.

## 6. Feedback, acessibilidade e responsividade
- Hover/active em botões, ícones, cards, toggles e selects; `:focus-visible` com anel amarelo de 2 px.
- Botões de ícone com área de 44 px e `aria-label`; favorito e mute com `aria-pressed`.
- Checkbox nativo com o desenho do Figma; motivo do bloqueio por `aria-describedby`.
- Anúncios em `aria-live` ao adicionar equipamento, criar e excluir grupo.
- Toque (`pointer: coarse`): thumb do slider de 20 px. Animações respeitam `prefers-reduced-motion`.
- Conteúdo limitado a 1120 px no desktop; sem escala proporcional da interface.
