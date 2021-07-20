import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Select, Divider } from 'antd';
import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined } from '@ant-design/icons';

import MenuSelect from 'components/menu-select';
import RoutesList from 'components/routes-list';
import history from "utils/history";

import styles from './styles.less';


const { Option } = Select;
const KEY = 'global';

const menus = [
  {
    subName: '项目信息',
    subKey: 'project',
    emptyMenuList: [
      {
        name: '创建项目',
        key: 'm-project-create',
        icon: <PlusSquareOutlined />
      }
    ],
    menuList: [
      {
        name: '环境',
        key: 'm-project-env',
        icon: <CodeOutlined />
      },
      {
        name: '云模板',
        key: 'm-project-ct',
        icon: <LayoutOutlined />
      },
      {
        name: '变量',
        key: 'm-project-variable',
        icon: <InteractionOutlined />
      },
      {
        name: '设置',
        key: 'm-project-setting',
        icon: <SettingOutlined />
      }
    ]
  },
  {
    subName: '组织设置',
    subKey: 'org',
    emptyMenuList: [],
    menuList: [
      {
        name: '项目',
        key: 'm-org-project',
        icon: <ProjectOutlined />
      },
      {
        name: '云模板',
        key: 'm-org-ct',
        icon: <LayoutOutlined />
      },
      {
        name: '变量',
        key: 'm-org-variable',
        icon: <InteractionOutlined />
      },
      {
        name: '设定',
        key: 'm-org-setting',
        icon: <FormOutlined />
      }
    ]
  }
];

const OrgWrapper = ({ routes, curOrg, curProject, match = {}, orgs, dispatch }) => {

  const { orgId, mOrgKey, projectId, mProjectKey } = match.params || {};
  const orgList = (orgs || {}).list || [];
  const pjtId = projectId || (curProject || {}).id;
  
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
    dispatch({
      type: 'global/set-curOrg',
      payload: {
        orgId: value
      }
    });
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId: value
      }
    });
    history.push(`/org/${value}/m-org-ct`);
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
        <MenuSelect
          options={orgList}
          onChange={changeCurOrg}
          selectionStyle={{ padding: '13px 20px 13px 24px' }}
          lablePropName='name'
          valuePropName='id'            
          value={curOrg && curOrg.id}
          menuSelectfooter={(
            <div 
              className={styles.menuSelectfooterContent} 
              onClick={() => history.push('/')}
            >
              查看更多组织
            </div>
          )}
        />
        <div style={{ padding: '0 19px' }}>
          <Divider style={{ margin: '0' }} />
        </div>
        <div className='menu-wrapper'>
          {
            menus.map(it => (
              <div className='sub-menu'>
                <div className='menu-title'>{it.subName}</div>
                <div className='menu-list'>
                  { renderMenus(it) }
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
    curOrg: state[KEY].get('curOrg'),
    curProject: state[KEY].get('curProject')
  })
)(OrgWrapper);
