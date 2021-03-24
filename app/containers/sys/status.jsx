import React, { useEffect } from 'react';
import { List, Tag } from 'antd';
import { Link } from 'react-router-dom';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';


const SysStatus = (props) => {
  return <Layout
    extraHeader={<PageHeader
      title='系统状态'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width whiteBg withPadding'>
    </div>
  </Layout>;
};


export default Eb_WP()(SysStatus);
