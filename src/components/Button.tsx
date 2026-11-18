import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = app/botão/grande-principal ativo (amarelo); outline = contorno branco. */
  variant?: 'primary' | 'outline';
  /** large = 50px (botão grande); medium = 32px (app/botão/médio). */
  size?: 'large' | 'medium';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'outline',
  size = 'medium',
  icon,
  fullWidth = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, fullWidth ? 'btn--full' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  );
}
