import React, { useState, useCallback, useEffect } from 'react';
import { Button, notification, Tabs, Dropdown, Menu, Popover } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import styles from "./styles.less";

import Overview from './detailPages/overview';
import Running from './detailPages/running';
import Setting from './detailPages/setting';
import State from './detailPages/state';
import Variable from './detailPages/variable';
import CreateTaskForm from './detailPages/createTaskForm';

import { DownOutlined } from '@ant-design/icons';

import { ctAPI } from 'services/base';

import DetailContext from './detailPages/DetailContext';

const subNavs = {
  overview: '概述',
  running: '运行',
  state: '状态',
  variable: '变量',
  setting: '设置'
};

const CloudTmpDetail = (props) => {
  const { match, routesParams } = props,
    { ctId } = match.params;
  const [ tab, setTabs ] = useState('overview'),
    [ popOverVisible, setPopoverVisible ] = useState(false),
    [ taskType, setTaskType ] = useState(null),
    [ refreshTimeStamp, setRefreshTimeStamp ] = useState(new Date() - 0),
    [ detailInfo, setDetailInfo ] = useState({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await ctAPI.detail({
        id: ctId,
        orgId: routesParams.curOrg.id
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setDetailInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const toggleVisible = ({ taskType = null, visible }) => {
    setPopoverVisible(visible);
    setTaskType(taskType);
  };

  const closePopover = () => toggleVisible({ taskType: null, visible: false });

  const renderByTab = useCallback(() => {
    const PAGES = {
      overview: (props) => <Overview/>,
      running: (props) => <Running {...props}/>,
      state: (props) => <State/>,
      variable: (props) => <Variable {...props}/>,
      setting: (props) => <Setting {...props}/>
    };
    return PAGES[tab]({
      curOrg: routesParams.curOrg,
      ctId,
      detailInfo,
      reload: fetchInfo
    });
  }, [ tab, detailInfo ]);

  return <DetailContext.Provider
    value={{
      refreshTimeStamp,
      setRefreshTimeStamp
    }}
  >
    <Layout
      extraHeader={<PageHeader
        title={detailInfo.name || '-'}
        breadcrumb={true}
        des={detailInfo.description}
        //subDes={'123,123,123'}
        renderFooter={() => <Tabs
          tabBarExtraContent={<Dropdown
            overlay={
              <Menu
                onClick={({ key }) => toggleVisible({ taskType: key, visible: true })}
              >
                <Menu.Item key='plan'>新建plan作业</Menu.Item>
                <Menu.Item key='apply'>新建apply作业</Menu.Item>
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
          activeKey={tab}
          onChange={k => setTabs(k)}
        >
          {Object.keys(subNavs).map(it => <Tabs.TabPane tab={subNavs[it]} key={it}/>)}
        </Tabs>}
      />}
    >
      <div className='container-inner-width'>
        <div className={styles.ctDetail}>
          {renderByTab()}
        </div>
      </div>
    </Layout>
  </DetailContext.Provider>;
};

export default Eb_WP()(CloudTmpDetail);
