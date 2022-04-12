import React, { useMemo } from 'react';
import { LoadingIcon } from 'components/lottie-icon';
import { CustomTag } from 'components/custom';
import { SCAN_DETAIL_DISABLE_STATUS } from 'constants/types';
import { t } from 'utils/i18n';

export default ({ policyStatus, onlyShowResultStatus = false, clickProps, style, empty, ...restProps }) => {

  const { style: clickPropsStyle, ...restClickProps } = SCAN_DETAIL_DISABLE_STATUS.includes(policyStatus) ? {} : (clickProps || {});
  const props = {
    style: { 
      ...clickPropsStyle,
      ...style
    },
    ...restClickProps,
    ...restProps
  };

  const Status = useMemo(() => {
    const resultStatus = [ 'passed', 'failed', 'violated' ];
    // 仅展示结果状态时 非合规检测结果状态不返回
    if (onlyShowResultStatus && !resultStatus.includes(policyStatus)) {
      return;
    }
    const map = {
      disable: (props) => <CustomTag type='default' text={t('define.policyStatus.disable')} {...props}/>,
      pending: (props) => <LoadingIcon size={22} {...props}/>,
      passed: (props) => <CustomTag type='success' text={t('define.policyStatus.passed')} {...props} />,
      failed: (props) => <CustomTag type='error' text={t('define.policyStatus.failed')} {...props} />,
      violated: (props) => <CustomTag type='error' text={t('define.policyStatus.violated')} {...props} />
    };
    return map[policyStatus];
  });

  return (
    <>
      {Status ? <Status {...props} /> : empty}
    </>
  );
};