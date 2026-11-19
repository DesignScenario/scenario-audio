# QA checklist

**Última execução:** 19/11/2026, depois do briefing completo (Source, favoritas, mute, grupos). Script Playwright headless (Chromium 1234) contra `npm run dev`: **86/86 verificações aprovadas**, com SMA6 e SMA4, + revisão visual das capturas em 1440, 820 e 375 px.
Itens marcados *(18/11)* não foram afetados pela mudança e vêm da execução anterior.
`[x]` = testado e aprovado · `[ ]` = pendente (motivo ao lado).

## Build
- [x] `npm run build` sem erros de TypeScript
- [x] `npm run lint` sem avisos

## Descoberta e navegação
- [x] Estado inicial, busca com animação, resultado com 1 SMA6 + 2 SMA4 *(18/11)*
- [x] Estado sem equipamentos (opção de demonstração) *(18/11)*
- [x] Cards mostram modelo, MAC, **IP** e zonas
- [x] Adicionar SMA6 e SMA4; o mesmo equipamento não duplica
- [x] Abrir equipamento → aba **Zona** inicial; abas Zona | Source alternam
- [x] Engrenagem abre Configurações; ← volta para a **mesma aba**
- [x] Valores mantidos depois de ir às Configurações e voltar (volume, Source escolhida, nome e estado da Source)
- [x] Outro equipamento abre na aba Zona e tem Sources independentes

## Zonas
- [x] SMA6 = 6 cards; SMA4 = 4 cards
- [x] Favoritar a Zona 4 → vai ao topo; volume ajustado antes (30) preservado
- [x] Duas favoritas ordenadas pela numeração (4, 6); desfavoritar volta à posição original
- [x] Favoritar funciona com a zona desabilitada
- [x] Mute: valor "Mudo", slider mantém 80, `aria-pressed`; desfazer volta a 80 %
- [x] Volume de uma zona não altera as outras
- [x] Desabilitar: 0 %; select, slider, mute, EQ e Memorizar desabilitados
- [x] Reabilitar mantém o mute anterior e o volume 80
- [x] Accordion fechado por padrão; `aria-expanded` alterna
- [x] Grave limitado a −7 / +7; balanço a +10
- [x] Memorizar último volume alterna e é independente por zona; EQ independente por zona
- [x] Select de Source começa na Source da zona e troca de Source

## Sources
- [x] 4 Sources numeradas 1–4
- [x] Renomear: só espaços → Salvar desabilitado + aviso; limite de 20 caracteres; Esc cancela; Enter salva
- [x] Nome novo aparece no select das zonas
- [x] Ganho muda (+2) e mostra o valor
- [x] Desabilitar Source em uso: card avisa "ainda selecionada em 2 zonas"
- [x] Zona que usa a Source desabilitada mantém a associação, mostra "(desabilitada)" e o aviso
- [x] Source desabilitada não aparece nas outras zonas; trocar para uma habilitada remove o aviso

## Grupos
- [x] SMA6: rascunho com 6 checkboxes; com 1 zona, Salvar desabilitado; 3 grupos → limite atingido
- [x] SMA4: 4 checkboxes; 2 grupos → "Limite de 2 grupos do SMA4 atingido"
- [x] Zona de outro grupo bloqueada, com motivo acessível ("No Grupo 1")
- [x] Com só 1 zona livre, "Adicionar grupo" fica desabilitado com explicação
- [x] Grupo salvo: desmarcar até 2 é permitido; abaixo de 2 bloqueado (motivo "Mínimo 2") e o estado não muda
- [x] Excluir grupo libera as zonas e renumera o restante
- [x] Configurações de rede e Informações do dispositivo sem link/botão

## Responsividade
- [x] 375 px e 820 px sem rolagem horizontal: zonas (accordion aberto), Sources e grupos
- [x] 1440 px: SMA6 em 3 colunas; Sources em 2; grupos em 3
- [x] Cabeçalho em 375 px quebra entre MAC e IP
- [x] 1280 px: descoberta em duas colunas *(18/11)*

## Acessibilidade básica
- [x] Abas com `role="tab"`, sliders/selects/checkboxes nativos com nome acessível ("Volume da Zona 4", "Grave da Zona 1", "Source da Zona 2")
- [x] Botões de ícone com nome acessível (Favoritar, Silenciar, Renomear, Configurações)
- [x] Anel de foco visível (verificado no CSS; não fotografado) *(18/11)*
- [ ] Teste com leitor de tela real (NVDA/VoiceOver): **pendente**, não disponível no ambiente automatizado
- [ ] Contraste medido com ferramenta: **pendente**. Atenção ao toggle desligado (#353535) sobre o card desabilitado (#262626)

## Console
- [x] Nenhum erro de console nem requisição com falha durante todo o fluxo

## Pendentes fora do ambiente
- [ ] Arraste com toque e select nativo em dispositivo físico (iOS/Android): **pendente**
- [ ] Firefox e Safari: **pendente** (só o Chromium foi testado)
