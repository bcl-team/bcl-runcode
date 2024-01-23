import { FC, ReactNode } from 'react';
import styled from 'styled-components';

export type TNavigationTabProps = {
  name: string;
  children: ReactNode;
};

const Wrapper = styled.div``;

export const NavigationTab: FC<TNavigationTabProps> = ({ name, children }) => {
  return <Wrapper>{children}</Wrapper>;
};
