import searchIcon from '../assets/icons/buscando-24px.svg';
import refreshIcon from '../assets/icons/atualizar-wifi-24px.svg';
import type { ScanStatus as Status } from '../types';
import './ScanStatus.css';

interface ScanStatusProps {
  status: Status;
  found: number;
  onRescan: () => void;
}

/**
 * Linha de status da busca, baseada em app_procurando_dispositivos_bluetooth
 * ("Procurando dispositivos..." + ícone animado) e no ícone app_ícone_atualizar-wifi-24px.
 */
export function ScanStatusRow({ status, found, onRescan }: ScanStatusProps) {
  if (status === 'scanning') {
    return (
      <div className="scan-status" role="status">
        <span className="scan-status__text">Procurando equipamentos…</span>
        <img className="scan-status__icon scan-status__icon--spin" src={searchIcon} width={18} height={18} alt="" />
      </div>
    );
  }
  return (
    <div className="scan-status">
      <span className="scan-status__text" role="status">
        {found > 0 ? `Busca concluída · ${found} ${found === 1 ? 'equipamento' : 'equipamentos'}` : 'Busca concluída'}
      </span>
      <button type="button" className="scan-status__action" onClick={onRescan}>
        <img src={refreshIcon} width={24} height={24} alt="" />
        <span>Procurar novamente</span>
      </button>
    </div>
  );
}
