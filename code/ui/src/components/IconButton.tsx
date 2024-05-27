import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { fromTheme, scale } from '../utils';

type TIconButtonProps = {
  onClick?: () => void;
  type?: HTMLButtonElement['type'];
} & PropsWithChildren;

const Wrapper = styled.button`
  height: ${scale(18)};
  width: ${scale(18)};
  border-radius: ${scale(3)};
  color: ${fromTheme('activeTextColor')};
  box-sizing: border-box;
  padding: ${scale(2)};

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover {
    cursor: pointer;
    background-color: ${fromTheme('activeColor')};
  }
`;

export const IconButton: FC<TIconButtonProps> = ({ children, onClick, type }) => {
  return (
    <Wrapper type={type} onClick={onClick}>
      {children}
    </Wrapper>
  );
};
