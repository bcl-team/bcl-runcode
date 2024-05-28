import { useSyncExternalStore } from 'react';
import { EScriptLanguage, EScriptSide } from '../models';

const getTypes = async (): Promise<{ server: string[]; client: string[] }> => {
  const defFiles = ['index.d.ts'];
  const defFilesServer = [...defFiles, 'natives_server.d.ts'];
  const defFilesClient = [...defFiles, 'natives_universal.d.ts'];

  const prefix = 'https://unpkg.com/@citizenfx/{}/';
  const prefixClient = prefix.replace('{}', 'client');
  const prefixServer = prefix.replace('{}', 'server');

  const [client, server] = await Promise.all([
    Promise.all(defFilesClient.map((file) => fetch(prefixClient + file).then((res) => res.text()))),
    Promise.all(defFilesServer.map((file) => fetch(prefixServer + file).then((res) => res.text()))),
  ]);

  const sharedTypings = [
    'declare const playerId: number;',
    'declare const playerPed: number;',
    'declare const currentVehicle: number;',
    'declare const lastVehicle: number;',
    'declare const sleep: (ms: number) => Promise<void>;',
    'declare const waitUntil: (predicate: () => boolean, max?: number) => Promise<boolean>;',
  ];

  client.push('declare const serverId: number;');
  client.push('declare const requestModel: (model: string | number) => Promise<void>;');
  client.push('declare const requestAnimDict: (dict: string) => Promise<void>;');

  sharedTypings.forEach((typing) => {
    server.push(typing);
    client.push(typing);
  });

  return { client, server };
};

const listeners = new Set<() => unknown>();

const store: Record<EScriptLanguage, Record<EScriptSide, string[]>> = {
  [EScriptLanguage.JavaScript]: {
    [EScriptSide.Client]: [],
    [EScriptSide.Server]: [],
  },
  [EScriptLanguage.Lua]: {
    [EScriptSide.Client]: [],
    [EScriptSide.Server]: [],
  },
} as const;

const subscribe = (listener: (...args: never[]) => unknown): (() => unknown) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): typeof store => {
  return store;
};

const emitChanges = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

export const useTypes = (language?: EScriptLanguage, side?: EScriptSide): string[] => {
  const store = useSyncExternalStore(subscribe, getSnapshot);
  if (!language || !side) {
    return [];
  }
  return store[language][side];
};

getTypes().then((types) => {
  store[EScriptLanguage.JavaScript][EScriptSide.Client] = types.client;
  store[EScriptLanguage.JavaScript][EScriptSide.Server] = types.server;
  emitChanges();
});
