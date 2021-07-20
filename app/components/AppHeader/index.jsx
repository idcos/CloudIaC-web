import React, { useEffect, useState } from 'react';
import { Select, Menu, Dropdown, Tooltip, Button, Badge, notification } from 'antd';
import { QuestionCircleFilled, DownOutlined, FundFilled, PlusSquareOutlined } from '@ant-design/icons';
import { connect } from "react-redux";

import history from 'utils/history';
import { logout } from 'services/logout';
import SeniorSelect from 'components/senior-select';
import { pjtAPI } from 'services/base';
import OpModal from 'components/project-modal';

import styles from './styles.less';

const { Option } = Select;
const KEY = 'global';

const AppHeader = (props) => {

  const { theme, locationPathName, curOrg, projects, curProject, dispatch, userInfo } = props;
  const projectList = (projects || {}).list || [];
  const projectId = (curProject || {}).id;
  const orgId = (curOrg || {}).id;

  const [ pjtModalVsible, setPjtModalVsible ] = useState(false);
  const [ devManualTooltipVisible, setDevManualTooltipVisible ] = useState(localStorage.newbieGuide_devManual === 'true');

  const changeProject = (pjtId) => {
    dispatch({
      type: 'global/set-curProject',
      payload: {
        projectId: pjtId
      }
    });
    history.push(`/org/${orgId}/project/${pjtId}/m-project-env`);
  };

  useEffect(() => {
    if (projectList.length > 0 && !projectList.find(it => it.id === projectId)) {
      dispatch({
        type: 'global/set-curProject',
        payload: {
          projectId: projectList[0].id
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
    if (locationPathName.indexOf('org') == -1) {
      dispatch({
        type: 'global/set-curOrg',
        payload: {
          orgId: null
        }
      });
    }
  }, [locationPathName]);

  const onCloseDevManualTooltip = () => {
    setDevManualTooltipVisible(false);
    localStorage.newbieGuide_devManual = false;
  };

  const goMoreProject = () => {
    history.push(`/org/${orgId}/m-org-project`);
  };

  const togglePjtModalVsible = () => setPjtModalVsible(!pjtModalVsible);

  const pjtOperation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: (param) => pjtAPI.createProject(param)
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

  return <div className={`idcos-app-header ${theme || ''}`}>
    <div className='inner'>
      <div className='logo' onClick={() => history.push('/')}><img src='/assets/logo/iac-logo.svg' alt='IaC'/></div>
      <div className='rParts'>
        {
          orgId ? (
            <>
              <SeniorSelect 
                placeholder='项目：'
                style={{ width: 250, marginLeft: 24 }}
                options={projectList}
                onChange={changeProject}
                value={projectId}
                valuePropName='id'
                formatOptionLabel={(name) => `项目：${name}`}
                seniorSelectfooter={(
                  <div className={styles.seniorSelectfooter}>
                    <div className='more' onClick={goMoreProject}>查看更多项目</div>
                    <div className='create'>
                      <div className='btn' onClick={togglePjtModalVsible}>
                        <span className='icon'>
                          <PlusSquareOutlined/>
                        </span>
                        <span>创建新的项目</span>
                      </div>
                    </div>
                  </div>
                )}
              />
              {
                pjtModalVsible && <OpModal
                  visible={pjtModalVsible}
                  orgId={orgId}
                  opt='add'
                  toggleVisible={togglePjtModalVsible}
                  operation={pjtOperation}
                />
              }
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
