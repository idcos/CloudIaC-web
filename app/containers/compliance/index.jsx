import React, { useCallback } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { connect } from 'react-redux';
import { useSessionStorageState } from 'ahooks';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import versionCfg from 'assets/version.json';
import { getComplianceMenus } from './menus';
import styles from './styles.less';
import classNames from 'classnames';

const KEY = 'global';

const ComplianceWrapper = ({ routes, curOrg, match = {} }) => {

  const { orgId, typeKey } = match.params || {};
  const [ collapsed, setCollapsed ] = useSessionStorageState('compliance_menu_collapsed', false);

  const linkTo = (scope, menuItemKey) => {
    switch (scope) {
    case 'dashboard':
      history.push(`/org/${orgId}/compliance/dashboard`);
      break;
    case 'compliance-config':
      history.push(`/org/${orgId}/compliance/compliance-config/${menuItemKey}`);
      break;
    case 'policy-config':
      history.push(`/org/${orgId}/compliance/policy-config/${menuItemKey}`);
      break;
    default:
      break;
    }
  };

  const renderMenus = useCallback(({ subKey, emptyMenuList = [], menuList }) => {
    let scope = subKey, menuKey, isEmptyData = false;
    if (subKey === 'none') {
      menuKey = 'dashboard';
      scope = 'dashboard';
    }
    return (isEmptyData ? emptyMenuList : menuList).map(menuItem => {
      if (menuItem.isHide) {
        return null;
      }
      return (
        <div 
          className={`menu-item ${typeKey === menuItem.key ? 'checked' : ''}`} 
          onClick={() => linkTo(scope, menuItem.key)}
        >
          <Tooltip title={collapsed && menuItem.name} placement='right'>
            <span className='icon'>{menuItem.icon}</span>
          </Tooltip>
          {!collapsed && <span>{menuItem.name}</span>}
        </div>
      );
    });
  }, [collapsed]);
 
  return (
    <div className={styles.complianceWrapper}>
      <div className={classNames('left-nav', { collapsed })}>
        <div className='menu-wrapper'>
          {
            getComplianceMenus().map(subMenu => {
              if (subMenu.isHide) {
                return null;
              }
              return (
                <div className='sub-menu'>
                  {subMenu.subName === 'none' ? null : (
                    <div className='menu-title'>
                      {collapsed ? <div className='divider'></div> : subMenu.subName}
                    </div>
                  )}
                  <div className='menu-list'>
                    { renderMenus(subMenu) }
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className='nav-footer'>
          <span className='icon' onClick={() => setCollapsed(!collapsed)}>
            <MenuOutlined />
          </span>
          <span className='text'>{versionCfg.version || ''}</span>
        </div>
      </div>
      <div className='right-content'>
        <RoutesList
          routes={routes}
          routesParams={{
            curOrg
          }}
        />
      </div>
    </div>
  );
  
};

export default connect(
  (state) => ({ 
    curOrg: state[KEY].get('curOrg')
  })
)(ComplianceWrapper);