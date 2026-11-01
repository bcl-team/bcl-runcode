import { FC, useRef } from 'react';
import Draggable from 'react-draggable';
import { useClientEvent, useClientState } from './services';
import { Header } from './components/Header';
import { Explorer } from './components/Explorer';
import { Editor } from './components/Editor';
import { useAppDimensions } from './hooks/use-app-dimensions';
import styled from 'styled-components';
import { fromTheme, scale } from './utils';
import { NewFileModal } from './components/NewFileModal.tsx';
import { useAppDispatch } from './store';
import { addOutput } from './store/console-buffer.store.ts';
import { TConsoleOutput } from '@lib/shared';

const AppWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: ${scale(5)};
  box-shadow: 0 0 ${scale(1)} ${scale(1)} ${fromTheme('borderColor')};

  #top-bar {
    border-bottom: 1px solid ${fromTheme('borderColor')};
  }

  .header-wrapper {
    height: ${scale(30)};
    flex-shrink: 0;
    cursor: move;
  }

  .content-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .explorer-wrapper {
      height: 100%;
      width: 20%;
      min-width: ${scale(200)};
      flex-shrink: 0;
      box-sizing: border-box;
      border-right: 1px solid ${fromTheme('borderColor')};
    }

    .editor-wrapper {
      height: 100%;
      flex: 1;
      min-width: 0;
    }
  }

  .resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: max(14px, ${scale(14)});
    height: max(14px, ${scale(14)});
    padding: 0;
    cursor: nwse-resize;
    touch-action: none;
    color: ${fromTheme('scrollBarColor')};
    background: linear-gradient(
      135deg,
      transparent 45%,
      currentColor 45%,
      currentColor 55%,
      transparent 55%,
      transparent 65%,
      currentColor 65%,
      currentColor 75%,
      transparent 75%
    );

    &:hover,
    &:focus-visible {
      color: ${fromTheme('activeTextColor')};
    }
  }
`;

export const App: FC = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const isOpen = useClientState(`editor:isOpen`, false);
  const [dimensions, setDimensions] = useAppDimensions();
  const resizeRef = useRef<{ pointerId: number; x: number; y: number; width: number; height: number } | null>(null);
  const dispatch = useAppDispatch();

  const resize = (width: number, height: number): void => {
    setDimensions({
      width: Math.min(width, window.innerWidth - dimensions.x),
      height: Math.min(height, window.innerHeight - dimensions.y),
    });
  };

  useClientEvent('bcl-runcode:output', (data: [string, TConsoleOutput]) => {
    console.log('output', data);
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
      position={{ x: dimensions.x, y: dimensions.y }}
      onDrag={(_e, data) => {
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
        <button
          className="resize-handle"
          aria-label="Resize editor"
          title="Resize editor"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            resizeRef.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              width: dimensions.width,
              height: dimensions.height,
            };
          }}
          onPointerMove={(event) => {
            const start = resizeRef.current;
            if (!start || start.pointerId !== event.pointerId) return;
            resize(start.width + event.clientX - start.x, start.height + event.clientY - start.y);
          }}
          onPointerUp={(event) => {
            if (resizeRef.current?.pointerId !== event.pointerId) return;
            resizeRef.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onLostPointerCapture={() => {
            resizeRef.current = null;
          }}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 50 : 10;
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
            event.preventDefault();
            resize(
              dimensions.width + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0),
              dimensions.height + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0),
            );
          }}
        />
        <NewFileModal key={String(isOpen)} />
      </AppWrapper>
    </Draggable>
  );
};
