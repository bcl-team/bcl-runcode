import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TScript, TScriptOutput } from '../models';

type TScripsState = {
  scripts: TScript[];
  activeScript?: string;
  openScripts: string[];
};

const initialState: TScripsState = JSON.parse(localStorage.getItem('scripts') || 'null') || {
  scripts: [],
  activeScript: undefined,
  openScripts: [],
};

const save = (state: TScripsState): void => {
  localStorage.setItem('scripts', JSON.stringify(state));
};

const scriptsSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    setScripts: (state, action: PayloadAction<TScripsState>) => {
      return action.payload;
    },
    addScript: (state, action: PayloadAction<TScript>): void => {
      state.scripts.push(action.payload);
      state.activeScript = action.payload.id;
      save(state);
    },
    addOutput(state, actionL: PayloadAction<{ id: string; output: TScriptOutput }>): void {
      const script = state.scripts.find((s) => s.id === actionL.payload.id);
      if (script) {
        script.outputBuffer.push(actionL.payload.output);
      }
      save(state);
    },
    setActiveScript: (state, action: PayloadAction<string>): void => {
      state.activeScript = action.payload;
      if (!state.openScripts.includes(action.payload)) {
        state.openScripts.push(action.payload);
      }
      save(state);
    },
    setScriptContent: (state, action: PayloadAction<{ id: string; content: string }>): void => {
      const script = state.scripts.find((s) => s.id === action.payload.id);
      if (script) {
        script.content = action.payload.content;
        save(state);
      }
    },
    removeScript: (state, action: PayloadAction<string>): void => {
      state.scripts = state.scripts.filter((s) => s.id !== action.payload);
      save(state);
    },
    clearOutput(state, action: PayloadAction<string>): void {
      const script = state.scripts.find((s) => s.id === action.payload);
      if (script) {
        script.outputBuffer = [];
        save(state);
      }
    },
  },
});

export const { clearOutput, addOutput, setScriptContent, setScripts, addScript, removeScript, setActiveScript } =
  scriptsSlice.actions;
export const scriptsReducer = scriptsSlice.reducer;
