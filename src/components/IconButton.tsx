import type { ButtonHTMLAttributes, Ref } from 'react';
import './IconButton.css';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** SVG do Figma (src/assets/icons). */
  icon: string;
  /** Rótulo acessível obrigatório: o botão não tem texto visível. */
  label: string;
  iconSize: number;
  /** Para botões de alternância (favorito, mute): aria-pressed. */
  pressed?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

/** Botão só com ícone do DS, com área de toque de 44px (mesmo padrão do voltar da barra de título). */
export function IconButton({ icon, label, iconSize, pressed, className = '', type = 'button', ref, ...rest }: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={`icon-btn ${className}`.trim()}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      {...rest}
    >
      <img src={icon} width={iconSize} height={iconSize} alt="" />
    </button>
  );
}
