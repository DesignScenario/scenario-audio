import type { CSSProperties } from 'react';
import './Slider.css';

interface SliderProps {
  id?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Texto acessível do controle. */
  label: string;
  /** Texto lido por leitores de tela para o valor atual (ex.: "45 por cento"). */
  valueText?: string;
  disabled?: boolean;
  /**
   * unipolar: preenche do mínimo até o valor (volume).
   * bipolar: preenche do centro até o valor (equalização e balanço).
   */
  mode?: 'unipolar' | 'bipolar';
  describedBy?: string;
}

/**
 * Baseado em app/slider/padrão (Embrace Power): trilho de 3px em cinza/250,
 * preenchimento e thumb de 13px em destaque/principal. Usa o input range nativo
 * (teclado, toque e leitores de tela funcionam sem código extra).
 */
export function Slider({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueText,
  disabled,
  mode = 'unipolar',
  describedBy,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const center = mode === 'bipolar' ? 50 : 0;
  const style = {
    '--fill-start': `${Math.min(center, pct)}%`,
    '--fill-end': `${Math.max(center, pct)}%`,
  } as CSSProperties;

  return (
    <div className={`slider slider--${mode}${disabled ? ' slider--disabled' : ''}`}>
      <input
        id={id}
        className="slider__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        aria-valuetext={valueText}
        aria-describedby={describedBy}
        onChange={(e) => onChange(Number(e.target.value))}
        style={style}
      />
      {mode === 'bipolar' && <span className="slider__center-mark" aria-hidden="true" />}
    </div>
  );
}
