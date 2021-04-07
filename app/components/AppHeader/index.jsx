import React, { useEffect } from 'react';

import { Select, Menu } from 'antd';
import { Link } from 'react-router-dom';
import history from 'utils/history';
import { SettingFilled, FundFilled } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from "react-redux";

const { Option } = Select;
const KEY = 'global';

const AppHeader = (props) => {
  const { theme, navs, locationPathName, orgs, curOrg, dispatch, userInfo } = props;

  const changeCurOrg = (orgId) => {
    dispatch({
      type: 'global/set-curOrg',
      payload: {
        orgId
      }
    });
    history.push(`/org/${orgId}/ct`);
  };

  useEffect(() => {
    if (locationPathName.indexOf('org') == -1) {
      dispatch({
        type: 'global/set-curOrg',
        payload: {
          orgId: null
        }
      });
    }
  }, [locationPathName]);

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'>
      <div className='logo' onClick={() => history.push('/')}><img src='/assets/logo/logo.svg' alt='IaC'/></div>
      <div className='rParts'>
        <Select
          className={styles.orgSwitcher}
          style={{ width: 164 }}
          placeholder='选择组织'
          onChange={changeCurOrg}
          value={curOrg && curOrg.guid}
        >
          {(orgs.list || []).map(it => <Option value={it.guid}>{it.name}</Option>)}
        </Select>
        {
          curOrg && <Menu
            mode='horizontal'
            theme={theme}
            selectedKeys={[(navs.find(it => locationPathName.indexOf(it.link) >= 0) || {}).key]}
            className={styles.navs}
          >
            {navs.map(it => <Menu.Item key={it.key}><Link to={`/org/${curOrg.guid}${it.link}`}>{it.name}</Link></Menu.Item>)}
          </Menu>
        }
        <div className='user'>
          <span onClick={() => history.push('/sys/status')}><FundFilled/></span>
          <span onClick={() => history.push('/sys/setting')}><SettingFilled/></span>
          <span>{userInfo.name || ''}</span>
        </div>
      </div>
    </div>
  </div>;
};


export default connect((state) => {
  return {
    orgs: state[KEY].get('orgs').toJS(),
    curOrg: state[KEY].get('curOrg'),
    userInfo: state[KEY].get('userInfo').toJS()
  };
})(AppHeader);
