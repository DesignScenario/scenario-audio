import type { SourceState, ZoneState } from '../types';

/** Volume que a zona está tocando de fato: 0 quando mutada ou desabilitada. */
export function effectiveVolume(zone: ZoneState): number {
  return zone.enabled && !zone.muted ? zone.volume : 0;
}

/**
 * Ordem de exibição: favoritas primeiro e, dentro de cada grupo, pela numeração original.
 * Só reordena a lista; o estado de cada zona fica intacto no reducer.
 */
export function sortZonesForDisplay(zones: ZoneState[]): ZoneState[] {
  return [...zones].sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.number - b.number);
}

/** Sources que podem ser escolhidas numa nova seleção (só as habilitadas). */
export function selectableSources(sources: SourceState[]): SourceState[] {
  return sources.filter((s) => s.enabled);
}
