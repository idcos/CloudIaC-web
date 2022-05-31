import React, { useState, useCallback, useEffect } from 'react';
import { Tabs } from 'antd';
import getPermission from "utils/permission";
import { connect } from 'react-redux';
import { t } from 'utils/i18n';
import { Menus } from 'components/ui-design';
import ApiToken from './api-token';
import UserRole from './user-role';
import Vcs from './vcs';
import Ssh from './ssh';
import Notification from './notification';
import ResourceAccount from './resource-account';
import styles from './styles.less';

const OrgSetting = ({ match, userInfo, sysConfigSwitches }) => {
 
  const { orgId } = match.params;
  const [ activeKey, setActiveKey ] = useState();
  const [ menus, setMenus ] = useState([]);
  const { ORG_SET, PROJECT_OPERATOR, PROJECT_SET } = getPermission(userInfo);

  useEffect(() => {
    const M = [
      { key: 'userRole', name: t('define.userRole'), icon: '', hide: !ORG_SET && !PROJECT_SET },
      { key: 'apiToken', name: 'API Token', icon: '', hide: !ORG_SET },
      { key: 'vcs', name: 'VCS', icon: '', hide: !ORG_SET },
      { key: 'ssh', name: t('define.ssh'), icon: '', hide: !ORG_SET && !PROJECT_OPERATOR },
      { key: 'notification', name: t('define.notification'), icon: '', hide: !ORG_SET },
      { key: 'resourceAccount', name: t('define.resourceAccount.title'), icon: '', hide: !ORG_SET }
    ].filter(it => !it.hide);
    setMenus([
      { type: 'title', title: '设置' },
      ...M
    ]);
    setActiveKey((M[0] || {}).key);
  }, [userInfo]);

  const renderByPanel = useCallback(() => {
    if (!activeKey) {
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
    return PAGES[activeKey]({
      title: menus[activeKey],
      orgId,
      userInfo,
      sysConfigSwitches
    });
  }, [activeKey]);

  return (
    <div className={styles.orgSet}>
      <div className='left-menus'>
        <Menus 
          activeKey={activeKey} 
          onChange={(key) => setActiveKey(key)}
          menus={menus}
        />
      </div>
      <div className='right-content'>
        {renderByPanel()}
      </div>
      {/* <Tabs
        tabBarStyle={{ backgroundColor: '#fff' }}
        animated={false}
        renderTabBar={(props, DefaultTabBar) => {
          return (
            <div style={{ marginBottom: -16 }}>
              <DefaultTabBar {...props} />
            </div>
          );
        }}
        activeKey={activeKey}
        onChange={(k) => setActiveKey(k)}
      >
        {Object.keys(menus).map((key) => {
          return (
            <Tabs.TabPane
              tab={menus[key]}
              key={key}
            />
          );
        })}
      </Tabs> */}
      
    </div>
  );
};

export default connect(
  (state) => ({ 
    sysConfigSwitches: state.global.get('sysConfigSwitches').toJS(),
    userInfo: state['global'].get('userInfo').toJS()
  })
)(OrgSetting);
