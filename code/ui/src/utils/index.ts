import { ITheme } from '../themes/theme.interface.ts';

export const asset = (path: string): string => {
  return `nui://${window.PARENT_RESOURCE_NAME}/assets/${path}`;
};

export const scale = (sizePx: number): string => {
  return 'calc(' + sizePx + 'px * var(--scale))';
};

export const fromTheme = <T extends keyof ITheme>(key: T): (({ theme }: { theme: ITheme }) => ITheme[T]) => {
  return ({ theme }) => theme[key];
};

export * from './language.tsx';
export * from './typings.ts';
