import { FC, ReactNode, useId } from 'react';
import styled from 'styled-components';

export type TSelectProps = {
  options: { value: string; label: ReactNode }[];
  label: string;
  onSelect: (value: string) => unknown;
};

const SelectWrapper = styled.div`
  width: 100%;

  label {
    display: block;
    margin-bottom: 5px;
  }
  select {
    outline: none;
    width: 100%;
    margin-bottom: 5px;
  }
`;

export const Select: FC<TSelectProps> = ({ options, label, onSelect }) => {
  const id = useId();

  return (
    <SelectWrapper>
      <label htmlFor={id}>{label}</label>
      <select onChange={(e) => onSelect(options[e.target.selectedIndex].value)} id={id}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SelectWrapper>
  );
};
