import { TConsoleOutput } from './console';

const AsyncFunction = Object.getPrototypeOf(async function () {
  /**/
}).constructor;

interface IScriptEvents {
  out: (type: TConsoleOutput) => void;
  error: (error: Error) => void;
}

export class Script {
  public readonly id: string;
  public readonly name: string;
  private readonly _console: Record<string, Function> = {};
  private readonly _context: Record<string, unknown> = {};
  private readonly _disposables: Function[] = [];
  private readonly _globals: Record<string, Function> = {};

  private readonly _events: {
    [key in keyof IScriptEvents]: IScriptEvents[key][];
  } = {
    out: [],
    error: [],
  };

  constructor(id: string, context: Record<string, unknown>) {
    this.id = id;
    this._context = context;
    this._console = Script._patchConsole(this);
    this._globals = Script._patchGlobals(this._disposables);
  }

  public async execute(code: string): Promise<void> {
    try {
      const contextKeys = Object.keys(this._context);
      const contextValues = Object.values(this._context);
      const globalsKeys = Object.keys(this._globals);
      const globalsValues = Object.values(this._globals);

      const scriptDefinitions = [...contextKeys, ...globalsKeys, 'console', code];
      const scriptImplementations = [...contextValues, ...globalsValues, this._console];
      const res = await new AsyncFunction(...scriptDefinitions)(...scriptImplementations);
      this._console.log('Result:', res);
    } catch (e) {
      this._console.error(e);
      this._events.error.forEach((handler) => handler(e));
    }
  }

  public cleanup(): void {
    this._disposables.forEach((disposable) => disposable());
  }

  private static _getTs(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  private static _patchConsole(script: Script): Record<string, Function> {
    const console = {};
    console['log'] = (...messages: string[]): void => {
      globalThis.console.log(...messages);
      script._events.out.forEach((handler) =>
        handler({ id: script.id, method: 'log', data: messages, timestamp: Script._getTs() }),
      );
    };
    console['debug'] = (...messages: string[]): void => {
      globalThis.console.debug(...messages);
      script._events.out.forEach((handler) =>
        handler({ id: script.id, method: 'debug', data: messages, timestamp: Script._getTs() }),
      );
    };
    console['info'] = (...messages: string[]): void => {
      globalThis.console.info(...messages);
      script._events.out.forEach((handler) =>
        handler({ id: script.id, method: 'info', data: messages, timestamp: Script._getTs() }),
      );
    };
    console['warn'] = (...messages: string[]): void => {
      globalThis.console.warn(...messages);
      script._events.out.forEach((handler) =>
        handler({ id: script.id, method: 'warn', data: messages, timestamp: Script._getTs() }),
      );
    };
    console['error'] = (...messages: string[]): void => {
      globalThis.console.error(...messages);
      script._events.out.forEach((handler) =>
        handler({ id: script.id, method: 'error', data: messages, timestamp: Script._getTs() }),
      );
    };

    return console;
  }

  private static _patchGlobals(disposables: Function[]): Record<string, Function> {
    const on = (eventName: string, handler: (data: unknown) => void): void => {
      globalThis.on(eventName, handler);
      disposables.push(() => {
        globalThis.removeEventListener(eventName, handler);
      });
    };

    const onNet = (eventName: string, handler: (data: unknown) => void): void => {
      globalThis.onNet(eventName, handler);
      disposables.push(() => {
        globalThis.removeEventListener(eventName, handler);
      });
    };

    const setTick = (handler: () => void): number => {
      const tickId = globalThis.setTick(handler);
      disposables.push(() => {
        globalThis.clearTick(tickId);
      });
      return tickId;
    };

    const setInterval = (handler: () => void, ms?: number): unknown => {
      const intervalId = globalThis.setInterval(handler, ms);
      disposables.push(() => {
        globalThis.clearInterval(intervalId as never);
      });
      return intervalId;
    };

    const setTimeout = (handler: () => void, ms?: number): unknown => {
      const timeoutId = globalThis.setTimeout(handler, ms);
      disposables.push(() => {
        globalThis.clearTimeout(timeoutId as never);
      });
      return timeoutId;
    };

    const RegisterCommand = (commandName: string, handler: (...args: unknown[]) => void): void => {
      let isActive = true;
      globalThis.RegisterCommand(commandName, (...args: unknown[]) => {
        if (isActive) {
          return handler(...args);
        }
      });
      disposables.push(() => {
        isActive = false;
      });
    };

    return {
      on,
      onNet,
      setTick,
      setInterval,
      setTimeout,
      RegisterCommand,
    };
  }

  public on<K extends keyof IScriptEvents>(eventName: K, handler: IScriptEvents[K]): void {
    this._events[eventName].push(handler);
  }
}
