# Product brief — Scenario Audio

## Contexto
A Scenario Automation vai comercializar dois equipamentos de áudio multi-room:

| Modelo | Zonas de áudio |
|---|---|
| **SMA6** | 6 |
| **SMA4** | 4 |

Um sistema multi-room distribui e gerencia áudio em vários cômodos de uma residência ou de um espaço comercial. Cada zona tem volume próprio, e o áudio pode tocar de forma independente ou integrada entre os ambientes.

O **Scenario Audio** é o app em que o usuário localiza, adiciona, configura e controla esses equipamentos. Ele faz parte do mesmo ecossistema do app **Embrace Power** e usa o Design System dele.

## Objetivos do app (briefing)
1. Localizar equipamentos SMA6 e SMA4 disponíveis na rede local.
2. Exibir os equipamentos encontrados para identificação e adição.
3. Permitir o acesso a cada equipamento adicionado.
4. Exibir as zonas e permitir o ajuste individual de volume.
5. Oferecer controle avançado para habilitar ou desabilitar zonas.
6. Permitir ajustar a equalização do dispositivo (grave, médio, agudo, balanço).

## Escopo deste protótipo
- Varredura **simulada**, com equipamentos fictícios (1 SMA6 e 2 SMA4).
- Adição de equipamentos com prevenção de duplicidade.
- Tela de controle com zonas (volume e habilitar/desabilitar) e equalização.
- Estado só em memória, durante a sessão do navegador.
- Interface web responsiva que simula a experiência de um app.

## Público / contexto de uso
O briefing não detalha o perfil do usuário (morador, integrador ou instalador). Ainda **precisa ser definido**.

## Fora do escopo nesta etapa
- Integração real com SMA4/SMA6, descoberta real na rede, protocolos e comandos de hardware.
- Backend, banco de dados, APIs.
- Autenticação, cadastro, contas de usuário.
- Atualização de firmware.
- App mobile nativo.
- Qualquer funcionalidade não citada no briefing (fontes de áudio, agrupamento de zonas, renomear zonas etc.).
- Valores técnicos oficiais (faixas de EQ/balanço): os do protótipo são demonstrativos.
