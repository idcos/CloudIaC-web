import React, { useState, useCallback, useRef } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useSessionStorageState } from 'ahooks';
import classNames from 'classnames';
import { Divider, Tooltip } from 'antd';
import RoutesList from 'components/routes-list';
import versionCfg from 'assets/version.json';
import history from "utils/history";
import getMenus from './menus';
import styles from './styles.less';

const KEY = 'global';

const OrgWrapper = ({ routes, userInfo, curOrg, projects, curProject, match = {}, dispatch }) => {

  const [ collapsed, setCollapsed ] = useSessionStorageState('execute_menu_collapsed', false);
  const { orgId, mOrgKey, projectId, mProjectKey } = match.params || {};
  const projectList = (projects || {}).list || [];
  const pjtId = projectId || (curProject || {}).id;
 
  // 跳转 scope作用域
  const linkTo = (scope, menuItemKey) => {
    switch (scope) {
      case 'org':
      case 'other':
        history.push(`/org/${orgId}/${menuItemKey}`);
        break;
      case 'project':
        history.push(`/org/${orgId}/project/${pjtId}/${menuItemKey}`);
        break;
      default:
        break;
    }
  };

  const renderMenus = useCallback(({ subKey, emptyMenuList = [], menuList }) => {
    let scope = subKey, menuKey, isEmptyData = false;
    switch (subKey) {
    case 'org':
    case 'other':
      menuKey = mOrgKey;
      break;
    case 'project':
      menuKey = mProjectKey;
      // 没有项目id情况下 作用域指向组织
      if (!pjtId) {
        isEmptyData = true;
        scope = 'org';
        menuKey = mOrgKey;
      }
      break;
    default:
      break;
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
          <Tooltip title={collapsed && menuItem.name} placement='right'>
            <span className='icon'>{menuItem.icon}</span>
          </Tooltip>
          {!collapsed && <span>{menuItem.name}</span>}
        </div>
      );
    });
  }, [ pjtId, collapsed ]);

  const menus = getMenus(userInfo || {}, {
    projectList
  });

  return (
    <div className={styles.orgWrapper}>
      <div className={classNames('left-nav', { collapsed })}>
        <div className='menu-wrapper'>
          {
            menus.map(subMenu => {
              return (
                <div className='sub-menu'>
                  {subMenu.subName ? (
                    <div className='menu-title'>
                      {collapsed ? <div className='divider'></div> : subMenu.subName}
                    </div>
                  ) : (
                    menus.length > 1 && ( 
                      <Divider style={{ margin: '12px 0' }} />
                    )
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
          <span className='text'>v{versionCfg.version || ''}</span>
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
    projects: state[KEY].get('projects').toJS(),
    userInfo: state[KEY].get('userInfo').toJS()
  })
)(OrgWrapper);