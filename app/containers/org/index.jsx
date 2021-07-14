import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';

import RoutesList from 'components/routes-list';
import history from "utils/history";

import styles from './styles.less';


const { Option } = Select;
const KEY = 'global';

const menus = [
  {
    subName: '项目信息',
    subKey: 'project',
    menuList: [
      {
        name: '环境',
        key: 'm-project-env'
      },
      {
        name: '云模板',
        key: 'm-project-ct'
      },
      {
        name: '变量',
        key: 'm-project-variable'
      },
      {
        name: '设置',
        key: 'm-project-setting'
      }
    ]
  },
  {
    subName: '组织设置',
    subKey: 'org',
    menuList: [
      {
        name: '项目',
        key: 'm-org-project'
      },
      {
        name: '云模板',
        key: 'm-org-ct'
      },
      {
        name: '变量',
        key: 'm-org-variable'
      },
      {
        name: '设定',
        key: 'm-org-setting'
      }
    ]
  }
];

const OrgWrapper = ({ routes, curOrg, match = {}, orgs, dispatch }) => {
  const { orgId, mOrgKey, projectId, mProjectKey } = match.params || {};
  const linkTo = (subKey, menuItemKey) => {
    switch (subKey) {
      case 'org':
        history.push(`/org/${orgId}/${menuItemKey}`);
        break;
      case 'project':
        history.push(`/org/${orgId}/project/${projectId}/${menuItemKey}`);
        break;
      default:
        break;
    }
  };

  const changeCurOrg = (orgId) => {
    dispatch({
      type: 'global/set-curOrg',
      payload: {
        orgId
      }
    });
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId
      }
    });
    history.push(`/org/${orgId}`);
  };
 
  return (
    <div className={styles.orgWrapper}>
      <div className='left-nav'>
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          // className={styles.orgSwitcher}
          style={{ width: 200 }}
          placeholder='选择组织'
          onChange={changeCurOrg}
          value={curOrg && curOrg.id}
        >
          {(orgs.list || []).map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
        <div className='menu-wrapper'>
          {
            menus.map(it => (
              <div className='sub-menu'>
                <div className='menu-title'>{it.subName}</div>
                <div className='menu-list'>
                  {
                    it.menuList.map(menuItem => {
                      let menuKey;
                      switch (it.subKey) {
                        case 'org':
                          menuKey = mOrgKey;
                          break;
                        case 'project':
                          menuKey = mProjectKey;
                          break;
                        default:
                          break;
                      }
                      return (
                        <div 
                          className={`menu-item ${menuKey === menuItem.key ? 'checked' : ''}`} 
                          onClick={() => linkTo(it.subKey, menuItem.key)}
                        >
                          <span>{menuItem.name}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            ))
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
    curOrg: state[KEY].get('curOrg')
  })
)(OrgWrapper);
