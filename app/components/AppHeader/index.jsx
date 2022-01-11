import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Tooltip, Button, Badge } from 'antd';
import { QuestionCircleFilled, DownOutlined, EyeOutlined, FundFilled, SettingFilled, SecurityScanFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from 'query-string';
import history from 'utils/history';
import { QuitIcon } from 'components/iconfont';
import changeOrg from "utils/changeOrg";
import { logout } from 'services/logout';
import SeniorSelect from 'components/senior-select';
import getPermission from "utils/permission";
import styles from './styles.less';

const KEY = 'global';

const AppHeader = (props) => {
  const { theme, locationPathName, orgs, curOrg, projects, curProject, dispatch, userInfo } = props;
  const { ORG_SET } = getPermission(userInfo);
  const { pathname } = window.location;
  const orgList = (orgs || {}).list || [];
  const projectList = (projects || {}).list || [];
  const projectId = (curProject || {}).id;
  const url_projectId = pathname.indexOf('/project/') !== -1 ? pathname.split('/').filter(i => i)[3] : null;
  const orgId = (curOrg || {}).id;
  const preStateRef = useRef({});
  const [ devManualTooltipVisible, setDevManualTooltipVisible ] = useState(localStorage.newbieGuide_devManual === 'true');
  const [ menuType, setMenuType ] = useState(pathname.indexOf('compliance') !== -1 ? 'compliance' : 'execute');

  useEffect(() => {
   
    if (orgId && !(orgId !== preStateRef.current.orgId && projectId === preStateRef.current.projectId)) {
      dispatch({
        type: 'global/getUserInfo',
        payload: {
          orgId,
          projectId
        }
      });
    }
    
    preStateRef.current = {
      orgId, projectId
    };
    
  }, [ orgId, projectId ]);

  useEffect(() => {
    if (projectList.length > 0 && !projectList.find(it => it.id === projectId)) {
      dispatch({
        type: 'global/set-curProject',
        payload: {
          projectId: url_projectId || projectList[0].id
        }
      });
    }
    if (projectList.length === 0) {
      dispatch({
        type: 'global/set-curProject',
        payload: {
          projectId: null
        }
      });
    }
  }, [ projectList, projectId ]);

  useEffect(() => {
    const { orgId } = queryString.parse(location.search);
    if (orgId) {
      changeCurOrg(orgId, false);
      return;
    }
    if (locationPathName === '/') {
      dispatch({
        type: 'global/set-curOrg',
        payload: {
          orgId: null
        }
      });
    }
  }, [locationPathName]);

  const changeCurOrg = (value, needJump = true) => {
    changeOrg({ orgId: value, dispatch, needJump, menuType });
  };

  const onCloseDevManualTooltip = () => {
    setDevManualTooltipVisible(false);
    localStorage.newbieGuide_devManual = false;
  };

  const jumpExecute = () => {
    if (!ORG_SET && !projectList.length) {
      history.push(`/org/${orgId}/m-other-resource`);
      return;
    }
    if (ORG_SET) {
      history.push(`/org/${orgId}/m-org-ct`);
    } else {
      history.push(`/org/${orgId}/project/${projectList[0].id}/m-project-env`);
    }
  };

  const changeMenu = (value) => {
    if (value === 'execute') {
      jumpExecute();
    } else {
      history.push(`/org/${orgId}/compliance/dashboard`);
    }
    setMenuType(value);
  };

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'> 
      <div 
        className='logo' 
        onClick={() => {
          history.push('/'); 
          setMenuType('execute');
        }}
      >
        <img src='/assets/logo/iac-logo.svg' alt='IaC'/>
      </div>
      <div className='change-menu-wrapper'>
        {(pathname !== '/') && (
          <>
            {
              menuType === 'execute' ? (
                <div className='changeMenu' onClick={() => changeMenu('compliance')}>进入合规</div>
              ) : (
                <div className='changeMenu' onClick={() => changeMenu('execute')}>进入执行</div>
              )
            }
          </>
        )}
      </div>
      <div className='rParts'>
        {
          (pathname !== '/') ? (
            <>
              <SeniorSelect
                style={{ width: 250 }}
                options={orgList}
                onChange={changeCurOrg}
                listHeight={800}
                maxLen={10}
                value={orgId}
                showSearch={true}
                searchPlaceholder='请输入组织名称搜索'
                lablePropsNames={{ name: 'name' }}
                valuePropName='id'
                formatOptionLabel={(name) => `组织：${name}`}
                seniorSelectfooter={(
                  <div className={styles.seniorSelectfooter}>
                    <div className='more' onClick={() => history.push('/')}>
                      <EyeOutlined className='icon' />查看更多
                    </div>
                  </div>
                )}
              />
            </>
          ) : null
        }
        <div className='user'>
          <Tooltip 
            color='#00AB9D'
            visible={devManualTooltipVisible}
            overlayStyle={{ maxWidth: 'none' }}
            title={
              <div className='dev-manual-tooltip-content'>
                IaC帮助文档，快速了解IaC玩法 
                <Button type='primary' onClick={() => onCloseDevManualTooltip()}>知道了</Button> 
              </div>
            }
          >
            <Badge color={devManualTooltipVisible ? '#00AB9D' : null} offset={[ -1, 3 ]}>
              <span onClick={() => history.push('/devManual')}><QuestionCircleFilled/></span>
            </Badge>
          </Tooltip>
          <span onClick={() => history.push('/sys/status')}><FundFilled/></span>
          <Dropdown
            overlay={(
              <div className={styles.userDropContent}>
                <div className='header'>
                  <div className='name'>{userInfo.name}</div>
                  <div className='email'>{userInfo.email}</div>
                </div>
                <div className='body'>
                  <div className='link-item' onClick={() => history.push('/user/setting')}>
                    <span className='icon'><SecurityScanFilled /></span>
                    <span className='text'>用户设置</span>
                  </div>
                  {
                    userInfo.isAdmin ? (
                      <div className='link-item' onClick={() => history.push('/sys/setting')}>
                        <span className='icon'><SettingFilled /></span>
                        <span className='text'>系统设置</span>
                      </div>
                    ) : null
                  }
                  <div className='link-item' onClick={() => logout()}>
                    <span className='icon'><QuitIcon/></span>
                    <span className='text'>退出</span>
                  </div>
                </div>
              </div>
            )}
          >
            <span>{userInfo.name || ''} <DownOutlined style={{ verticalAlign: 'middle', fontSize: 14 }} /></span>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>;
};

export default connect((state) => {
  return {
    orgs: state[KEY].get('orgs').toJS(),
    curOrg: state[KEY].get('curOrg'),
    projects: state[KEY].get('projects').toJS(),
    curProject: state[KEY].get('curProject'),
    userInfo: state[KEY].get('userInfo').toJS()
  };
})(AppHeader);
