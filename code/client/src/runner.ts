import { patchGlobals, patchConsole } from '@lib/shared';
import { emitNUI } from './ui';

const AsyncFunction = Object.getPrototypeOf(async function () {
  /**/
}).constructor;

export const runCode = async (code: { id: string; code: string }): Promise<void> => {
  const { __dispose, ...globals } = patchGlobals();

  const console = patchConsole(code.id, (event, output) => {
    emitNUI(event, output);
  });

  try {
    const res = await new AsyncFunction('playerPedId', 'playerId', 'console', ...Object.keys(globals), code.code)(
      PlayerPedId(),
      PlayerId(),
      console,
      ...Object.values(globals),
    );

    console.log(res);
  } catch (e) {
    console.error(e.message);
  }
  __dispose();
};

onNet('editor:runJs', runCode);
