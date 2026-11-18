import { useRef, type KeyboardEvent } from 'react';
import './Tabs.css';

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  idPrefix: string;
}

/**
 * Baseado em app/menu/abas (Embrace Power): abas de 40px, ativa #404040 Bold 15px,
 * inativa #262626 SemiBold 13px em cinza/250. Navegação por setas (padrão WAI-ARIA).
 */
export function Tabs<T extends string>({ items, value, onChange, label, idPrefix }: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (index + 1) % items.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(items[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            className={`tabs__tab${selected ? ' tabs__tab--active' : ''}`}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
