# Decisões, hipóteses e pontos em aberto

Status: **confirmado** (veio do briefing ou da equipe) · **provisório** (escolha do protótipo, fácil de mudar) · **validar** (depende de produto/técnica).

## Áudio e zonas
| # | Decisão / hipótese | Justificativa | Status |
|---|---|---|---|
| 1 | Faixa de **grave/médio/agudo** de **−7 a +7 dB**, passo 1 | Definido pela equipe em 19/11/2026. Em `src/config/audioLimits.ts` | **confirmado** (passo 1: provisório) |
| 2 | Faixa de **balanço** de −10 (E) a +10 (D), passo 1, sem unidade | Não foi definida; exibida como "E n / Centro / D n" e marcada como demonstrativa na tela | **validar** (equipe técnica) |
| 3 | Volume de 0 a 100 %, passo 1 | Briefing | confirmado (passo: provisório) |
| 4 | Equalização **por zona** | Equipe (19/11/2026) e briefing. Estado em `ZoneState.equalizer` | **confirmado** |
| 5 | Volumes iniciais 65/40/80/25/55/70 % | Mostrar estados independentes | provisório |
| 6 | **Mute** é um botão próprio (ícone de alto-falante) que preserva o volume; o slider continua mostrando o valor, esmaecido, e o % mostra "Mudo" | Briefing; o ícone `volume=ativo/mute` já existe no Figma | confirmado (visual: provisório) |
| 7 | **Desabilitar** a zona acinzenta o card, mostra **0 %**, ícone mudo e bloqueia Source, volume, mute e avançados; ao reabilitar, tudo volta como estava, **inclusive o mute anterior** | Equipe (19/11/2026) + escolha do usuário ao combinar com o mute do briefing | **confirmado** |
| 8 | Favoritar e reabilitar continuam disponíveis com a zona desabilitada | Não são controles operacionais; o briefing pede que reabilitar fique acessível | provisório |
| 9 | Avançados da zona em **accordion** dentro do card (EQ + Memorizar último volume), fechado por padrão | Briefing + escolha do usuário (substitui a tela "Zona N · Equalização" e o botão Equalizar de 19/11/2026) | **confirmado** (fechado por padrão: provisório) |
| 10 | **Memorizar último volume**: só guarda a preferência por zona; não muda nenhum comportamento no protótipo | O briefing não descreve o efeito (ex.: ao religar o equipamento) | **validar** (produto) |
| 11 | **Favoritas** no topo, ordenadas pela numeração; ao desfavoritar, a zona volta à sua posição | Briefing | confirmado |
| 12 | Nome das zonas fixo ("Zona 1…N"), sem renomear | Não está no briefing | confirmado |

## Sources
| # | Decisão / hipótese | Justificativa | Status |
|---|---|---|---|
| 13 | **4 Sources** fictícias por equipamento ("Source 1…4"), em `src/data/mockDevices.ts`; a zona *n* começa na Source ((n−1) mod 4) + 1 | Quantidade e nomes oficiais não definidos; a lista é orientada a dados | **validar** (quantidade por modelo) |
| 14 | **Source desabilitada que já está em uso**: a zona mantém a associação, o select mostra "Nome (desabilitada)", contorno amarelo e aviso pedindo outra Source; a Source não aparece nas demais zonas; o card da Source avisa "ainda selecionada em N zonas" | Briefing pede não alterar silenciosamente | **validar** (UX) |
| 15 | Renomear inline (campo + Salvar/Cancelar, Enter/Esc), sem espaços nas pontas, sem nome vazio, **até 20 caracteres** (`SOURCE_NAME_MAX`) | Briefing pede limite razoável e configurável | provisório (limite) |
| 16 | **Ganho** de −10 a +10, passo 1, **sem unidade** (`GAIN_LIMITS`) | Faixa e unidade não informadas | **validar** (equipe técnica) |

## Grupos e configurações
| # | Decisão / hipótese | Justificativa | Status |
|---|---|---|---|
| 17 | Limite de grupos: **SMA4 = 2, SMA6 = 3**; mínimo **2 zonas**; zona em **um só grupo** | Briefing. Regras em `src/state/groupRules.ts`, aplicadas no reducer | confirmado |
| 18 | Criar grupo por **rascunho** (Adicionar → marcar → Salvar/Cancelar), um rascunho por vez | Permite aplicar a regra do mínimo antes de o grupo existir | provisório |
| 19 | Em grupo salvo, é possível **adicionar** zonas livres; não é possível ficar com menos de 2 (é preciso excluir o grupo) | Briefing (remoção); adicionar é hipótese | provisório |
| 20 | Nome "Grupo N" pela **posição**: ao excluir, os seguintes são renumerados | Nomes automáticos, sem renomear (briefing) | provisório |
| 21 | "Adicionar grupo" também fica desabilitado quando há menos de 2 zonas livres | Evita criar um rascunho impossível de salvar | provisório |
| 22 | Configurações de rede e Informações do dispositivo: linhas esmaecidas "Em breve", sem link | Briefing proíbe tela ou fluxo | confirmado |
| 23 | Configurações em tela própria (engrenagem → tela; ← volta para a mesma aba) | Mesmo padrão de navegação das demais telas | provisório |

## Descoberta, dados e visual
| # | Decisão / hipótese | Justificativa | Status |
|---|---|---|---|
| 24 | Varredura simulada: 1 SMA6 + 2 SMA4, revelados um a um, ~2,8 s | Demonstra loading e os dois modelos | provisório |
| 25 | MACs fictícios `02:DE:40:…` e IPs `192.0.2.x` (faixa de documentação RFC 5737) | Não podem ser confundidos com equipamentos reais | provisório |
| 26 | Toggle "Simular rede sem equipamentos" em *Opções de demonstração* | Única forma de ver o estado vazio sem hardware | provisório (remover no app real) |
| 27 | Tela inicial com *Meus equipamentos* e *Encontrados na rede*; duas colunas no desktop | Deixa clara a diferença | provisório |
| 28 | Fonte **Figtree** em toda a interface | Equipe (19/11/2026) | **confirmado** |
| 29 | Miniatura de equipamento em CSS (placeholder) | Fotos do SMA4/SMA6 ainda indisponíveis | provisório (substituir) |
| 30 | Sem router e sem persistência após recarregar | Briefing pede estado só na sessão | provisório |
| 31 | Público: **usuário final (morador)** | Equipe (19/11/2026) | **confirmado** |
| 32 | Card/zona desabilitada com fundo `#262626` (`semântica/keypads/secundária/cinza`) | O Figma não tem estado de card desabilitado | provisório |
| 33 | Select de Source **nativo** estilizado como `app/item-de-lista/menu-suspenso` | Acessível e com a lista do sistema no celular; o Figma mostra a lista aberta em accordion | provisório |
| 34 | Mute esmaece o slider com opacidade 0,45 (`--opacidade-mudo`) | Não há estado "mudo" de slider no Figma | provisório |
