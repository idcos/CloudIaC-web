import React, { useState, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


import Basic from './pages/basic';
import Pwd from './pages/pwd';

import styles from './styles.less';

const subNavs = {
  basic: '基本信息',
  pwd: '修改密码'
};

const User = ({ userInfo, dispatch, location }) => {
  const { state } = location;
  const [ panel, setPanel ] = useState(state.panel || 'basic');

  const updateUserInfo = ({ payload, cb }) => {
    dispatch({
      type: 'global/updateUserInfo',
      payload: {
        ...payload,
        id: userInfo.id
      },
      cb
    });
  };
  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: (props) => userInfo.name && <Basic {...props}/>,
      pwd: (props) => userInfo.name && <Pwd {...props}/>
    };
    return PAGES[panel]({
      title: subNavs[panel],
      userInfo,
      updateUserInfo
    });
  }, [ panel, userInfo ]);
  return <Layout
    extraHeader={<PageHeader
      title='用户设置'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width'>
      <div className={styles.user}>
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

const mapStateToProps = (state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
};

const withConnect = connect(
  mapStateToProps
);
const withEB = Eb_WP();

export default compose(
  withConnect,
  withEB
)(User);
