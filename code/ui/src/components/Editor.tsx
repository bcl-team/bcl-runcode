import { FC, useCallback, useEffect, useRef, useState } from 'react';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import styled from 'styled-components';
import { Console } from 'console-feed';
import { VscTrash } from 'react-icons/vsc';
import { useAppDispatch, useAppSelector } from '../store';
import { IDisposable } from 'monaco-editor';
import debounce from 'debounce';
import { clearOutput, setScriptContent } from '../store/scripts.store.ts';
import { EScriptLanguage } from '../models';

const Wrapper = styled.div`
  --editor-view-height: 75%;
  height: 100%;
  .editor {
    height: var(--editor-view-height);
  }

  .output {
    box-sizing: border-box;
    border-top: 1px solid black;
    background-color: #242424;

    height: calc(100% - var(--editor-view-height));
    font-family: Consolas, 'Courier New', monospace;

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      box-sizing: border-box;
      padding-left: 20px;
      border-bottom: 1px solid black;
      height: 26px;

      svg {
        height: 16px;
        width: 16px;
      }

      button:hover {
        cursor: pointer;
      }
    }

    .logs {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 26px);
      /* width */
      &::-webkit-scrollbar {
        width: 2px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #666;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
  }
`;

const getTypes = async (): Promise<{ server: string[]; client: string[] }> => {
  const defFiles = ['index.d.ts'];
  const defFilesServer = [...defFiles, 'natives_server.d.ts'];
  const defFilesClient = [...defFiles, 'natives_universal.d.ts'];

  const prefix = 'https://unpkg.com/@citizenfx/{}/';
  const prefixClient = prefix.replace('{}', 'client');
  const prefixServer = prefix.replace('{}', 'server');

  const [client, server] = await Promise.all([
    Promise.all(defFilesClient.map((file) => fetch(prefixClient + file).then((res) => res.text()))),
    Promise.all(defFilesServer.map((file) => fetch(prefixServer + file).then((res) => res.text()))),
  ]);

  client.push('declare const playerPedId: number;');
  client.push('declare const playerId: number;');
  return { client, server };
};

const getLanguageCode = (language: EScriptLanguage): string => {
  if (language === 'js') {
    return 'javascript';
  }
  if (language === 'lua') {
    return 'lua';
  }

  return 'javascript';
};

export const Editor: FC = () => {
  const [types, setTypes] = useState<{ client: string[]; server: string[]; isLoading: boolean }>({
    client: [],
    server: [],
    isLoading: true,
  });
  const dispatch = useAppDispatch();
  const monaco = useMonaco();
  const scripts = useAppSelector((x) => x.scripts);
  const disposables = useRef<IDisposable[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);
  const activeScript = scripts.scripts.find((x) => x.id === scripts.activeScript);

  const save = useCallback(
    debounce((v: string) => {
      dispatch(setScriptContent({ id: scripts.activeScript!, content: v }));
    }, 500),
    [scripts.activeScript],
  );

  useEffect(() => {
    getTypes().then((types) => {
      setTypes({ ...types, isLoading: false });
    });
  }, []);

  useEffect(() => {
    if (!monaco) {
      return;
    }
  }, [monaco?.editor]);

  useEffect(() => {
    const element = logsRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [activeScript?.outputBuffer]);

  useEffect(() => {
    disposables.current.forEach((x) => x.dispose());
    disposables.current = [];

    if (!monaco) {
      return;
    }

    const activeScript = scripts.scripts.find((x) => x.id === scripts.activeScript);

    if (!activeScript) {
      return;
    }

    if (activeScript.language === 'js') {
      monaco?.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true,
      });

      if (activeScript.side === 'client') {
        types.client.map((x) => {
          const l = monaco?.languages.typescript.javascriptDefaults.addExtraLib(x);
          if (l) {
            disposables.current.push(l);
          }
        });
      } else {
        types.server.map((x) => {
          const l = monaco?.languages.typescript.javascriptDefaults.addExtraLib(x);
          if (l) {
            disposables.current.push(l);
          }
        });
      }
    }
  }, [types, scripts.activeScript]);

  if (!scripts.activeScript) {
    return;
  }

  return (
    <Wrapper>
      <div className="editor">
        <MonacoEditor
          onChange={(v) => {
            save(v!);
          }}
          theme={'vs-dark'}
          height={'100%'}
          value={scripts.scripts.find((x) => x.id === scripts.activeScript)?.content ?? ''}
          language={getLanguageCode(
            scripts.scripts.find((x) => x.id === scripts.activeScript)?.language ?? EScriptLanguage.JavaScript,
          )}
        />
      </div>
      <div className="output">
        <div className="output-header">
          <div>OUTPUT</div>
          <button onClick={() => (activeScript ? dispatch(clearOutput(activeScript.id)) : null)}>
            <VscTrash />
          </button>
        </div>
        <div className="logs" ref={logsRef}>
          <Console
            logs={scripts.scripts.find((x) => x.id === scripts.activeScript)?.outputBuffer ?? []}
            logGrouping={false}
            variant="dark"
          />
        </div>
      </div>
    </Wrapper>
  );
};
