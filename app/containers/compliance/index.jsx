import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import { getComplianceMenus } from './menus';
import styles from './styles.less';

const KEY = 'global';

const ComplianceWrapper = ({ routes, curOrg, match = {} }) => {

  const { orgId, typeKey } = match.params || {};

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
          <span className='icon'>{menuItem.icon}</span>
          <span>{menuItem.name}</span>
        </div>
      );
    });
  }, []);
 
  return (
    <div className={styles.complianceWrapper}>
      <div className='left-nav'>
        <div className='menu-wrapper'>
          {
            getComplianceMenus().map(subMenu => {
              if (subMenu.isHide) {
                return null;
              }
              return (
                <div className='sub-menu'>
                  {subMenu.subName === 'none' ? null : <div className='menu-title'>{subMenu.subName}</div>}
                  <div className='menu-list'>
                    { renderMenus(subMenu) }
                  </div>
                </div>
              );
            })
          }
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