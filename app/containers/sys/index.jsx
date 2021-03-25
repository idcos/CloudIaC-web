import React, { useState, useCallback } from 'react';
import { Table, Button, Menu, Alert } from 'antd';
import { Link } from 'react-router-dom';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


import ApiToken from './pages/apiToken';
import Orgs from './pages/orgs';
import Params from './pages/params';

import styles from './styles.less';

const subNavs = {
  apiToken: 'API Token|Token',
  params: '参数设置',
  org: '组织设置|组织'
};

const Sys = (props) => {
  const [ panel, setPanel ] = useState('apiToken');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      apiToken: <ApiToken/>,
      params: <Params/>,
      org: <Orgs/>
    };
    return PAGES[panel];
  }, [panel]);
  return <Layout
    extraHeader={<PageHeader
      title='系统设置'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width withPadding'>
      <div className={styles.sys}>
        <Menu
          mode='inline'
          className='subNav'
          defaultSelectedKeys={[panel]}
          onClick={({ item, key }) => setPanel(key)}
        >
          {Object.keys(subNavs).map(it => <Menu.Item key={it}>{subNavs[it].split('|')[0]}</Menu.Item>)}
        </Menu>
        <div className='rightPanel'>
          <div className='title'>
            <h2>
              {subNavs[panel].split('|')[0]}
              {
                /\|(.+)/.test(subNavs[panel]) && <Button>创建{RegExp.$1}</Button>
              }
            </h2>
          </div>
          <div className='gap'>
            {
              panel == 'apiToken' && <Alert
                message='Token用于API访问你的全部数据，请注意保密，如有泄漏，请禁用/删除等操作'
                type='warning'
                showIcon={true}
                closable={true}
              />
            }
          </div>
          {renderByPanel()}
        </div>
      </div>
    </div>
  </Layout>;
};


export default Eb_WP()(Sys);
