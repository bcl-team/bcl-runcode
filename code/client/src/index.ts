import { emitNUI, onNUI } from './ui';
import { TConsoleOutput } from '@lib/shared';
import './runner';

const commandName = 'toggleEditor';

const noop = (): void => null;


const openEditor = (): void => {
  emitNUI('editor:isOpen', true);
  SetNuiFocus(true, true);
};

const closeEditor = (): void => {
  emitNUI('editor:isOpen', false);
  SetNuiFocus(false, false);
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

const gameName = GetGameName();

if (gameName === 'fivem') {
  RegisterCommand('+' + commandName, noop, false);
  RegisterCommand('-' + commandName, toggleEditor, false);
  RegisterKeyMapping('+' + commandName, 'Toggle editor', 'keyboard', 'F4');
} else if (gameName === 'redm') {
  setTick(() => {
    // F4
    DisableControlAction(0, 0x1F6D95E5, true);
    if (IsDisabledControlJustPressed(0, 0x1F6D95E5)) {
      toggleEditor();
    }
  });
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
