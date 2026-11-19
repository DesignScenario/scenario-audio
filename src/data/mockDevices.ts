import { DEFAULT_EQUALIZER, GAIN_LIMITS, MODEL_ZONES } from '../config/audioLimits';
import type { AddedDevice, DiscoveredDevice, SourceState, ZoneState } from '../types';

/**
 * Equipamentos fictícios "encontrados" na varredura simulada.
 * - MACs com prefixo 02:DE:40 (bit "localmente administrado" ligado), só para demonstração.
 * - IPs na faixa 192.0.2.0/24 (TEST-NET-1, RFC 5737), reservada para documentação.
 * Não correspondem a equipamentos reais.
 */
export const MOCK_DISCOVERED_DEVICES: DiscoveredDevice[] = [
  { id: 'demo-sma6-a', model: 'SMA6', mac: '02:DE:40:00:6A:01', ip: '192.0.2.21' },
  { id: 'demo-sma4-a', model: 'SMA4', mac: '02:DE:40:00:4A:02', ip: '192.0.2.34' },
  { id: 'demo-sma4-b', model: 'SMA4', mac: '02:DE:40:00:4B:03', ip: '192.0.2.35' },
];

/**
 * Sources fictícias de cada equipamento. A quantidade e os nomes oficiais ainda não foram
 * definidos: altere esta lista para mudar a demonstração (ver docs/decisions.md).
 */
const DEMO_SOURCE_NAMES = ['Source 1', 'Source 2', 'Source 3', 'Source 4'];

/** Volumes iniciais variados, para mostrar que cada zona tem estado próprio. */
const DEMO_VOLUMES = [65, 40, 80, 25, 55, 70];

export function createSources(): SourceState[] {
  return DEMO_SOURCE_NAMES.map((name, index) => ({
    id: `source-${index + 1}`,
    number: index + 1,
    name,
    enabled: true,
    gain: GAIN_LIMITS.neutral,
  }));
}

export function createZones(count: number, sources: SourceState[]): ZoneState[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `zona-${index + 1}`,
    number: index + 1,
    name: `Zona ${index + 1}`,
    enabled: true,
    favorite: false,
    volume: DEMO_VOLUMES[index % DEMO_VOLUMES.length],
    muted: false,
    // Distribui as Sources entre as zonas para a demonstração.
    sourceId: sources[index % sources.length].id,
    equalizer: { ...DEFAULT_EQUALIZER },
    rememberLastVolume: false,
  }));
}

export function createAddedDevice(device: DiscoveredDevice): AddedDevice {
  const sources = createSources();
  return {
    ...device,
    sources,
    zones: createZones(MODEL_ZONES[device.model], sources),
    groups: [],
  };
}
