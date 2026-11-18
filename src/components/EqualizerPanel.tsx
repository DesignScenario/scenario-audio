import { EQ_BANDS, type EqBandConfig } from '../config/audioLimits';
import type { EqualizerBand, EqualizerState } from '../types';
import { Button } from './Button';
import { Slider } from './Slider';
import './EqualizerPanel.css';

interface EqualizerPanelProps {
  equalizer: EqualizerState;
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

/** Equalização do dispositivo (não por zona, conforme o briefing). */
export function EqualizerPanel({ equalizer, onChange, onReset }: EqualizerPanelProps) {
  const isNeutral = EQ_BANDS.every((cfg) => equalizer[cfg.band] === cfg.neutral);

  return (
    <div className="eq-panel">
      <p className="eq-panel__intro">Ajuste aplicado a todas as zonas deste equipamento.</p>

      <ul className="eq-panel__list">
        {EQ_BANDS.map((cfg) => {
          const value = equalizer[cfg.band];
          const id = `eq-${cfg.band}`;
          const isBalance = cfg.band === 'balance';
          return (
            <li key={cfg.band} className={`eq-panel__band${isBalance ? ' eq-panel__band--balance' : ''}`}>
              <div className="eq-panel__row">
                <label htmlFor={id} className="eq-panel__label">
                  {cfg.label}
                </label>
                <output htmlFor={id} className={`eq-panel__value${value === cfg.neutral ? ' eq-panel__value--neutral' : ''}`}>
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
                label={cfg.label}
                valueText={spokenValue(cfg, value)}
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
                    <span>{cfg.min}</span>
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
        <Button onClick={onReset} disabled={isNeutral}>
          Restaurar padrão
        </Button>
        <p className="eq-panel__note">Faixas de ajuste demonstrativas — ainda não são as especificações do equipamento.</p>
      </div>
    </div>
  );
}
