import React, { useState, useCallback, useRef } from 'react';
import { EyeOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Divider, notification } from 'antd';
import MenuSelect from 'components/menu-select';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import ProjectModal from 'components/project-modal';
import projectAPI from 'services/project';
import getMenus from './menus';
import styles from './styles.less';

const KEY = 'global';

const OrgWrapper = ({ routes, userInfo, curOrg, projects, curProject, match = {}, dispatch }) => {
  const { orgId, mOrgKey, projectId, mProjectKey } = match.params || {};
  const projectList = (projects || {}).list || [];
  const pjtId = projectId || (curProject || {}).id;
  const [ pjtSelectActive, setPjtSelectActive ] = useState(false);
  const [ pjtModalVsible, setPjtModalVsible ] = useState(false);
  const pjtSelectRef = useRef();
 
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

  const togglePjtModalVsible = () => {
    // 打开创建项目modal时 关闭项目选择器
    if (!pjtModalVsible) {
      pjtSelectRef.current && pjtSelectRef.current.setVisible(false);
    }
    setPjtModalVsible(!pjtModalVsible);
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

  const pjtOperation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: (param) => projectAPI.createProject(param)
      };
      let params = {
        ...payload
      };
      const res = await method[action](params);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
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
                setActive={setPjtSelectActive}
                selectionStyle={{ padding: '13px 20px 13px 24px' }}
                bodyStyle={{ maxHeight: 'none' }}
                valuePropName='id' 
                lablePropsNames={{ name: 'name' }}
                value={pjtId}
                showSearch={true}
                searchPlaceholder='请输入项目名称搜索'
                selectRef={pjtSelectRef}
                maxLen={14}
                menuSelectfooter={(
                  <div 
                    className={styles.menuSelectfooterContent} 
                  >
                    <div className='more' onClick={() => history.push(`/project-select-page?orgId=${orgId}`)}>
                      <EyeOutlined className='icon' />查看更多项目
                    </div>
                    <div className='create'>
                      <div className='btn' onClick={togglePjtModalVsible}>
                        <span className='icon'>
                          <PlusSquareOutlined/>
                        </span>
                        <span>创建新的项目</span>
                      </div>
                    </div>
                    {
                      pjtModalVsible && <ProjectModal
                        visible={pjtModalVsible}
                        orgId={orgId}
                        opt='add'
                        toggleVisible={togglePjtModalVsible}
                        operation={pjtOperation}
                      />
                    }
                  </div>
                )}
              />
              {!pjtSelectActive && <div style={{ padding: '0 19px' }}>
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
                  {
                    subMenu.subName ? (
                      <div className='menu-title'>{subMenu.subName}</div>
                    ) : (
                      <Divider style={{ margin: '12px 0' }} />
                    )
                  }
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