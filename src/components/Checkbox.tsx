import checkOff from '../assets/icons/caixa-de-selecao-off-20px.svg';
import checkOn from '../assets/icons/caixa-de-selecao-on-20px.svg';
import './Checkbox.css';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Bloqueado (Figma: caixa-de-seleção-5, bloqueado=True): opacidade 0,4. */
  disabled?: boolean;
  /** Motivo do bloqueio, exibido e ligado por aria-describedby. */
  hint?: string;
}

/**
 * Checkbox nativo (teclado e leitores de tela) com o desenho de app/ícone/caixa-de-seleção-cheia-20px.
 * O texto fica ao lado da caixa, como em app/item-de-lista/caixa-de-seleção-5.
 */
export function Checkbox({ id, label, checked, onChange, disabled, hint }: CheckboxProps) {
  const hintId = hint ? `${id}-motivo` : undefined;
  return (
    <div className={`checkbox${disabled ? ' checkbox--disabled' : ''}`}>
      <input
        id={id}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        disabled={disabled}
        aria-describedby={hintId}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className="checkbox__label">
        <img className="checkbox__box" src={checked ? checkOn : checkOff} width={20} height={20} alt="" />
        <span>{label}</span>
      </label>
      {hint && (
        <span id={hintId} className="checkbox__hint">
          {hint}
        </span>
      )}
    </div>
  );
}
