import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import { getComplianceMenus } from './menus';
import styles from './styles.less';

const KEY = 'global';

const ComplianceWrapper = ({ routes, curOrg }) => {
  const linkTo = (scope, menuItemKey) => {
    switch (scope) {
    case 'dashboard':
      history.push(`/compliance/dashboard`);
      break;
    case 'compliance-config':
      history.push(`/compliance/compliance-config/${menuItemKey}`);
      break;
    case 'policy-config':
      history.push(`/compliance/policy-config/${menuItemKey}`);
      break;
    default:
      break;
    }
  };

  const renderMenus = useCallback(({ subKey, emptyMenuList = [], menuList }) => {
    let scope = subKey, menuKey, isEmptyData = false;
    let pathList = window.location.pathname.split('/');
    if (subKey === 'none') {
      menuKey = 'dashboard';
      scope = 'dashboard';
    }
    if (pathList.length > 4) {
      menuKey = pathList[pathList.length - 2];
    } else {
      menuKey = pathList[pathList.length - 1];
    }
    return (isEmptyData ? emptyMenuList : menuList).map(menuItem => {
      if (menuItem.isHide) {
        return null;
      }
      return (
        <div 
          className={`menu-item ${menuKey === menuItem.key ? 'checked' : ''}`} 
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