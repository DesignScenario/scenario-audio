import { useEffect } from 'react';
import { DeviceControlPage } from './pages/DeviceControlPage';
import { DeviceSettingsPage } from './pages/DeviceSettingsPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { useAppState } from './state/AppState';

/**
 * Navegação por estado (sem router): descoberta → controle (abas Zona | Source) ↔ configurações.
 * O estado vive no AppStateProvider, então os valores se mantêm ao trocar de tela.
 */
export default function App() {
  const { state } = useAppState();
  const device = state.added.find((d) => d.id === state.openDeviceId) ?? null;
  const view = device ? state.deviceView : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = device
      ? view === 'settings'
        ? `Configurações · ${device.model} · Scenario Audio`
        : `${device.model} · Scenario Audio`
      : 'Scenario Audio';
  }, [device?.id, view]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!device) return <DiscoveryPage />;
  if (view === 'settings') return <DeviceSettingsPage key={device.id} device={device} />;
  return <DeviceControlPage key={device.id} device={device} />;
}
