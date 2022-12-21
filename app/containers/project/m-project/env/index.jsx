import React, { useState } from 'react';
import { Button, Tabs, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import EnvList from './components/envList';
import history from 'utils/history';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';

const envNavs = {
  '': t('define.all'),
  running: t('env.status.running'),
  active: t('env.status.active'),
  approving: t('env.status.approving'),
  inactive: t('env.status.inactive'),
  failed: t('env.status.failed')
};

const Envs = (props) => {

  const { match, userInfo, location } = props;
  const { tplName } = location.state || {};
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const { params: { orgId, projectId } } = match; 
  const [ panel, setPanel ] = useState('');
  const [ query, setQuery ] = useState({ 
    q: tplName,
    currentPage: 1,
    pageSize: 10
  });

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  return (
    <Layout
      extraHeader={<PageHeader
        title={t('define.scope.env')}
        breadcrumb={true}
        subDes={(
          PROJECT_OPERATOR ? (
            <Button 
              onClick={() => {
                history.push(`/org/${orgId}/project/${projectId}/m-project-ct`);
              }} 
              type='primary'
            >{t('define.deployEnv')}</Button>
          ) : null
        )}
      />}
    >
      <div className='idcos-card'>
        <Tabs
          className='common-card-tabs'
          type={'card'}
          animated={false}
          renderTabBar={(props, DefaultTabBar) => {
            return (
              <div style={{ marginBottom: -16 }}>
                <DefaultTabBar {...props} />
              </div>
            );
          }}
          activeKey={panel}
          onChange={(k) => {
            setPanel(k);
            changeQuery({
              currentPage: 1
            });
          }}
          destroyInactiveTabPane={true}
          tabBarExtraContent={
            <Input
              style={{ width: 400 }}
              allowClear={true}
              placeholder={t('define.env.search.placeholder')}
              prefix={<SearchOutlined />}
              defaultValue={query.q}
              onPressEnter={(e) => {
                changeQuery({
                  q: e.target.value,
                  currentPage: 1
                });
              }}
            />
          }
        >
          {Object.keys(envNavs).map((it) => (
            <Tabs.TabPane
              tab={envNavs[it]}
              key={it}
            > 
              <EnvList {...props} panel={panel} query={query} changeQuery={changeQuery} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Envs);