/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { DEFAULT_EQUALIZER, GAIN_LIMITS, SCAN_TIMING, SOURCE_NAME_MAX, VOLUME_LIMITS } from '../config/audioLimits';
import { createAddedDevice, MOCK_DISCOVERED_DEVICES } from '../data/mockDevices';
import type {
  AddedDevice,
  ControlTab,
  DeviceView,
  DiscoveredDevice,
  EqualizerBand,
  ScanStatus,
  SourceState,
  ZoneState,
} from '../types';
import { canCreateGroup, canUncheck, isZoneBlockedFor } from './groupRules';

/**
 * Estado global do protótipo (somente em memória, durante a sessão).
 * Nenhuma ação aqui se comunica com hardware, rede ou API.
 * As regras de negócio (zona desabilitada, Sources, grupos) são aplicadas AQUI,
 * não apenas na interface.
 */
interface State {
  scanStatus: ScanStatus;
  discovered: DiscoveredDevice[];
  added: AddedDevice[];
  /** Opção de demonstração: faz a varredura terminar sem resultados. */
  simulateEmptyNetwork: boolean;
  /** Tela atual: null = descoberta; id = equipamento aberto. */
  openDeviceId: string | null;
  /** Com um equipamento aberto: controle (abas) ou configurações. */
  deviceView: DeviceView;
  /** Aba da tela de controle; mantida ao ir às configurações e voltar. */
  controlTab: ControlTab;
}

type Action =
  | { type: 'scanStarted' }
  | { type: 'deviceFound'; device: DiscoveredDevice }
  | { type: 'scanFinished' }
  | { type: 'setSimulateEmpty'; value: boolean }
  | { type: 'addDevice'; id: string }
  | { type: 'openDevice'; id: string | null }
  | { type: 'setDeviceView'; view: DeviceView }
  | { type: 'setControlTab'; tab: ControlTab }
  // Zonas
  | { type: 'setZoneEnabled'; deviceId: string; zoneId: string; enabled: boolean }
  | { type: 'toggleZoneFavorite'; deviceId: string; zoneId: string }
  | { type: 'setZoneVolume'; deviceId: string; zoneId: string; volume: number }
  | { type: 'setZoneMuted'; deviceId: string; zoneId: string; muted: boolean }
  | { type: 'setZoneSource'; deviceId: string; zoneId: string; sourceId: string }
  | { type: 'setEqualizer'; deviceId: string; zoneId: string; band: EqualizerBand; value: number }
  | { type: 'resetEqualizer'; deviceId: string; zoneId: string }
  | { type: 'setRememberLastVolume'; deviceId: string; zoneId: string; value: boolean }
  // Sources
  | { type: 'setSourceEnabled'; deviceId: string; sourceId: string; enabled: boolean }
  | { type: 'renameSource'; deviceId: string; sourceId: string; name: string }
  | { type: 'setSourceGain'; deviceId: string; sourceId: string; gain: number }
  // Grupos
  | { type: 'addGroup'; deviceId: string; zoneIds: string[] }
  | { type: 'setGroupZone'; deviceId: string; groupId: string; zoneId: string; checked: boolean }
  | { type: 'removeGroup'; deviceId: string; groupId: string };

const initialState: State = {
  scanStatus: 'idle',
  discovered: [],
  added: [],
  simulateEmptyNetwork: false,
  openDeviceId: null,
  deviceView: 'control',
  controlTab: 'zona',
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function updateDevice(state: State, deviceId: string, update: (d: AddedDevice) => AddedDevice): State {
  return { ...state, added: state.added.map((d) => (d.id === deviceId ? update(d) : d)) };
}

function updateZone(state: State, deviceId: string, zoneId: string, update: (z: ZoneState) => ZoneState): State {
  return updateDevice(state, deviceId, (d) => ({
    ...d,
    zones: d.zones.map((z) => (z.id === zoneId ? update(z) : z)),
  }));
}

/** Controles operacionais: uma zona desabilitada fica bloqueada (Source, volume, mute e avançados). */
function updateEnabledZone(state: State, deviceId: string, zoneId: string, update: (z: ZoneState) => ZoneState): State {
  return updateZone(state, deviceId, zoneId, (z) => (z.enabled ? update(z) : z));
}

function updateSource(state: State, deviceId: string, sourceId: string, update: (s: SourceState) => SourceState): State {
  return updateDevice(state, deviceId, (d) => ({
    ...d,
    sources: d.sources.map((s) => (s.id === sourceId ? update(s) : s)),
  }));
}

let groupSeq = 0;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'scanStarted':
      return { ...state, scanStatus: 'scanning', discovered: [] };
    case 'deviceFound':
      if (state.discovered.some((d) => d.id === action.device.id)) return state;
      return { ...state, discovered: [...state.discovered, action.device] };
    case 'scanFinished':
      return { ...state, scanStatus: 'done' };
    case 'setSimulateEmpty':
      return { ...state, simulateEmptyNetwork: action.value };
    case 'addDevice': {
      // Evita duplicidade: um equipamento já adicionado nunca é adicionado de novo.
      if (state.added.some((d) => d.id === action.id)) return state;
      const found = state.discovered.find((d) => d.id === action.id);
      if (!found) return state;
      return { ...state, added: [...state.added, createAddedDevice(found)] };
    }
    case 'openDevice':
      // Ao abrir outro equipamento, começa pela aba Zona.
      return {
        ...state,
        openDeviceId: action.id,
        deviceView: 'control',
        controlTab: action.id === state.openDeviceId ? state.controlTab : 'zona',
      };
    case 'setDeviceView':
      return { ...state, deviceView: action.view };
    case 'setControlTab':
      return { ...state, controlTab: action.tab };

    // ---------- Zonas ----------
    case 'setZoneEnabled':
      // Desabilitar só bloqueia e muta (volume efetivo 0); volume, mute, Source e EQ ficam guardados.
      return updateZone(state, action.deviceId, action.zoneId, (z) => ({ ...z, enabled: action.enabled }));
    case 'toggleZoneFavorite':
      // Favoritar não é um controle operacional: funciona mesmo com a zona desabilitada.
      return updateZone(state, action.deviceId, action.zoneId, (z) => ({ ...z, favorite: !z.favorite }));
    case 'setZoneVolume':
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({
        ...z,
        volume: clamp(action.volume, VOLUME_LIMITS.min, VOLUME_LIMITS.max),
      }));
    case 'setZoneMuted':
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({ ...z, muted: action.muted }));
    case 'setZoneSource': {
      const device = state.added.find((d) => d.id === action.deviceId);
      const source = device?.sources.find((s) => s.id === action.sourceId);
      // Só Sources habilitadas podem ser escolhidas numa nova seleção.
      if (!source || !source.enabled) return state;
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({ ...z, sourceId: action.sourceId }));
    }
    case 'setEqualizer':
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({
        ...z,
        equalizer: { ...z.equalizer, [action.band]: action.value },
      }));
    case 'resetEqualizer':
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({
        ...z,
        equalizer: { ...DEFAULT_EQUALIZER },
      }));
    case 'setRememberLastVolume':
      return updateEnabledZone(state, action.deviceId, action.zoneId, (z) => ({
        ...z,
        rememberLastVolume: action.value,
      }));

    // ---------- Sources ----------
    case 'setSourceEnabled':
      // Desabilitar NÃO altera as zonas que já usam a Source (hipótese de UX, ver decisions.md).
      return updateSource(state, action.deviceId, action.sourceId, (s) => ({ ...s, enabled: action.enabled }));
    case 'renameSource': {
      const name = action.name.trim().slice(0, SOURCE_NAME_MAX);
      if (!name) return state; // nome vazio é rejeitado
      return updateSource(state, action.deviceId, action.sourceId, (s) => ({ ...s, name }));
    }
    case 'setSourceGain':
      return updateSource(state, action.deviceId, action.sourceId, (s) => ({
        ...s,
        gain: clamp(action.gain, GAIN_LIMITS.min, GAIN_LIMITS.max),
      }));

    // ---------- Grupos ----------
    case 'addGroup':
      return updateDevice(state, action.deviceId, (d) => {
        const zoneIds = [...new Set(action.zoneIds)];
        if (!canCreateGroup(d.model, d.groups, zoneIds, d.zones.map((z) => z.id))) return d;
        groupSeq += 1;
        return { ...d, groups: [...d.groups, { id: `grupo-${Date.now()}-${groupSeq}`, zoneIds }] };
      });
    case 'setGroupZone':
      return updateDevice(state, action.deviceId, (d) => {
        const group = d.groups.find((g) => g.id === action.groupId);
        if (!group || !d.zones.some((z) => z.id === action.zoneId)) return d;
        if (action.checked) {
          if (group.zoneIds.includes(action.zoneId)) return d;
          if (isZoneBlockedFor(d.groups, group.id, action.zoneId)) return d; // exclusividade entre grupos
        } else if (!canUncheck(group, action.zoneId)) {
          return d; // mínimo de zonas por grupo
        }
        const zoneIds = action.checked
          ? [...group.zoneIds, action.zoneId]
          : group.zoneIds.filter((id) => id !== action.zoneId);
        return { ...d, groups: d.groups.map((g) => (g.id === group.id ? { ...g, zoneIds } : g)) };
      });
    case 'removeGroup':
      return updateDevice(state, action.deviceId, (d) => ({
        ...d,
        groups: d.groups.filter((g) => g.id !== action.groupId),
      }));
    default:
      return state;
  }
}

interface AppStateValue {
  state: State;
  startScan: () => void;
  setSimulateEmpty: (value: boolean) => void;
  addDevice: (id: string) => void;
  openDevice: (id: string | null) => void;
  setDeviceView: (view: DeviceView) => void;
  setControlTab: (tab: ControlTab) => void;
  setZoneEnabled: (deviceId: string, zoneId: string, enabled: boolean) => void;
  toggleZoneFavorite: (deviceId: string, zoneId: string) => void;
  setZoneVolume: (deviceId: string, zoneId: string, volume: number) => void;
  setZoneMuted: (deviceId: string, zoneId: string, muted: boolean) => void;
  setZoneSource: (deviceId: string, zoneId: string, sourceId: string) => void;
  setEqualizer: (deviceId: string, zoneId: string, band: EqualizerBand, value: number) => void;
  resetEqualizer: (deviceId: string, zoneId: string) => void;
  setRememberLastVolume: (deviceId: string, zoneId: string, value: boolean) => void;
  setSourceEnabled: (deviceId: string, sourceId: string, enabled: boolean) => void;
  renameSource: (deviceId: string, sourceId: string, name: string) => void;
  setSourceGain: (deviceId: string, sourceId: string, gain: number) => void;
  addGroup: (deviceId: string, zoneIds: string[]) => void;
  setGroupZone: (deviceId: string, groupId: string, zoneId: string, checked: boolean) => void;
  removeGroup: (deviceId: string, groupId: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  /** Varredura simulada: revela os equipamentos fictícios um a um e depois conclui. */
  const startScan = useCallback(() => {
    clearTimers();
    dispatch({ type: 'scanStarted' });
    const results = state.simulateEmptyNetwork ? [] : MOCK_DISCOVERED_DEVICES;
    let elapsed = SCAN_TIMING.firstResultMs;
    results.forEach((device) => {
      timers.current.push(window.setTimeout(() => dispatch({ type: 'deviceFound', device }), elapsed));
      elapsed += SCAN_TIMING.betweenResultsMs;
    });
    const finishAt = results.length ? elapsed - SCAN_TIMING.betweenResultsMs + SCAN_TIMING.finishDelayMs : 2000;
    timers.current.push(window.setTimeout(() => dispatch({ type: 'scanFinished' }), finishAt));
  }, [state.simulateEmptyNetwork]);

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      startScan,
      setSimulateEmpty: (v) => dispatch({ type: 'setSimulateEmpty', value: v }),
      addDevice: (id) => dispatch({ type: 'addDevice', id }),
      openDevice: (id) => dispatch({ type: 'openDevice', id }),
      setDeviceView: (view) => dispatch({ type: 'setDeviceView', view }),
      setControlTab: (tab) => dispatch({ type: 'setControlTab', tab }),
      setZoneEnabled: (deviceId, zoneId, enabled) => dispatch({ type: 'setZoneEnabled', deviceId, zoneId, enabled }),
      toggleZoneFavorite: (deviceId, zoneId) => dispatch({ type: 'toggleZoneFavorite', deviceId, zoneId }),
      setZoneVolume: (deviceId, zoneId, volume) => dispatch({ type: 'setZoneVolume', deviceId, zoneId, volume }),
      setZoneMuted: (deviceId, zoneId, muted) => dispatch({ type: 'setZoneMuted', deviceId, zoneId, muted }),
      setZoneSource: (deviceId, zoneId, sourceId) => dispatch({ type: 'setZoneSource', deviceId, zoneId, sourceId }),
      setEqualizer: (deviceId, zoneId, band, v) => dispatch({ type: 'setEqualizer', deviceId, zoneId, band, value: v }),
      resetEqualizer: (deviceId, zoneId) => dispatch({ type: 'resetEqualizer', deviceId, zoneId }),
      setRememberLastVolume: (deviceId, zoneId, v) =>
        dispatch({ type: 'setRememberLastVolume', deviceId, zoneId, value: v }),
      setSourceEnabled: (deviceId, sourceId, enabled) =>
        dispatch({ type: 'setSourceEnabled', deviceId, sourceId, enabled }),
      renameSource: (deviceId, sourceId, name) => dispatch({ type: 'renameSource', deviceId, sourceId, name }),
      setSourceGain: (deviceId, sourceId, gain) => dispatch({ type: 'setSourceGain', deviceId, sourceId, gain }),
      addGroup: (deviceId, zoneIds) => dispatch({ type: 'addGroup', deviceId, zoneIds }),
      setGroupZone: (deviceId, groupId, zoneId, checked) =>
        dispatch({ type: 'setGroupZone', deviceId, groupId, zoneId, checked }),
      removeGroup: (deviceId, groupId) => dispatch({ type: 'removeGroup', deviceId, groupId }),
    }),
    [state, startScan],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState precisa estar dentro de <AppStateProvider>.');
  return ctx;
}
