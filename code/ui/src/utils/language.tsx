import { EScriptLanguage, EScriptSide } from '../models';
import React, { ReactNode } from 'react';
import { SiLua } from 'react-icons/si';
import { IoLogoJavascript } from 'react-icons/io';

export const getLanguageIcon = (language: EScriptLanguage): ReactNode => {
  switch (language) {
    case EScriptLanguage.JavaScript:
      return <IoLogoJavascript />;
    case EScriptLanguage.Lua:
      return <SiLua />;
    default:
      throw new Error(`Unknown language: ${language}`);
  }
};

export const getScriptSide = (side: EScriptSide): ReactNode => {
  switch (side) {
    case EScriptSide.Client:
      return 'CL';
    case EScriptSide.Server:
      return 'SV';
    default:
      throw new Error(`Unknown side: ${side}`);
  }
};
