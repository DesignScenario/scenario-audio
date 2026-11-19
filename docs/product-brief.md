# Product brief — Scenario Audio

## Contexto
A Scenario Automation vai comercializar dois equipamentos de áudio multi-room:

| Modelo | Zonas de áudio | Grupos de zonas (máx.) |
|---|---|---|
| **SMA6** | 6 | 3 |
| **SMA4** | 4 | 2 |

Um sistema multi-room distribui e gerencia áudio em vários cômodos de uma residência ou de um espaço comercial. Cada zona tem volume próprio e pode usar fontes de áudio (Sources) diferentes.

O **Scenario Audio** é o app em que o usuário localiza, adiciona, configura e controla esses equipamentos. Ele faz parte do mesmo ecossistema do app **Embrace Power** e usa o Design System dele.

## Funcionalidades deste protótipo (briefing)
1. Procurar equipamentos na rede local (varredura **simulada**).
2. Exibir os encontrados com imagem, modelo, MAC, IP e número de zonas.
3. Adicionar equipamentos (sem duplicar) e acessar cada um.
4. Controlar as zonas individualmente.
5. Habilitar, desabilitar e favoritar zonas (favoritas no topo).
6. Selecionar uma Source por zona.
7. Ajustar volume e mute de cada zona.
8. Configurações avançadas por zona: grave, médio, agudo, balanço e *Memorizar último volume*.
9. Gerenciar as Sources: habilitar, renomear e ajustar ganho.
10. Criar e excluir grupos de zonas, respeitando as regras de cada modelo.

Estrutura: lista de equipamentos → tela do equipamento (abas **Zona** | **Source**, engrenagem no topo direito) → **Configurações** (Grupos funcional; Rede e Informações apenas listadas).

## Público
**Usuário final, morador** (definido em 19/11/2026). A linguagem e o nível de detalhe técnico das telas devem ser pensados para ele.

## Fora do escopo nesta etapa
- Integração real com SMA4/SMA6, descoberta real na rede, protocolos e comandos de hardware.
- Backend, banco de dados, APIs, autenticação.
- Telas ou fluxos de **Configurações de rede** e **Informações do dispositivo**.
- Atualização de firmware; app mobile nativo.
- Renomear zonas ou grupos.
- Persistência além da sessão do navegador.
- Valores técnicos oficiais ainda não definidos: balanço e ganho são demonstrativos (grave/médio/agudo já usam −7 a +7 dB).
