export const patchGlobals = (): Record<string, Function> => {
  const res = {
    on: [] as { eventName: string; handler: Function }[],
    onNet: [] as { eventName: string; handler: Function }[],
    setTick: [] as number[],
    setInterval: [] as unknown[],
    setTimeout: [] as unknown[],
  };

  const __dispose = (): void => {
    res.on.forEach(({ eventName, handler }) => {
      globalThis.removeEventListener(eventName, handler);
    });

    res.onNet.forEach(({ eventName, handler }) => {
      globalThis.removeEventListener(eventName, handler);
    });

    res.setTick.forEach((id) => {
      globalThis.clearTick(id);
    });

    res.setInterval.forEach((id) => {
      globalThis.clearInterval(id as never);
    });

    res.setTimeout.forEach((id) => {
      globalThis.clearTimeout(id as never);
    });
  };

  const on = (eventName: string, handler: (data: unknown) => void): void => {
    globalThis.on(eventName, handler);
  };

  const onNet = (eventName: string, handler: (data: unknown) => void): void => {
    globalThis.onNet(eventName, handler);
  };

  const setTick = (handler: () => void): number => {
    return globalThis.setTick(handler);
  };

  const setInterval = (handler: () => void, ms?: number): unknown => {
    return globalThis.setInterval(handler, ms);
  };

  const setTimeout = (handler: () => void, ms?: number): unknown => {
    return globalThis.setTimeout(handler, ms);
  };

  return {
    on,
    onNet,
    setTick,
    setInterval,
    setTimeout,
    __dispose,
  };
};
