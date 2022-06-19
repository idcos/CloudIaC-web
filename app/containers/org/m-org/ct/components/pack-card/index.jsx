import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.less';
import { Tooltip } from 'antd';
import { TierOfficialIcon, TierVerifiedIcon } from 'components/iconfont';
import { DownloadOutlined } from '@ant-design/icons';
import { getIconUrl } from 'utils/util';
import { t } from 'utils/i18n';

const PackCard = ({ data, toggleVisible }) => {
  const {
    name, 
    namespace, 
    description, 
    categoryNames, 
    logo, 
    id,
    tier, 
    hostname, 
    latestVersion, 
    latestVersionVerified,
    downloadCount,
    repoAddr
  } = data;
  return (
    <div className={styles.pack_card} onClick={() => {
      toggleVisible(id); 
    }}
    >
      <div className={'main'}>
        <img className={'icon'} src={getIconUrl(logo)}/>
        <div className={'content'}>
          <div className={'title idcos-text-ellipsis'}>{name}</div>
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
          <div className={'version'}>
            <span>{latestVersion}</span>
            {!!latestVersionVerified && (
              <img src='/assets/img/yunji_auth.svg' />
            )}
          </div>
        </div>
        <div className={'divider'}></div>
        <div className={'bottom-right'}>
          <DownloadOutlined className={'download-icon'}/> 
          <div>下载 {downloadCount}</div>
        </div>
      </div>
    </div>
  );
};
export default PackCard;
