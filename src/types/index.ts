/** Modelos de equipamento multi-room comercializados pela Scenario Automation. */
export type DeviceModel = 'SMA4' | 'SMA6';

/** Equipamento como ele aparece na varredura (simulada) da rede local. */
export interface DiscoveredDevice {
  id: string;
  model: DeviceModel;
  /** MAC fictício, apenas para demonstração. */
  mac: string;
  /** IP fictício (faixa de documentação 192.0.2.0/24), apenas para demonstração. */
  ip: string;
}

/** Equalização de uma zona: grave, médio, agudo e balanço. */
export interface EqualizerState {
  bass: number;
  mid: number;
  treble: number;
  balance: number;
}

export type EqualizerBand = keyof EqualizerState;

export interface ZoneState {
  id: string;
  /** Numeração original (1…N); define a ordem dentro de favoritas e não favoritas. */
  number: number;
  /** Nome exibido, ex.: "Zona 1". */
  name: string;
  enabled: boolean;
  favorite: boolean;
  /**
   * Último volume definido pelo usuário (0–100). Mute e zona desabilitada não alteram este valor;
   * o volume que toca de fato vem de `effectiveVolume()` em state/selectors.ts.
   */
  volume: number;
  muted: boolean;
  /** Source selecionada. Pode apontar para uma Source desabilitada (ver docs/decisions.md). */
  sourceId: string;
  equalizer: EqualizerState;
  rememberLastVolume: boolean;
}

/** Fonte de áudio cadastrada no equipamento. */
export interface SourceState {
  id: string;
  /** Posição na lista (1…N). */
  number: number;
  name: string;
  enabled: boolean;
  /** Ganho em escala demonstrativa (ver GAIN_LIMITS). */
  gain: number;
}

/** Grupo de zonas. O nome ("Grupo N") é derivado da posição na lista. */
export interface ZoneGroup {
  id: string;
  zoneIds: string[];
}

/** Equipamento adicionado ao app, com o estado de controle simulado. */
export interface AddedDevice extends DiscoveredDevice {
  zones: ZoneState[];
  sources: SourceState[];
  groups: ZoneGroup[];
}

export type ScanStatus = 'idle' | 'scanning' | 'done';
export type DeviceView = 'control' | 'settings';
export type ControlTab = 'zona' | 'source';
