import React, { useState, useEffect, useCallback } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Modal, notification, Tabs, Button, Form, Input } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';

import Info from './components/info';
import Resource from './components/resource';
import Deploy from './components/deploy';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';

import styles from './styles.less';

import { envAPI } from 'services/base';

const subNavs = {
  resource: '资源',
  deploy: '部署日志',
  deployHistory: '部署历史',
  variable: '变量',
  setting: '设置'
};

const EnvDetail = (props) => {
  const { dispatch, match: { params: { orgId, projectId, envId, tabKey } } } = props;
  const [ panel, setPanel ] = useState(tabKey || 'resource');
  const [form] = Form.useForm();
  const [ info, setInfo ] = useState({});
  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} lastTaskId={info.lastTaskId} />,
      deploy: () => <Deploy {...props} lastTaskId={info.lastTaskId} />,
      deployHistory: () => <DeployHistory {...props}/>,
      variable: () => <Variable {...props}/>,
      setting: () => <Setting {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      dispatch
    });
  }, [ panel, info.lastTaskId ]);

  useEffect(() => {
    fetchInfo();
  }, [panel]);
  
  // 获取Info
  const fetchInfo = async () => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId, status: panel
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  
  const redeploy = async() => {
    history.push(`/org/${orgId}/project/${projectId}/m-project-env/deploy/${info.tplId}/${envId}`); 
  };
  const destroy = () => {
    Modal.confirm({
      width: 480,
      title: `你确定要销毁环境“${info.name}”吗？`,
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
                    if (!value || info.name === value) {
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
      },
      onCancel: () => form.resetFields()
    });
  };
  return <Layout
    extraHeader={
      <PageHeader
        title={info.name || ''}
        subDes={<div><Button onClick={redeploy}>重新部署</Button><Button onClick={destroy} style={{ marginLeft: 8 }} type={'primary'}>销毁资源</Button></div>}
        breadcrumb={true}
      />
    }
  >
    <div className='idcos-card'>
      <Info {...props} info={info} />
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
            let stateObj = { tabKey: k };
            setPanel(k); 
            window.history.replaceState(null, null, `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/${k}`);
          }}
        >
          {Object.keys(subNavs).map((it) => (
            <Tabs.TabPane
              tab={subNavs[it]}
              key={it}
            />
          ))}
        </Tabs>
        {renderByPanel()}
      </div>
    </div>
  </Layout>;
};

export default connect()(
  Eb_WP()(EnvDetail)
);
