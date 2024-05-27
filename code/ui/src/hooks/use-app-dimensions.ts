import { TAppDimensions } from '../models';
import { useState } from 'react';

const rate = window.innerHeight / 1080;

const width = 1000 * rate;
const height = 600 * rate;

const DEFAULT_DIMENSIONS = {
  width: width,
  height: height,
  x: (window.innerWidth - width) / 2,
  y: (window.innerHeight - height) / 2,
};

const getDimensions = (): TAppDimensions => {
  return DEFAULT_DIMENSIONS;
};

export const useAppDimensions = (): [TAppDimensions, (dimensions: Partial<TAppDimensions>) => void] => {
  const [state, setState] = useState<TAppDimensions>(getDimensions);

  return [
    state,
    (dimensions) => {
      setState((s) => {
        const newState = { ...s, ...dimensions };
        return newState;
      });
    },
  ];
};
