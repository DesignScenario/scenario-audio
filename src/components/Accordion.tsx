import { useId, useState, type ReactNode } from 'react';
import chevronIcon from '../assets/icons/menu-suspenso-24px.svg';
import './Accordion.css';

interface AccordionProps {
  title: string;
  /** Complemento do rótulo acessível, ex.: "da Zona 3". */
  context?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Baseado em app/item-de-lista/menu-suspenso-com-texto (Embrace Power): título SemiBold 16px,
 * chevron app/ícone/menu-suspenso-24px e conteúdo 16px abaixo.
 * Aberto/fechado é estado de interface (local); os valores ficam no reducer.
 */
export function Accordion({ title, context, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={`accordion${open ? ' accordion--open' : ''}`}>
      <button
        type="button"
        className="accordion__trigger"
        aria-expanded={open}
        aria-controls={contentId}
        aria-label={context ? `${title} ${context}` : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="accordion__title">{title}</span>
        <img className="accordion__chevron" src={chevronIcon} width={24} height={24} alt="" />
      </button>
      <div id={contentId} className="accordion__content" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
