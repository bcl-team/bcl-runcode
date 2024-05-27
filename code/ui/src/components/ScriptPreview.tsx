import React, { FC, ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import { fromTheme, getLanguageIcon, getScriptSide, scale } from '../utils';
import { EScriptLanguage, EScriptSide } from '../models';
import { SiLua, SiJavascript } from 'react-icons/si';
import { IconButton } from './IconButton.tsx';
import { VscEdit, VscSave, VscTrash } from 'react-icons/vsc';
import { useAppDispatch } from '../store';
import { deleteScript, setActiveScript, updateScriptName } from '../store/scripts.store.ts';

export type TScriptPreviewProps = {
  name: string;
  language: EScriptLanguage;
  side: EScriptSide;
  id: string;
  isActive: boolean;
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${scale(5)};
  max-width: 100%;
  padding: ${scale(5)};
  box-sizing: border-box;
  user-select: none;

  &.active {
    background-color: ${fromTheme('activeColor')};
  }

  .script-preview {
    display: flex;
    align-items: flex-start;
    gap: ${scale(5)};
  }

  .script-preview-icon {
    width: ${scale(12)};
    height: ${scale(12)};
    svg {
      width: 100%;
      height: 100%;
    }
  }

  .script-preview-label {
    display: flex;
    align-items: flex-end;
    gap: ${scale(5)};
    font-size: ${scale(9)};
  }

  .script-preview-name {
    display: inline-block;
    overflow: hidden;
    outline: none;
    max-width: ${scale(100)};
    max-height: ${scale(9)};
    text-overflow: ellipsis;
    border-bottom: 1px solid transparent;
    &.editing {
      border-bottom: 1px solid ${fromTheme('activeTextColor')};
    }
  }

  .controls {
    display: flex;
    gap: ${scale(5)};
    align-items: center;
    justify-content: center;
  }

  * {
    color: ${fromTheme('activeTextColor')};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ScriptPreview: FC<TScriptPreviewProps> = ({ name, language, side, id, isActive }) => {
  const [isEditing, setIsEditing] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  return (
    <Wrapper
      className={isActive ? 'active' : ''}
      onClick={() => {
        dispatch(setActiveScript(id));
      }}
    >
      <div className="script-preview">
        <div className="script-preview-icon">{getLanguageIcon(language)}</div>
        <div className="script-preview-label">
          <div className="script-preview-side">[{getScriptSide(side)}]</div>
          <div
            ref={nameRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isEditing) {
                e.preventDefault();
                setIsEditing(false);
                dispatch(updateScriptName({ id, name: nameRef.current?.innerText }));
              }
            }}
            data-rh="tooltip"
            contentEditable={isEditing}
            className={'script-preview-name' + (isEditing ? ' editing' : '')}
            suppressContentEditableWarning={true}
          >
            {name}
          </div>
        </div>
      </div>
      <div className="controls">
        <IconButton
          onClick={() =>
            setIsEditing((wasEditing) => {
              if (wasEditing) {
                dispatch(updateScriptName({ id, name: nameRef.current?.innerText }));
              } else {
                setTimeout(() => nameRef.current?.focus(), 0);
              }
              return !wasEditing;
            })
          }
        >
          {isEditing ? <VscSave /> : <VscEdit />}
        </IconButton>
        <IconButton onClick={() => dispatch(deleteScript(id))}>
          <VscTrash />
        </IconButton>
      </div>
    </Wrapper>
  );
};
