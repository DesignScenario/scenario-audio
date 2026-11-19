import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import editIcon from '../assets/icons/editar-22px.svg';
import { GAIN_LIMITS, SOURCE_NAME_MAX } from '../config/audioLimits';
import type { SourceState } from '../types';
import { Accordion } from './Accordion';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import './SourceCard.css';

interface SourceCardProps {
  source: SourceState;
  /** Quantas zonas usam esta Source (para avisar ao desabilitar). */
  zonesUsing: number;
  onEnabledChange: (enabled: boolean) => void;
  onRename: (name: string) => void;
  onGainChange: (gain: number) => void;
}

function formatGain(value: number): string {
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}

/** Card de Source: número, nome (renomeável), habilitar/desabilitar e Ganho no accordion. */
export function SourceCard({ source, zonesUsing, onEnabledChange, onRename, onGainChange }: SourceCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(source.name);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const nameId = `source-nome-${source.id}`;
  const inputId = `source-campo-${source.id}`;
  const errorId = `source-erro-${source.id}`;
  const gainId = `source-ganho-${source.id}`;
  const trimmed = draft.trim();
  const invalid = trimmed.length === 0;

  const startEditing = () => {
    setDraft(source.name);
    setEditing(true);
  };

  const finish = () => {
    setEditing(false);
    // Devolve o foco ao botão de editar, que volta a existir depois da renderização.
    window.requestAnimationFrame(() => editButtonRef.current?.focus());
  };

  const save = (e?: FormEvent) => {
    e?.preventDefault();
    if (invalid) return;
    onRename(trimmed);
    finish();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      finish();
    }
  };

  return (
    <article className={`source-card${source.enabled ? '' : ' source-card--disabled'}`} aria-labelledby={nameId}>
      <div className="source-card__header">
        <span className="source-card__number" aria-hidden="true">
          {source.number}
        </span>

        {editing ? (
          <form className="source-card__form" onSubmit={save}>
            <label htmlFor={inputId} className="visually-hidden">
              Novo nome da Source {source.number}
            </label>
            <input
              id={inputId}
              className="source-card__input"
              value={draft}
              maxLength={SOURCE_NAME_MAX}
              autoFocus
              aria-invalid={invalid || undefined}
              aria-describedby={errorId}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <p id={errorId} className={`source-card__field-hint${invalid ? ' source-card__field-hint--error' : ''}`}>
              {invalid ? 'O nome não pode ficar vazio.' : `${draft.length}/${SOURCE_NAME_MAX} caracteres`}
            </p>
            <div className="source-card__form-actions">
              <Button type="button" onClick={finish}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={invalid}>
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <h3 id={nameId} className="source-card__name">
              <span className="visually-hidden">Source {source.number}: </span>
              {source.name}
            </h3>
            <IconButton
              ref={editButtonRef}
              icon={editIcon}
              iconSize={22}
              label={`Renomear ${source.name}`}
              onClick={startEditing}
            />
          </>
        )}
      </div>

      <div className="source-card__status-row">
        <span className={`source-card__status${source.enabled ? '' : ' source-card__status--off'}`}>
          {source.enabled ? 'Habilitada' : 'Desabilitada'}
          {!source.enabled && zonesUsing > 0 && (
            <span className="source-card__usage">
              {' '}
              · ainda selecionada em {zonesUsing} {zonesUsing === 1 ? 'zona' : 'zonas'}
            </span>
          )}
        </span>
        <Toggle
          checked={source.enabled}
          onChange={onEnabledChange}
          label={source.enabled ? `Desabilitar ${source.name}` : `Habilitar ${source.name}`}
        />
      </div>

      <div className="source-card__advanced">
        <Accordion title="Configurações avançadas" context={`da ${source.name}`}>
          <div className="source-card__gain">
            <div className="source-card__gain-row">
              <label htmlFor={gainId}>Ganho</label>
              <output htmlFor={gainId} className={`source-card__gain-value${source.gain === 0 ? ' source-card__gain-value--neutral' : ''}`}>
                {formatGain(source.gain)}
              </output>
            </div>
            <Slider
              id={gainId}
              mode="bipolar"
              value={source.gain}
              min={GAIN_LIMITS.min}
              max={GAIN_LIMITS.max}
              step={GAIN_LIMITS.step}
              onChange={onGainChange}
              label={`Ganho da ${source.name}`}
              valueText={String(source.gain)}
            />
            <div className="source-card__scale" aria-hidden="true">
              <span>−{Math.abs(GAIN_LIMITS.min)}</span>
              <span>0</span>
              <span>+{GAIN_LIMITS.max}</span>
            </div>
            <p className="source-card__note">Escala de ganho demonstrativa, sem unidade oficial.</p>
          </div>
        </Accordion>
      </div>
    </article>
  );
}
