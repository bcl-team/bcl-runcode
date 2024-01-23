import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import styled from 'styled-components';
import { VscClose } from 'react-icons/vsc';
import { setActiveScript } from '../store/scripts.store.ts';

const Wrapper = styled.div`
  font-size: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  overflow-x: auto;
  display: inline-flex;
  height: 30px;

  /* width */
  &::-webkit-scrollbar {
    height: 2px;
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

  .script {
    user-select: none;
    width: 180px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 12px;
    gap: 5px;

    &.active {
      background-color: ${({ theme }) => theme.colors.activeBackground};
    }

    button {
    }
  }
`;

export const ScriptsNavigation: FC = () => {
  const store = useAppSelector((state) => state.scripts);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      {store.scripts.map((script) => {
        return (
          <div
            onClick={() => dispatch(setActiveScript(script.id))}
            className={'script' + (store.activeScript === script.id ? ' active' : '')}
            key={script.id}
          >
            <div>
              {script.name}.{script.language}
            </div>
            <button>
              <VscClose />
            </button>
          </div>
        );
      })}
    </Wrapper>
  );
};
