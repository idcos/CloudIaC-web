import React from 'react';
import { Space } from 'antd';
import { connect } from 'react-redux';
import RoutesList from 'components/routes-list';
import history from "utils/history";
import { t } from "utils/i18n";
import { RadioButtonGroup } from 'components/ui-design';
import getMenus from './menus';
import styles from './styles.less';

const KEY = 'global';

const OrgWrapper = ({ routes, userInfo, curOrg, match = {} }) => {

  const { orgId, mOrgKey } = match.params || {};
 
  // 跳转 scope作用域
  const linkTo = (menuItemKey) => {
    history.push(`/org/${orgId}/${menuItemKey}`);
  };

  const menus = getMenus(userInfo || {});

  return (
    <div className={styles.orgWrapper}>
      <div className='header'>
        <Space size={32}>
          <div className='view-title'>{t('define.orgView')}</div>
          <RadioButtonGroup 
            value={mOrgKey}
            onChange={(val) => linkTo(val)}
            options={menus.map(it => ({ label: it.name, value: it.key }))} 
          />
        </Space>
      </div>
      <div className='body'>
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
    userInfo: state[KEY].get('userInfo').toJS()
  })
)(OrgWrapper);