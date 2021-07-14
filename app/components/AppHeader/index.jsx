import React, { useEffect, useState } from 'react';
import { Select, Menu, Dropdown, Tooltip, Button, Badge } from 'antd';
import { Link } from 'react-router-dom';
import history from 'utils/history';
import { QuestionCircleFilled, DownOutlined, FundFilled } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from "react-redux";
import { logout } from 'services/logout';

const { Option } = Select;
const KEY = 'global';

const AppHeader = (props) => {
  const { theme, locationPathName, curOrg, projects, curProject, dispatch, userInfo } = props;
  const [ devManualTooltipVisible, setDevManualTooltipVisible ] = useState(localStorage.newbieGuide_devManual === 'true');

  const changeProject = (projectId) => {
    dispatch({
      type: 'global/set-curProject',
      payload: {
        projectId
      }
    });
    history.push(`/org/${curOrg.id}/project/${projectId}/m-project-env`);
  };

  useEffect(() => {
    if (locationPathName.indexOf('org') == -1) {
      dispatch({
        type: 'global/set-curOrg',
        payload: {
          orgId: null
        }
      });
    }
    if (locationPathName.indexOf('/project/') == -1) {
      dispatch({
        type: 'global/set-curProject',
        payload: {
          projectId: null
        }
      });
    }
  }, [locationPathName]);

  const onCloseDevManualTooltip = () => {
    setDevManualTooltipVisible(false);
    localStorage.newbieGuide_devManual = false;
  };

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'>
      <div className='logo' onClick={() => history.push('/')}><img src='/assets/logo/logo.svg' alt='IaC'/></div>
      <div className='rParts'>
        {
          curOrg && curOrg.id ? (
            <Select 
              getPopupContainer={triggerNode => triggerNode.parentNode}
              className={styles.projectSwitcher}
              style={{ width: 164 }}
              placeholder='选择项目'
              onChange={changeProject}
              value={curProject && curProject.id}
            >
              {(projects.list || []).map(it => <Option value={it.id}>{it.name}</Option>)}
            </Select>
          ) : null
        }
        <div className='user'>
          <Tooltip 
            color='#13c2c2'
            visible={devManualTooltipVisible}
            overlayStyle={{ maxWidth: 'none' }}
            title={
              <div className='dev-manual-tooltip-content'>
                IaC开发者文档，快速了解IaC玩法 
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
            overlay={<Menu
              onClick={({ key }) => {
                switch (key) {
                  case 'basic':
                  case 'pwd':
                    history.push({
                      pathname: `/user/setting`,
                      state: {
                        panel: key
                      }
                    });
                    break;
                  case 'logout':
                    logout();
                    break;
                  default:
                    return;
                }
              }}
            >
              <Menu.Item key='basic'>用户设置</Menu.Item>
              {
                userInfo.isAdmin ? (
                  <Menu.Item key='sys' onClick={() => history.push('/sys/setting')}>系统设置</Menu.Item>
                ) : null
              }
              <Menu.Item key='pwd'>修改密码</Menu.Item>
              <Menu.Item danger={true} key='logout'>退出登录</Menu.Item>
            </Menu>}
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
