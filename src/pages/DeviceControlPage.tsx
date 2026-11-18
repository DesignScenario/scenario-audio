import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { EqualizerPanel } from '../components/EqualizerPanel';
import { SectionLabel } from '../components/SectionLabel';
import { Tabs } from '../components/Tabs';
import { ZoneCard } from '../components/ZoneCard';
import { useAppState } from '../state/AppState';
import type { AddedDevice } from '../types';
import './DeviceControlPage.css';

type ControlTab = 'zonas' | 'equalizacao';

const TABS: { id: ControlTab; label: string }[] = [
  { id: 'zonas', label: 'Zonas' },
  { id: 'equalizacao', label: 'Equalização' },
];

export function DeviceControlPage({ device }: { device: AddedDevice }) {
  const { openDevice, setZoneVolume, setZoneEnabled, setEqualizer, resetEqualizer } = useAppState();
  const [tab, setTab] = useState<ControlTab>('zonas');
  const activeZones = device.zones.filter((z) => z.enabled).length;

  return (
    <div className="page">
      <AppHeader
        title={device.model}
        subtitle={`MAC ${device.mac}`}
        onBack={() => openDevice(null)}
        backLabel="Voltar para equipamentos"
      />

      <main className="page__content control">
        <Tabs items={TABS} value={tab} onChange={setTab} label="Controles do equipamento" idPrefix="controle" />

        {tab === 'zonas' && (
          <section
            id="controle-panel-zonas"
            role="tabpanel"
            aria-labelledby="controle-tab-zonas"
            className="control__panel"
          >
            <SectionLabel
              label="Zonas"
              count={device.zones.length}
              trailing={
                <span className="control__summary">
                  {activeZones} {activeZones === 1 ? 'ativa' : 'ativas'}
                </span>
              }
            />
            <div className={`control__zones control__zones--${device.zones.length}`}>
              {device.zones.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onVolumeChange={(v) => setZoneVolume(device.id, zone.id, v)}
                  onEnabledChange={(enabled) => setZoneEnabled(device.id, zone.id, enabled)}
                />
              ))}
            </div>
          </section>
        )}

        {tab === 'equalizacao' && (
          <section
            id="controle-panel-equalizacao"
            role="tabpanel"
            aria-labelledby="controle-tab-equalizacao"
            className="control__panel"
          >
            <SectionLabel label="Equalização do equipamento" />
            <EqualizerPanel
              equalizer={device.equalizer}
              onChange={(band, v) => setEqualizer(device.id, band, v)}
              onReset={() => resetEqualizer(device.id)}
            />
          </section>
        )}
      </main>
    </div>
  );
}
