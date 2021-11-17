import React, { useEffect, useState, useRef } from "react";
import taskAPI from 'services/task';
import { default as AnsiUp } from 'ansi_up';
import classnames from 'classnames';
import { useThrottleEffect } from 'ahooks';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { getNumLen } from 'utils/util';
import { useEventSource } from "utils/hooks";
import styles from './styles.less';

const ansi_up = new AnsiUp();

export default ({ taskInfo, stepId, stepStatus, isFullscreen }) => {

  const { orgId, projectId, id: taskId } = taskInfo || {};
  const ansiCoderWrapperRef = useRef();
  const [ taskStepLog, setTaskStepLog ] = useState([]);
  const [ html, setHtml ] = useState('');
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    return () => {
      evtSource && evtSource.close();
    };
  }, [evtSource]);

  useEffect(() => {
    switch (stepStatus) {
      case 'complete':
      case 'failed':
      case 'timeout':
        fetchTaskStepLog();
        break;
      case 'running':
        fetchSse();
        break;
      default:
        break;
    }
  }, [stepStatus]);

  useThrottleEffect(
    () => {
      const maxLineIndexLen = getNumLen(taskStepLog.length);
      const lineIndexWidth = 6 + 8.5 * maxLineIndexLen;
      const _html = taskStepLog.map((line, index) => {
        return `
          <div class='ansi-line' style='padding-left: ${lineIndexWidth}px;'>
            <span class='line-index' style='width: ${lineIndexWidth}px;'>${index + 1 }</span>
            <pre class='line-text reset-styles'>${ansi_up.ansi_to_html(line)}</pre>
          </div>
        `;
      }).join('');
      setHtml(_html);
      setTimeout(() => {
        go('bottom');
      });
    },
    [taskStepLog],
    {
      wait: 100
    }
  );

  // 查询任务步骤完整日志
  const {
    run: fetchTaskStepLog,
  } = useRequest(
    () => requestWrapper(
      taskAPI.getTaskStepLog.bind(null, { orgId, projectId, taskId, stepId })
    ),
    {
      manual: true,
      onSuccess: (data) => {
        if (data) {
          setTaskStepLog(data.split('\n'));
        }
      }
    }
  );

  const fetchSse = () => {
    evtSourceInit(
      {
        onmessage: (data) => {
          setTaskStepLog((prevLog) => [ ...prevLog, data ]);
        }
      },
      {
        url: `/api/v1/tasks/${taskId}/steps/${stepId}/log/sse`,
        options: 
        { 
          withCredentials: true,
          headers: {
            'IaC-Org-Id': orgId,
            'IaC-Project-Id': projectId,
            'Authorization': window.localStorage.getItem('accessToken')
          }
        }
      }
    );
  };
 
  const go = (type) => {
    try {
      const scrollDom = ansiCoderWrapperRef.current;
      let top;
      switch (type) {
      case 'top':
        top = 0;
        break;
      case 'bottom':
        top = scrollDom.scrollHeight;
        break;
      default:
        break;
      }
      scrollDom.scrollTo({
        top,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('滚动定位失败');
    }
  };

  return (
    <div className={classnames(styles.deployLog, { [styles.isFullscreen]: isFullscreen })} ref={ansiCoderWrapperRef} >
      <div className='ansi-coder-content' dangerouslySetInnerHTML={{ __html: html }}>
      </div>
    </div>
  );
};