import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { t } from 'utils/i18n';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';

import Basic from './basic';
import User from './user';

const subNavs = {
  basic: t('define.page.userSet.basic'),
  user: t('define.user'),
};

const ProjectSetting = ({ match, dispatch, sysConfigSwitches }) => {
  const { orgId, projectId } = match.params;

  const [panel, setPanel] = useState('basic');
  const renderByPanel = useCallback(() => {
    const PAGES = {
      basic: props => <Basic {...props} />,
      user: props => <User {...props} />,
    };
    return PAGES[panel]({
      title: subNavs[panel],
      orgId,
      projectId,
      dispatch,
      sysConfigSwitches,
    });
  }, [panel]);

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={t('define.setting')}
          breadcrumb={true}
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
              onChange={k => setPanel(k)}
            >
              {Object.keys(subNavs).map(it => (
                <Tabs.TabPane tab={subNavs[it]} key={it} />
              ))}
            </Tabs>
          )}
        />
      }
    >
      <div className='idcos-card'>{renderByPanel()}</div>
    </Layout>
  );
};

export default connect(state => ({
  sysConfigSwitches: state.global.get('sysConfigSwitches').toJS(),
}))(Eb_WP()(ProjectSetting));
