import speakerIcon from '../assets/icons/alto-falante-19px.svg';
import speakerMutedIcon from '../assets/icons/alto-falante-mudo-19px.svg';
import starOff from '../assets/icons/estrela-favorito-off-28px.svg';
import starOn from '../assets/icons/estrela-favorito-on-28px.svg';
import { VOLUME_LIMITS } from '../config/audioLimits';
import { effectiveVolume } from '../state/selectors';
import type { EqualizerBand, SourceState, ZoneState } from '../types';
import { Accordion } from './Accordion';
import { EqualizerPanel } from './EqualizerPanel';
import { IconButton } from './IconButton';
import { Slider } from './Slider';
import { SourceSelect } from './SourceSelect';
import { Toggle } from './Toggle';
import './ZoneCard.css';

interface ZoneCardProps {
  zone: ZoneState;
  sources: SourceState[];
  onEnabledChange: (enabled: boolean) => void;
  onFavoriteToggle: () => void;
  onSourceChange: (sourceId: string) => void;
  onVolumeChange: (volume: number) => void;
  onMutedChange: (muted: boolean) => void;
  onEqualizerChange: (band: EqualizerBand, value: number) => void;
  onEqualizerReset: () => void;
  onRememberLastVolumeChange: (value: boolean) => void;
}

/**
 * Card de zona. Ordem: identificação (nome, favorito, volume atual) → Source → volume + mute →
 * Configurações avançadas (accordion) → habilitar/desabilitar no rodapé.
 * Desabilitada: card acinzentado, 0 % e mudo; Source, volume, mute e avançados bloqueados.
 * Favoritar e reabilitar continuam disponíveis.
 */
export function ZoneCard({
  zone,
  sources,
  onEnabledChange,
  onFavoriteToggle,
  onSourceChange,
  onVolumeChange,
  onMutedChange,
  onEqualizerChange,
  onEqualizerReset,
  onRememberLastVolumeChange,
}: ZoneCardProps) {
  const sliderId = `slider-${zone.id}`;
  const nameId = `nome-${zone.id}`;
  const disabledMsgId = `aviso-${zone.id}`;
  const sourceMsgId = `aviso-source-${zone.id}`;
  const rememberId = `memorizar-${zone.id}`;

  const silent = !zone.enabled || zone.muted;
  const shownVolume = zone.enabled ? zone.volume : effectiveVolume(zone);
  const currentSource = sources.find((s) => s.id === zone.sourceId);
  const sourceUnavailable = zone.enabled && currentSource !== undefined && !currentSource.enabled;

  return (
    <article
      className={`zone-card${zone.enabled ? '' : ' zone-card--disabled'}${zone.muted && zone.enabled ? ' zone-card--muted' : ''}`}
      aria-labelledby={nameId}
    >
      <div className="zone-card__header">
        <h3 id={nameId} className="zone-card__name">
          {zone.name}
        </h3>
        <IconButton
          icon={zone.favorite ? starOn : starOff}
          iconSize={28}
          label={zone.favorite ? `Remover ${zone.name} dos favoritos` : `Favoritar ${zone.name}`}
          pressed={zone.favorite}
          onClick={onFavoriteToggle}
          className="zone-card__favorite"
        />
        <output className="zone-card__value" htmlFor={sliderId} aria-live="off">
          {zone.enabled && zone.muted ? (
            'Mudo'
          ) : (
            <>
              {shownVolume}
              <span className="zone-card__unit">%</span>
            </>
          )}
        </output>
      </div>

      <SourceSelect
        id={`source-${zone.id}`}
        label={`Source da ${zone.name}`}
        sources={sources}
        value={zone.sourceId}
        onChange={onSourceChange}
        disabled={!zone.enabled}
        describedBy={!zone.enabled ? disabledMsgId : sourceUnavailable ? sourceMsgId : undefined}
      />
      {sourceUnavailable && (
        <p id={sourceMsgId} className="zone-card__warning" role="status">
          {currentSource.name} está desabilitada. Selecione outra Source.
        </p>
      )}

      <div className="zone-card__volume">
        <Slider
          id={sliderId}
          value={zone.enabled ? zone.volume : 0}
          min={VOLUME_LIMITS.min}
          max={VOLUME_LIMITS.max}
          step={VOLUME_LIMITS.step}
          onChange={onVolumeChange}
          label={`Volume da ${zone.name}`}
          valueText={
            !zone.enabled ? 'mudo, zona desabilitada' : zone.muted ? `${zone.volume} por cento, mudo` : `${zone.volume} por cento`
          }
          disabled={!zone.enabled}
          describedBy={zone.enabled ? undefined : disabledMsgId}
        />
        <IconButton
          icon={silent ? speakerMutedIcon : speakerIcon}
          iconSize={19}
          label={zone.muted ? `Ativar som da ${zone.name}` : `Silenciar ${zone.name}`}
          pressed={zone.muted}
          disabled={!zone.enabled}
          aria-describedby={zone.enabled ? undefined : disabledMsgId}
          onClick={() => onMutedChange(!zone.muted)}
          className="zone-card__mute"
        />
      </div>

      {!zone.enabled && (
        <p id={disabledMsgId} className="zone-card__hint" role="status">
          Zona mutada: ative a zona para ajustar Source, volume e configurações.
        </p>
      )}

      <div className="zone-card__advanced">
        <Accordion title="Configurações avançadas" context={`da ${zone.name}`}>
          <div className="zone-card__advanced-body">
            <EqualizerPanel
              idPrefix={zone.id}
              context={zone.name}
              equalizer={zone.equalizer}
              disabled={!zone.enabled}
              describedBy={disabledMsgId}
              onChange={onEqualizerChange}
              onReset={onEqualizerReset}
            />
            <div className="zone-card__setting">
              <span id={rememberId}>Memorizar último volume</span>
              <Toggle
                checked={zone.rememberLastVolume}
                onChange={onRememberLastVolumeChange}
                labelledBy={rememberId}
                disabled={!zone.enabled}
              />
            </div>
          </div>
        </Accordion>
      </div>

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
