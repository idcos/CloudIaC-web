import React, { useState, useEffect, useMemo } from 'react';
import { 
  Modal,
  Row, Col,
  Select
} from 'antd';
import { 
  SearchOutlined,
  FileUnknownOutlined,
  LeftOutlined,
  UserOutlined,
  CodeOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { TierOfficialIcon, TierVerifiedIcon } from 'components/iconfont';
import MarkdownDoc from "components/markdown-doc";
import styles from './index.less';
import { formatNumber } from 'utils/format';
import { getStackIconUrl } from 'utils/util';
import queryString from 'query-string';
import history from 'utils/history';
import { t } from 'utils/i18n';
import { TIER_ENUM, TIER_ICON_ENUM } from 'constants/types';
export default ({
  exchangeUrl,
  toggleVisible,
  visible,
  detail,
  orgId,
  versionList,
  readme,
  currentVersion,
  setCurrentVersion
}) => { 
  const {
    categoryNames,
    description,
    exchangeRepoPath,
    id,
    stackKey,
    logo,
    name,
    title,
    namespace
  } = detail;
  const genLabel = (item) => {
    if (item.verified === true) {
      return <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>{item.version}</div>
        <img src='/assets/img/yunji_auth.svg' style={{ marginLeft: 4 }} />
      </div>;
    }
    return <span>{item.version}</span>;
  };
  return (
    <Modal
      visible={visible}
      width={720}
      title={t('define.exchange.stackDetail')}
      centered={true}
      okText={t('define.createCT')}
      okButtonProps={{
        disabled: !currentVersion
      }}
      onCancel={() => {
        toggleVisible();
      }}
      onOk={() => {
        const search = queryString.stringify({ repoFullName: exchangeRepoPath, repoId: exchangeRepoPath, repoRevision: currentVersion });
        history.push({
          pathname: `/org/${orgId}/m-org-ct/importCT-exchange/exchange-createCT`,
          search: search
        });
      }}
    >
      <div className={styles.detail}>
        <div className={'content'}>
          <div className='icon-container'>
            <img width={64} height={64}src={getStackIconUrl(exchangeUrl, logo)} />
          </div>
          <div className='main-content'>
            <div className='content-header'>
              <div className='title'>{title}</div>
              {TIER_ICON_ENUM[detail.tier] && <div className='yunji'>
                {TIER_ICON_ENUM[detail.tier] ? TIER_ICON_ENUM[detail.tier] : null}
                {TIER_ICON_ENUM[detail.tier] ? <div>{TIER_ENUM[detail.tier]}</div> : null}
              </div>}
            </div>
            <div className='content-description'>{description || '-'}</div>
            <div className='info-container'>
              <Row>
                <Col span={8}>
                  <div className='info'>
                    <UserOutlined className='label' />
                    <span className='label'>{t('define.author')}</span>
                    <span className='normal'>{namespace}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='info'>
                    <DownloadOutlined className='label' />
                    <span className='label'>{t('define.download')}</span>
                    <span className='normal'>{formatNumber(detail.downloadCount)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className='info'>
                    <CodeOutlined className='label' />
                    <span className='label'>{t('define.stack.id')}</span>
                    <a href={`https://exchange.cloudiac.org/stack/detail?id=${id}`} target='_blank'>{stackKey}</a>
                  </div>
                </Col>
              </Row>
            </div>
            {categoryNames && <div className='tags'>
              { (categoryNames ? categoryNames.split(',') : []).map(item => <div className='tag'>{item}</div>)}
            </div>}
            
          </div>
          <div className='select-container'>
            <Select
              suffixIcon={<CaretDownOutlined color='#57606A' />}
              style={{ width: 209, height: 34 }}
              placeholder={t('define.exchange.select.placeholder')}
              dropdownStyle={{ width: 280 }}
              onChange={(version) => {
                setCurrentVersion(version);
              }}
              options={versionList.map(item => ({ label: genLabel(item), value: item.version }))}
              value={currentVersion}
            />
          </div>
        </div>
        <div className='markdown'>
          <MarkdownDoc mdText={readme} />
        </div>
      </div>
        


    </Modal>
  );
};