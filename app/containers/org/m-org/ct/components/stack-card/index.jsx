import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.less';
import { Tooltip } from 'antd';
import { TierOfficialIcon, TierVerifiedIcon } from 'components/iconfont';
import { DownloadOutlined } from '@ant-design/icons';
import { formatNumber } from 'utils/format';
import { getStackIconUrl } from 'utils/util';
import { t } from 'utils/i18n';

const StackCard = ({ data, toggleVisible }) => {
  const {
    name, 
    namespace, 
    description, 
    categoryNames, 
    logo, 
    id,
    tier, 
    title,
    latestVersion, 
    latestVersionVerified,
    downloadCount,
    repoAddr
  } = data;
  return (
    <div className={styles.stack_card} onClick={() => {
      toggleVisible(id); 
    }}
    >
      <div className={'main'}>
        <img className={'icon'} src={getStackIconUrl(logo)}/>
        <div className={'content'}>
          <div className={'title idcos-text-ellipsis'}>{title}</div>
          <div className={'comment'}>{description}</div>
          <div className={'tags'}>
            { (categoryNames ? categoryNames.split(',') : []).map(item => <div className='tag'>{item}</div>)}
          </div>
        </div>
      </div>
      <div className={'bottom'}>
        <div className={'bottom-left'}>
          <div className={'from'}>
            { tier === 'official' && <TierOfficialIcon className={'tier-icon'} />}
            { tier === 'verified' && <TierVerifiedIcon className={'tier-icon'} />}  
            <div>{namespace}</div>
          </div>
        </div>
        <div className={'bottom-right'}>
          <div className={'version'}>
            <span>{latestVersion}</span>
            {!!latestVersionVerified && (
              <img src='/assets/img/yunji_auth.svg' />
            )}
          </div>
          <div className={'divider'}></div>
          <div className={'download'}>
            <DownloadOutlined className={'download-icon'}/> 
            <div>{t('define.download')}</div>
            <div>{formatNumber(downloadCount)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StackCard;
