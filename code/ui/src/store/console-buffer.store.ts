import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TConsoleOutput = {
  id: string;
  method: 'log' | 'debug' | 'info' | 'warn' | 'error';
  data: unknown[];
  timestamp: string;
};

export type TConsoleBuffer = {
  [scriptId: string]: TConsoleOutput[];
};

const initialState: TConsoleBuffer = {};

const slice = createSlice({
  name: 'consoleBuffer',
  initialState,
  reducers: {
    addOutput(state, action: PayloadAction<[string, TConsoleOutput]>) {
      const [scriptId, output] = action.payload;
      if (!state[scriptId]) {
        state[scriptId] = [];
      }
      output.id = window.crypto.randomUUID();
      state[scriptId].push(output);
    },
    clearBuffer(state) {
      Object.keys(state).forEach((key) => {
        delete state[key];
      });
    },
    clearBufferById(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const { addOutput, clearBuffer, clearBufferById } = slice.actions;
export const consoleBufferReducer = slice.reducer;
