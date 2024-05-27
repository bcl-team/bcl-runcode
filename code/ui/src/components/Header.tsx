import { FC } from 'react';
import styled from 'styled-components';
import { asset, fromTheme, scale } from '../utils';
import { VscClose } from 'react-icons/vsc';
import { Strings } from '../const';

const Wrapper = styled.div`
  user-select: none;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.backgroundColor};
  display: flex;
  justify-content: space-between;\
  align-items: center;
  box-sizing: border-box;
  padding-left: ${scale(8)};
  
  .logo-header {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${scale(10)};
    color: ${fromTheme('activeTextColor')};
    
    img {
      width: auto;
      height: ${scale(15)};
      &:hover {
        cursor: pointer;
      }
    }
    
    font-size: ${scale(12)};
    

  }

  .controls {
    color: ${fromTheme('inactiveTextColor')};
    button {
      width: ${scale(30)};
      height: ${scale(30)};
      padding: 0;

      svg {
        width: 80%;
        height: 80%;
      }
      
      transition: all 0.3s ease;
      &:hover {
        cursor: pointer;
        color: ${fromTheme('activeTextColor')};
        background-color:  ${fromTheme('dangerColor')}
      }
    }
  }
`;

export const Header: FC = () => {
  return (
    <Wrapper>
      <div className={'logo-header'}>
        <img
          draggable={false}
          src={asset('logo-header.png')}
          alt=""
          onClick={(e) => {
            console.log('test', (e.target as HTMLAnchorElement).href);
            e.preventDefault();
            window.invokeNative('openUrl', Strings.ScriptURL);
          }}
        />
        <div className="app-label">{Strings.ResourceName}</div>
      </div>
      <div className="controls">
        <button>
          <VscClose />
        </button>
      </div>
    </Wrapper>
  );
};
