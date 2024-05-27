import { FC, useRef } from 'react';
import Draggable from 'react-draggable';
import { useClientEvent, useClientState } from './services';
import { Header, Explorer, Editor } from './components';
import { useAppDimensions } from './hooks';
import styled from 'styled-components';
import { fromTheme, scale } from './utils';
import { NewFileModal } from './components/NewFileModal.tsx';
import { useAppDispatch } from './store';
import { addOutput } from './store/console-buffer.store.ts';
import { TConsoleOutput } from '@lib/shared';

const AppWrapper = styled.div`
  border-radius: ${scale(5)};
  overflow: hidden;
  box-shadow: 0 0 ${scale(1)} ${scale(1)} ${fromTheme('borderColor')};

  #top-bar {
    border-bottom: 1px solid ${fromTheme('borderColor')};
  }

  .header-wrapper {
    height: ${scale(30)};
  }

  .content-wrapper {
    height: calc(100% - ${scale(30)});
    display: flex;
    justify-content: space-between;

    .explorer-wrapper {
      height: 100%;
      width: 20%;
      border-right: 1px solid ${fromTheme('borderColor')};
    }

    .editor-wrapper {
      height: 100%;
      width: 80%;
    }
  }
`;

export const App: FC = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const isOpen = useClientState(`editor:isOpen`, false);
  const [dimensions, setDimensions] = useAppDimensions();
  const dispatch = useAppDispatch();

  useClientEvent('bcl-runcode:output', (data: [string, TConsoleOutput]) => {
    dispatch(addOutput(data));
  });

  if (!isOpen) {
    return null;
  }

  return (
    <Draggable
      bounds={{
        left: 0,
        right: window.innerWidth - dimensions.width,
        top: 0,
        bottom: window.innerHeight - dimensions.height,
      }}
      handle={'#top-bar'}
      nodeRef={appRef}
      defaultPosition={{ x: dimensions.x, y: dimensions.y }}
      onStop={(e, data) => {
        setDimensions({ x: data.x, y: data.y });
      }}
    >
      <AppWrapper ref={appRef} style={{ width: dimensions.width + 'px', height: dimensions.height + 'px' }} id={'app'}>
        <div className={'header-wrapper'} style={{ width: '100%' }} id={'top-bar'}>
          <Header />
        </div>
        <div className="content-wrapper">
          <div className="explorer-wrapper">
            <Explorer />
          </div>
          <div className="editor-wrapper">
            <Editor />
          </div>
        </div>
        <NewFileModal key={String(isOpen)} />
      </AppWrapper>
    </Draggable>
  );
};
