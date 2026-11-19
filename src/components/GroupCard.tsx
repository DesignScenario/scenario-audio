import { GROUP_MIN_ZONES } from '../config/audioLimits';
import { canSaveDraft, canUncheck, DRAFT_GROUP_ID, groupName, isZoneBlockedFor, zoneOwner } from '../state/groupRules';
import type { ZoneGroup, ZoneState } from '../types';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import './GroupCard.css';

interface GroupCardProps {
  /** Grupo salvo, ou o rascunho (id = DRAFT_GROUP_ID). */
  group: ZoneGroup;
  /** Grupos salvos do equipamento (para exclusividade e nomes). */
  groups: ZoneGroup[];
  zones: ZoneState[];
  onToggleZone: (zoneId: string, checked: boolean) => void;
  /** Grupo salvo: excluir. */
  onRemove?: () => void;
  /** Rascunho: salvar e cancelar. */
  onSave?: () => void;
  onCancel?: () => void;
}

/** Card de um grupo: "Grupo N" + um checkbox por zona do equipamento (quantidade vem de MODEL_ZONES). */
export function GroupCard({ group, groups, zones, onToggleZone, onRemove, onSave, onCancel }: GroupCardProps) {
  const isDraft = group.id === DRAFT_GROUP_ID;
  const name = isDraft ? `Grupo ${groups.length + 1}` : groupName(groups, group.id);
  const titleId = `titulo-${group.id}`;
  const ruleId = `regra-${group.id}`;
  const canSave = canSaveDraft(group.zoneIds);

  return (
    <section className={`group-card${isDraft ? ' group-card--draft' : ''}`} aria-labelledby={titleId}>
      <div className="group-card__header">
        <h3 id={titleId} className="group-card__name">
          {name}
          {isDraft && <span className="group-card__badge">Novo</span>}
        </h3>
        <span className="group-card__count">
          {group.zoneIds.length} {group.zoneIds.length === 1 ? 'zona' : 'zonas'}
        </span>
      </div>

      <fieldset className="group-card__zones" aria-describedby={ruleId}>
        <legend className="visually-hidden">Zonas do {name}</legend>
        {zones.map((zone) => {
          const checked = group.zoneIds.includes(zone.id);
          const owner = zoneOwner(groups, zone.id);
          const blockedByOther = isZoneBlockedFor(groups, group.id, zone.id);
          const blockedByMin = !isDraft && checked && !canUncheck(group, zone.id);
          const hint = blockedByOther && owner ? `No ${groupName(groups, owner.id)}` : blockedByMin ? `Mínimo ${GROUP_MIN_ZONES}` : undefined;
          return (
            <Checkbox
              key={zone.id}
              id={`${group.id}-${zone.id}`}
              label={String(zone.number)}
              checked={checked}
              disabled={blockedByOther || blockedByMin}
              hint={hint}
              onChange={(v) => onToggleZone(zone.id, v)}
            />
          );
        })}
      </fieldset>

      <p id={ruleId} className={`group-card__rule${isDraft && !canSave ? ' group-card__rule--alert' : ''}`}>
        {isDraft
          ? canSave
            ? 'Pronto para salvar.'
            : `Selecione pelo menos ${GROUP_MIN_ZONES} zonas para salvar o grupo.`
          : `Um grupo precisa de pelo menos ${GROUP_MIN_ZONES} zonas. Para desfazê-lo, exclua o grupo.`}
      </p>

      <div className="group-card__actions">
        {isDraft ? (
          <>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button variant="primary" onClick={onSave} disabled={!canSave}>
              Salvar grupo
            </Button>
          </>
        ) : (
          <Button onClick={onRemove} aria-label={`Excluir ${name}`}>
            Excluir grupo
          </Button>
        )}
      </div>
    </section>
  );
}
