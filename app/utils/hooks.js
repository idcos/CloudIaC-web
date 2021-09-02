import { useRef, useEffect, useState, useMemo } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import noop from 'lodash/noop';
import isEmpty from 'lodash/isUndefined';
import isFunction from 'lodash/isFunction';

// sse hooks
export const useEventSource = () => {
  let eventSourceRef = useRef();

  const init = (listeners, { url, options }) => {
    eventSourceRef.current = new EventSourcePolyfill(url, options);
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

// 搜索和表格关联封装
export const useSearchAndTable = (props) => {

  const {
    pagination = {},
    defaultParams = { current: 1, pageSize: 10 },
    resultMap = { list: [], total: 0 },
    onSearch = noop, 
  } = props || {};

  const [searchParams, setSearchParams] = useState(defaultParams);

  useEffect(() => {
    onSearch(searchParams);
  }, [searchParams]);

  const onChangeSearchParams = (changeParams, options) => {
    const {
      resetCurrent = true,
      isMerge = true
    } = options || {};
    if (isMerge) {
      if (resetCurrent) {
        setSearchParams(preValue => omitBy({ ...preValue, ...changeParams, current: 1 }, isEmpty));
      } else {
        setSearchParams(preValue => omitBy({ ...preValue, ...changeParams }, isEmpty));
      }
    } else {
      setSearchParams(omitBy(changeParams, isEmpty));
    }
  };

  return {
    tableProps: {
      dataSource: resultMap.list,
      pagination: {
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total: resultMap.total,
        showSizeChanger: true,
        showTotal: (total) => `共${total}条`,
        onChange: (...args) => {
          const [current, pageSize] = args;
          onChangeSearchParams({
            current,
            pageSize
          }, {
            resetCurrent: false
          });
          isFunction(pagination.onChange) && pagination.onChange(...args);
        },
        ...omit(pagination, ['current', 'pageSize', 'total', 'onChange'])
      },
    },
    searchParams,
    onChangeSearchParams
  };
};