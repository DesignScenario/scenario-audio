import type { ReactNode } from 'react';
import './SectionLabel.css';

interface SectionLabelProps {
  id?: string;
  label: string;
  count?: number;
  trailing?: ReactNode;
  as?: 'h2' | 'h3';
}

/** Baseado em app/subtítulo: rótulo Bold 10px em caixa alta, contador e linha inferior cinza/300. */
export function SectionLabel({ id, label, count, trailing, as: Tag = 'h2' }: SectionLabelProps) {
  return (
    <div className="section-label">
      <Tag id={id} className="section-label__text">
        {label}
        {count !== undefined && <span className="section-label__count">: {count}</span>}
      </Tag>
      {trailing}
    </div>
  );
}
