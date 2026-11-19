import type { SourceState } from '../types';
import './SourceSelect.css';

interface SourceSelectProps {
  id: string;
  /** Rótulo acessível completo, ex.: "Source da Zona 3". */
  label: string;
  sources: SourceState[];
  value: string;
  onChange: (sourceId: string) => void;
  disabled?: boolean;
  describedBy?: string;
}

/**
 * Select nativo (acessível por teclado e com a lista do sistema no celular), com o visual de
 * app/item-de-lista/menu-suspenso: fundo #1F1F1F, 46px, texto SemiBold 14px e chevron do DS.
 * Só Sources habilitadas são oferecidas. Se a Source atual estiver desabilitada, ela continua
 * visível como opção desabilitada, e o card mostra o aviso (hipótese em docs/decisions.md).
 */
export function SourceSelect({ id, label, sources, value, onChange, disabled, describedBy }: SourceSelectProps) {
  const current = sources.find((s) => s.id === value);
  const currentUnavailable = current !== undefined && !current.enabled;

  return (
    <div className={`source-select${currentUnavailable ? ' source-select--warning' : ''}`}>
      <span className="source-select__caption" aria-hidden="true">
        Source
      </span>
      <select
        id={id}
        className="source-select__input"
        aria-label={label}
        value={value}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={currentUnavailable || undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        {sources.map((s) =>
          s.enabled ? (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ) : s.id === value ? (
            <option key={s.id} value={s.id} disabled>
              {s.name} (desabilitada)
            </option>
          ) : null,
        )}
      </select>
    </div>
  );
}
