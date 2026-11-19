import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { GroupCard } from '../components/GroupCard';
import { SectionLabel } from '../components/SectionLabel';
import { useAppState } from '../state/AppState';
import { canAddGroup, canCreateGroup, DRAFT_GROUP_ID, groupLimit, zoneOwner } from '../state/groupRules';
import type { AddedDevice } from '../types';
import './DeviceSettingsPage.css';

/**
 * Configurações do equipamento. Nesta etapa só **Grupos** é funcional;
 * Configurações de rede e Informações do dispositivo aparecem desabilitadas, sem tela ou fluxo.
 */
export function DeviceSettingsPage({ device }: { device: AddedDevice }) {
  const app = useAppState();
  // Rascunho do grupo em criação: estado de formulário, só vira grupo pelo reducer ao salvar.
  const [draft, setDraft] = useState<string[] | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const limit = groupLimit(device.model);
  const canAdd = canAddGroup(device.model, device.groups) && draft === null;
  const limitReached = !canAddGroup(device.model, device.groups);
  const freeZones = device.zones.filter((z) => !zoneOwner(device.groups, z.id)).length;

  const toggleDraftZone = (zoneId: string, checked: boolean) =>
    setDraft((d) => (d ? (checked ? [...d, zoneId] : d.filter((id) => id !== zoneId)) : d));

  const saveDraft = () => {
    if (!draft || !canCreateGroup(device.model, device.groups, draft, device.zones.map((z) => z.id))) return;
    app.addGroup(device.id, draft);
    setAnnouncement(`Grupo ${device.groups.length + 1} criado.`);
    setDraft(null);
  };

  return (
    <div className="page">
      <AppHeader
        title="Configurações"
        subtitle={`${device.model} · MAC ${device.mac}`}
        onBack={() => app.setDeviceView('control')}
        backLabel={`Voltar para o controle do ${device.model}`}
      />

      <main className="page__content settings">
        <p className="visually-hidden" aria-live="polite">
          {announcement}
        </p>

        <section className="settings__section" aria-labelledby="sec-grupos">
          <SectionLabel
            id="sec-grupos"
            label="Grupos"
            count={device.groups.length}
            trailing={<span className="settings__summary">Máximo {limit}</span>}
          />
          <p className="settings__intro">
            Agrupe zonas do {device.model}. Cada grupo precisa de pelo menos 2 zonas, e uma zona só pode estar em um
            grupo.
          </p>

          {device.groups.length === 0 && draft === null && (
            <p className="settings__empty">Nenhum grupo criado ainda.</p>
          )}

          <div className="settings__groups">
            {device.groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                groups={device.groups}
                zones={device.zones}
                onToggleZone={(zoneId, checked) => app.setGroupZone(device.id, group.id, zoneId, checked)}
                onRemove={() => {
                  app.removeGroup(device.id, group.id);
                  setAnnouncement('Grupo excluído. As zonas dele ficaram livres.');
                }}
              />
            ))}
            {draft !== null && (
              <GroupCard
                group={{ id: DRAFT_GROUP_ID, zoneIds: draft }}
                groups={device.groups}
                zones={device.zones}
                onToggleZone={toggleDraftZone}
                onSave={saveDraft}
                onCancel={() => setDraft(null)}
              />
            )}
          </div>

          <div className="settings__add">
            <Button variant="primary" size="large" onClick={() => setDraft([])} disabled={!canAdd || freeZones < 2}>
              Adicionar grupo
            </Button>
            <p className="settings__add-hint" role="status">
              {limitReached
                ? `Limite de ${limit} grupos do ${device.model} atingido. Exclua um grupo para criar outro.`
                : freeZones < 2 && draft === null
                  ? 'Não há zonas livres suficientes para um novo grupo.'
                  : `${device.groups.length} de ${limit} grupos criados.`}
            </p>
          </div>
        </section>

        <section className="settings__section" aria-labelledby="sec-outros">
          <SectionLabel id="sec-outros" label="Outras configurações" />
          {/* Itens previstos, sem tela nem fluxo nesta etapa (briefing). */}
          <ul className="settings__list">
            <li className="settings__item" aria-disabled="true">
              <span>Configurações de rede</span>
              <span className="settings__soon">Em breve</span>
            </li>
            <li className="settings__item" aria-disabled="true">
              <span>Informações do dispositivo</span>
              <span className="settings__soon">Em breve</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
