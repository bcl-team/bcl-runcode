import { emitNUI, onNUI } from './ui';
import { runCode } from './runner';
import { TConsoleOutput } from '@lib/shared';

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

onNUI('editor:close', () => {
  isOpen = false;
  closeEditor();
});

onNUI('runCode', async (code: { side: string; language: string; id: string; code: string }) => {
  if (code.side === 'server') {
    if (code.language === 'js') {
      emitNet('runCode:js', code);
    } else {
      emitNet('runCode:lua', code);
    }
  } else {
    if (code.language === 'js') {
      await runCode(code);
    } else {
      emit('runCode:lua', code);
    }
  }
});

RegisterCommand('+' + commandName, noop, false);
RegisterCommand('-' + commandName, toggleEditor, false);
RegisterKeyMapping('+' + commandName, 'Toggle editor', 'keyboard', 'F4');

onNet('editor:output', (output: TConsoleOutput) => {
  emitNUI('editor:output', output);
});

onNet('editor:clear', () => {
  emitNUI('editor:clear');
});
