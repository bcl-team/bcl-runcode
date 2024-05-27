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
    res.on.push({ eventName, handler });
    globalThis.on(eventName, handler);
  };

  const onNet = (eventName: string, handler: (data: unknown) => void): void => {
    res.onNet.push({ eventName, handler });
    globalThis.onNet(eventName, handler);
  };

  const setTick = (handler: () => void): number => {
    res.setTick.push(globalThis.setTick(handler));
    return globalThis.setTick(handler);
  };

  const setInterval = (handler: () => void, ms?: number): unknown => {
    res.setInterval.push(globalThis.setInterval(handler, ms));
    return globalThis.setInterval(handler, ms);
  };

  const setTimeout = (handler: () => void, ms?: number): unknown => {
    res.setTimeout.push(globalThis.setTimeout(handler, ms));
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
