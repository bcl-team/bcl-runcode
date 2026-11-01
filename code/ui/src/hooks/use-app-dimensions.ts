import { TAppDimensions } from '../models/app-dimensions.model';
import { useCallback, useEffect, useState } from 'react';

const rate = window.innerHeight / 1080;

const width = 1000 * rate;
const height = 600 * rate;

const DEFAULT_DIMENSIONS = {
  width: width,
  height: height,
  x: (window.innerWidth - width) / 2,
  y: (window.innerHeight - height) / 2,
};

const fitDimensions = (dimensions: TAppDimensions): TAppDimensions => {
  const rate = window.innerHeight / 1080;
  const width = Math.min(window.innerWidth, Math.max(700 * rate, dimensions.width));
  const height = Math.min(window.innerHeight, Math.max(400 * rate, dimensions.height));

  return {
    width,
    height,
    x: Math.max(0, Math.min(window.innerWidth - width, dimensions.x)),
    y: Math.max(0, Math.min(window.innerHeight - height, dimensions.y)),
  };
};

export const useAppDimensions = (): [TAppDimensions, (dimensions: Partial<TAppDimensions>) => void] => {
  const [state, setState] = useState<TAppDimensions>(() => fitDimensions(DEFAULT_DIMENSIONS));
  const setDimensions = useCallback((dimensions: Partial<TAppDimensions>) => {
    setState((state) => fitDimensions({ ...state, ...dimensions }));
  }, []);

  useEffect(() => {
    const onResize = (): void => setDimensions({});
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setDimensions]);

  return [state, setDimensions];
};
