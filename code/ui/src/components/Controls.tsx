import React, { FC } from 'react';
import styled from 'styled-components';
import { VscAdd, VscPlay } from 'react-icons/vsc';
import { NewScriptPopUp } from './NewScript.tsx';
import { TScript } from '../models';
import { useAppDispatch, useAppSelector } from '../store';
import { addScript } from '../store/scripts.store.ts';
import { client } from '../client';

const Wrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  button {
    width: 40px;
    height: 100%;
    svg {
      height: 20px;
      width: 20px;
    }

    &:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.hover};
    }
  }
`;

export const Controls: FC = () => {
  const [newScript, setNewScript] = React.useState(false);
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.scripts);

  const runCode = (): void => {
    const activeScript = store.scripts.find((x) => x.id === store.activeScript);
    if (!activeScript) {
      return;
    }
    client.emit(`runCode`, {
      code: activeScript.content,
      language: activeScript.language,
      side: activeScript.side,
      id: activeScript.id,
    });
  };

  return (
    <>
      <Wrapper>
        <button onClick={() => setNewScript(true)}>
          <VscAdd />
        </button>
        <button onClick={runCode}>
          <VscPlay />
        </button>
      </Wrapper>
      {newScript && (
        <NewScriptPopUp
          onDone={(script: TScript) => {
            setNewScript(false);
            if (!script) {
              return;
            }
            dispatch(addScript(script));
          }}
        />
      )}
    </>
  );
};
