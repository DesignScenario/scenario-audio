import type { DeviceModel, EqualizerBand, EqualizerState } from '../types';

/**
 * Limites de ajuste do SMA4/SMA6. Ver docs/decisions.md.
 * - Grave, médio e agudo: −7 a +7 dB (CONFIRMADO pela equipe em 19/11/2026).
 * - Balanço: −10 a +10 ⚠️ DEMONSTRATIVO, ainda precisa ser validado com a equipe técnica.
 */

/** Quantidade de zonas por modelo (definida no briefing). */
export const MODEL_ZONES: Record<DeviceModel, number> = {
  SMA4: 4,
  SMA6: 6,
};

export const VOLUME_LIMITS = { min: 0, max: 100, step: 1 } as const;

export interface EqBandConfig {
  band: EqualizerBand;
  label: string;
  min: number;
  max: number;
  step: number;
  /** Posição neutra/central inicial. */
  neutral: number;
  /** Unidade exibida ao lado do valor. */
  unit: string;
  /** true enquanto a faixa não for confirmada pela equipe técnica. */
  provisional: boolean;
}

export const EQ_BANDS: EqBandConfig[] = [
  { band: 'bass', label: 'Grave', min: -7, max: 7, step: 1, neutral: 0, unit: 'dB', provisional: false },
  { band: 'mid', label: 'Médio', min: -7, max: 7, step: 1, neutral: 0, unit: 'dB', provisional: false },
  { band: 'treble', label: 'Agudo', min: -7, max: 7, step: 1, neutral: 0, unit: 'dB', provisional: false },
  { band: 'balance', label: 'Balanço', min: -10, max: 10, step: 1, neutral: 0, unit: '', provisional: true },
];

export const DEFAULT_EQUALIZER: EqualizerState = {
  bass: 0,
  mid: 0,
  treble: 0,
  balance: 0,
};

/** Duração da varredura simulada e intervalo entre equipamentos "encontrados". */
export const SCAN_TIMING = { firstResultMs: 900, betweenResultsMs: 650, finishDelayMs: 700 } as const;

/** Limite de grupos de zonas por modelo (definido no briefing). */
export const MODEL_GROUP_LIMIT: Record<DeviceModel, number> = {
  SMA4: 2,
  SMA6: 3,
};

/** Quantidade mínima de zonas em um grupo (definida no briefing). */
export const GROUP_MIN_ZONES = 2;

/**
 * ⚠️ Ganho da Source: escala DEMONSTRATIVA, sem unidade. A faixa e a unidade oficiais
 * ainda não foram informadas (ver docs/decisions.md).
 */
export const GAIN_LIMITS = { min: -10, max: 10, step: 1, neutral: 0 } as const;

/** Limite de caracteres do nome de uma Source (valor de demonstração, configurável). */
export const SOURCE_NAME_MAX = 20;
