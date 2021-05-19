import { useRef } from 'react';

export const useEventSource = () => {
  let eventSourceRef = useRef();

  const init = (listeners, { url, options }) => {
    eventSourceRef.current = new EventSource(url, options);
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
