import { Events } from '../const/events.ts';
import { eventEmitter } from './event-emitter.tsx';
import { TCreateScriptModel } from '../models';

export const useNewFileModal = (): (() => Promise<TCreateScriptModel>) => {
  return () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      eventEmitter.emit(Events.OpenModal, resolve);
    });
  };
};
