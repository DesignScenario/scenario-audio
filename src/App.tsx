import { useEffect } from 'react';
import { DeviceControlPage } from './pages/DeviceControlPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { useAppState } from './state/AppState';

/**
 * Navegação por estado (sem router): o protótipo tem só duas telas.
 * O estado vive no AppStateProvider, então os valores se mantêm ao trocar de tela.
 */
export default function App() {
  const { state } = useAppState();
  const device = state.added.find((d) => d.id === state.openDeviceId) ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = device ? `${device.model} · Scenario Audio` : 'Scenario Audio';
  }, [device?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return device ? <DeviceControlPage key={device.id} device={device} /> : <DiscoveryPage />;
}
