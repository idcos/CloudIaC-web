import React from 'react';
import { Popover } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { t } from 'utils/i18n';

const Index = ({
  formContent,
  title = t('define.token.action.add'),
  close,
  children,
  style = { width: 500 },
  ...restProps
}) => {
  let content = () => {
    return (
      <div style={style} className={'popoverform-box'}>
        <div className={'popoverform-header'}>
          <div className={'popoverform-header-title'}>
            {title}
            <CloseOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => close()}
            />
          </div>
        </div>
        <div className={'popoverform-body'}>{formContent}</div>
        <div className={'popoverform-footer'}></div>
      </div>
    );
  };
  return (
    <div id={'popoverform'} className={'popoverform'}>
      <Popover
        {...restProps}
        getPopupContainer={() => document.getElementById('app')}
        content={content}
      >
        {children}
      </Popover>
    </div>
  );
};

export default Index;
