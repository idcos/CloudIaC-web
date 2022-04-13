import React, { useState, useCallback, useEffect } from 'react';
import { Tabs } from 'antd';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import getPermission from "utils/permission";
import { connect } from 'react-redux';
import { t } from 'utils/i18n';
import ApiToken from './api-token';
import UserRole from './user-role';
import Vcs from './vcs';
import Ssh from './ssh';
import Notification from './notification';
import ResourceAccount from './resource-account';

const OrgSetting = ({ match, userInfo }) => {
 
  const { orgId } = match.params;
  const [ panel, setPanel ] = useState();
  const [ subNavs, setSubNavs ] = useState({});
  const { ORG_SET, PROJECT_OPERATOR, PROJECT_SET } = getPermission(userInfo);

  useEffect(() => {
    if (ORG_SET) {
      setSubNavs({
        userRole: t('define.userRole'),
        apiToken: 'API Token',
        vcs: 'VCS',
        ssh: t('define.ssh'),
        notification: t('define.notification'),
        resourceAccount: t('define.resourceAccount.title')
      });
      setPanel('userRole');
    } else if (PROJECT_SET) {
      setSubNavs({
        userRole: t('define.userRole'),
        ssh: t('define.ssh')
      });
      setPanel('userRole');
    } else if (PROJECT_OPERATOR) {
      setSubNavs({
        ssh: t('define.ssh')
      });
      setPanel('ssh');
    }
  }, [userInfo]);

  const renderByPanel = useCallback(() => {
    if (!panel) {
      return null;
    }
    const PAGES = {
      userRole: (props) => <UserRole {...props} />,
      apiToken: (props) => <ApiToken {...props} />,
      vcs: (props) => <Vcs {...props} />,
      ssh: (props) => <Ssh {...props} />,
      notification: (props) => <Notification {...props} />,
      resourceAccount: (props) => <ResourceAccount {...props} />
    };
    return PAGES[panel]({
      title: subNavs[panel],
      orgId,
      userInfo
    });
  }, [panel]);

  return (
    <Layout
      extraHeader={<PageHeader
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
            onChange={(k) => setPanel(k)}
          >
            {Object.keys(subNavs).map((key) => {
              return (
                <Tabs.TabPane
                  tab={subNavs[key]}
                  key={key}
                />
              );
            })}
          </Tabs>
        )}
      />}
    >
      <div className='idcos-card'>
        {renderByPanel()}
      </div>
    </Layout>
  );
};

export default connect(
  (state) => ({ 
    userInfo: state['global'].get('userInfo').toJS()
  })
)(OrgSetting);
