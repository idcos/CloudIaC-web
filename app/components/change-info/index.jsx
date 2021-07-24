import React, { useMemo } from 'react';
import { Tooltip } from 'antd';

import styles from './styles.less';

export default ({ resAdded, resChanged, resDestroyed }) => {

  const changeInfo = useMemo(() => {
    let info;
    if (!isNaN(resAdded) || !isNaN(resChanged) || !isNaN(resDestroyed)) {
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
            <span>{resAdded}添加 <br/> </span>
            <span>{resChanged}更新 <br/> </span>
            <span>{resDestroyed}删除 <br/> </span>
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
