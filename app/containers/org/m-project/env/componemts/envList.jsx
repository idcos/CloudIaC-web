import React, { useState, useEffect, memo } from 'react';
import { Card, Descriptions, Tag, Space, Empty, Spin } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import { ENV_STATUS, AUTO_DESTROY, ENV_STATUS_COLOR } from 'constants/types';
import { timeUtils } from "utils/time";
import { Eb_WP } from 'components/error-boundary';
import envAPI from 'services/env';
import styles from '../styles.less';

const EnvList = (props) => {

  const { match, panel } = props;
  const { params: { orgId, projectId } } = match;
 

  const { 
    data: resultMap = {
      list: [],
      total: 0
    },
    loading
  } = useRequest(
    () => requestWrapper(
      envAPI.envsList.bind(null, {
        status: panel,
        orgId,
        projectId
      })
    )
  );

  

  const EnvCard = ({ data = {} }) => {

    const [ open, setOpen ] = useState(false);
    const [ now, setNow ] = useState(moment());
  
    useEffect(() => {
      const t = setInterval(() => {
        setNow(moment());
      }, 1000);
      return () => {
        clearInterval(t);
      };
    }, []);

    const formatTTL = ({ autoDestroyAt, ttl }) => {
      if (autoDestroyAt) {
        return timeUtils.diff(autoDestroyAt, now, '-');
      }
      switch (ttl) {
      case '':
      case null:
      case undefined:
        return '-';
      case 0:
      case '0':
        return '不限制';
      default:
        const it = AUTO_DESTROY.find(d => d.code === ttl) || {};
        return it.name;
      }
    };
    
    return (
      <Card 
        style={{ marginTop: 20 }} 
        type='inner' 
        title={(
          <Space>
            <a onClick={() => {
              history.push(`/org/${orgId}/project/${projectId}/m-project-env/detail/${data.id}/resource`); 
            }}
            >{data.name || '-'}</a>
            <span style={{ color: 'rgba(0, 0, 0, 0.26)', fontSize: 12 }}>ID：{data.id}</span>
            <span>{ENV_STATUS[data.status] && <Tag color={ENV_STATUS_COLOR[data.status] || 'default'}>{ENV_STATUS[data.status]}</Tag>}</span>
          </Space>
        )}
        extra={(
          <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', fontSize: 12 }}>
            {open ? <DownOutlined /> : <RightOutlined />}
          </div>
        )}
      >
        <Descriptions 
          column={4} 
          style={{ marginBottom: -16 }}
          labelStyle={{ color: 'rgba(0, 0, 0, 0.46)' }}
          contentStyle={{ color: 'rgba(0, 0, 0, 0.86)' }}
        >
          <Descriptions.Item label='存活时间'>{formatTTL(data)}</Descriptions.Item>
          <Descriptions.Item label='云模板'>{data.templateName || '-'}</Descriptions.Item>
          <Descriptions.Item label='资源数'>{data.resourceCount || '-'}</Descriptions.Item>
          <Descriptions.Item label='更新时间'>{timeUtils.format(data.updatedAt) || '-'}</Descriptions.Item>
          {
            open && (
              <>
                <Descriptions.Item label='Commit_ID'>{(data.commitId || '').substring(0, 12) || '-'}</Descriptions.Item>
                <Descriptions.Item label='分支/标签'>{data.revision || '-'}</Descriptions.Item>
                <Descriptions.Item label='密钥'>{data.keyName || '-'}</Descriptions.Item>
                <Descriptions.Item label='tfvars文件'>{data.tfVarsFile || '-'}</Descriptions.Item>
                <Descriptions.Item label='playbook文件'>{data.playbook || '-'}</Descriptions.Item>
                <Descriptions.Item label='部署通道'>{data.runnerId || '-'}</Descriptions.Item>
                <Descriptions.Item label='target'>{data.target || '-'}</Descriptions.Item>
                <Descriptions.Item label='推送到分支时重新部署'>{(data.triggers || []).includes('commit') ? '是' : '否' }</Descriptions.Item>
                <Descriptions.Item label='PR/MR时执行PLAN'>{(data.triggers || []).includes('prmr') ? '是' : '否' }</Descriptions.Item>
                <Descriptions.Item label='创建人'>{data.creator || '-'}</Descriptions.Item>
                <Descriptions.Item label='创建时间'>{timeUtils.format(data.createdAt) || '-'}</Descriptions.Item>
              </>
            )
          }
        </Descriptions>
      </Card>
    );
  };

  return (
    <Spin spinning={loading}>
      {
        resultMap.list.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        ) : (
          resultMap.list.map(data => <EnvCard data={data}/>)
        )
      }
    </Spin>
  );
};

export default Eb_WP()(memo(EnvList));
