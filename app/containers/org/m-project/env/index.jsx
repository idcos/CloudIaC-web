import React, { useState } from 'react';
import { Button, Tabs, Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import EnvList from './componemts/envList';
import history from 'utils/history';
import getPermission from "utils/permission";

const envNavs = {
  '': '全部',
  active: '活跃',
  approving: '待审批',
  inactive: '不活跃',
  failed: '失败'
};

const Envs = (props) => {

  const { match, userInfo, location } = props;
  const { tplName } = location.state || {};
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const { params: { orgId, projectId } } = match; 
  const [ panel, setPanel ] = useState('');
  const [ query, setQuery ] = useState({ q: tplName });

  return (
    <Layout
      extraHeader={<PageHeader
        title='环境'
        breadcrumb={true}
        subDes={(
          PROJECT_OPERATOR ? (
            <Button 
              onClick={() => {
                history.push(`/org/${orgId}/project/${projectId}/m-project-ct`);
              }} 
              type='primary'
            >部署新环境</Button>
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
          onChange={(k) => setPanel(k)}
          destroyInactiveTabPane={true}
          tabBarExtraContent={
            <Input
              style={{ width: 400 }}
              allowClear={true}
              placeholder='请输入环境名称、标签或云模板名称搜索'
              prefix={<SearchOutlined />}
              defaultValue={query.q}
              onPressEnter={(e) => {
                setQuery(preValue => ({ ...preValue, q: e.target.value }));
              }}
            />
          }
        >
          {Object.keys(envNavs).map((it) => (
            <Tabs.TabPane
              tab={envNavs[it]}
              key={it}
            > 
              <EnvList {...props} panel={panel} query={query} />
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