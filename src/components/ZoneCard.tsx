import speakerIcon from '../assets/icons/alto-falante-19px.svg';
import { VOLUME_LIMITS } from '../config/audioLimits';
import type { ZoneState } from '../types';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import './ZoneCard.css';

interface ZoneCardProps {
  zone: ZoneState;
  onVolumeChange: (volume: number) => void;
  onEnabledChange: (enabled: boolean) => void;
}

/**
 * Card de zona. Ação principal: volume (app/controle/volume = slider + alto-falante).
 * Ação avançada e secundária: habilitar/desabilitar a zona (app/toggle), no rodapé.
 */
export function ZoneCard({ zone, onVolumeChange, onEnabledChange }: ZoneCardProps) {
  const sliderId = `slider-${zone.id}`;
  const nameId = `nome-${zone.id}`;
  const disabledMsgId = `aviso-${zone.id}`;

  return (
    <article className={`zone-card${zone.enabled ? '' : ' zone-card--disabled'}`} aria-labelledby={nameId}>
      <div className="zone-card__header">
        <h3 id={nameId} className="zone-card__name">
          {zone.name}
        </h3>
        <output className="zone-card__value" htmlFor={sliderId} aria-live="off">
          {zone.volume}
          <span className="zone-card__unit">%</span>
        </output>
      </div>

      <div className="zone-card__volume">
        <Slider
          id={sliderId}
          value={zone.volume}
          min={VOLUME_LIMITS.min}
          max={VOLUME_LIMITS.max}
          step={VOLUME_LIMITS.step}
          onChange={onVolumeChange}
          label={`Volume da ${zone.name}`}
          valueText={`${zone.volume} por cento`}
          disabled={!zone.enabled}
          describedBy={zone.enabled ? undefined : disabledMsgId}
        />
        <img className="zone-card__speaker" src={speakerIcon} width={19} height={19} alt="" />
      </div>

      {!zone.enabled && (
        <p id={disabledMsgId} className="zone-card__hint" role="status">
          Volume bloqueado: ative a zona para ajustar.
        </p>
      )}

      <div className="zone-card__footer">
        <span className={`zone-card__status${zone.enabled ? '' : ' zone-card__status--off'}`}>
          {zone.enabled ? 'Zona ativa' : 'Zona desabilitada'}
        </span>
        <Toggle
          checked={zone.enabled}
          onChange={onEnabledChange}
          label={zone.enabled ? `Desabilitar ${zone.name}` : `Habilitar ${zone.name}`}
        />
      </div>
    </article>
  );
}
