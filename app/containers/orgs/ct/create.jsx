import React from 'react';
import { Button } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


const CloudTmpCreate = (props) => {
  return <Layout
    extraHeader={<PageHeader
      title='创建云模板'
      breadcrumb={true}
    />}
  >
  </Layout>;
};

export default Eb_WP()(CloudTmpCreate);
