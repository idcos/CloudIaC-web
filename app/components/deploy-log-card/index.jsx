import React, { useState, useRef, useEffect } from "react";
import { Card, Space, Button, Tag, Collapse, Input, Tooltip } from "antd";
import { CloseCircleFilled, CheckCircleFilled, SyncOutlined, FullscreenExitOutlined, FullscreenOutlined, SearchOutlined, InfoCircleFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import classNames from 'classnames';
import { useRequest, useFullscreen, useScroll } from 'ahooks';
import { requestWrapper } from 'utils/request';
import getPermission from "utils/permission";
import { TASK_STATUS, TASK_STATUS_COLOR, END_TASK_STATUS_LIST } from 'constants/types';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import history from 'utils/history';
import { timeUtils } from "utils/time";
import SearchByKeyWord from 'components/coder/ansi-coder-card/dom-event';
import DeployLog from './deploy-log';
import styles from './styles.less';

const { Panel } = Collapse;
const searchService = new SearchByKeyWord({ 
  searchWrapperSelect: '.ansi-coder-content',
  excludeSearchClassNameList: [
    'line-index'
  ]
});
const enableStatusList = [ 'complete', 'failed', 'timeout', 'running' ];

const DeployLogCard = ({ taskInfo, userInfo, reload }) => {

  const searchRef = useRef();
  const ref = useRef();
  const timeRef = useRef();
  const stopLoopRef = useRef(false);
  const scrollRef = useRef(null);
  const { top: scrollRefTop } = useScroll(scrollRef);
  const [ isFullscreen, { toggleFull } ] = useFullscreen(ref);
  const { orgId, projectId, envId, id: taskId, startAt, endAt, type, status } = taskInfo || {};
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);
  const [ activeKey, setActiveKey ] = useState([]);
  const [ canAutoScroll, setCanAutoScroll ] = useState(true);
  const taskHasEnd = END_TASK_STATUS_LIST.includes(status);
  const autoScroll = !taskHasEnd && canAutoScroll;

  useEffect(() => {
    if (!taskId) {
      return;
    }
    if (taskHasEnd) {
      timeRef.current = setTimeout(() => {
        stopLoopRef.current = true;
      }, 30000);
    } else {
      timeRef.current && clearTimeout(timeRef.current);
      stopLoopRef.current = false;
      cancelLoop();
      runLoop();
    }
    return () => {
      timeRef.current && clearTimeout(timeRef.current);
    };
  }, [taskHasEnd]);

  useEffect(() => {
    // ?????????????????????????????????,?????????????????????????????? 
    scrollRef.current.addEventListener("DOMMouseScroll", scrollFunc);
    // ??????????????????????????????????????????Google???mousewheel??????????????????????????????????????? wheel????????????
    scrollRef.current.addEventListener("wheel", scrollFunc);
    // ie?????????wheel???????????????????????????????????????mousewheel
    scrollRef.current.addEventListener("mousewheel", scrollFunc);
    return () => {
      scrollRef.current.removeEventListener("DOMMouseScroll", scrollFunc);
      //    ??????????????????????????????????????????Google???mousewheel??????????????????????????????????????? wheel????????????
      scrollRef.current.removeEventListener("wheel", scrollFunc);
      //    ie?????????wheel???????????????????????????????????????mousewheel
      scrollRef.current.removeEventListener("mousewheel", scrollFunc);
    };
  }, []);

  useEffect(() => {
    const { scrollHeight, clientHeight } = scrollRef.current;
    // ???????????????
    if (scrollRefTop === scrollHeight - clientHeight) {
      setCanAutoScroll(true);
    }
  }, [scrollRefTop]);

  const scrollFunc = (e) => {
    e = e || window.event;
    if (e.wheelDelta) {   
      if (e.wheelDelta > 0) {    
        setCanAutoScroll(false);
      }
    } else if (e.detail) {
      if (e.detail < 0) {
        setCanAutoScroll(false);
      }
    }
  };

  // ????????????????????????
  const {
    data: taskSteps = [],
    run: runLoop,
    cancel: cancelLoop
  } = useRequest(
    () => requestWrapper(
      taskAPI.getTaskSteps.bind(null, { orgId, projectId, taskId })
    ),
    {
      formatResult: res => res || [],
      ready: !!taskId,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        if (autoScroll) {
          const activeKey = getAutoActiveKey(data);
          setActiveKey(activeKey);
        }
        if (stopLoopRef.current) {
          cancelLoop();
        }
      }
    }
  );

  const getAutoActiveKey = (data) => {
    let activeKey = [];
    data.forEach((item) => {
      if (enableStatusList.includes(item.status)) {
        activeKey.push(item.id);
      }
    });
    return activeKey;
  };

  const goBottom = () => {
    const { scrollHeight, clientHeight } = scrollRef.current;
    scrollRef.current.scrollTop = scrollHeight - clientHeight;
  };

  // ????????????
  const {
    run: applyTask,
    loading: applyTaskLoading
  } = useRequest(
    () => requestWrapper(
      envAPI.envRedeploy.bind(null, { orgId, projectId, envId, taskType: 'apply' }),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: (data) => {
        const { taskId } = data;
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${taskId}`); 
      }
    }
  ); 

  // ????????????
  const {
    run: passOrRejecy,
    fetches: {
      approved: { loading: approvedLoading = false } = {},
      rejected: { loading: rejectedLoading = false } = {},
    } 
  } = useRequest(
    (action) => requestWrapper(
      taskAPI.approve.bind(null, { orgId, taskId, projectId, action }),
      {
        autoSuccess: true
      }
    ),
    {
      fetchKey: (action) => action,
      manual: true,
      onSuccess: () => {
        reload && reload();
        setCanAutoScroll(true);
      }
    }
  );

  const manualChangeActiveKey = (keys) => {
    setActiveKey(keys);
  };

  return (
    <div ref={ref} className={styles.deploy_log_card_wrapper}>
      <Card
        className='deploy-log-card'
        bodyStyle={{ background: 'rgba(36, 38, 35)', padding: 0 }}
        title={
          <div className='card-title'>
            <div className='card-title-top'>
              <span className='title'>????????????</span> 
              <Tag className='status' color={TASK_STATUS_COLOR[status]}>{TASK_STATUS[status]}</Tag>
              {
                taskInfo.status === 'failed' && taskInfo.message ? (
                  <Tooltip title={taskInfo.message}>
                    <InfoCircleFilled style={{ color: '#ff4d4f', fontSize: 14 }} />
                  </Tooltip>
                ) : null
              }
            </div>
            <div className='card-title-bottom'>??????????????????{timeUtils.diff(endAt, startAt, '-')}</div>
          </div>
        }
        extra={
          <Space size={24}>
            {
              PROJECT_OPERATOR && (
                <Space size={8}>
                  {
                    taskInfo.status === 'approving' && (
                      <>
                        <Button 
                          disabled={!PROJECT_APPROVER || approvedLoading}
                          onClick={() => passOrRejecy('rejected')}
                          loading={rejectedLoading} 
                        >
                          ??????
                        </Button>
                        <Button 
                          disabled={!PROJECT_APPROVER || rejectedLoading}
                          onClick={() => passOrRejecy('approved')} 
                          loading={approvedLoading} 
                          type='primary'
                        >
                          ??????
                        </Button>
                      </>
                    )
                  }
                  {
                    type === 'plan' && status === 'complete' ? (
                      <Button 
                        type='primary'
                        onClick={applyTask}
                        loading={applyTaskLoading}
                      >
                        ????????????
                      </Button>
                    ) : null
                  }
                </Space>
              )
            }
            <Input
              prefix={<SearchOutlined />}
              ref={searchRef}
              placeholder='????????????'
              onPressEnter={(e) => {
                searchService.search(e.target.value);
                searchRef.current.focus();
              }}
              style={{ width: 240 }}
            />
            <span 
              className='tool'
              onClick={toggleFull} 
            >
              {
                isFullscreen ? (
                  <>
                    <FullscreenExitOutlined className='tool-icon'/>
                    <span className='tool-text'>????????????</span> 
                  </>
                ) : (
                  <>
                    <FullscreenOutlined className='tool-icon'/>
                    <span className='tool-text'>????????????</span>
                  </>
                )
              }
            </span>
          </Space>
        }
      >
        <div className={classNames('card-body-scroll', { isFullscreen })} ref={scrollRef} >
          <Collapse 
            activeKey={activeKey} 
            onChange={manualChangeActiveKey}
            ghost={true} 
            className='deploy-log-collapse'
          >
            {
              taskSteps.map(({ name, id, startAt, type, endAt, status }, index) => (
                <Panel 
                  className={'log-panel-' + index}
                  collapsible={!['complete', 'failed', 'timeout', 'running'].includes(status) && 'disabled'}
                  header={
                    <Space>
                      <span>{name || type || '-'}</span>
                      {status === 'complete' && <CheckCircleFilled style={{ color: '#45BC13' }}/>}
                      {(status === 'failed' || status === 'timeout') && <CloseCircleFilled style={{ color: '#F23C3C' }}/>}
                      {status === 'running' && <SyncOutlined spin={true} style={{ color: '#ffffff' }}/>}
                    </Space>
                  } 
                  key={id}
                  extra={timeUtils.diff(endAt, startAt)}
                >
                  <DeployLog autoScroll={autoScroll} goBottom={goBottom} isFullscreen={isFullscreen} taskInfo={taskInfo} stepId={id} stepStatus={status}/>
                </Panel>
              ))
            }
          </Collapse>
        </div>
      </Card>
    </div>
  );
};


export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(DeployLogCard);