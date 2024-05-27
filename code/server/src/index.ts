import { Script } from '@lib/shared';

const scripts = new Map<string, Script>();

const isError = (e: unknown): e is Error => {
  return e instanceof Error;
};

onNet('bcl-runcode:run:js:server', async (runId: number, code: { id: string; language: string; code: string }) => {
  const source = global.source.toString();

  const id = `${source}::${code.id}`;

  let script: Script;
  if (scripts.has(id)) {
    script = scripts.get(id);
    script.cleanup();
  } else {
    const getPlayerPed = (): number => GetPlayerPed(source);
    script = new Script(code.id, {
      playerId: source,
      get playerPed() {
        return getPlayerPed();
      },
      get currentVehicle() {
        return GetVehiclePedIsIn(getPlayerPed(), false);
      },
      get lastVehicle() {
        return GetVehiclePedIsIn(getPlayerPed(), true);
      },
    });

    script.on('out', (output) => {
      output.data = output.data.map((x) => {
        if (isError(x)) {
          return {
            message: x.message,
            stack: x.stack,
          };
        }
        return x;
      });
      emitNet('bcl-runcode:output', source, code.id, output);
    });

    scripts.set(id, script);
  }

  await script.execute(code.code);
  emitNet('bcl-runcode:run:done', source, runId);
});

on('playerDropped', () => {
  const source = global.source.toString();
  [...scripts.entries()].forEach(([id, script]) => {
    if (id.startsWith(source)) {
      script.cleanup();
      scripts.delete(id);
    }
  });
});
