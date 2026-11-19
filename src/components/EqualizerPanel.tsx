import { EQ_BANDS, type EqBandConfig } from '../config/audioLimits';
import type { EqualizerBand, EqualizerState } from '../types';
import { Button } from './Button';
import { Slider } from './Slider';
import './EqualizerPanel.css';

interface EqualizerPanelProps {
  /** Prefixo dos ids (único por zona), ex.: "zona-3". */
  idPrefix: string;
  /** Contexto para os rótulos acessíveis, ex.: "Zona 3" → "Grave da Zona 3". */
  context: string;
  equalizer: EqualizerState;
  /** Zona desabilitada: controles bloqueados, valores preservados. */
  disabled?: boolean;
  /** Id do aviso que explica o bloqueio. */
  describedBy?: string;
  onChange: (band: EqualizerBand, value: number) => void;
  onReset: () => void;
}

function formatValue(cfg: EqBandConfig, value: number): string {
  if (cfg.band === 'balance') {
    if (value === 0) return 'Centro';
    return value < 0 ? `E ${Math.abs(value)}` : `D ${value}`;
  }
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value)}${cfg.unit ? ` ${cfg.unit}` : ''}`;
}

function spokenValue(cfg: EqBandConfig, value: number): string {
  if (cfg.band === 'balance') {
    if (value === 0) return 'centro';
    return value < 0 ? `${Math.abs(value)} para a esquerda` : `${value} para a direita`;
  }
  return `${value} ${cfg.unit === 'dB' ? 'decibéis' : ''}`.trim();
}

const PROVISIONAL_LABELS = EQ_BANDS.filter((cfg) => cfg.provisional).map((cfg) => cfg.label.toLowerCase());

/** Equalização de uma zona (grave, médio, agudo e balanço), usada dentro do accordion do card. */
export function EqualizerPanel({
  idPrefix,
  context,
  equalizer,
  disabled = false,
  describedBy,
  onChange,
  onReset,
}: EqualizerPanelProps) {
  const isNeutral = EQ_BANDS.every((cfg) => equalizer[cfg.band] === cfg.neutral);

  return (
    <div className="eq-panel">
      <ul className="eq-panel__list">
        {EQ_BANDS.map((cfg) => {
          const value = equalizer[cfg.band];
          const id = `${idPrefix}-eq-${cfg.band}`;
          const isBalance = cfg.band === 'balance';
          return (
            <li key={cfg.band} className={`eq-panel__band${isBalance ? ' eq-panel__band--balance' : ''}`}>
              <div className="eq-panel__row">
                <label htmlFor={id} className="eq-panel__label">
                  {cfg.label}
                </label>
                <output
                  htmlFor={id}
                  className={`eq-panel__value${value === cfg.neutral || disabled ? ' eq-panel__value--neutral' : ''}`}
                >
                  {formatValue(cfg, value)}
                </output>
              </div>
              <Slider
                id={id}
                mode="bipolar"
                value={value}
                min={cfg.min}
                max={cfg.max}
                step={cfg.step}
                onChange={(v) => onChange(cfg.band, v)}
                label={`${cfg.label} da ${context}`}
                valueText={spokenValue(cfg, value)}
                disabled={disabled}
                describedBy={disabled ? describedBy : undefined}
              />
              <div className="eq-panel__scale" aria-hidden="true">
                {isBalance ? (
                  <>
                    <span>Esquerda</span>
                    <span>Centro</span>
                    <span>Direita</span>
                  </>
                ) : (
                  <>
                    <span>−{Math.abs(cfg.min)}</span>
                    <span>0</span>
                    <span>+{cfg.max}</span>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="eq-panel__footer">
        <Button onClick={onReset} disabled={isNeutral || disabled} aria-label={`Restaurar equalização padrão da ${context}`}>
          Restaurar padrão
        </Button>
        {PROVISIONAL_LABELS.length > 0 && (
          <p className="eq-panel__note">Faixa de {PROVISIONAL_LABELS.join(' e ')} demonstrativa.</p>
        )}
      </div>
    </div>
  );
}
