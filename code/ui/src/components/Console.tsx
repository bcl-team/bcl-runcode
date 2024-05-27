import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../store';
import { fromTheme, scale } from '../utils';
import { Strings } from '../const';
import { Console as Console_ } from 'console-feed';
import { VscTrash } from 'react-icons/vsc';
import { clearBufferById } from '../store/console-buffer.store.ts';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .console-buffer-header {
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${fromTheme('secondaryColor')};
    border-bottom: 1px solid ${fromTheme('borderColor')};
    font-size: ${scale(10)};
    box-sizing: border-box;
    height: 15%;
    padding-inline: ${scale(5)};

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
        background-color: ${fromTheme('backgroundColor')};
      }
    }
  }

  .console-buffer-body {
    overflow-y: auto;
    padding: 5px;
    box-sizing: border-box;
    background-color: ${fromTheme('backgroundColor')};
    height: 85%;

    /* width */
    &::-webkit-scrollbar {
      width: ${scale(3)};
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
  }
`;

export const Console: FC = () => {
  const consoleBuffer = useAppSelector((state) => state.consoleBuffer);
  const activeScriptId = useAppSelector((state) => state.scripts.activeScriptId);
  const dispatch = useAppDispatch();
  const logs = consoleBuffer[activeScriptId!] ?? [];
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = logsRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [logs]);

  return (
    <Wrapper>
      <div className="console-buffer-header">
        <div>{Strings.Output}</div>
        <div className="action" onClick={() => dispatch(clearBufferById(activeScriptId!))}>
          <div>{Strings.ClearOutput}</div>
          <VscTrash />
        </div>
      </div>
      <div className="console-buffer-body" ref={logsRef}>
        <Console_
          styles={{
            BASE_FONT_SIZE: scale(10),
          }}
          variant="dark"
          logs={logs}
          logGrouping={false}
        />
      </div>
    </Wrapper>
  );
};
