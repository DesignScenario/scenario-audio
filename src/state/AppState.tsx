/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { DEFAULT_EQUALIZER, SCAN_TIMING } from '../config/audioLimits';
import { createAddedDevice, MOCK_DISCOVERED_DEVICES } from '../data/mockDevices';
import type { AddedDevice, DiscoveredDevice, EqualizerBand, ScanStatus } from '../types';

/**
 * Estado global do protótipo (somente em memória, durante a sessão).
 * Nenhuma ação aqui se comunica com hardware, rede ou API.
 */
interface State {
  scanStatus: ScanStatus;
  discovered: DiscoveredDevice[];
  added: AddedDevice[];
  /** Opção de demonstração: faz a varredura terminar sem resultados. */
  simulateEmptyNetwork: boolean;
  /** Tela atual: null = descoberta; id = controle do equipamento. */
  openDeviceId: string | null;
}

type Action =
  | { type: 'scanStarted' }
  | { type: 'deviceFound'; device: DiscoveredDevice }
  | { type: 'scanFinished' }
  | { type: 'setSimulateEmpty'; value: boolean }
  | { type: 'addDevice'; id: string }
  | { type: 'openDevice'; id: string | null }
  | { type: 'setZoneVolume'; deviceId: string; zoneId: string; volume: number }
  | { type: 'setZoneEnabled'; deviceId: string; zoneId: string; enabled: boolean }
  | { type: 'setEqualizer'; deviceId: string; band: EqualizerBand; value: number }
  | { type: 'resetEqualizer'; deviceId: string };

const initialState: State = {
  scanStatus: 'idle',
  discovered: [],
  added: [],
  simulateEmptyNetwork: false,
  openDeviceId: null,
};

function updateDevice(state: State, deviceId: string, update: (d: AddedDevice) => AddedDevice): State {
  return { ...state, added: state.added.map((d) => (d.id === deviceId ? update(d) : d)) };
}

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
      return { ...state, openDeviceId: action.id };
    case 'setZoneVolume':
      return updateDevice(state, action.deviceId, (d) => ({
        ...d,
        zones: d.zones.map((z) => (z.id === action.zoneId && z.enabled ? { ...z, volume: action.volume } : z)),
      }));
    case 'setZoneEnabled':
      return updateDevice(state, action.deviceId, (d) => ({
        ...d,
        zones: d.zones.map((z) => (z.id === action.zoneId ? { ...z, enabled: action.enabled } : z)),
      }));
    case 'setEqualizer':
      return updateDevice(state, action.deviceId, (d) => ({
        ...d,
        equalizer: { ...d.equalizer, [action.band]: action.value },
      }));
    case 'resetEqualizer':
      return updateDevice(state, action.deviceId, (d) => ({ ...d, equalizer: { ...DEFAULT_EQUALIZER } }));
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
  setZoneVolume: (deviceId: string, zoneId: string, volume: number) => void;
  setZoneEnabled: (deviceId: string, zoneId: string, enabled: boolean) => void;
  setEqualizer: (deviceId: string, band: EqualizerBand, value: number) => void;
  resetEqualizer: (deviceId: string) => void;
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
      setZoneVolume: (deviceId, zoneId, volume) => dispatch({ type: 'setZoneVolume', deviceId, zoneId, volume }),
      setZoneEnabled: (deviceId, zoneId, enabled) => dispatch({ type: 'setZoneEnabled', deviceId, zoneId, enabled }),
      setEqualizer: (deviceId, band, v) => dispatch({ type: 'setEqualizer', deviceId, band, value: v }),
      resetEqualizer: (deviceId) => dispatch({ type: 'resetEqualizer', deviceId }),
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
