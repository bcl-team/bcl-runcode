/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/* eslint-disable @typescript-eslint/naming-convention */
import { ITheme } from './themes/theme.interface.ts';

declare global {
  declare function GetParentResourceName(): string;

  interface Window {
    WEBVIEW_ENV: 'BROWSER' | 'GAME';
    PARENT_RESOURCE_NAME: string;
  }
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}

export {};
