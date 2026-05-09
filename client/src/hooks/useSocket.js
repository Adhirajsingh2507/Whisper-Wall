import { useEffect, useCallback } from 'react';
import socket from '../socket/index.js';

// Hook to subscribe to a Socket.IO event
// Usage: useSocket('new-post', (post) => setPosts(...))
export const useSocket = (eventName, callback, deps = []) => {
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    socket.on(eventName, memoizedCallback);

    return () => {
      socket.off(eventName, memoizedCallback);
    };
  }, [eventName, memoizedCallback]);
};
