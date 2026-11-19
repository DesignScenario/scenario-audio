import { GROUP_MIN_ZONES, MODEL_GROUP_LIMIT } from '../config/audioLimits';
import type { DeviceModel, ZoneGroup } from '../types';

/**
 * Regras dos grupos de zonas (briefing):
 * - SMA4: até 2 grupos; SMA6: até 3 (MODEL_GROUP_LIMIT).
 * - Cada grupo tem no mínimo 2 zonas (GROUP_MIN_ZONES).
 * - Uma zona pertence a no máximo um grupo.
 * Funções puras: usadas pelo reducer (que aplica as regras) e pela interface (que as explica).
 */

/** Rascunho ainda não salvo; usa este id para não colidir com grupos reais. */
export const DRAFT_GROUP_ID = '__rascunho__';

export function groupLimit(model: DeviceModel): number {
  return MODEL_GROUP_LIMIT[model];
}

export function canAddGroup(model: DeviceModel, groups: ZoneGroup[]): boolean {
  return groups.length < groupLimit(model);
}

/** Grupo que já contém a zona, ou undefined. */
export function zoneOwner(groups: ZoneGroup[], zoneId: string): ZoneGroup | undefined {
  return groups.find((g) => g.zoneIds.includes(zoneId));
}

/** A zona está em outro grupo e, por isso, não pode ser marcada neste. */
export function isZoneBlockedFor(groups: ZoneGroup[], groupId: string, zoneId: string): boolean {
  const owner = zoneOwner(groups, zoneId);
  return owner !== undefined && owner.id !== groupId;
}

/** Um grupo novo só pode ser salvo com o mínimo de zonas. */
export function canSaveDraft(zoneIds: string[]): boolean {
  return new Set(zoneIds).size >= GROUP_MIN_ZONES;
}

/** Em um grupo salvo, desmarcar não pode deixá-lo abaixo do mínimo. */
export function canUncheck(group: ZoneGroup, zoneId: string): boolean {
  return !group.zoneIds.includes(zoneId) || group.zoneIds.length > GROUP_MIN_ZONES;
}

/**
 * Valida um grupo novo contra os existentes: limite do modelo, mínimo de zonas,
 * zonas válidas do equipamento e exclusividade entre grupos.
 */
export function canCreateGroup(
  model: DeviceModel,
  groups: ZoneGroup[],
  zoneIds: string[],
  validZoneIds: string[],
): boolean {
  return (
    canAddGroup(model, groups) &&
    canSaveDraft(zoneIds) &&
    zoneIds.every((id) => validZoneIds.includes(id) && zoneOwner(groups, id) === undefined)
  );
}

/** Nome exibido do grupo, derivado da posição ("Grupo 1", "Grupo 2"…). */
export function groupName(groups: ZoneGroup[], groupId: string): string {
  const index = groups.findIndex((g) => g.id === groupId);
  return `Grupo ${index >= 0 ? index + 1 : groups.length + 1}`;
}
