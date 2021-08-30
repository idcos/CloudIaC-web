import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'antd';

import MenuSelect from 'components/menu-select';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import changeOrg from "utils/changeOrg";

import getMenus from './menus';
import styles from './styles.less';

const KEY = 'global';

const OrgWrapper = ({ routes, userInfo, curOrg, projects, curProject, match = {}, orgs, dispatch }) => {
  const { orgId, mOrgKey, projectId, mProjectKey } = match.params || {};
  const orgList = (orgs || {}).list || [];
  const projectList = (projects || {}).list || [];
  const pjtId = projectId || (curProject || {}).id;
  const [ dividerVisible, setDividerVisible ] = useState(false);
 
  // 跳转 scope作用域
  const linkTo = (scope, menuItemKey) => {
    switch (scope) {
    case 'org':
      history.push(`/org/${orgId}/${menuItemKey}`);
      break;
    case 'project':
      history.push(`/org/${orgId}/project/${pjtId}/${menuItemKey}`);
      break;
    default:
      break;
    }
  };

  const changeCurOrg = (value) => {
    changeOrg({ orgId: value, dispatch });
  };

  const changeProject = (pjtId) => {
    dispatch({
      type: 'global/set-curProject',
      payload: {
        projectId: pjtId
      }
    });
    history.push(`/org/${orgId}/project/${pjtId}/m-project-env`);
  };

  const renderMenus = useCallback(({ subKey, emptyMenuList = [], menuList }) => {
    let scope = subKey, menuKey, isEmptyData = false;
    switch (subKey) {
    case 'org':
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
          <span className='icon'>{menuItem.icon}</span>
          <span>{menuItem.name}</span>
        </div>
      );
    });
  }, [pjtId]);
 
  return (
    <div className={styles.orgWrapper}>
      <div className='left-nav'>
        {
          projectList.length ? (
            <>
              <MenuSelect
                options={projectList}
                onChange={changeProject}
                setDividerVisible={setDividerVisible}
                selectionStyle={{ padding: '13px 20px 13px 24px' }}
                lablePropName='name'
                valuePropName='id'            
                value={pjtId}
                menuSelectfooter={(
                  <div 
                    className={styles.menuSelectfooterContent} 
                    onClick={() => history.push('/')}
                  >
                    查看更多项目
                  </div>
                )}
              />
              {!dividerVisible && <div style={{ padding: '0 19px' }}>
                <Divider style={{ margin: '0' }} />
              </div>}
            </>
          ) : null
        }
        <div className='menu-wrapper'>
          {
            getMenus(userInfo || {}).map(subMenu => {
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
    projects: state[KEY].get('projects').toJS(),
    userInfo: state[KEY].get('userInfo').toJS()
  })
)(OrgWrapper);