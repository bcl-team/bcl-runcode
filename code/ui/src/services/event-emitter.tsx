import EventEmitter2 from 'eventemitter2';
import { DependencyList, useEffect } from 'react';

export const eventEmitter = new EventEmitter2();

export const useEvent = (event: string, handler: (...args: never[]) => unknown, deps: DependencyList = []): void => {
  useEffect(() => {
    eventEmitter.on(event, handler as never);

    return () => {
      eventEmitter.off(event, handler as never);
    };
  }, deps);
};
