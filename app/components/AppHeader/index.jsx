import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Tooltip, Button, Badge, Divider } from 'antd';
import { QuestionCircleFilled, DownOutlined, FundFilled, SettingFilled, SecurityScanFilled, EyeOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import queryString from 'query-string';
import history from 'utils/history';
import { QuitIcon, EnIcon, ZhIcon, ToRegistryIcon, SwitchComplianceIcon } from 'components/iconfont';
import changeOrg from "utils/changeOrg";
import { logout } from 'services/logout';
import SeniorSelect from 'components/senior-select';
import getPermission from "utils/permission";
import { t, getLanguage, setLanguage } from "utils/i18n";
import { getMatchParams } from "utils/util";
import styles from './styles.less';
import { IAC_PUBLICITY_HOST } from 'constants/types';

const KEY = 'global';

const AppHeader = (props) => {

  const language = getLanguage();
  const { theme, locationPathName, curOrg, curProject, dispatch, userInfo, orgs } = props;
  const orgList = (orgs || {}).list || [];
  const projectId = (curProject || {}).id;
  const orgId = (curOrg || {}).id;
  const preStateRef = useRef({});
  const [ devManualTooltipVisible, setDevManualTooltipVisible ] = useState(localStorage.newbieGuide_devManual === 'true');
  const menuType = locationPathName.indexOf('compliance') !== -1 ? 'compliance' : 'execute';
  
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
    if (orgId) {
      dispatch({
        type: 'global/getProjects',
        payload: {
          orgId: orgId
        }
      });
    }
  }, [orgId]);

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

  const changeMenu = (value) => {
    if (value === 'execute') {
      history.push(`/org/${orgId}/m-org-overview`);
    } else {
      history.push(`/org/${orgId}/compliance/dashboard`);
    }
  };

  const linkToOrgView = () => {
    history.push(`/org/${orgId}/m-org-overview`);
  };

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'> 
      <div 
        className='logo' 
        onClick={() => {
          history.push('/');
        }}
      >
        <img src='/assets/logo/iac-logo.svg' alt='IaC'/>
      </div>
      <Divider type='vertical' className='header-divider'/>
      <div className='rParts'>
        {
          !!orgId ? (
            <>
              <SeniorSelect
                style={{ width: 'auto' }}
                dropdownMatchSelectWidth={250}
                options={orgList}
                onChange={changeCurOrg}
                listHeight={800}
                maxLen={10}
                value={orgId}
                showSearch={true}
                searchPlaceholder={t('define.header.organization.search.placeholder')} 
                lablePropsNames={{ name: 'name' }}
                valuePropName='id'
                formatOptionLabel={(name) => 
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div>{`${name}`}</div>
                    <div
                      className={'tab-icon'}
                    >
                      <div
                        className={'tab-triangle'}
                        style={{
                          borderTopColor: `#ffffff`,
                          transition: 'all 0.2s'
                        }}
                      ></div>
                    </div>
                  </div>}
                seniorSelectfooter={(
                  <div className={styles.seniorSelectfooter}>
                    <div className='more' onClick={() => history.push('/')}>
                      <EyeOutlined className='icon' />{t('define.header.organization.more')}
                    </div>
                  </div>
                )}
              />
            </>
          ) : null
        }

        <div className='user'>
          {!!orgId && (
            <>
              {
                // define.enterCompliance
                menuType === 'execute' ? (
                  <Tooltip placement='bottom' title={t('define.enterCompliance')}>
                    <span onClick={() => changeMenu('compliance')}>{<SwitchComplianceIcon />}</span>
                  </Tooltip>
                  
                ) : (
                  // define.enterExecute
                  <Tooltip placement='bottom' title={t('define.enterExecute')}>
                    <span onClick={() => changeMenu('execute')}>{<SwitchComplianceIcon />}</span>
                  </Tooltip>
                )
              }
            </>
          )}
          <span onClick={() => window.open('https://registry.cloudiac.org/')}>{ <ToRegistryIcon />}</span>
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
              <span onClick={() => window.open(`${IAC_PUBLICITY_HOST}/markdown/docs/`)}><QuestionCircleFilled/></span>
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
    curProject: state[KEY].get('curProject') || {},
    userInfo: state[KEY].get('userInfo').toJS()
  };
})(AppHeader);
