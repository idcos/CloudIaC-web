import { useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';

// 深度比较Effect
export const useDeepCompareEffect = (fn, deps) => {
  const renderRef = useRef(0);
  const depsRef = useRef(deps);
  if (!isEqual(deps, depsRef.current)) {
    renderRef.current++;
  }
  depsRef.current = deps;
  return useEffect(fn, [renderRef.current]);
};
