import { DEFAULT_EQUALIZER, MODEL_ZONES } from '../config/audioLimits';
import type { AddedDevice, DiscoveredDevice, ZoneState } from '../types';

/**
 * Equipamentos fictícios "encontrados" na varredura simulada.
 * Os MACs usam o prefixo 02:DE:40 (bit "localmente administrado" ligado),
 * reservado aqui só para demonstração — não correspondem a equipamentos reais.
 */
export const MOCK_DISCOVERED_DEVICES: DiscoveredDevice[] = [
  { id: 'demo-sma6-a', model: 'SMA6', mac: '02:DE:40:00:6A:01' },
  { id: 'demo-sma4-a', model: 'SMA4', mac: '02:DE:40:00:4A:02' },
  { id: 'demo-sma4-b', model: 'SMA4', mac: '02:DE:40:00:4B:03' },
];

/** Volumes iniciais variados, para mostrar que cada zona tem estado próprio. */
const DEMO_VOLUMES = [65, 40, 80, 25, 55, 70];

export function createZones(count: number): ZoneState[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `zona-${index + 1}`,
    name: `Zona ${index + 1}`,
    volume: DEMO_VOLUMES[index % DEMO_VOLUMES.length],
    enabled: true,
  }));
}

export function createAddedDevice(device: DiscoveredDevice): AddedDevice {
  return {
    ...device,
    zones: createZones(MODEL_ZONES[device.model]),
    equalizer: { ...DEFAULT_EQUALIZER },
  };
}
