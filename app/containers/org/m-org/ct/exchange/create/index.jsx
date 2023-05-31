import React from 'react';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { t } from 'utils/i18n';
import queryString from 'query-string';
import CTFormSteps from './ct-form-steps';

const Create = ({ match = {}, location }) => {
  const { orgId } = match.params || {};
  const queryInfo = queryString.parse(location.search) || {};
  return (
    <Layout
      extraHeader={
        <PageHeader title={t('define.addTemplate')} breadcrumb={true} />
      }
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} opType='add' queryInfo={queryInfo} />
      </div>
    </Layout>
  );
};

export default Create;
