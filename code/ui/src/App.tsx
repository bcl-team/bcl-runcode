import { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { useClientEvent, useClientState } from './client';
import { Controls, Editor, ScriptsNavigation, FilesNavBar, TopBar } from './components';
import { useAppDispatch, useAppSelector } from './store';
import { TConsoleOutput } from '@lib/shared';
import dispatch from 'console-feed/lib/Hook/store/dispatch';
import { addOutput } from './store/scripts.store.ts';

const width = 1000;
const height = 600;

const Wrapper = styled.div`
  width: ${width}px;
  height: ${height}px;

  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  box-sizing: border-box;

  header {
    width: 100%;
    height: 30px;
  }

  .container {
    height: calc(100% - 30px);
    background-color: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-sizing: border-box;
    display: flex;

    .nav {
      width: 20%;
      height: 100%;
    }

    .editor-view {
      width: 80%;
      height: calc(100% - 30px);

      .controls {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

const pos = localStorage.getItem(`editor:position`) ?? '{}';

let { x: defaultPositionX = (window.innerWidth - width) / 2, y: defaultPositionY = (window.innerHeight - height) / 2 } =
  JSON.parse(pos);

export const App: FC = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const isOpen = useClientState(`editor:isOpen`, false);
  const dispatch = useAppDispatch();

  const scripts = useAppSelector((x) => x.scripts.scripts);
  useClientEvent(
    'editor:output',
    (data: TConsoleOutput) => {
      console.log('triggered');
      const script = scripts.find((x) => x.id === data.id);
      if (!script) {
        return;
      }
      dispatch(addOutput({ id: data.id, output: { ...data, id: window.crypto.randomUUID() } }));
    },
    [scripts],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Draggable
      bounds={{
        left: 0,
        right: window.innerWidth - width,
        top: 0,
        bottom: window.innerHeight - height,
      }}
      handle={'#top-bar'}
      nodeRef={appRef}
      defaultPosition={{ x: defaultPositionX, y: defaultPositionY }}
      onStop={(e, data) => {
        localStorage.setItem(`editor:position`, JSON.stringify({ x: data.x, y: data.y }));
        defaultPositionX = data.x;
        defaultPositionY = data.y;
      }}
    >
      <Wrapper ref={appRef}>
        <header id={'top-bar'}>
          <TopBar />
        </header>
        <div className="container">
          <div className={'nav'}>
            <FilesNavBar />
          </div>
          <div className={'editor-view'}>
            <div className={'controls'}>
              <ScriptsNavigation />
              <Controls />
            </div>
            <Editor />
          </div>
        </div>
      </Wrapper>
    </Draggable>
  );
};
