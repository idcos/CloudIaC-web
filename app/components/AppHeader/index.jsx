import React from 'react';

import { Select, Menu } from 'antd';
import { Link } from 'react-router-dom';
import history from 'utils/history';
import { SettingFilled, FundFilled } from '@ant-design/icons';
import styles from './styles.less';


export default (props) => {
  const { theme, navs, locationPathName } = props;

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'>
      <div className='logo' onClick={() => history.push('/')}><img src='/assets/logo/logo.svg' alt='IaC'/></div>
      <div className='rParts'>
        <Select
          className={styles.orgSwitcher}
          style={{ width: 164 }}
          placeholder='选择组织'
        >

        </Select>
        <Menu
          mode='horizontal'
          theme={theme}
          selectedKeys={[(navs.find(it => locationPathName.indexOf(it.link) >= 0) || {}).key]}
          className={styles.navs}
        >
          {navs.map(it => <Menu.Item key={it.key}><Link to={it.link}>{it.name}</Link></Menu.Item>)}
        </Menu>
        <div className='user'>
          <span onClick={() => history.push('/sys/status')}><FundFilled/></span>
          <span onClick={() => history.push('/sys')}><SettingFilled/></span>
          <span>
            <span>{}-{}</span>
          </span>
        </div>
      </div>
    </div>
  </div>;
};
