import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import styled from 'styled-components';
import { fromTheme, getLanguageIcon, getScriptSide, scale, useTypes } from '../utils';
import { useAppDispatch, useAppSelector } from '../store';
import { IconButton } from './IconButton.tsx';
import { VscClose, VscCode } from 'react-icons/vsc';
import { closeScript, setActiveScript, updateScriptContent } from '../store/scripts.store.ts';
import { EScriptLanguage, EScriptSide } from '../models';
import { Strings } from '../const';
import { IDisposable } from 'monaco-editor';
import debounce from 'debounce';
import { useDebouncedCallback } from 'use-debounce';
import { client } from '../services';

const rate = window.innerHeight / 1080;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${fromTheme('backgroundColor')};

  .editor-controls {
    margin: 0;
    height: ${scale(25)};
    background-color: ${fromTheme('backgroundColor')};
    box-sizing: border-box;
    border-bottom: 1px solid ${fromTheme('borderColor')};
    display: flex;
    align-self: flex-end;
    justify-content: space-between;
    padding-right: ${scale(5)};
  }

  .editor-tabs {
    overflow-y: auto;
    width: 90%;
    padding: 0;
    margin: 0;
    display: flex;
    overflow-x: auto; /* Enables horizontal scrolling */
    white-space: nowrap; /* Prevents wrapping of items to the next line */

    /* width */
    &::-webkit-scrollbar {
      height: ${scale(1)};
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: ${fromTheme('secondaryColor')};
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: ${fromTheme('scrollBarColor')};
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    li {
      user-select: none;
      box-sizing: border-box;

      border-top-right-radius: ${scale(5)};
      border-top-left-radius: ${scale(5)};
      display: flex;
      border: 1px solid ${fromTheme('borderColor')};

      padding-left: ${scale(5)};
      align-self: end;

      justify-content: space-between;
      align-items: center;
      padding-right: 0;
      color: ${fromTheme('activeTextColor')};
      background-color: ${fromTheme('backgroundColor')};

      &.active {
        background-color: ${fromTheme('secondaryColor')};
      }

      .script-label {
        padding: 0 ${scale(5)};
        font-size: ${scale(10)};
        vertical-align: middle;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${scale(5)};
      }

      button {
        width: ${scale(20)};
        height: ${scale(20)};
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .editor-actions {
    border-left: 1px solid ${fromTheme('borderColor')};
    box-sizing: border-box;
    padding-left: ${scale(2)};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${fromTheme('activeTextColor')};
    user-select: none;

    svg {
      width: ${scale(15)};
      height: ${scale(15)};
    }

    .action {
      display: flex;
      align-items: center;
      gap: ${scale(5)};
      border-radius: ${scale(3)};
      color: ${fromTheme('activeTextColor')};
      box-sizing: border-box;
      padding: ${scale(2)};
      font-size: ${scale(8)};
      &:hover {
        cursor: pointer;
        background-color: ${fromTheme('activeColor')};
      }
    }
  }
  .monaco-editor-content {
    box-sizing: border-box;
    height: calc(100% - ${scale(25)});
  }
`;

const getLanguageCode = (language: EScriptLanguage): string => {
  if (language === 'js') {
    return 'javascript';
  }
  if (language === 'lua') {
    return 'lua';
  }

  return 'javascript';
};

export const CodeEditor: FC = () => {
  const { openScriptIds, scripts, activeScriptId } = useAppSelector((x) => x.scripts);
  const dispatch = useAppDispatch();
  const activeScript = scripts.find((x) => x.id === activeScriptId);
  const types = useTypes(activeScript?.language, activeScript?.side);
  const disposables = useRef<IDisposable[]>([]);
  const monaco = useMonaco();
  const codeRef = useRef<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const scriptNames = useMemo(() => {
    return openScriptIds.reduce(
      (acc, scriptId) => {
        const script = scripts.find((x) => x.id === scriptId);
        if (script) {
          acc.push({
            label: script.name,
            id: script.id,
            isActive: script.id === activeScriptId,
            language: script.language,
            side: script.side,
          });
        }
        return acc;
      },
      [] as { label: string; id: string; isActive: boolean; language: EScriptLanguage; side: EScriptSide }[],
    );
  }, [openScriptIds]);

  useEffect(() => {
    disposables.current.forEach((x) => x.dispose());
    disposables.current = [];

    if (!monaco) {
      return;
    }

    if (!activeScript) {
      return;
    }

    if (activeScript.language === 'js') {
      monaco?.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
      });

      types.map((x) => {
        const l = monaco?.languages.typescript.javascriptDefaults.addExtraLib(x);
        if (l) {
          disposables.current.push(l);
        }
      });
    }
  }, [types, activeScript?.id]);

  const handleTabClick = (id: string, e: React.MouseEvent): void => {
    if (e.button === 1) {
      dispatch(closeScript(id));
    }

    if (e.button === 0) {
      dispatch(setActiveScript(id));
    }
  };

  const save = useDebouncedCallback((id: string, content: string) => {
    if (activeScript) {
      dispatch(updateScriptContent({ id, content }));
    }
  }, 500);

  useEffect(() => {
    codeRef.current = activeScript?.content ?? '';
  }, [activeScript?.id]);

  const executeCode = (): void => {
    if (isExecuting) {
      return;
    }
    setIsExecuting(true);
    if (!activeScript) {
      return;
    }
    const code = codeRef.current;
    client.emit(`bcl-runcode:run:${activeScript.language}:${activeScript.side}`, {
      id: activeScript.id,
      language: activeScript.language,
      code,
    });
    setIsExecuting(false);
  };

  return (
    <Wrapper>
      <div className="editor-controls">
        <ul className="editor-tabs">
          {scriptNames.map((script) => (
            <li
              className={script.isActive ? 'active' : ''}
              onMouseDown={handleTabClick.bind(null, script.id)}
              key={script.id}
            >
              <div className="script-label">
                {getLanguageIcon(script.language)}
                {`[${getScriptSide(script.side)}]`}
                <div>{script.label}</div>
              </div>
              <IconButton onClick={() => dispatch(closeScript(script.id))}>
                <VscClose />
              </IconButton>
            </li>
          ))}
        </ul>
        <div className="editor-actions">
          <div className="execute action" onClick={executeCode}>
            <div>{Strings.ExecuteCode}</div>
            <VscCode />
          </div>
        </div>
      </div>
      <div className="monaco-editor-content">
        {activeScript && (
          <MonacoEditor
            onChange={(e) => {
              save(activeScript.id, e ?? '');
              codeRef.current = e ?? '';
            }}
            theme={'vs-dark'}
            height={'100%'}
            options={{
              padding: {
                top: Math.round(rate * 10),
                bottom: Math.round(rate * 10),
              },
              fontSize: Math.round(rate * 12),
            }}
            value={activeScript?.content}
            language={getLanguageCode(activeScript.language)}
          />
        )}
      </div>
    </Wrapper>
  );
};
