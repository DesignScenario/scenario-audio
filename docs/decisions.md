# Decisões, hipóteses e pontos em aberto

Status: **confirmado** (veio do briefing) · **provisório** (escolha do protótipo, fácil de mudar) · **validar** (depende de produto/técnica).

| # | Decisão / hipótese | Justificativa | Status |
|---|---|---|---|
| 1 | Faixa de **grave/médio/agudo** de −10 a +10, passo 1, exibida em "dB" | O briefing não traz as faixas oficiais; precisávamos de controles interativos. Centralizado em `src/config/audioLimits.ts` | **validar** (equipe técnica) |
| 2 | Faixa de **balanço** de −10 (E) a +10 (D), passo 1, sem unidade | Mesmo motivo; exibido como "E n / Centro / D n" | **validar** |
| 3 | Volume de 0 a 100 %, passo 1 | O briefing pede porcentagem | confirmado (passo: provisório) |
| 4 | Equalização **por equipamento**, não por zona | Informação disponível no briefing; o código isola o EQ em `AddedDevice.equalizer` | confirmado / **validar** se mudar |
| 5 | Volumes iniciais 65/40/80/25/55/70 % | Mostrar estados independentes | provisório |
| 6 | Desabilitar uma zona **preserva** o volume e só bloqueia o ajuste | Comportamento menos destrutivo; o briefing só pede "restaurar a possibilidade de ajustar" | **validar** (o hardware pode zerar/mutar) |
| 7 | Varredura simulada: 1 SMA6 + 2 SMA4, revelados um a um, ~2,8 s no total | Demonstra loading e os dois modelos; segue as telas de busca do Embrace Power | provisório |
| 8 | MACs fictícios com prefixo `02:DE:40` (localmente administrado) | Deixa claro que não são equipamentos reais | provisório |
| 9 | Toggle "Simular rede sem equipamentos" em *Opções de demonstração* | Única forma de ver o estado vazio sem hardware; rotulado como recurso do protótipo | provisório (remover no app real) |
| 10 | Tela inicial com duas seções (Encontrados na rede / Meus equipamentos); no desktop, em duas colunas | Deixa clara a diferença entre o que está na rede e o que já foi adicionado | provisório |
| 11 | Tela de controle com abas **Zonas** \| **Equalização** | Mantém o volume como ação principal e a EQ separada, sem poluir | provisório |
| 12 | Habilitar/desabilitar zona via toggle no rodapé de cada card | Controle avançado próximo da zona, mas com menos peso que o slider | provisório |
| 13 | Fonte **Figtree** (telas do Embrace Power) em vez de Montserrat (E-APP DS) | O briefing aponta o Embrace Power como referência | **validar** (design) |
| 14 | Miniatura de equipamento desenhada em CSS (placeholder) | O Figma não tem foto do SMA4/SMA6 | **validar** (fornecer asset) |
| 15 | Sem router e sem persistência após recarregar | Protótipo simples; o briefing pede persistência só durante a sessão | provisório |
| 16 | Card de equipamento mostra "N zonas de áudio" em vez de Firmware/IP/SSID | Firmware/IP/SSID estão fora do escopo; o número de zonas diferencia os modelos | provisório |
| 17 | Nome das zonas fixo ("Zona 1…N"), sem renomear | Renomear não está no briefing | confirmado |
