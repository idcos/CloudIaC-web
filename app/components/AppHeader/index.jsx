import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Tooltip, Button, Badge } from 'antd';
import { QuestionCircleFilled, DownOutlined, EyeOutlined, FundFilled, SettingFilled, ToolFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from 'query-string';
import history from 'utils/history';
import { QuitIcon } from 'components/iconfont';
import changeOrg from "utils/changeOrg";
import { logout } from 'services/logout';
import SeniorSelect from 'components/senior-select';
import envAPI from 'services/env';
import styles from './styles.less';

const KEY = 'global';

const AppHeader = (props) => {
  const { theme, locationPathName, orgs, curOrg, projects, curProject, dispatch, userInfo } = props;
  const { pathname } = window.location;
  const orgList = (orgs || {}).list || [];
  const projectList = (projects || {}).list || [];
  const projectId = (curProject || {}).id;
  const url_projectId = pathname.indexOf('/project/') !== -1 ? pathname.split('/').filter(i => i)[3] : null;
  const envIdbyPath = pathname.indexOf('/detail/') !== -1 ? pathname.split('/').filter(i => i)[6] : null;
  const orgId = (curOrg || {}).id;
  const preStateRef = useRef({});
  const [ devManualTooltipVisible, setDevManualTooltipVisible ] = useState(localStorage.newbieGuide_devManual === 'true');
  const [ menuType, setMenuType ] = useState(pathname.indexOf('compliance') !== -1 ? 'execute' : 'compliance');
  const [ locationHref, setLocationHref ] = useState('/');

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
    
    if (orgId && projectId && envIdbyPath) {
      getEnv();
    }
    preStateRef.current = {
      orgId, projectId
    };
    
  }, [ orgId, projectId, envIdbyPath ]);

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

  const getEnv = async() => {
    const res = await envAPI.envsInfo({
      orgId, projectId, envId: envIdbyPath
    });
    if (res.code === 200) {
      dispatch({
        type: 'global/set-curEnv',
        payload: {
          state: res.result || {}
        }
      });
    }
  };

  const changeCurOrg = (value, needJump = true) => {
    changeOrg({ orgId: value, dispatch, needJump });
  };

  const onCloseDevManualTooltip = () => {
    setDevManualTooltipVisible(false);
    localStorage.newbieGuide_devManual = false;
  };

  const changeMenu = (value) => {
    setMenuType(value);
    localStorage.setItem('menuType', value);
    if (value === 'execute') {
      setLocationHref(pathname);
    }
    value === 'execute' ? history.push(`/compliance/dashboard`) : history.push(locationHref || '/');
  };

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'> 
      <div className='logo' onClick={() => {
        history.push('/'); 
        setMenuType('compliance');
      }}
      ><img src='/assets/logo/iac-logo.svg' alt='IaC'/></div>
      {(pathname !== '/') && userInfo.isAdmin && <div>{menuType === 'compliance' ? <div className='changeMenu' onClick={() => changeMenu('execute')}>进入合规</div> : <div className='changeMenu' onClick={() => changeMenu('compliance')}>进入执行界面</div>}</div>}
      <div className='rParts'>
        {
          (pathname !== '/' && pathname.indexOf('compliance') === -1) ? (
            <>
              <SeniorSelect
                style={{ width: 250, marginLeft: 24 }}
                options={orgList}
                onChange={changeCurOrg}
                listHeight={800}
                maxLen={7}
                value={orgId}
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
            color='#13c2c2'
            visible={devManualTooltipVisible}
            overlayStyle={{ maxWidth: 'none' }}
            title={
              <div className='dev-manual-tooltip-content'>
                IaC帮助文档，快速了解IaC玩法 
                <Button type='primary' onClick={() => onCloseDevManualTooltip()}>知道了</Button> 
              </div>
            }
          >
            <Badge color={devManualTooltipVisible ? '#13c2c2' : null} offset={[ -1, 3 ]}>
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
                    <div className='line-border-top'>
                      <span className='icon'><SettingFilled /></span>
                      <span className='text'>用户设置</span>
                    </div>
                  </div>
                  {
                    userInfo.isAdmin ? (
                      <div className='link-item' onClick={() => history.push('/sys/setting')}>
                        <div className='line-border-bottom'>
                          <span className='icon'><ToolFilled /></span>
                          <span className='text'>系统设置</span>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
                <div className='footer'>
                  <div className='link-item' style={{ padding: '9px 18px' }} onClick={() => logout()}>
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
