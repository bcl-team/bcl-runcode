import { FC } from 'react';
import styled from 'styled-components';
import { Console } from './Console.tsx';
import { fromTheme } from '../utils';
import { CodeEditor } from './CodeEditor.tsx';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .editor-content {
    height: 70%;
    overflow: hidden;
  }

  .console-content {
    height: 30%;
    border-top: 1px solid ${fromTheme('borderColor')};
  }
`;

export const Editor: FC = () => {
  return (
    <Wrapper>
      <div className="editor-content">
        <CodeEditor />
      </div>
      <div className="console-content">
        <Console />
      </div>
    </Wrapper>
  );
};
