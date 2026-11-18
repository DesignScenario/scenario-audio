# QA checklist

**Última execução:** 18/11/2026. Script Playwright headless (Chromium 1234) contra `npm run dev`, 37 verificações automatizadas aprovadas + revisão visual das capturas em 1280, 1440, 820 e 375 px.
`[x]` = testado e aprovado · `[ ]` = pendente (motivo ao lado).

## Build
- [x] `npm run build` sem erros de TypeScript
- [x] `npm run lint` sem avisos

## Descoberta
- [x] Estado inicial mostra o botão **Procurar equipamentos**
- [x] Estado de busca mostra "Procurando equipamentos…" com animação
- [x] Varredura conclui com 3 equipamentos (1 SMA6, 2 SMA4)
- [x] Cards exibem miniatura, modelo, MAC e ação Adicionar
- [x] Estado sem equipamentos (opção de demonstração) exibe mensagem, dicas e Procurar novamente, sem repetir o título
- [x] Adicionar move o equipamento para *Meus equipamentos* e o botão vira **Adicionado** (desabilitado)
- [x] Procurar novamente não duplica os adicionados e os mantém marcados como Adicionado

## Controle — zonas
- [x] SMA6 exibe exatamente 6 zonas
- [x] SMA4 exibe exatamente 4 zonas
- [x] Volume muda por teclado (setas) e por valor direto; o % atualiza na hora
- [x] Alterar uma zona não altera as outras
- [x] Desabilitar zona: slider desabilitado, mensagem de bloqueio, resumo "5 ativas"
- [x] Reabilitar zona preserva o volume anterior
- [x] Card na tela inicial mostra "5 de 6 zonas ativas" depois de voltar

## Controle — equalização
- [x] 4 controles (Grave, Médio, Agudo, Balanço) iniciam no neutro/centro
- [x] Valores atualizam em tempo real (+4 dB, −3 dB, E 2)
- [x] Restaurar padrão fica desabilitado no neutro e zera os valores
- [x] EQ de cada equipamento é independente

## Navegação e persistência
- [x] Voltar retorna à tela de equipamentos
- [x] Volumes e EQ persistem ao sair e reabrir o equipamento (na sessão)

## Responsividade
- [x] 375 px: zonas em 1 coluna, sem rolagem horizontal
- [x] 820 px: zonas em 2 colunas, sem rolagem horizontal
- [x] 1440 px: SMA6 em 3 colunas (2×3)
- [x] 1280 px: descoberta em duas colunas (rede | meus equipamentos)

## Acessibilidade básica
- [x] Abas com `role="tab"` e navegação por setas
- [x] Sliders acessíveis por nome ("Volume da Zona 1", "Grave"…) e operáveis por teclado
- [x] Toggles com `role="switch"` e rótulo ("Desabilitar Zona 3")
- [x] Anel de foco visível (verificado no CSS; não fotografado)
- [ ] Teste com leitor de tela real (NVDA/VoiceOver): **pendente**, não disponível no ambiente automatizado
- [ ] Contraste medido com ferramenta: **pendente**. Texto secundário #A1A1A1 sobre #000 ≈ 8:1 (calculado, não medido na página)

## Console
- [x] Nenhum erro de console nem requisição com falha durante todo o fluxo

## Pendentes fora do ambiente
- [ ] Arraste com toque em dispositivo físico (iOS/Android): **pendente**
- [ ] Firefox e Safari: **pendente** (só o Chromium foi testado)
