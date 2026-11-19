import './Toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Rótulo acessível; também pode ser associado via aria-labelledby. */
  label?: string;
  labelledBy?: string;
  id?: string;
  disabled?: boolean;
}

/** Baseado em app/toggle (Embrace Power): 36×22, desligado #353535 + bolinha branca; ligado amarelo + bolinha preta. */
export function Toggle({ checked, onChange, label, labelledBy, id, disabled }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      disabled={disabled}
      className={`toggle${checked ? ' toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" aria-hidden="true" />
    </button>
  );
}
