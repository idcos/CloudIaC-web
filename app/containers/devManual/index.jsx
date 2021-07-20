import React, { useEffect, useState } from 'react';

import PageHeaderPlus from 'components/pageHeaderPlus';
import LayoutPlus from 'components/common/layout/plus';
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
    <LayoutPlus
      contentStyle={{ paddingTop: 0 }}
      extraHeader={<PageHeaderPlus className='container-inner-width' title='开发者手册' />}
    >
      <div className={styles.markdownDocWrapper}>
        <div className='markdown-doc-scroll'>
          <div className='container-inner-width'>
            <MarkdownDoc mdText={mdText} scrollDomSelecter='.markdown-doc-scroll' />
          </div>
        </div>
      </div>
    </LayoutPlus>
  );
};
