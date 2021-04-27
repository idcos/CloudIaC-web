import { useRef } from 'react';

export const useEventSource = () => {
  let eventSourceRef = useRef();

  const init = (listeners, { url, options }) => {
    eventSourceRef.current = new EventSource(url, options);

    _listeners.call(eventSourceRef.current, listeners);
  };

  function _listeners({ onmessage }) {
    this.onopen = function() {
      console.log("Connection to server opened.");
    };

    this.onmessage = function(e) {
      onmessage(e.data);
    };

    this.onerror = function() {
      console.log("EventSource failed.");
      this.close();
    };
  }

  return [ eventSourceRef.current, init ];
};
