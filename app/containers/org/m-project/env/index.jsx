import React, { useState, useEffect } from 'react';

import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';

export default () => {

  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus
        title='环境'
        breadcrumb={true}
      />}
    >
      <div className='idcos-card'>
        环境
      </div>
    </LayoutPlus>
  );
};
