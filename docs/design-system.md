# Design System — referência visual

**Fonte:** Figma `hjBAF72Al9BTYAKXzFZfdJ` ("Embrace - Mobile"), acessado pelo MCP do Figma em 18/11/2026.
Páginas analisadas: **EMBRACE POWER** (`24880:123260`) e **E-APP – DESIGN SYSTEM** (`21525:204596`).
Telas de referência usadas: *Gerenciar dispositivos / Bluetooth* (seção GERENCIAMENTO `24881:176582`, frame `24881:176610`).

Legenda: **figma** = variável nomeada lida no Figma · **figma-raw** = valor lido de componente/tela sem variável · **adaptado** = derivado do Figma · **provisório** = criado para o protótipo.

## Cores
| Token CSS | Valor | Origem | Nome no Figma / uso |
|---|---|---|---|
| `--cinza-0` | #FFFFFF | figma | `cinza/0`: texto, contorno de botão |
| `--cinza-50` | #B7B7B7 | figma | `cinza/50`: rótulo do `app/subtítulo` |
| `--cinza-200` | #A5A5A5 | figma | `cinza/200`: subtítulo do topo, botão desabilitado |
| `--cinza-250` | #999999 | figma | `cinza/250`: trilho do slider, aba inativa |
| `--cinza-300` | #7D7D7D | figma | `cinza/300`: linha do `app/subtítulo` |
| `--cinza-1000` | #000000 | figma | `cinza/1000`: fundo |
| `--texto-secundario` | #A1A1A1 | figma-raw | MAC/Firmware no item de dispositivo |
| `--destaque-principal` | #FFCC33 | figma | `destaque/principal`: slider, botão ativo, toggle ligado |
| `--aba-ativa` | #404040 | figma | `semântica/keypads/primária/cinza` |
| `--aba-inativa` | #262626 | figma | `semântica/keypads/secundária/cinza` |
| `--toggle-off` | #353535 | figma-raw | fundo do `app/toggle` desligado |
| `--superficie-card` | #141414 | **provisório** | o tema escuro do Figma não tem superfície de card |
| `--borda-card` | #262626 | adaptado | reaproveita `secundária/cinza` como borda sutil |

## Tipografia
- **Figtree** SemiBold (600) / Bold (700): usada nas telas do Embrace Power. Carregada do Google Fonts.
  - Observação: o E-APP DS define `família/principal` = **Montserrat**. Seguimos o Embrace Power (Figtree), que é a referência pedida. **Confirmar com o design.**
- Tamanhos: `tamanho/5xs` 10 · `tamanho/2xs` 13 · `tamanho/Size 3` 14 · `tamanho/s` 15 · `tamanho/m` 16 · título da barra 22 (figma-raw) · `tamanho/4xl` 26.
- Rótulos de seção: Bold 10 px, caixa alta, `cinza/50`.

## Medidas
Margem de tela 31 px · barra de título 56 px · ícone voltar 28 px · `app/subtítulo` 25 px · botão médio 32 px · botão grande 50 px · aba 40 px · miniatura de dispositivo 64 px (raio 6) · raio de botão 4 px · gaps 4/12/16 no item de dispositivo.

## Componentes verificados e como foram usados
| Componente Figma (id) | Uso no Scenario Audio | Fidelidade |
|---|---|---|
| `app/barra/barra-de-título` (`28153:672163`) | `AppHeader` | Fiel; botão voltar com área de toque de 44 px |
| `app/ícone/voltar-28px` (`798:6050`) | `assets/icons/voltar-28px.svg` | Asset original |
| `app/subtítulo` (`35332:102194`) | `SectionLabel` | Fiel (sem os ícones de ordenar/filtrar) |
| `app_item_dispositivo_encontrado_1` | `DiscoveredEquipmentCard` | Fiel na estrutura; MAC + "N zonas" no lugar de Firmware/IP/SSID |
| `app/botão/médio` (`21546:239191`) | `Button size="medium"` (Adicionar) | Fiel |
| `app/botão/grande-principal` (`21546:234069`) | `Button size="large"` | Fiel: contorno, ativo amarelo, desabilitado cinza |
| `app_procurando_dispositivos_bluetooth` | `ScanStatusRow` | Adaptado: sem o ícone Bluetooth (não há Bluetooth no fluxo) |
| `app_ícone_atualizar-wifi-24px` (`27906:299611`) | Procurar novamente | Asset original |
| Lupa de `app/animação/buscando-24px` (`35513:76848`) | Ícone de busca / loading | Asset original; animação refeita em CSS |
| `app/slider/padrão` (`22303:606622`) | `Slider` | Fiel (trilho 3 px, thumb 13 px); adaptado com modo bipolar, área de toque de 32 px e thumb de 20 px em toque |
| `app/controle/volume` (`8524:109173`) | Linha de volume do `ZoneCard` | Fiel (slider + alto-falante 19 px, gap 11) |
| `app/ícone/alto-falante-19px` (`838:10592`) | `assets/icons/alto-falante-19px.svg` | Asset original |
| `app/toggle` (`17843:308172`) | `Toggle` | Fiel (36×22, cores e posições do Figma) |
| `app/menu/abas` (`26021:107549`) | `Tabs` | Fiel nas cores e tamanhos; fonte Figtree em vez de Montserrat |
| Brilho "Ellipse 69" das imagens de dispositivo | `assets/images/brilho-dispositivo.svg` | Asset original |

Também existe no Figma uma variante de volume por botões −/+ (`app/controle/volume`, tipo=botão) e ícones de sinal Wi-Fi (`e-power/status/wifi-24px`). Não foram usados nesta etapa.

## Imagens de produto: pendente
- O Figma **não tem imagem do SMA4 nem do SMA6**. O símbolo `e-power/imagens/dispositivos/padrão` (`20829:38084`) é um quadro transparente.
- Placeholder em uso (`DeviceThumb`): moldura preta com raio 6 + brilho original + silhueta neutra de amplificador com **um LED por zona** e o nome do modelo. **Substituir pela foto oficial assim que existir.**

## Itens a confirmar com o design
1. Figtree × Montserrat como fonte do Scenario Audio.
2. Cor de superfície para cards no tema escuro (`--superficie-card` é provisório).
3. Fotos oficiais do SMA4/SMA6.
4. Padrão visual de "zona desabilitada" (borda tracejada é uma proposta).
5. Componente de slider bipolar (EQ/balanço): não existe no DS.
