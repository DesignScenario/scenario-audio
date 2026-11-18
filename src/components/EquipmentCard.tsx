import { MODEL_ZONES } from '../config/audioLimits';
import type { DiscoveredDevice } from '../types';
import { Button } from './Button';
import { DeviceThumb } from './DeviceThumb';
import './EquipmentCard.css';

interface DiscoveredCardProps {
  device: DiscoveredDevice;
  isAdded: boolean;
  onAdd: () => void;
}

/** Baseado em app_item_dispositivo_encontrado (Embrace Power): imagem 64px, nome, MAC e botão médio. */
export function DiscoveredEquipmentCard({ device, isAdded, onAdd }: DiscoveredCardProps) {
  return (
    <article className="equipment-card" aria-label={`${device.model}, MAC ${device.mac}`}>
      <div className="equipment-card__info">
        <DeviceThumb model={device.model} />
        <div className="equipment-card__text">
          <h3 className="equipment-card__name">{device.model}</h3>
          <p className="equipment-card__meta">
            <span>MAC:</span> <span className="equipment-card__mac">{device.mac}</span>
          </p>
          <p className="equipment-card__meta">{MODEL_ZONES[device.model]} zonas de áudio</p>
        </div>
      </div>
      {isAdded ? (
        <Button fullWidth disabled aria-label={`${device.model} ${device.mac} já adicionado`}>
          Adicionado
        </Button>
      ) : (
        <Button fullWidth onClick={onAdd} aria-label={`Adicionar ${device.model} ${device.mac}`}>
          Adicionar
        </Button>
      )}
    </article>
  );
}

interface AddedCardProps {
  device: DiscoveredDevice;
  activeZones: number;
  totalZones: number;
  onOpen: () => void;
  highlight?: boolean;
}

/** Equipamento já adicionado: o card inteiro é um botão que abre a tela de controle. */
export function AddedEquipmentCard({ device, activeZones, totalZones, onOpen, highlight }: AddedCardProps) {
  return (
    <button
      type="button"
      className={`equipment-card equipment-card--added${highlight ? ' equipment-card--highlight' : ''}`}
      onClick={onOpen}
      aria-label={`Abrir controle do ${device.model}, MAC ${device.mac}`}
    >
      <div className="equipment-card__info">
        <DeviceThumb model={device.model} />
        <div className="equipment-card__text">
          <span className="equipment-card__name">{device.model}</span>
          <span className="equipment-card__meta">
            MAC: <span className="equipment-card__mac">{device.mac}</span>
          </span>
          <span className="equipment-card__meta">
            {activeZones} de {totalZones} zonas ativas
          </span>
        </div>
        <svg className="equipment-card__chevron" width="20" height="20" viewBox="0 0 28 28" aria-hidden="true">
          {/* Mesmo traço do app/ícone/voltar-28px, espelhado. */}
          <path d="M10 22L18 14L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    </button>
  );
}
