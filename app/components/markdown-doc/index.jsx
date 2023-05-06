import React, { useState, useEffect, useRef } from 'react';
import { Remarkable } from 'remarkable';
import styles from './styles.less';

const MarkdownDoc = ({ mdText }) => {
  const [innerHTML, setInnerHTML] = useState();

  const ref = useRef(
    new Remarkable({
      html: true,
    }),
  );

  useEffect(() => {
    if (!mdText) {
      return;
    }
    let html = ref.current.render(mdText);
    setInnerHTML(html);
  }, [mdText]);

  return (
    <div className={styles.markdownDoc}>
      <div className='md-content idcos-no-scrollbar'>
        <div dangerouslySetInnerHTML={{ __html: innerHTML }}></div>
      </div>
    </div>
  );
};
export default MarkdownDoc;
