import { emitNUI, onNUI } from './ui';
import { TConsoleOutput } from '@lib/shared';
import './runner';

const commandName = 'toggleEditor';

const noop = (): void => null;

let tick = null;

const openEditor = (): void => {
  SetNuiFocus(true, true);
  SetNuiFocusKeepInput(true);
  SetPlayerControl(PlayerId(), false, 0);
  emitNUI('editor:isOpen', true);
  tick = setTick(() => {
    DisableAllControlActions(0);
  });
};

const closeEditor = (): void => {
  SetNuiFocus(false, false);
  SetPlayerControl(PlayerId(), true, 0);
  emitNUI('editor:isOpen', false);
  clearTick(tick);
  tick = undefined;
};

let isOpen = false;

const toggleEditor = (): void => {
  isOpen = !isOpen;
  if (!isOpen) {
    closeEditor();
  } else {
    openEditor();
  }
};

onNUI('bcl-runcode:close', () => {
  isOpen = false;
  closeEditor();
});

onNUI('bcl-runcode::run::js::server', (...args: unknown[]) => emitNet('bcl-code:runCode::js::server', ...args));

if (GetGameName() === 'fivem') {
  RegisterCommand('+' + commandName, noop, false);
  RegisterCommand('-' + commandName, toggleEditor, false);
  RegisterKeyMapping('+' + commandName, 'Toggle editor', 'keyboard', 'F4');
}

RegisterCommand(
  'bclruncode',
  () => {
    toggleEditor();
  },
  false,
);

onNet('editor:output', (output: TConsoleOutput) => {
  emitNUI('editor:output', output);
});

onNet('editor:clear', () => {
  emitNUI('editor:clear');
});
