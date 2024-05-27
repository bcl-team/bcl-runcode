import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  createScript,
  deleteScript,
  scriptsReducer,
  setActiveScript,
  updateScriptContent,
  updateScriptName,
} from './scripts.store.ts';
import { consoleBufferReducer } from './console-buffer.store.ts';

const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(createScript, deleteScript, setActiveScript, updateScriptName, updateScriptContent),
  effect: (action, listenerApi) =>
    localStorage.setItem('scripts', JSON.stringify((listenerApi.getState() as RootState).scripts)),
});

export const appStore = configureStore({
  reducer: {
    scripts: scriptsReducer,
    consoleBuffer: consoleBufferReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
