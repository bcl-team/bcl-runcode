type THandler = (...args: unknown[]) => unknown;

export const onNUI = (name: string, handler: THandler): void => {
  RegisterNuiCallbackType(name);

  on(`__cfx_nui:${name}`, async (data: unknown, cb: THandler) => {
    const result = await handler(data);
    cb(result ?? null);
  });
};

export const emitNUI = (eventName: string, payload?: unknown): void => {
  SendNuiMessage(JSON.stringify({ eventName, payload }));
};
