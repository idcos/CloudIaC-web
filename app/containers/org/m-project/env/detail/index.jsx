import React, { useState, useEffect, useCallback, useRef } from 'react';
import history from 'utils/history';
import { connect } from 'react-redux';
import { Modal, notification, Tabs, Button, Form, Input } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';

import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { END_ENV_STATUS_LIST } from "constants/types";
import { envAPI } from 'services/base';
import getPermission from "utils/permission";

import Info from './components/info';
import Resource from './components/resource';
import DeployJournal from './components/deployJournal';
import DeployHistory from './components/deployHistory';
import Variable from './components/variable';
import Setting from './components/setting';

import styles from './styles.less';


const subNavs = {
  resource: '资源',
  deployJournal: '部署日志',
  deployHistory: '部署历史',
  variable: '变量',
  setting: '设置'
};

const EnvDetail = (props) => {

  const { userInfo, match: { params: { orgId, projectId, envId, tabKey } } } = props;
  const { PROJECT_OPERATOR } = getPermission(userInfo);

  const [ panel, setPanel ] = useState(tabKey || 'resource');
  const [form] = Form.useForm();
  const [ info, setInfo ] = useState({});

  const loopRef = useRef();

  const renderByPanel = useCallback(() => {
    const PAGES = {
      resource: () => <Resource {...props} info={info} />,
      deployJournal: () => <DeployJournal {...props} info={info} reload={fetchInfo} />,
      deployHistory: () => <DeployHistory {...props}/>,
      variable: () => <Variable {...props} info={info}/>,
      setting: () => <Setting {...props} info={info} reload={fetchInfo}/>
    };
    return PAGES[panel]();
  }, [ panel, info ]);
 
  useEffect(() => {
    fetchInfo();
    return () => {
      clearInterval(loopRef.current);
    };
  }, []);

  // 获取Info
  const fetchInfo = async (opType = '') => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      const data = res.result || {};
      if (opType === 'loop') {
        setInfo(preInfo => {
          return data.status !== preInfo.status ? data : preInfo;
        });
      } else {
        setInfo(data);
      }
      // 循环刷新详情数据
      if (END_ENV_STATUS_LIST.indexOf(data.status) === -1 && !loopRef.current) {
        loopRef.current = setInterval(() => {
          fetchInfo('loop');
        }, 1500);
      }
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
        history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/deployHistory/task/${res.result.lastTaskId}`);
      },
      onCancel: () => form.resetFields()
    });
  };
  return <Layout
    extraHeader={
      <PageHeader
        title={info.name || ''}
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
            setPanel(k); 
            history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}/${k}`);
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

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(
  Eb_WP()(EnvDetail)
);
