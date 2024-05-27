import { TCreateScriptModel, TScript } from '../models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TScriptsStore = {
  openScriptIds: string[];
  scripts: TScript[];
  activeScriptId?: string;
};

const initialState: TScriptsStore = {
  openScriptIds: [],
  scripts: [],
  activeScriptId: undefined,
};

const getInitialState = (): TScriptsStore => {
  const scripts = localStorage.getItem('scripts');
  if (scripts) {
    return { ...initialState, ...JSON.parse(scripts) };
  }

  return initialState;
};

const fallback = (value: string | undefined, fallback: string): string => {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value;
};

const slice = createSlice({
  name: 'scripts',
  initialState: getInitialState(),
  reducers: {
    createScript(state, action: PayloadAction<TCreateScriptModel>) {
      const id = window.crypto.randomUUID();
      state.scripts.push({
        ...action.payload,
        id,
        content: '',
      });
      state.openScriptIds.push(id);
      state.activeScriptId = id;
    },
    updateScriptName(state, action: PayloadAction<{ id: string; name?: string }>) {
      const script = state.scripts.find((script) => script.id === action.payload.id);
      if (script) {
        script.name = fallback(action.payload.name, 'Untitled');
      }
    },
    updateScriptContent(state, action: PayloadAction<{ id: string; content: string }>) {
      const script = state.scripts.find((script) => script.id === action.payload.id);
      if (script) {
        script.content = action.payload.content;
      }
    },
    deleteScript(state, action: PayloadAction<string>) {
      state.scripts = state.scripts.filter((script) => script.id !== action.payload);
    },
    setScripts: (state, action) => {
      state.scripts = action.payload;
    },
    setActiveScript: (state, action) => {
      state.activeScriptId = action.payload;
      state.openScriptIds = [...new Set([...state.openScriptIds, action.payload])];
    },
    closeScript: (state, action: PayloadAction<string>) => {
      state.openScriptIds = state.openScriptIds.filter((id) => id !== action.payload);
      if (state.activeScriptId === action.payload) {
        state.activeScriptId = state.openScriptIds[state.openScriptIds.length - 1];
      }
    },
  },
});

export const scriptsReducer = slice.reducer;

export const {
  closeScript,
  createScript,
  deleteScript,
  setScripts,
  setActiveScript,
  updateScriptName,
  updateScriptContent,
} = slice.actions;
