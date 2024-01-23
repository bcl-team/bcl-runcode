import { client } from './client';
import { useEffect, useState } from 'react';

export const useClientEvent = <T>(event: string, handler: (arg: T) => unknown, deps?: React.DependencyList): void => {
  useEffect(() => {
    client.on(event, handler as never);
    return () => {
      client.off(event, handler as never);
    };
  }, deps);
};

export const useClientState = <T>(event: string, defaultValue: T): T => {
  const [state, setState] = useState<T>(defaultValue);

  useClientEvent(event, setState);

  return state;
};
