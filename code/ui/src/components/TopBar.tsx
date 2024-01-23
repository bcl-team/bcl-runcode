import React, { FC } from 'react';
import styled from 'styled-components';
import { client } from '../client';
import { VscClose, VscSave } from 'react-icons/vsc';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  box-sizing: border-box;
  height: 100%;
  user-select: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  padding-left: 10px;
  border-top-right-radius: 3px;
  overflow: hidden;

  .title {
    font-size: 14px;
  }

  .buttons {
    display: flex;
  }

  button {
    svg {
      height: 16px;
      width: 16px;
    }

    width: 40px;
    height: 30px;

    &:hover {
      cursor: pointer;
    }
  }

  .close:hover {
    background-color: #bb0606;
  }

  .run:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  .save:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

export const TopBar: FC = () => {
  const close = (): void => {
    client.emit(`editor:close`);
  };

  return (
    <Wrapper>
      <div className="title">
        <span>Untitled-1</span>
      </div>
      <div className="buttons">
        <button className={'save'}>
          <VscSave />
        </button>
        <button className={'close'} onClick={close}>
          <VscClose />
        </button>
      </div>
    </Wrapper>
  );
};
