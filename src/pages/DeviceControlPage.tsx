import gearIcon from '../assets/icons/configuracoes-32px.svg';
import { AppHeader } from '../components/AppHeader';
import { IconButton } from '../components/IconButton';
import { SectionLabel } from '../components/SectionLabel';
import { SourceCard } from '../components/SourceCard';
import { Tabs } from '../components/Tabs';
import { ZoneCard } from '../components/ZoneCard';
import { useAppState } from '../state/AppState';
import { sortZonesForDisplay } from '../state/selectors';
import type { AddedDevice, ControlTab } from '../types';
import './DeviceControlPage.css';

const TABS: { id: ControlTab; label: string }[] = [
  { id: 'zona', label: 'Zona' },
  { id: 'source', label: 'Source' },
];

/** Tela do equipamento: abas Zona | Source e engrenagem para as configurações. */
export function DeviceControlPage({ device }: { device: AddedDevice }) {
  const app = useAppState();
  const { controlTab } = app.state;
  const activeZones = device.zones.filter((z) => z.enabled).length;
  const favorites = device.zones.filter((z) => z.favorite).length;
  const enabledSources = device.sources.filter((s) => s.enabled).length;
  const id = device.id;

  return (
    <div className="page">
      <AppHeader
        title={device.model}
        // Espaços não separáveis: em telas estreitas a quebra acontece só entre MAC e IP.
        subtitle={`MAC\u00a0${device.mac} · IP\u00a0${device.ip}`}
        onBack={() => app.openDevice(null)}
        backLabel="Voltar para equipamentos"
        trailing={
          <IconButton
            icon={gearIcon}
            iconSize={32}
            label={`Configurações do ${device.model}`}
            onClick={() => app.setDeviceView('settings')}
          />
        }
      />

      <main className="page__content control">
        <Tabs items={TABS} value={controlTab} onChange={app.setControlTab} label="Controles do equipamento" idPrefix="controle" />

        {controlTab === 'zona' && (
          <section id="controle-panel-zona" role="tabpanel" aria-labelledby="controle-tab-zona" className="control__panel">
            <SectionLabel
              label="Zonas"
              count={device.zones.length}
              trailing={
                <span className="control__summary">
                  {activeZones} {activeZones === 1 ? 'ativa' : 'ativas'}
                  {favorites > 0 && ` · ${favorites} ${favorites === 1 ? 'favorita' : 'favoritas'}`}
                </span>
              }
            />
            {/* key = id da zona: reordenar as favoritas move o card sem recriá-lo. */}
            <div className={`control__zones control__zones--${device.zones.length}`}>
              {sortZonesForDisplay(device.zones).map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  sources={device.sources}
                  onEnabledChange={(v) => app.setZoneEnabled(id, zone.id, v)}
                  onFavoriteToggle={() => app.toggleZoneFavorite(id, zone.id)}
                  onSourceChange={(sourceId) => app.setZoneSource(id, zone.id, sourceId)}
                  onVolumeChange={(v) => app.setZoneVolume(id, zone.id, v)}
                  onMutedChange={(v) => app.setZoneMuted(id, zone.id, v)}
                  onEqualizerChange={(band, v) => app.setEqualizer(id, zone.id, band, v)}
                  onEqualizerReset={() => app.resetEqualizer(id, zone.id)}
                  onRememberLastVolumeChange={(v) => app.setRememberLastVolume(id, zone.id, v)}
                />
              ))}
            </div>
          </section>
        )}

        {controlTab === 'source' && (
          <section id="controle-panel-source" role="tabpanel" aria-labelledby="controle-tab-source" className="control__panel">
            <SectionLabel
              label="Sources"
              count={device.sources.length}
              trailing={
                <span className="control__summary">
                  {enabledSources} {enabledSources === 1 ? 'habilitada' : 'habilitadas'}
                </span>
              }
            />
            <ol className="control__sources">
              {device.sources.map((source) => (
                <li key={source.id}>
                  <SourceCard
                    source={source}
                    zonesUsing={device.zones.filter((z) => z.sourceId === source.id).length}
                    onEnabledChange={(v) => app.setSourceEnabled(id, source.id, v)}
                    onRename={(name) => app.renameSource(id, source.id, name)}
                    onGainChange={(v) => app.setSourceGain(id, source.id, v)}
                  />
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
}
