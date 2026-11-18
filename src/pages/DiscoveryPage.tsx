import { useEffect, useState } from 'react';
import searchIcon from '../assets/icons/buscando-24px.svg';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { AddedEquipmentCard, DiscoveredEquipmentCard } from '../components/EquipmentCard';
import { ScanStatusRow } from '../components/ScanStatus';
import { SectionLabel } from '../components/SectionLabel';
import { Toggle } from '../components/Toggle';
import { useAppState } from '../state/AppState';
import './DiscoveryPage.css';

export function DiscoveryPage() {
  const { state, startScan, addDevice, openDevice, setSimulateEmpty } = useAppState();
  const { scanStatus, discovered, added, simulateEmptyNetwork } = state;
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  // Destaque temporário do equipamento recém-adicionado.
  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(() => setLastAdded(null), 2400);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  const addedIds = new Set(added.map((d) => d.id));

  const handleAdd = (id: string) => {
    const device = discovered.find((d) => d.id === id);
    addDevice(id);
    setLastAdded(id);
    if (device) setAnnouncement(`${device.model} ${device.mac} adicionado a Meus equipamentos.`);
  };

  return (
    <div className="page">
      <AppHeader title="Scenario Audio" subtitle="Equipamentos multi-room" />

      <main className="page__content discovery">
        <p className="visually-hidden" aria-live="polite">
          {announcement}
        </p>

        {/* ---------- Meus equipamentos ---------- */}
        <section className="discovery__section discovery__mine" aria-labelledby="sec-meus">
          <SectionLabel id="sec-meus" label="Meus equipamentos" count={added.length} />
          {added.length === 0 ? (
            <p className="discovery__hint">
              Nenhum equipamento adicionado ainda. Os equipamentos que você adicionar aparecem aqui para acesso
              rápido.
            </p>
          ) : (
            <ul className="discovery__list discovery__list--added">
              {added.map((d) => (
                <li key={d.id}>
                  <AddedEquipmentCard
                    device={d}
                    activeZones={d.zones.filter((z) => z.enabled).length}
                    totalZones={d.zones.length}
                    onOpen={() => openDevice(d.id)}
                    highlight={lastAdded === d.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------- Encontrados na rede ---------- */}
        <section className="discovery__section discovery__network" aria-labelledby="sec-rede" aria-busy={scanStatus === 'scanning'}>
          <SectionLabel
            id="sec-rede"
            label="Encontrados na rede"
            count={scanStatus === 'idle' ? undefined : discovered.length}
          />

          {scanStatus === 'idle' && (
            <div className="discovery__start">
              <div className="discovery__start-icon" aria-hidden="true">
                <img src={searchIcon} width={18} height={18} alt="" />
              </div>
              <p className="discovery__start-title">Encontre seus equipamentos</p>
              <p className="discovery__start-text">
                Procure amplificadores SMA4 e SMA6 conectados à mesma rede local deste aparelho.
              </p>
              <Button variant="primary" size="large" onClick={startScan}>
                Procurar equipamentos
              </Button>
            </div>
          )}

          {scanStatus !== 'idle' && (
            <>
              {/* No resultado vazio, o bloco abaixo já traz título e ação; evita repetir a mensagem. */}
              {!(scanStatus === 'done' && discovered.length === 0) && (
                <ScanStatusRow status={scanStatus} found={discovered.length} onRescan={startScan} />
              )}

              {discovered.length > 0 && (
                <ul className="discovery__list discovery__list--found">
                  {discovered.map((d) => (
                    <li key={d.id}>
                      <DiscoveredEquipmentCard device={d} isAdded={addedIds.has(d.id)} onAdd={() => handleAdd(d.id)} />
                    </li>
                  ))}
                </ul>
              )}

              {scanStatus === 'scanning' && discovered.length === 0 && (
                <div className="discovery__skeleton" aria-hidden="true">
                  <span />
                  <span />
                </div>
              )}

              {scanStatus === 'done' && discovered.length === 0 && (
                <div className="discovery__empty" role="status">
                  <p className="discovery__start-title">Nenhum equipamento encontrado</p>
                  <ul className="discovery__tips">
                    <li>Confira se o SMA4 ou SMA6 está ligado.</li>
                    <li>Verifique se ele está na mesma rede deste aparelho.</li>
                    <li>Aguarde alguns segundos e procure novamente.</li>
                  </ul>
                  <Button size="large" onClick={startScan}>
                    Procurar novamente
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ---------- Opções de demonstração (apenas protótipo) ---------- */}
        <details className="discovery__demo">
          <summary>Opções de demonstração</summary>
          <div className="discovery__demo-row">
            <span id="demo-vazia">Simular rede sem equipamentos</span>
            <Toggle checked={simulateEmptyNetwork} onChange={setSimulateEmpty} labelledBy="demo-vazia" />
          </div>
          <p className="discovery__demo-note">Recurso do protótipo para visualizar o estado vazio. Não faz parte do app.</p>
        </details>
      </main>
    </div>
  );
}
