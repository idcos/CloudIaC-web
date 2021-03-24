import React from 'react';
import { Button } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


const OrgSetting = (props) => {
  return <Layout
    extraHeader={<PageHeader
      title='设置'
      breadcrumb={true}
    />}
  >
  </Layout>;
};

export default Eb_WP()(OrgSetting);
