import React from 'react';
import { Button } from 'antd';

import history from 'utils/history';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


const CloudTmp = (props) => {
  const { match } = props;
  const { params } = match;
  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
      subDes={<Button onClick={() => history.push(`/${params.orgId}/ct/createCT`)}>创建云模板</Button>}
    />}
  >
  </Layout>;
};

export default Eb_WP()(CloudTmp);
