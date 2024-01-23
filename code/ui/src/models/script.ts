import { EScriptLanguage } from './script-language.ts';
import { EScriptSide } from './script-side.ts';

export type TScriptOutput = {
  id: string;
  method: 'log' | 'debug' | 'info' | 'warn' | 'error';
  data: string[];
  timestamp: string;
};

export type TScript = {
  outputBuffer: TScriptOutput[];
  id: string;
  name: string;
  side: EScriptSide;
  language: EScriptLanguage;
  content: string;
};
