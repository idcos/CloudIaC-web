import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Modal, notification, Tabs, Button, Form, Input, Tag, Tooltip, Space } from "antd";
import { ExclamationCircleFilled, InfoCircleFilled, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import PolicyStatus from 'components/policy-status';
import { END_TASK_STATUS_LIST, ENV_STATUS, ENV_STATUS_COLOR } from "constants/types";
import envAPI from 'services/env';
import taskAPI from 'services/task';
import history from 'utils/history';
import { safeJsonParse } from 'utils/util';
import getPermission from "utils/permission";
import EnvInfo from './components/envInfo';
import ComplianceInfo from './components/compliance-info';
import Resource from './components/resource';
import Output from './components/output';
import DeployJournal from './components/deployJournal';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';
import EnvTags from '../componemts/env-tags';
import Lock from './components/lock';
import styles from './styles.less';
import { createBrowserHistory } from 'history';
import DetailPageContext from './detail-page-context';

const subNavs = {
  overview: '概览',
  resource: '资源',
  output: 'Output',
  deployJournal: '部署日志',
  deployHistory: '部署历史',
  variable: '变量',
  compInfo: '合规状态',
  setting: '设置'
};

const EnvDetail = (props) => {

  const { userInfo, location, match: { params: { orgId, projectId, envId } } } = props;
  const { tabKey } = queryString.parse(location.search);
  const { PROJECT_OPERATOR, PROJECT_APPROVER } = getPermission(userInfo);
  const [ panel, setPanel ] = useState(tabKey || 'resource');
  const [form] = Form.useForm();
  const [ taskId, setTaskId ] = useState();
  const [ lockVisible, setLockVisible ] = useState(false);
  const [ lockLoading, setLockLoading ] = useState(false);
  const [ lockType, setLockType ] = useState(false);

  // 获取环境详情
  const { loading: envDetailLoading, data: envInfo = {}, run: fetchEnvInfo } = useRequest(
    () => requestWrapper(
      envAPI.envsInfo.bind(null, {
        orgId, projectId, envId
      })
    ),
    {
      ready: !!envId,
      formatResult: data => data || {},
      onSuccess: (data) => {
        if (!taskId) {
          setTaskId(data.lastTaskId);
        }
      }
    }
  );

  // 更新tag
  const { run: updateTag } = useRequest(
    (tags) => requestWrapper(
      envAPI.updateTag.bind(null, {
        tags,
        orgId,
        projectId,
        envId
      }), {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: () => {
        fetchEnvInfo();
      }
    }
  );

  const { data: taskInfo = {}, cancel: cancelLoop, run: fetchTaskInfo } = useRequest(
    () => requestWrapper(
      taskAPI.detail.bind(null, {
        orgId, projectId, taskId
      })
    ),
    {
      ready: !!taskId,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        if (END_TASK_STATUS_LIST.indexOf(data.status) !== -1 && !data.aborting) {
          cancelLoop();
          fetchEnvInfo();
        }
      },
      onError: () => {
        cancelLoop();
      }
    }
  );

  const redeploy = async() => {
    history.push(`/org/${orgId}/project/${projectId}/m-project-env/deploy/${envInfo.tplId}/${envId}`);
  };

  const destroy = () => {
    Modal.confirm({
      width: 480,
      title: `你确定要销毁环境“${envInfo.name}”吗？`,
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <div style={{ marginBottom: 29 }}>销毁资源将删除环境所有资源</div>
          <Form layout='vertical' requiredMark='optional' form={form}>
            <Form.Item
              name='name'
              label='输入环境名称以确认'
              rules={[
                { required: true, message: '请输入环境名称' },
                () => ({
                  validator(_, value) {
                    if (!value || envInfo.name === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('环境名称不一致!'));
                  }
                })
              ]}
            >
              <Input placeholder='请输入环境名称' />
            </Form.Item>
          </Form>
        </>
      ),
      okText: '确认',
    	cancelText: '取消',
      onOk: async () => {
        const values = await form.validateFields();
        const res = await envAPI.envDestroy({ orgId, projectId, envId });
        if (res.code != 200) {
          notification.error({
            message: '操作失败',
            description: res.message
          });
          return;
        }
        notification.success({
          message: '操作成功'
        });
        form.resetFields();
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${res.result.taskId}`);
      },
      onCancel: () => form.resetFields()
    });
  };


  const onLock = async(type) => {
    if (type === 'unlock') {
      let confirmRes = await envAPI.unlockedConfirm({ orgId, projectId, envId });
      if (confirmRes.code !== 200) {
        return notification.error({ message: confirmRes.message });
      }

      if (!confirmRes.result.autoDestroyPass) {
        setLockLoading(true);
        let res = await envAPI.envUnLocked({ orgId, projectId, envId });
        setLockLoading(false);

        if (res.code !== 200) {
          return notification.error({ message: res.message });
        }

        notification.success({ message: '操作成功' });
        fetchEnvInfo();
      } else {
        setLockVisible(true);
        setLockType(type);
      }

    } else {
      setLockVisible(true);
      setLockType(type);
    }
  };

  const reload = () => {
    fetchEnvInfo();
    fetchTaskInfo();
  };

  const renderByPanel = useCallback(() => {
    const PAGES = {
      overview: () => <EnvInfo />,
      resource: () => <Resource />,
      output: () => <Output />,
      deployJournal: () => <DeployJournal />,
      deployHistory: () => <DeployHistory />,
      variable: () => <Variable />,
      setting: () => <Setting/>,
      compInfo: () => <ComplianceInfo/>
    };
    return PAGES[panel]();
  }, [panel]);

  return (
    <DetailPageContext.Provider
      value={{
        userInfo,
        taskInfo,
        envInfo,
        reload,
        envId,
        taskId,
        orgId,
        projectId,
        type: 'env',
        changeTabPage: setPanel
      }}
    >
      <Layout
        extraHeader={
          <PageHeader
            colSpan={{
              title: 16,
              subDes: 8
            }}
            title={(
              <Space size={8} align='center'>
                <span>{envInfo.name || ''}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ENV_STATUS[envInfo.status] && (
                    <Tag style={{ margin: 0 }} color={ENV_STATUS_COLOR[envInfo.status] || 'default'}>
                      {ENV_STATUS[envInfo.status]}
                    </Tag>
                  )}
                  {
                    envInfo.status === 'failed' && taskInfo.status === 'failed' && taskInfo.message ? (
                      <Tooltip title={taskInfo.message}>
                        <InfoCircleFilled style={{ color: '#ff4d4f', fontSize: 14 }} />
                      </Tooltip>
                    ) : null
                  }
                  {envInfo.isDrift && <Tag style={{ margin: 0 }} color={'orange'}>漂移</Tag>}
                  <PolicyStatus style={{ margin: 0 }} policyStatus={envInfo.policyStatus} onlyShowResultStatus={true} />
                </div>
                <EnvTags
                  tags={envInfo.tags}
                  canEdit={PROJECT_OPERATOR}
                  update={(data) => {
                    updateTag(data.join(','));
                  }}
                />
              </Space>
            )}

            subDes={
              PROJECT_OPERATOR ? (
                <Space>
                  {/*TODO 接口字段待定*/}
                  <div className={styles.cost}>240.00/当月费用</div>
                  <Button onClick={redeploy}>重新部署</Button>
                  <Button disabled={envInfo.locked} onClick={destroy} type={'primary'}>销毁资源</Button>
                  {PROJECT_APPROVER && <div>{!envInfo.locked ? (<Tooltip title='锁定当前环境'><LockOutlined onClick={() => onLock('lock')} style={{ fontSize: 20 }} /></Tooltip>) :
                    (<Tooltip title='解锁当前环境'>
                      <UnlockOutlined onClick={() => {
                        if (lockLoading || envDetailLoading) {
                          return;
                        } else {
                          setLockLoading(true);
                          onLock('unlock');
                        }
                      }} style={{ fontSize: 20 }}
                      /></Tooltip>)}</div>}
                </Space>
              ) : null
            }
            breadcrumb={true}
          />
        }
      >
        <div style={{ marginTop: 20 }} className='idcos-card'>
          <div>
            <Tabs
              // type={'card'}
              tabBarStyle={{ backgroundColor: '#fff', marginBottom: 20 }}
              animated={false}
              renderTabBar={(props, DefaultTabBar) => {
                return (
                  <div style={{ marginBottom: -16 }}>
                    <DefaultTabBar {...props} />
                  </div>
                );
              }}
              activeKey={panel}
              onChange={(k) => {
                const history = createBrowserHistory({ forceRefresh: false });
                history.replace({
                  search: `?tabKey=${k}`
                });
                setPanel(k);
              }}
            >
              {Object.keys(subNavs).map((it) => {
                return (
                  <Tabs.TabPane
                    tab={subNavs[it]}
                    key={it}
                  />
                );
              })}
            </Tabs>
            {renderByPanel()}
          </div>
        </div>

        {lockVisible && <div className={'lockModal'}> <Lock
          toggleVisible={() => setLockVisible(false)}
          lockType={lockType}
          reload={fetchEnvInfo}
          envInfo={envInfo}
          orgId={orgId}
          projectId={projectId}
          envId={envId}
        /></div>}
      </Layout>
    </DetailPageContext.Provider>
  );
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(
  Eb_WP()(EnvDetail)
);
