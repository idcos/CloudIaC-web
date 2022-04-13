import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Tooltip, Button, Badge } from 'antd';
import { QuestionCircleFilled, DownOutlined, EyeOutlined, FundFilled, SettingFilled, SecurityScanFilled } from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from 'query-string';
import history from 'utils/history';
import { QuitIcon, EnIcon, ZhIcon } from 'components/iconfont';
import changeOrg from "utils/changeOrg";
import { logout } from 'services/logout';
import SeniorSelect from 'components/senior-select';
import getPermission from "utils/permission";
import { t, getLanguage, setLanguage } from "utils/i18n";
import styles from './styles.less';

const KEY = 'global';

const AppHeader = (props) => {

  const language = getLanguage();
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
        {!!orgId && (
          <>
            {
              menuType === 'execute' ? (
                <div className='changeMenu' onClick={() => changeMenu('compliance')}>{t('define.enterCompliance')}</div>
              ) : (
                <div className='changeMenu' onClick={() => changeMenu('execute')}>{t('define.enterExecute')}</div>
              )
            }
          </>
        )}
      </div>
      <div className='rParts'>
        {
          !!orgId ? (
            <>
              <SeniorSelect
                style={{ width: 250 }}
                options={orgList}
                onChange={changeCurOrg}
                listHeight={800}
                maxLen={10}
                value={orgId}
                showSearch={true}
                searchPlaceholder={t('define.searchOrgPlaceholder')}
                lablePropsNames={{ name: 'name' }}
                valuePropName='id'
                formatOptionLabel={(name) => <>{t('define.scope.org')}: {name}</>}
                seniorSelectfooter={(
                  <div className={styles.seniorSelectfooter}>
                    <div className='more' onClick={() => history.push('/')}>
                      <EyeOutlined className='icon' />{t('define.viewMore')}
                    </div>
                  </div>
                )}
              />
            </>
          ) : null
        }
        <div className='user'>
          <span onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>{language === 'zh' ? <EnIcon /> : <ZhIcon />}</span>
          <Tooltip 
            color='#08857C'
            placement='bottomRight'
            visible={devManualTooltipVisible}
            overlayStyle={{ maxWidth: 'none' }}
            title={
              <div className='dev-manual-tooltip-content'>
                {t('define.HelpDocTooltip')} 
                <Button type='primary' onClick={() => onCloseDevManualTooltip()}>{t('define.gotIt')}</Button> 
              </div>
            }
          >
            <Badge color={devManualTooltipVisible ? '#08857C' : null} offset={[ -1, 3 ]}>
              <span onClick={() => window.open('https://idcos.github.io/cloudiac')}><QuestionCircleFilled/></span>
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
                    <span className='text'>{t('define.userSet')}</span>
                  </div>
                  {
                    userInfo.isAdmin ? (
                      <div className='link-item' onClick={() => history.push('/sys/setting')}>
                        <span className='icon'><SettingFilled /></span>
                        <span className='text'>{t('define.sysSet')}</span>
                      </div>
                    ) : null
                  }
                  <div className='link-item' onClick={() => logout()}>
                    <span className='icon'><QuitIcon/></span>
                    <span className='text'>{t('define.logout')}</span>
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
