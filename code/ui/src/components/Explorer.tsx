import React, { FC } from 'react';
import styled from 'styled-components';
import { fromTheme, scale } from '../utils';
import { VscNewFile } from 'react-icons/vsc';
import { IconButton } from './IconButton.tsx';
import { Strings } from '../const';
import { useNewFileModal } from '../services/useNewFileModal.ts';
import { useAppDispatch, useAppSelector } from '../store';
import { ScriptPreview } from './ScriptPreview.tsx';
import { createScript } from '../store/scripts.store.ts';

const Wrapper = styled.div`
  background-color: ${fromTheme('backgroundColor')};
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .explorer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${fromTheme('activeTextColor')};
    font-size: ${scale(10)};
    box-sizing: border-box;
    padding: ${scale(5)} ${scale(5)};
    border-bottom: 1px solid ${fromTheme('borderColor')};
    user-select: none;
    height: ${scale(25)};
    flex-shrink: 0;
  }

  .explorer-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
      width: ${scale(4)};
    }

    &::-webkit-scrollbar-track {
      background: ${fromTheme('secondaryColor')};
    }

    &::-webkit-scrollbar-thumb {
      background: ${fromTheme('scrollBarColor')};
    }

    .divider {
      height: 1px;
      background-color: ${fromTheme('borderColor')};
      width: 100%;
    }
  }
`;

export const Explorer: FC = () => {
  const _createScript = useNewFileModal();
  const { scripts, activeScriptId } = useAppSelector((state) => state.scripts);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <div className="explorer-header">
        <div className="explorer-header-label">
          <span>{Strings.Explorer}</span>
        </div>
        <IconButton
          onClick={async () => {
            const result = await _createScript();
            if (!result) {
              return;
            }
            dispatch(createScript(result));
          }}
        >
          <VscNewFile />
        </IconButton>
      </div>
      <div className="explorer-body">
        {scripts.map((script) => {
          return (
            <React.Fragment key={script.id}>
              <ScriptPreview
                isActive={script.id === activeScriptId}
                id={script.id}
                name={script.name}
                language={script.language}
                side={script.side}
              />
              <div className="divider" />
            </React.Fragment>
          );
        })}
      </div>
    </Wrapper>
  );
};
