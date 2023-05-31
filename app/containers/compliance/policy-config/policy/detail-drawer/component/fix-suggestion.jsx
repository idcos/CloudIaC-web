import React from 'react';
import { Card } from 'antd';
import { t } from 'utils/i18n';

const FixSuggestion = ({ content }) => {
  return (
    <Card
      title={t('define.suggestion.content')}
      type='inner'
      bodyStyle={{ minHeight: 300 }}
    >
      <div
        className='idcos-format-html'
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </Card>
  );
};

export default FixSuggestion;
