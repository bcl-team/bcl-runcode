export type TConsoleOutput = {
  id: string;
  method: 'log' | 'debug' | 'info' | 'warn' | 'error';
  data: unknown[];
  timestamp: string;
};

const getTs = (): string => {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const patchConsole = (
  id: string,
  emit: (event: string, output: TConsoleOutput) => unknown,
): Record<string, Function> => {
  return {
    log: (...args: string[]) => {
      console.log(`RUNCODE:`, ...args);
      emit('editor:output', {
        id,
        method: 'log',
        data: args,
        timestamp: getTs(),
      });
    },
    debug: (...args: string[]) => {
      console.debug(`RUNCODE:`, ...args);
      emit('editor:output', {
        id,
        method: 'debug',
        data: args,
        timestamp: getTs(),
      });
    },
    info: (...args: string[]) => {
      console.info(`RUNCODE:`, ...args);
      emit('editor:output', {
        id,
        method: 'info',
        data: args,
        timestamp: getTs(),
      });
    },
    warn: (...args: string[]) => {
      console.warn(`RUNCODE:`, ...args);
      emit('editor:output', {
        id,
        method: 'warn',
        data: args,
        timestamp: getTs(),
      });
    },
    error: (...args: string[]) => {
      console.error(`RUNCODE:`, ...args);
      emit('editor:output', {
        id,
        method: 'error',
        data: args,
        timestamp: getTs(),
      });
    },
  };
};
