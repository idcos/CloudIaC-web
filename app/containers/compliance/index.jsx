import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'antd';

import MenuSelect from 'components/menu-select';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import changeOrg from "utils/changeOrg";

import { getComplianceMenus } from './menus';
import styles from './styles.less';

const KEY = 'global';

const OrgWrapper = ({ routes, userInfo, curOrg, curProject, match = {}, orgs, dispatch, menuType }) => {
  const linkTo = (scope, menuItemKey) => {
    switch (scope) {
    case 'compliance-config':
      history.push(`/compliance/compliance-config/${menuItemKey}`);
      break;
    case 'strategy-config':
      history.push(`/compliance/strategy-config/${menuItemKey}`);
      break;
    default:
      break;
    }
  };

  const changeCurOrg = (value) => {
    changeOrg({ orgId: value, dispatch });
  };

  const renderMenus = useCallback(({ subKey, emptyMenuList = [], menuList }) => {
    let scope = subKey, menuKey, isEmptyData = false;
    let pathList = window.location.pathname.split('/');
    menuKey = pathList[pathList.length - 1];
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
    <div className={styles.orgWrapper}>
      <div className='left-nav'>
        <div className='menu-wrapper'>
          {
            getComplianceMenus().map(subMenu => {
              if (subMenu.isHide) {
                return null;
              }
              return (
                <div className='sub-menu'>
                  <div className='menu-title'>{subMenu.subName}</div>
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
    orgs: state[KEY].get('orgs').toJS(),
    curOrg: state[KEY].get('curOrg'),
    curProject: state[KEY].get('curProject'),
    userInfo: state[KEY].get('userInfo').toJS(),
    menuType: state[KEY].get('menuType')
  })
)(OrgWrapper);