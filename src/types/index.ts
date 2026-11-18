/** Modelos de equipamento multi-room comercializados pela Scenario Automation. */
export type DeviceModel = 'SMA4' | 'SMA6';

/** Equipamento como ele aparece na varredura (simulada) da rede local. */
export interface DiscoveredDevice {
  id: string;
  model: DeviceModel;
  /** MAC fictício, apenas para demonstração. */
  mac: string;
}

export interface ZoneState {
  id: string;
  /** Nome exibido, ex.: "Zona 1". */
  name: string;
  /** Volume em porcentagem (0–100). */
  volume: number;
  enabled: boolean;
}

/**
 * Equalização do dispositivo. Pelo briefing, é um ajuste do equipamento inteiro
 * (não por zona). Se a especificação mudar, mova este objeto para dentro de ZoneState.
 */
export interface EqualizerState {
  bass: number;
  mid: number;
  treble: number;
  balance: number;
}

export type EqualizerBand = keyof EqualizerState;

/** Equipamento adicionado ao app, com o estado de controle simulado. */
export interface AddedDevice extends DiscoveredDevice {
  zones: ZoneState[];
  equalizer: EqualizerState;
}

export type ScanStatus = 'idle' | 'scanning' | 'done';
