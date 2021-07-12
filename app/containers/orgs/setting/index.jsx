import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Menu, notification } from "antd";

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';

import { orgsAPI } from 'services/base';

import styles from './styles.less';

import Basic from './pages/basic';
import Member from './pages/member';
import Notification from './pages/notification';
import ResAccount from './pages/resAccount';
import Vcs from './pages/vcs';

const subNavs = {
  basic: '基本信息',
  member: '用户角色',
  notification: '组织通知',
  resAccount: '资源账号',
  vcs: 'VCS'
};

const OrgSetting = ({ routesParams, dispatch }) => {
  const { curOrg } = routesParams;
  const [ panel, setPanel ] = useState('basic');

  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: (props) => <Basic {...props}/>,
      member: (props) => <Member {...props}/>,
      notification: (props) => <Notification {...props}/>,
      resAccount: (props) => <ResAccount {...props}/>,
      vcs: (props) => <Vcs {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      curOrg,
      dispatch
    });
  }, [panel]);

  return <Layout
    extraHeader={<PageHeader
      title='设置'
      breadcrumb={true}
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.setting}>
        <Menu
          mode='inline'
          className='subNav'
          defaultSelectedKeys={[panel]}
          onClick={({ item, key }) => setPanel(key)}
        >
          {Object.keys(subNavs).map(it => <Menu.Item key={it}>{subNavs[it]}</Menu.Item>)}
        </Menu>
        <div className='rightPanel'>
          {renderByPanel()}
        </div>
      </div>
    </div>
  </Layout>;
};

export default connect()(
  Eb_WP()(OrgSetting)
);
