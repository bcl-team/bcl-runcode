import React, { FC, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { EScriptLanguage, EScriptSide, TScript } from '../models';
import { VscClose, VscCode } from 'react-icons/vsc';
import { Select } from './Select.tsx';

export type TNewScriptPopUpProps = {
  onDone: (script: TScript) => void;
};

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;

  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  font-size: 14px;

  .pop-up {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding-left: 10px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};

      .label {
        input {
          outline: none;
          background-color: ${({ theme }) => theme.colors.background};
          color: ${({ theme }) => theme.colors.text};
          font-size: 14px;
          width: 100%;
          height: 100%;
          border: none;
          border-bottom: 1px solid ${({ theme }) => theme.colors.border};
        }
      }

      button {
        border: none;
        height: 30px;
        width: 30px;

        &:hover {
          cursor: pointer;
          background-color: ${({ theme }) => theme.colors.hover}
        }

        svg {
          height: 20px;
          width: 20px;
        }
      }
    }

    .content {
      box-sizing: border-box;
      padding: 10px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    .controls {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      box-sizing: border-box;
      padding: 10px;

      .create {
        box-sizing: border-box;
        padding: 5px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;

        &:hover {
          cursor: pointer;
          background-color: ${({ theme }) => theme.colors.hover}
        }

        svg {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
}
`;

const languages = [
  {
    value: EScriptLanguage.JavaScript,
    label: 'JavaScript',
  },
  {
    value: EScriptLanguage.Lua,
    label: 'Lua',
  },
];

const sides = [
  {
    value: EScriptSide.Client,
    label: 'Client',
  },
  {
    value: EScriptSide.Server,
    label: 'Server',
  },
];

export const NewScriptPopUp: FC<TNewScriptPopUpProps> = ({ onDone }) => {
  const [language, setLanguage] = useState<EScriptLanguage>(languages[0].value);
  const [side, setSide] = useState<EScriptSide>(sides[0].value);
  const [name, setName] = useState<string>('New Script');

  return createPortal(
    <Wrapper>
      <div className="pop-up">
        <header>
          <div className={'label'}>
            <input type={'text'} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button onClick={() => onDone(null!)}>
            <VscClose />
          </button>
        </header>
        <section className="content">
          <Select
            onSelect={(v) => setLanguage(v as EScriptLanguage)}
            options={languages}
            label={'Select programming language'}
          />
          <Select onSelect={(v) => setSide(v as EScriptSide)} options={sides} label={'Choose execution side'} />
        </section>
        <section className="controls">
          <button
            className={'create'}
            onClick={() =>
              onDone({ name, language, side, content: '', id: window.crypto.randomUUID(), outputBuffer: [] })
            }
          >
            <div>Create</div>
            <VscCode />
          </button>
        </section>
      </div>
    </Wrapper>,
    document.body,
  );
};
