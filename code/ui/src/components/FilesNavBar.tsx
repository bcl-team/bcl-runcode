import { FC } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../store';
import { ScriptPreview } from './ScriptPreview.tsx';

const Wrapper = styled.div`
  height: 100%;
  width: 200px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

export const FilesNavBar: FC = () => {
  const scripts = useAppSelector((x) => x.scripts.scripts);
  return (
    <Wrapper>
      {scripts.map((x) => (
        <ScriptPreview key={x.id} {...x} />
      ))}
    </Wrapper>
  );
};
