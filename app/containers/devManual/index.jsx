import React, { useEffect, useState } from 'react';
import { DOCS } from 'constants/types';

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
    const res = await Promise.all(Object.keys(DOCS).map(d => fetch(`/assets/md/${d}.md`))).then((res) => {
      console.log(res.map(a => a.text()), 'res');
    });
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
      extraHeader={<PageHeader headerStyle={{ height: 90 }} showIcon={'user'} className='container-inner-width' title='开发者手册' />}
    >
      <div className={styles.markdownDocWrapper}>
        <div className='container-inner-width help-docs-wrapper'>
          <div className='help-docs-menus'>
          </div>
          <div className='help-docs-content'>
            <MarkdownDoc mdText={mdText} scrollDomSelecter='.markdown-doc-scroll' />
          </div>
        </div>
      </div>
    </Layout>
  );
};
