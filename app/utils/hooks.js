import { useRef, useState, useEffect } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import isEqual from 'lodash/isEqual';

// sse hooks
export const useEventSource = () => {
  let eventSourceRef = useRef();

  const init = (listeners, { url, options }) => {
    eventSourceRef.current = new EventSourcePolyfill(url, options);
    _listeners.call(eventSourceRef.current, listeners);
  };

  function _listeners({ onmessage, onerror }) {
    this.onopen = function() {
      console.log("Connection to server opened.");
    };

    this.onmessage = function(e) {
      onmessage && onmessage(e.data);
    };

    this.onerror = function(e) {
      console.log("EventSource failed.");
      this.close();
      onerror && onerror();
    };
  
  }

  return [ eventSourceRef.current, init ];
};

// 防抖 hooks
export const useDebounceHook = (value, delay) => {
  const [ debounceValue, setDebounceValue ] = useState(value);
  useEffect(() => {
    let timer = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timer);
  }, [ value, delay ]);
  return debounceValue;
};

// 节流 hooks
export const useThrottleHook = (value, duration) => {
  const [ throttleValue, setThrottleValue ] = useState(value);
  let Local = useRef({ flag: true }).current;
  useEffect(() => {
    let timer;
    if (Local.flag) {
      Local.flag = false;
      setThrottleValue(value);
      setTimeout(() => (Local.flag = true), duration);
    } else {
      timer = setTimeout(() => setThrottleValue(value), duration);
    }
    return () => clearTimeout(timer);
  }, [ value, duration, Local ]);
  return throttleValue;
};

export const useDeepCompareEffect = (fn, deps) => {
  const renderRef = useRef(0);
  const depsRef = useRef(deps);
  if (!isEqual(deps, depsRef.current)) {
    renderRef.current++;
  }
  depsRef.current = deps;
  return useEffect(fn, [renderRef.current]);
};