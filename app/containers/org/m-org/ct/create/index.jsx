import React from 'react';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { t } from 'utils/i18n';
import CTFormSteps from '../components/ct-form-steps';

const Create = ({ match = {} }) => {
  const { orgId } = match.params || {};
  return (
    <Layout
      extraHeader={
        <PageHeader title={t('define.addTemplate')} breadcrumb={true} />
      }
    >
      <div className='idcos-card'>
        <CTFormSteps orgId={orgId} opType='add' />
      </div>
    </Layout>
  );
};

export default Create;
