import React, { useEffect, useState } from 'react';

import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import MarkdownDoc from './markdown-doc';

import styles from './styles.less';

export default () => {

  const [ mdText, setMDText ] = useState('');

  useEffect(() => {
    getMDText();
  }, []);

  const getMDText = async () => {
    try {
      const res = await fetch('/assets/md/dev-doc.md');
      const text = await res.text();
      setMDText(typeof text === 'string' ? text : '');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout
      contentStyle={{ paddingTop: 0 }}
      extraHeader={<PageHeader className='container-inner-width' title='开发者手册' />}
    >
      <div className={styles.markdownDocWrapper}>
        <div className='markdown-doc-scroll'>
          <div className='container-inner-width'>
            <MarkdownDoc mdText={mdText} scrollDomSelecter='.markdown-doc-scroll' />
          </div>
        </div>
      </div>
    </Layout>
  );
};
