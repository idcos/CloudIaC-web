import React, { useEffect, useRef } from 'react';

export const useLoopPolicyStatus = () => {

  const time = useRef();

  useEffect(() => {
    return () => {
      clearTimeout(time.current);
    };
  }, []);

  const check = ({ list, loopFn }) => {
    const hasPendingItem = !!(list || []).find(it => it.policyStatus === 'pending');
    // 有检测中的数据需要轮询
    if (hasPendingItem) {
      clearTimeout(time.current);
      time.current = setTimeout(() => {
        loopFn();
      }, 3000);
    } else {
      clearTimeout(time.current);
    }
  };

  return { check };
};