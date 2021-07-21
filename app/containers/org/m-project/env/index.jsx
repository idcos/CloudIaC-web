import React, { useState, useMemo } from 'react';
import { Button, Tabs } from "antd";
 
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import EnvList from './componemts/envList';
import history from 'utils/history';

const envNavs = {
  '': '全部',
  active: '活跃',
  approving: '待审批',
  inactive: '已销毁',
  // filed: '已归档',
  failed: '失败'
};
export default (props) => {
  const { match } = props,
    { params: { orgId, projectId } } = match; 

  const [ panel, setPanel ] = useState('');
  const renders = useMemo(() => {
    return <EnvList {...props} panel={panel} />;
  }, [panel]);
  return (
    <Layout
      extraHeader={<PageHeader
        title='环境'
        breadcrumb={true}
      />}
    >
      <div className='idcos-card'>
        <Tabs
          tabBarStyle={{ backgroundColor: '#fff', paddingLeft: 16 }}
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
        >
          {Object.keys(envNavs).map((it) => (
            <Tabs.TabPane
              tab={envNavs[it]}
              key={it}
            > 
              <div className='btnsTop'>
                <Button onClick={() => {
                  history.push(`/org/${orgId}/project/${projectId}/m-project-ct`);
                }} type='primary'
                >部署新环境</Button>
              </div>
              {renders}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};
