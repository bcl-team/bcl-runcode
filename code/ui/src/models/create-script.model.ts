import { EScriptLanguage } from './script-language.ts';
import { EScriptSide } from './script-side.ts';

export type TCreateScriptModel = {
  name: string;
  language: EScriptLanguage;
  side: EScriptSide;
};
