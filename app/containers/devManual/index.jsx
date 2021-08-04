import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

import { DOCS } from 'constants/types';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';

import MarkdownDoc from './markdown-doc';
import styles from './styles.less';

export default () => {

  const [ mdText, setMDText ] = useState('');
  const [ docKey, setDocKey ] = useState('quickstart');
  const [ isOpen, setIsOpen ] = useState(true);

  useEffect(() => {
    getMDText();
  }, [docKey]);

  const getMDText = async () => {
    try {
      const res = await fetch(`/assets/md/${docKey}.md`);
      const text = await res.text();
      setMDText(typeof text === 'string' ? text : '');
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDoc = ({ key }) => {
    setDocKey(key);
  };

  return (
    <Layout
      style={{ paddingBottom: 0 }}
      contentStyle={{ paddingTop: 0, marginTop: 0 }}
    >
      <div className={styles.markdownDocWrapper}>
        <div className='container-inner-width help-docs-wrapper'>
          <div className={`help-docs-menus ${isOpen ? '' : 'isHide'}`} >
            <div className='title'>帮助文档所有文章</div>
            <Menu
              onClick={onChangeDoc}
              style={{ width: '100%' }}
              selectedKeys={[docKey]}
              mode='inline'
            >
              {Object.keys(DOCS).map(it => <Menu.Item key={it}>{DOCS[it]}</Menu.Item>)}
            </Menu>
            <div className='btn' onClick={() => setIsOpen(!isOpen)}>
              {
                isOpen ? (
                  <DoubleLeftOutlined />
                ) : (
                  <DoubleRightOutlined />
                )
              }
            </div>
          </div>
          <div className='help-docs-content'>
            <MarkdownDoc mdText={mdText} title={DOCS[docKey]} scrollDomSelecter='.markdown-doc-scroll' />
          </div>
        </div>
      </div>
    </Layout>
  );
};
