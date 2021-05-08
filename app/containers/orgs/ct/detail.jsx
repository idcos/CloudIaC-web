import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Button, notification, Tabs, Dropdown, Menu, Popover, Tag, Alert } from 'antd';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import RoutesList from 'components/routes-list';
import styles from "./styles.less";

import Overview from './detailPages/overview';
import Running from './detailPages/running';
import Setting from './detailPages/setting';
import State from './detailPages/state';
import Variable from './detailPages/variable';
import CreateTaskForm from './detailPages/createTaskForm';
import Task from './detailPages/running/task';

import { DownOutlined } from '@ant-design/icons';

import { ctAPI } from 'services/base';
import { CT } from 'constants/types';

import DetailContext from './detailPages/DetailContext';

const subNavs = {
  overview: '概览',
  running: '运行',
  state: '状态',
  variable: '变量',
  setting: '设置'
};

const CloudTmpDetail = (props) => {
  const { match, routesParams, routes } = props,
    { ctId, orgId, ctDetailTabKey } = match.params,
    baseUrl = `/org/${orgId}/ct/${ctId}/`;
  const [ popOverVisible, setPopoverVisible ] = useState(false),
    [ taskType, setTaskType ] = useState(null),
    [ refreshTimeStamp, setRefreshTimeStamp ] = useState(new Date() - 0),
    [ initSettingPanel, setInitSettingPanel ] = useState(null),
    [ detailInfo, setDetailInfo ] = useState({});

  useEffect(() => {
    fetchDetailInfo();
  }, []);

  const setTabs = (key) => {
    history.push(baseUrl + key);
  };

  const fetchDetailInfo = async () => {
    try {
      const res = await ctAPI.detail({
        id: ctId,
        orgId: routesParams.curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setDetailInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const toggleVisible = ({ taskType = null, visible }) => {
    setPopoverVisible(visible);
    setTaskType(taskType);
  };

  const closePopover = () => toggleVisible({ taskType: null, visible: false });

  return <DetailContext.Provider
    value={{
      refreshTimeStamp,
      setRefreshTimeStamp,
      initSettingPanel,
      setInitSettingPanel
    }}
  >
    <Layout
      extraHeader={<PageHeader
        title={detailInfo.name || '-'}
        breadcrumb={true}
        des={<>{detailInfo.status == 'disable' && <Tag color='red'>已禁用</Tag>} {detailInfo.description} </>}
        renderFooter={() => <Tabs
          tabBarExtraContent={<Dropdown
            overlay={
              <Menu
                onClick={({ key }) => toggleVisible({ taskType: key, visible: true })}
              >
                {Object.keys(CT.taskType).map(it => <Menu.Item key={it}>新建{CT.taskType[it]}</Menu.Item>)}
              </Menu>
            }
          >
            <Popover
              placement='bottomRight'
              content={popOverVisible && <CreateTaskForm
                closePopover={closePopover}
                taskType={taskType}
                orgId={routesParams.curOrg.id}
                ctDetailInfo={detailInfo}
              />}
              visible={popOverVisible}
              trigger={'click'}
              onMouseLeave={closePopover}
              overlayStyle={{ width: 500 }}
              onVisibleChange={closePopover}
            >
              <Button type='primary' icon={<DownOutlined/>}>新建作业</Button>
            </Popover>
          </Dropdown>}
          renderTabBar={(props, DefaultTabBar) => {
            return <div style={{ marginBottom: -16 }}>
              <DefaultTabBar {...props}/>
            </div>;
          }}
          activeKey={ctDetailTabKey}
          onChange={k => setTabs(k)}
        >
          {Object.keys(subNavs).map(it => 
            <Tabs.TabPane 
              tab={subNavs[it]} 
              key={it} 
              disabled={it == 'state' && !detailInfo.saveState}
            />
          )}
        </Tabs>}
      />}
    >
      <div className='container-inner-width'>
        {
          detailInfo.status == 'disable' && <Alert
            message={<>
              当前云模板为禁用状态，仅能正常访问云模板数据，不可发起作业、修改变量等操作
              <Button
                type='link'
                size='small'
                onClick={() => {
                  setTabs('setting');
                  setInitSettingPanel('del');
                }}
              >
                去修改状态
              </Button>
            </>}
            showIcon={true}
            type='warning'
            banner={true}
          />
        }
        <div className={styles.ctDetail}>
          <RoutesList
            routes={routes}
            routesParams={{
              curOrg: routesParams.curOrg,
              ctId,
              detailInfo,
              setTabs,
              ctDetailTabKey,
              baseUrl,
              reload: fetchDetailInfo
            }}
          />
        </div>
      </div>
    </Layout>
  </DetailContext.Provider>;
};

export default Eb_WP()(CloudTmpDetail);
