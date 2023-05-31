import { useEffect, useRef, useState } from 'react';

export const useLoopPolicyStatus = () => {
  const time = useRef();
  const [loopRequesting, setLoopRequesting] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(time.current);
      setLoopRequesting(false);
    };
  }, []);

  const check = ({ list, loopFn }) => {
    const hasPendingItem = !!(list || []).find(
      it => it.policyStatus === 'pending',
    );
    // 有检测中的数据需要轮询
    if (hasPendingItem) {
      clearTimeout(time.current);
      time.current = setTimeout(() => {
        setLoopRequesting(true);
        loopFn()
          .then(() => {
            setLoopRequesting(false);
          })
          .catch(() => {
            setLoopRequesting(false);
          });
      }, 5000);
    } else {
      clearTimeout(time.current);
    }
  };

  return { check, loopRequesting };
};
