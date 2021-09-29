import { useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';

// sse hooks
export const useEventSource = () => {
  let eventSourceRef = useRef();

  const init = (listeners, { url, options }) => {
    eventSourceRef.current = new EventSourcePolyfill(url, {
      heartbeatTimeout: 1000 * 60 * 60 * 24, // 长连接的最大等待时间默认值设置成1天
      ...options
    });
    _listeners.call(eventSourceRef.current, listeners);
  };

  function _listeners({ onmessage, onerror }) {
    this.onopen = function () {
      console.log("Connection to server opened.");
    };

    this.onmessage = function (e) {
      onmessage && onmessage(e.data);
    };

    this.onerror = function (e) {
      console.log("EventSource failed.");
      this.close();
      onerror && onerror();
    };

  }

  return [eventSourceRef.current, init];
};