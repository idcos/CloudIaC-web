import React, { useEffect } from 'react';

import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import MarkdownDoc from './markdown-doc';

import styles from './styles.less';

export default () => {

  return (
    <Layout
      contentStyle={{ paddingTop: 0 }}
      extraHeader={<PageHeader title='开发者手册' />}
    >
      <div className={styles.markdownDocWrapper}>
        <div className='markdown-doc-scroll'>
          <div className='container-inner-width'>
            <MarkdownDoc scrollDomSelecter='.markdown-doc-scroll' />
          </div>
        </div>
      </div>
    </Layout>
  );
};
