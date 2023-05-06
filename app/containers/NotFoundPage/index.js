/**
 * NotFoundPage
 */
import React from 'react';
import { Result, Button } from 'antd';
import { t } from 'utils/i18n';

export default function NotFound() {
  return (
    <Result
      status='404'
      title='404'
      subTitle={t('define.page.NotFound.subTitle')}
      extra={
        <Button
          onClick={() => {
            window.location.href = '/';
          }}
          type='primary'
        >
          {t('define.action.backHome')}
        </Button>
      }
    />
  );
}
