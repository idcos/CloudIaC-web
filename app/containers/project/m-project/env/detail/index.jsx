import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  notification,
  Tabs,
  Button,
  Form,
  Input,
  Tag,
  Tooltip,
  Space,
} from 'antd';
import { InfoCircleFilled, LockOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import PolicyStatus from 'components/policy-status';
import EnvTags from '../components/env-tags';
import {
  END_TASK_STATUS_LIST,
  ENV_STATUS,
  ENV_STATUS_COLOR,
} from 'constants/types';
import envAPI from 'services/env';
import taskAPI from 'services/task';
import tplAPI from 'services/tpl';
import history from 'utils/history';
import getPermission from 'utils/permission';
import EnvInfo from './components/envInfo';
import ComplianceInfo from './components/compliance-info';
import Resource from './components/resource';
import Output from './components/output';
import DeployJournal from './components/deployJournal';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';
import Tags from './components/tags';
import Lock from './components/lock';
import { createBrowserHistory } from 'history';
import DetailPageContext from './detail-page-context';
import { t } from 'utils/i18n';

const subNavs = {
  overview: t('define.overview'),
  resource: t('define.resource'),
  output: t('define.output'),
  deployJournal: t('task.deployLog.name'),
  deployHistory: t('define.deployHistory'),
  variable: t('define.variable'),
  compInfo: t('policy.detection.complianceStatus'),
  setting: t('define.setting'),
  tags: t('define.tag'),
};

const EnvDetail = props => {
  const {
    userInfo,
    location,
    match: {
      params: { orgId, projectId, envId },
    },
  } = props;
  const { tabKey } = queryString.parse(location.search);
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const [panel, setPanel] = useState(tabKey || 'resource');
  const [form] = Form.useForm();
  const [taskId, setTaskId] = useState();
  const [lockVisible, setLockVisible] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  const [lockType, setLockType] = useState(false);
  const [nameEdit, setNameEdit] = useState(false);
  const [envName, setEnvName] = useState('');
  // 获取环境详情
  const {
    loading: envDetailLoading,
    data: envInfo = {},
    run: fetchEnvInfo,
  } = useRequest(
    () =>
      requestWrapper(
        envAPI.envsInfo.bind(null, {
          orgId,
          projectId,
          envId,
        }),
      ),
    {
      ready: !!envId,
      formatResult: data => data || {},
      onSuccess: data => {
        if (!taskId) {
          setTaskId(data.lastTaskId);
        }
      },
    },
  );
  const env_data_name =
    `${envInfo.name && envInfo.name.replace(' ', '\u00A0')}` || '';
  // 获取Stack详情
  const { data: tplInfo = {} } = useRequest(
    () =>
      requestWrapper(
        tplAPI.detail.bind(null, {
          orgId,
          tplId: envInfo.tplId,
        }),
      ),
    {
      ready: !!envInfo.tplId,
      formatResult: data => data || {},
    },
  );

  const {
    data: taskInfo = {},
    cancel: cancelLoop,
    run: fetchTaskInfo,
  } = useRequest(
    () =>
      requestWrapper(
        taskAPI.detail.bind(null, {
          orgId,
          projectId,
          taskId,
        }),
      ),
    {
      ready: !!taskId,
      pollingInterval: 3000,
      pollingWhenHidden: false,
      onSuccess: data => {
        if (
          END_TASK_STATUS_LIST.indexOf(data.status) !== -1 &&
          !data.aborting
        ) {
          cancelLoop();
          fetchEnvInfo();
        }
      },
      onError: () => {
        cancelLoop();
      },
    },
  );

  const redeploy = async () => {
    const res = await envAPI.deployCheck({ orgId, projectId, envId });
    if (res.code !== 200) {
      return notification.error({
        message: res.message,
      });
    }
    history.push(
      `/org/${orgId}/project/${projectId}/m-project-env/deploy/${envInfo.tplId}/${envId}`,
    );
  };

  const destroy = () => {
    Modal.confirm({
      width: 480,
      title: `${t('define.env.action.destroy.confirm.title.prefix')} “${
        envInfo.name && envInfo.name.replace(' ', '\u00A0')
      }”?`,
      icon: <InfoCircleFilled />,
      cancelButtonProps: {
        className: 'ant-btn-tertiary',
      },
      content: (
        <>
          <div style={{ marginBottom: 29 }}>
            {t('define.env.action.destroy.confirm.content.des')}
          </div>
          <Form layout='vertical' requiredMark='optional' form={form}>
            <Form.Item
              name='name'
              label={t('define.env.action.destroy.confirm.content.field.name')}
              rules={[
                { required: true, message: t('define.form.input.placeholder') },
                () => ({
                  validator(_, value) {
                    if (!value || envInfo.name === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        t(
                          'define.env.action.destroy.confirm.content.field.name.noSameError',
                        ),
                      ),
                    );
                  },
                }),
              ]}
            >
              <Input placeholder={t('define.form.input.placeholder')} />
            </Form.Item>
          </Form>
        </>
      ),
      onOk: async () => {
        const res = await envAPI.envDestroy({ orgId, projectId, envId });
        if (res.code !== 200) {
          notification.error({
            message: t('define.message.getFail'),
            description: res.message,
          });
          return;
        }
        notification.success({
          message: t('define.message.opSuccess'),
        });
        form.resetFields();
        history.push(
          `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/task/${res.result.taskId}`,
        );
      },
      onCancel: () => form.resetFields(),
    });
  };

  const onLock = async type => {
    if (type === 'unlock') {
      let confirmRes = await envAPI.unlockedConfirm({
        orgId,
        projectId,
        envId,
      });
      if (confirmRes.code !== 200) {
        return notification.error({ message: confirmRes.message });
      }
      if (!confirmRes.result.autoDestroyPass) {
        Modal.confirm({
          width: 480,
          title: t('define.env.action.unlock'),
          icon: <InfoCircleFilled />,
          cancelButtonProps: {
            className: 'ant-btn-tertiary',
          },
          onOk: async () => {
            setLockLoading(true);
            let res = await envAPI.envUnLocked({ orgId, projectId, envId });
            setLockLoading(false);
            if (res.code !== 200) {
              return notification.error({ message: res.message });
            }
            notification.success({ message: t('define.message.opSuccess') });
            fetchEnvInfo();
          },
        });
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
      setting: () => <Setting />,
      compInfo: () => <ComplianceInfo />,
      tags: () => <Tags />,
    };
    return PAGES[panel]();
  }, [panel]);

  const onUnLock = () => {
    onLock('unlock');
  };

  const nameEditHandler = () => {
    setEnvName(env_data_name);
    setNameEdit(true);
  };

  const nameEnter = async e => {
    const value = e.target.value;
    if (!value) {
      notification.error({ message: t('define.task.abort.env.placeholder') });
      return;
    }
    try {
      const res = await envAPI.envsEdit({
        orgId,
        projectId,
        name: value,
        envId: envId ? envId : undefined,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: t('define.message.nameChangeSuccess'),
      });
      setNameEdit(false);
      reload();
    } catch (e) {
      notification.error({
        message: t('define.message.opFail'),
        description: e.message,
      });
      setNameEdit(false);
    }
  };
  return (
    <DetailPageContext.Provider
      value={{
        userInfo,
        taskInfo,
        envInfo,
        tplInfo,
        reload,
        envId,
        taskId,
        orgId,
        projectId,
        type: 'env',
        changeTabPage: setPanel,
        onUnLock,
        onLock,
      }}
    >
      <Layout
        extraHeader={
          <PageHeader
            colSpan={{
              title: 16,
              subDes: 8,
            }}
            title={
              <Space size={8} align='center'>
                <div>
                  {nameEdit && !!PROJECT_OPERATOR ? (
                    <div>
                      <Input
                        value={envName}
                        onChange={e => {
                          setEnvName(e.target.value);
                        }}
                        onPressEnter={nameEnter}
                        onBlur={nameEnter}
                      />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: 'grab' }}
                      onDoubleClick={nameEditHandler}
                    >
                      {env_data_name}
                    </div>
                  )}
                </div>

                {!!envInfo.locked && (
                  <LockOutlined style={{ color: '#000', fontSize: 16 }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {ENV_STATUS[envInfo.status] && (
                    <Tag
                      style={{ margin: 0 }}
                      color={ENV_STATUS_COLOR[envInfo.status] || 'default'}
                    >
                      {ENV_STATUS[envInfo.status]}
                    </Tag>
                  )}
                  {envInfo.status === 'failed' &&
                  taskInfo.status === 'failed' &&
                  taskInfo.message ? (
                    <Tooltip title={taskInfo.message}>
                      <InfoCircleFilled
                        style={{ color: '#ff4d4f', fontSize: 14 }}
                      />
                    </Tooltip>
                  ) : null}
                  {envInfo.isDrift && (
                    <Tag style={{ margin: 0 }} color={'orange'}>
                      {t('define.drift')}
                    </Tag>
                  )}
                  <PolicyStatus
                    style={{ margin: 0 }}
                    policyStatus={envInfo.policyStatus}
                    onlyShowResultStatus={true}
                  />
                  <EnvTags tags={envInfo.tags} />
                </div>
              </Space>
            }
            subDes={
              PROJECT_OPERATOR ? (
                <Space>
                  <Button onClick={redeploy} type='primary'>
                    {t('define.redeployment')}
                  </Button>
                  <Button disabled={envInfo.locked} onClick={destroy}>
                    {t('define.env.action.destroy')}
                  </Button>
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
              onChange={k => {
                const history = createBrowserHistory({ forceRefresh: false });
                history.replace({
                  search: `?tabKey=${k}`,
                });
                setPanel(k);
              }}
            >
              {Object.keys(subNavs).map(it => {
                return <Tabs.TabPane tab={subNavs[it]} key={it} />;
              })}
            </Tabs>
            {renderByPanel()}
          </div>
        </div>

        {lockVisible && (
          <div className={'lockModal'}>
            {' '}
            <Lock
              toggleVisible={() => setLockVisible(false)}
              lockType={lockType}
              reload={fetchEnvInfo}
              envInfo={envInfo}
              orgId={orgId}
              projectId={projectId}
              envId={envId}
            />
          </div>
        )}
      </Layout>
    </DetailPageContext.Provider>
  );
};

export default connect(state => {
  return {
    userInfo: state.global.get('userInfo').toJS(),
  };
})(Eb_WP()(EnvDetail));
