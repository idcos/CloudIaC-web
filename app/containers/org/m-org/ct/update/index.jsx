import React, { useState, useEffect } from "react";

import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";

import CTFormSteps from '../components/ct-form-steps';

export default ({ match = {} }) => {
  const { orgId, tplId } = match.params || {};
  return (
    <Layout
      extraHeader={<PageHeader title='编辑云模板' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} tplId={tplId} opType='edit' />
      </div>
    </Layout>
  );
};
