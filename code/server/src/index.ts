import { patchGlobals, patchConsole } from '@lib/shared';

const AsyncFunction = Object.getPrototypeOf(async function () {
  /**/
}).constructor;

onNet('runCode:js', async (code: { id: string; language: string; code: string; side: string }) => {
  const source = global.source;

  const { __dispose, ...globals } = patchGlobals();

  const console = patchConsole(code.id, (event, output) => {
    emitNet(event, source, output);
  });

  try {
    const res = await new AsyncFunction('source', 'console', ...Object.keys(globals), code.code)(
      source,
      console,
      ...Object.values(globals)
    );

    console.log(res);
  } catch (e) {
    console.error(e.message);
  }
  __dispose();
});
