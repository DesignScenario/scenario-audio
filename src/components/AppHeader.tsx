import type { ReactNode } from 'react';
import backIcon from '../assets/icons/voltar-28px.svg';
import './AppHeader.css';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  /** Ação opcional à direita (equivalente ao slot de ícone 28px do Figma). */
  trailing?: ReactNode;
}

/** Baseado em app/barra/barra-de-título (Embrace Power): título 22px + subtítulo em caixa alta. */
export function AppHeader({ title, subtitle, onBack, backLabel = 'Voltar', trailing }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__bar">
        {onBack && (
          <button type="button" className="app-header__icon-btn app-header__back" onClick={onBack} aria-label={backLabel}>
            <img src={backIcon} width={28} height={28} alt="" />
          </button>
        )}
        <div className="app-header__titles">
          <h1 className="app-header__title">{title}</h1>
          {subtitle && <p className="app-header__subtitle">{subtitle}</p>}
        </div>
        {trailing && <div className="app-header__trailing">{trailing}</div>}
      </div>
    </header>
  );
}
