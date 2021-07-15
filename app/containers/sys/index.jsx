import React, { useState, useCallback, useRef } from 'react';
import { Menu } from 'antd';
import history from 'utils/history';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


import Orgs from './pages/orgs';
import Params from './pages/params';

import styles from './styles.less';

const subNavs = {
  org: '组织设置',
  params: '参数设置'
};

const Sys = () => {
  const [ panel, setPanel ] = useState('org');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      org: (props) => <Orgs {...props}/>,
      params: (props) => <Params {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel]
    });
  }, [panel]);
  return <Layout
    extraHeader={<PageHeader
      title='系统设置'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.sys}>
        <Menu
          mode='inline'
          className='subNav'
          defaultSelectedKeys={[panel]}
          onClick={({ item, key }) => {
            setPanel(key);
          }}
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

export default Eb_WP()(Sys);
