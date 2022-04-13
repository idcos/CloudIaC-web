import React, { useState, useCallback, useEffect } from 'react';
import { Menu, Tabs } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { t } from 'utils/i18n';
import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import Basic from './pages/basic';
import Pwd from './pages/pwd';

const subNavs = {
  basic: t('define.page.userSet.basic'),
  pwd: t('define.page.userSet.pwd')
};

const User = ({ userInfo, dispatch }) => {

  const [ panel, setPanel ] = useState('basic');

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
      className='container-inner-width'
      title={t('define.page.userSet.title')}
      showIcon={'user'}
      breadcrumb={false}
      renderFooter={() => (
        <Tabs
          tabBarStyle={{ backgroundColor: '#fff' }}
          animated={false}
          renderTabBar={(props, DefaultTabBar) => {
            return (
              <div style={{ marginBottom: -16 }}>
                <DefaultTabBar {...props} />
              </div>
            );
          }}
          activeKey={panel}
          onChange={(k) => setPanel(k)}
        >
          {Object.keys(subNavs).map((it) => (
            <Tabs.TabPane
              tab={subNavs[it]}
              key={it}
            />
          ))}
        </Tabs>
      )}
    />}
  >
    <div className='idcos-card container-inner-width'>
      {renderByPanel()}
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
