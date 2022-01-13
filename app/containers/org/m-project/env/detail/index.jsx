import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Modal, notification, Tabs, Button, Form, Input, Tag, Tooltip, Space } from "antd";
import { ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons';
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
import getPermission from "utils/permission";
import EnvInfo from './components/envInfo';
import ComplianceInfo from './components/compliance-info';
import Resource from './components/resource';
import Output from './components/output';
import DeployJournal from './components/deployJournal';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';
import styles from './styles.less';
import { createBrowserHistory } from 'history';
import DetailPageContext from './detail-page-context';

const subNavs = {
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
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const [ panel, setPanel ] = useState(tabKey || 'resource');
  const [form] = Form.useForm();
  const [ taskId, setTaskId ] = useState();

  // 获取环境详情
  const { data: envInfo = {}, run: fetchEnvInfo } = useRequest(
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
        if (END_TASK_STATUS_LIST.indexOf(data.status) !== -1) {
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

  const reload = () => {
    fetchEnvInfo();
    fetchTaskInfo();
  };

  const renderByPanel = useCallback(() => {
    const PAGES = {
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
        type: 'env'
      }}
    >
      <Layout
        extraHeader={
          <PageHeader
            title={(
              <Space size={8} align='center'>
                <span>{envInfo.name || ''}</span>
                <div style={{ display: 'flex' }}>
                  {ENV_STATUS[envInfo.status] && <Tag color={ENV_STATUS_COLOR[envInfo.status] || 'default'}>{ENV_STATUS[envInfo.status]}</Tag> || '-'}
                  {
                    envInfo.status === 'failed' && taskInfo.status === 'failed' && taskInfo.message ? (
                      <Tooltip title={taskInfo.message}>
                        <InfoCircleFilled style={{ color: '#ff4d4f', fontSize: 14 }} />
                      </Tooltip>
                    ) : null
                  }
                  {envInfo.isDrift && <Tag color={'orange'}>漂移</Tag>}
                  <PolicyStatus policyStatus={envInfo.policyStatus} onlyShowResultStatus={true} />
                </div>
              </Space>
            )}
            
            subDes={
              PROJECT_OPERATOR ? (
                <div>
                  <Button onClick={redeploy}>重新部署</Button>
                  <Button onClick={destroy} style={{ marginLeft: 8 }} type={'primary'}>销毁资源</Button>
                </div>
              ) : null
            }
            breadcrumb={true}
          />
        }
      >
        <div className='idcos-card'>
          <EnvInfo envInfo={envInfo} taskInfo={taskInfo} />
        </div>
        <div style={{ marginTop: 20 }} className='idcos-card'>
          <div className={styles.depolyDetail}>
            <Tabs
              type={'card'}
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
