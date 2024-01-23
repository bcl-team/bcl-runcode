import { FC, useState } from 'react';
import { TScript } from '../models';
import styled from 'styled-components';
import { ReactComponent as JSIcon } from '../assets/js.svg';
import { ReactComponent as LuaIcon } from '../assets/lua.svg';
import { VscServer, VscEdit, VscTrash } from 'react-icons/vsc';
import { IoIosLaptop } from 'react-icons/io';
import { useAppDispatch } from '../store';
import { removeScript, setActiveScript } from '../store/scripts.store.ts';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  user-select: none;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
  padding-right: 0;

  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.activeBackground};
  }

  .name {
    display: flex;
    gap: 5px;
    align-items: center;

    svg {
      height: 16px;
      width: 16px;
    }
  }

  .options {
    display: flex;
    gap: 2px;
    align-items: center;

    button {
      height: 40px;
    }

    button:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.hover};
    }
  }
`;

export const ScriptPreview: FC<TScript> = ({ id, name, side, language }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const languageIcon = language === 'js' ? <JSIcon /> : <LuaIcon />;
  const sideIcon = side === 'client' ? <IoIosLaptop /> : <VscServer />;

  return (
    <Wrapper onClick={() => dispatch(setActiveScript(id))}>
      <div className="name">
        <div className="icons">{sideIcon}</div>
        <div>
          {name}.{language}
        </div>
      </div>
      <div className="options">
        <button onClick={() => dispatch(removeScript(id))}>
          <VscTrash />
        </button>
        <button>
          <VscEdit />
        </button>
      </div>
    </Wrapper>
  );
};
