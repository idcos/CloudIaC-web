import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import isNumber from 'lodash/isNumber';
import { t } from 'utils/i18n';
import styles from './styles.less';

export default ({ resAdded, resChanged, resDestroyed }) => {

  const changeInfo = useMemo(() => {
    let info;
    if (isNumber(resAdded) || isNumber(resChanged) || isNumber(resDestroyed)) {
      info = {
        text: (
          <span className={styles.text}>
            <span className='code-number code-number-add'>+{resAdded || 0}</span>
            <span className='code-number code-number-change'>~{resChanged || 0}</span>
            <span className='code-number code-number-destroy'>
              -{resDestroyed || 0}
            </span>
          </span>
        ),
        toolText: (
          <span>
            <span>{resAdded}&nbsp;{t('define.change.add')} <br/> </span>
            <span>{resChanged}&nbsp;{t('define.change.modify')} <br/> </span>
            <span>{resDestroyed}&nbsp;{t('define.change.delete')} <br/> </span>
          </span>
        )
      };
    }
    return info;
  }, [ resAdded, resChanged, resDestroyed ]);

  return (
    changeInfo ? (
      <Tooltip title={changeInfo.toolText} overlayStyle={{ minWidth: 135 }}>
        {changeInfo.text}
      </Tooltip>
    ) : null
  );
};
