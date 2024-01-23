import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: 'info',
  base: '/build/ui',
  build: {
    outDir: (global as never as Record<string, string>).WEBVIEW_ENV === 'GAME' ? '' : '../../build/ui',
    emptyOutDir: true,
  },
  resolve: {},
  plugins: [
    react({
      tsDecorators: true,
    }),
    svgr(),
    // (DynamicPublicDirectory as never as { default: (arr: string[]) => PluginOption }).default(['public', '../..']),
  ],
});
