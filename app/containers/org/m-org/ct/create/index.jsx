import React, { useState, useEffect } from "react";

import PageHeader from "components/pageHeader";
import Layout from "components/common/layout";

import CTFormSteps from '../components/ct-form-steps';

export default ({ match = {} }) => {
  const { orgId } = match.params || {};
  return (
    <Layout
      extraHeader={<PageHeader title='新建云模板' breadcrumb={true} />}
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} opType='add' />
      </div>
    </Layout>
  );
};
