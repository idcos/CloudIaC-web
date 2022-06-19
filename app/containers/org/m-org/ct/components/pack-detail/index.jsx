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
import styles from './index.less';
import { formatNumber } from 'utils/format';
import { getRegistryIconUrl } from 'utils/util';
import queryString from 'query-string';
import history from 'utils/history';
export default ({
  toggleVisible,
  visible,
  detail,
  orgId
}) => { 
  const {
    categories,
    creatorId,
    description,
    featured,
    featuredImage,
    hostname,
    latestVersion,
    latestVersionGitTag,
    exchangeRepoPath,
    id,
    key,
    logo,
    name,
    namespace,
    repoAddr,
    repoId,
    repoName,
    tier,
    vcsId,
    icon,
    downloadCount
  } = detail;
  return (
    <Modal
      visible={visible}
      width={720}
      title={'Pack详情'}
      centered={true}
      okText={'创建云模板'}
      onCancel={() => {
        toggleVisible();
      }}
      onOk={() => {
        const search = queryString.stringify({ repoFullName: name, repoId: exchangeRepoPath, repoRevision: latestVersionGitTag });
        history.push({
          pathname: `/org/${orgId}/m-org-ct/importCT-exchange/exchange-createCT`,
          search: search
        });
      }}
    >
      <div className={styles.detail}>
        <div className={'content'}>
          <div className='icon-container'>
            <img width={64} height={64}src={getRegistryIconUrl(logo)} />
          </div>
          <div className='main-content'>
            <div className='content-header'>
              <div className='title'>{name}</div>
              <div className='yunji'>
                <TierOfficialIcon width={16} height={16} />
                <div>云霁官方</div>
              </div>
            </div>
            <div className='content-description'>{description || '-'}</div>
            <div className='info-container'>
              <Row>
                <Col span={8}>
                  <div className='info'>
                    <UserOutlined className='label' />
                    <span className='label'>作者</span>
                    <span className='normal'>{namespace}</span>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='info'>
                    <DownloadOutlined className='label' />
                    <span className='label'>下载</span>
                    <span className='normal'>{formatNumber(detail.downloadCount)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <div className='info'>
                    <CodeOutlined className='label' />
                    <span className='label'>应用ID</span>
                    <a href={`https://exchange.cloudiac.org//pack/detail?id=${id}`} target='_blank'>{id}</a>
                  </div>
                </Col>
              </Row>
            </div>
            <div className='tags'>
              { (detail.categories || '').split(',').map(item => <div className='tag'>{item}</div>)}
            </div>
            
          </div>
          <div className='select-container'>
            <Select
              suffixIcon={<CaretDownOutlined color='#57606A' />}
              style={{ width: 209, height: 34 }}
              placeholder={"Examples"}
              dropdownStyle={{ width: 280 }}
              onChange={(exampleId) => {
                console.log(exampleId);
              }}
              // options={exampleList}
            />
          </div>
        </div>
        <div className='markdown'></div>
      </div>
        


    </Modal>
  );
};