import React, { useState, useEffect } from "react";

import PageHeaderPlus from "components/pageHeaderPlus";
import LayoutPlus from "components/common/layout/plus";

import CTFormSteps from '../components/ct-form-steps';

export default ({ match = {} }) => {
  const { orgId, tplId } = match.params || {};
  return (
    <LayoutPlus
      extraHeader={<PageHeaderPlus title='编辑云模版' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} tplId={tplId} opType='edit' />
      </div>
    </LayoutPlus>
  );
};
