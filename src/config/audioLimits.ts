import type { DeviceModel, EqualizerBand, EqualizerState } from '../types';

/**
 * ⚠️ VALORES DEMONSTRATIVOS — PRECISAM SER VALIDADOS COM A EQUIPE TÉCNICA.
 *
 * As faixas oficiais de ajuste do SMA4/SMA6 ainda não foram fornecidas.
 * Estes limites existem só para tornar os controles do protótipo interativos
 * e NÃO representam especificações do hardware. Ver docs/decisions.md.
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
  /** Unidade exibida ao lado do valor (demonstrativa). */
  unit: string;
}

export const EQ_BANDS: EqBandConfig[] = [
  { band: 'bass', label: 'Grave', min: -10, max: 10, step: 1, neutral: 0, unit: 'dB' },
  { band: 'mid', label: 'Médio', min: -10, max: 10, step: 1, neutral: 0, unit: 'dB' },
  { band: 'treble', label: 'Agudo', min: -10, max: 10, step: 1, neutral: 0, unit: 'dB' },
  { band: 'balance', label: 'Balanço', min: -10, max: 10, step: 1, neutral: 0, unit: '' },
];

export const DEFAULT_EQUALIZER: EqualizerState = {
  bass: 0,
  mid: 0,
  treble: 0,
  balance: 0,
};

/** Duração da varredura simulada e intervalo entre equipamentos "encontrados". */
export const SCAN_TIMING = { firstResultMs: 900, betweenResultsMs: 650, finishDelayMs: 700 } as const;
