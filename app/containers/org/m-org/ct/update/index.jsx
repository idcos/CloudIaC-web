import React from 'react';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { t } from 'utils/i18n';
import CTFormSteps from '../components/ct-form-steps';

const Update = ({ match = {} }) => {
  const { orgId, tplId } = match.params || {};
  return (
    <Layout
      extraHeader={
        <PageHeader title={t('define.modifyTemplate')} breadcrumb={true} />
      }
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} tplId={tplId} opType='edit' />
      </div>
    </Layout>
  );
};

export default Update;
