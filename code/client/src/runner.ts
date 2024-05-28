import { Script, sleep } from '@lib/shared';
import { emitNUI, onNUI } from './ui';

const scripts = new Map<string, Script>();

const isError = (e: unknown): e is Error => {
  return e instanceof Error;
};

const pushLog = (codeId: string, output: unknown): void => {
  emitNUI('bcl-runcode:output', [codeId, output]);
};

onNet('bcl-runcode:output', pushLog);

onNUI('bcl-runcode:run:js:client', async (code: { id: string; language: string; code: string }) => {
  const id = code.id;
  let script: Script;
  if (scripts.has(id)) {
    script = scripts.get(id);
    script.cleanup();
  } else {
    const getPlayerPed = (): number => GetPlayerPed(-1);
    script = new Script(code.id, {
      get playerId() {
        return PlayerId();
      },
      get serverId() {
        return GetPlayerServerId(PlayerId());
      },
      get playerPed() {
        return getPlayerPed();
      },
      get currentVehicle() {
        return GetVehiclePedIsIn(getPlayerPed(), false);
      },
      get lastVehicle() {
        return GetVehiclePedIsIn(getPlayerPed(), true);
      },
      requestModel: async (model: string | number): Promise<void> => {
        if (!IsModelInCdimage(model)) {
          throw new Error(`Model ${model} not found`);
        }

        RequestModel(model);
        if (!HasModelLoaded(model)) {
          RequestModel(model);
          while (!HasModelLoaded(model)) {
            await sleep(10);
          }
        }
      },
      requestAnimDict: async (dict: string): Promise<void> => {
        if (!DoesAnimDictExist(dict)) {
          throw new Error(`Anim dict ${dict} not found`);
        }

        if (!HasAnimDictLoaded(dict)) {
          RequestAnimDict(dict);
          while (!HasAnimDictLoaded(dict)) {
            await sleep(10);
          }
        }
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
      pushLog(code.id, output);
    });

    scripts.set(id, script);
  }

  await script.execute(code.code);
});

let runIdx = 0;
const cbs: Record<string, Function> = {};

onNet('bcl-runcode:run:done', (idx: number) => {
  cbs[idx]();
  delete cbs[idx];
});

onNUI('bcl-runcode:run:js:server', async (code: { id: string; language: string; code: string }) => {
  return new Promise((r) => {
    const idx = runIdx++;
    cbs[idx] = r;
    emitNet('bcl-runcode:run:js:server', idx, code);
  });
});
