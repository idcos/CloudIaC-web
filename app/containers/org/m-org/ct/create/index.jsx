import React, { useState, useEffect } from "react";

import PageHeaderPlus from "components/pageHeaderPlus";
import LayoutPlus from "components/common/layout/plus";

import CTFormSteps from '../components/ct-form-steps';

export default ({ match = {} }) => {
  const { orgId } = match.params || {};
  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus title='新建云模版' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} opType='add' />
      </div>
    </LayoutPlus>
  );
};
