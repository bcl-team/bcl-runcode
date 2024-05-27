import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useEvent } from '../services';
import { Events } from '../const/events.ts';
import { createPortal } from 'react-dom';
import { EScriptLanguage, EScriptSide, TCreateScriptModel } from '../models';
import { fromTheme, scale } from '../utils';
import { IconButton } from './IconButton.tsx';
import { VscClose } from 'react-icons/vsc';
import { Strings } from '../const';

const WindowWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Wrapper = styled.form`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-color: ${fromTheme('backgroundColor')};
  border: 1px solid ${fromTheme('borderColor')};
  width: ${scale(200)};
  color: ${fromTheme('activeTextColor')};
  user-select: none;
  border-radius: ${scale(3)};

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${scale(2)} ${scale(5)};
    border-bottom: 1px solid ${fromTheme('borderColor')};
    font-size: ${scale(10)};
    border-bottom: 1px solid ${fromTheme('borderColor')};
  }

  .modal-body {
    padding: ${scale(10)};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: ${scale(10)};

    select,
    input {
      box-sizing: border-box;
      outline: none;
      font-size: ${scale(8)};
      padding: ${scale(2)};
    }
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    padding: ${scale(5)};
    border-top: 1px solid ${fromTheme('borderColor')};
    button {
      font-size: ${scale(10)};
      border-radius: ${scale(3)};
      color: ${fromTheme('activeTextColor')};
      box-sizing: border-box;
      padding: ${scale(3)};
      &:hover {
        cursor: pointer;
        background-color: ${fromTheme('activeColor')};
      }
    }
  }
`;

type TResolver = (value: TCreateScriptModel) => void;

const NewFileModal_: FC = () => {
  const [resolver, setResolver] = useState<TResolver>(null!);

  const respond = (value: TCreateScriptModel): void => {
    setResolver(() => {
      resolver(value);
      return null!;
    });
  };

  useEvent(Events.OpenModal, async (createScript: TResolver): Promise<void> => {
    setResolver((r: TResolver): TResolver => {
      if (r) {
        r(null!);
      }
      return createScript;
    });
  });

  if (!resolver) {
    return;
  }

  return (
    <WindowWrapper>
      <Wrapper
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const formProps = Object.fromEntries(formData);

          respond(formProps as TCreateScriptModel);
        }}
        onReset={(e) => {
          e.preventDefault();
          respond(null!);
        }}
      >
        <div className="modal-header">
          <span>{Strings.NewScript}</span>
          <IconButton type={'reset'}>
            <VscClose />
          </IconButton>
        </div>
        <div className="modal-body">
          <input required name={'name'} type="text" placeholder={Strings.ScriptName} />
          <select name={'language'} id={'script-language'}>
            <option value={EScriptLanguage.JavaScript}>{Strings.JavaScript}</option>
            <option disabled value={EScriptLanguage.Lua}>
              {Strings.Lua}
            </option>
          </select>
          <select name={'side'} id={'script-side'}>
            <option value={EScriptSide.Client}>{Strings.Client}</option>
            <option value={EScriptSide.Server}>{Strings.Server}</option>
          </select>
        </div>
        <div className="controls">
          <button type={'submit'}>{Strings.CreateScript}</button>
        </div>
      </Wrapper>
    </WindowWrapper>
  );
};

export const NewFileModal: FC = () => {
  return createPortal(<NewFileModal_ />, document.body);
};
