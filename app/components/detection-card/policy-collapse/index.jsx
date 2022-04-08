import React, { useState } from 'react';
import { Space, Row, Col, Descriptions, Button, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import isFunction from 'lodash/isFunction';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import policiesAPI from 'services/policies';
import Coder from "components/coder";
import { POLICIES_SEVERITY_STATUS_ENUM, TARGET_TYPE_ENUM } from 'constants/types';
import { DropRightIcon, DropDownIcon } from 'components/iconfont';
import StatusIcon from '../components/status-icon';
import styles from './styles.less';

export default ({ data, refresh, targetId, targetType }) => {

  const isError = data.status === 'violated' || data.status === 'failed';
  const [ collapsed, setCollapsed ] = useState(true);

  // 更新策略屏蔽
  const {
    loading: updateSuppressLoading,
    run: updateSuppress
  } = useRequest(
    () => requestWrapper(
      policiesAPI.updateSuppress.bind(null, {
        policyId: data.policyId,
        addTargetIds: [targetId]
      }),
      {
        autoSuccess: true
      }
    ),
    {
      manual: true,
      onSuccess: () => {
        refresh();
      }
    }
  );

  const passedList = [
    { label: '严重等级', code: 'severity', format: (text) => POLICIES_SEVERITY_STATUS_ENUM[(text || '').toLowerCase()] || text },
    { 
      layout: 'vertical',
      code: 'rego', 
      format: (text) => (
        <Coder
          style={{ height: 350 }}
          selfClassName='idcos-common-gray-background-coder'
          options={{ mode: 'rego' }}
          value={text || ''}
        />
      )
    }
  ];

  const failedList = [
    { label: '文件', code: 'file' },
    { label: '行数', code: 'line' },
    { 
      // label: '错误资源类型所在的tf代码段', 
      layout: 'vertical',
      code: 'source', 
      format: (text) => (
        <Coder
          style={{ height: 350 }}
          selfClassName='idcos-common-gray-background-coder'
          options={{ mode: 'text/webassembly' }}
          value={text || ''}
        />
      )
    },
    { label: '严重等级', code: 'severity', format: (text) => POLICIES_SEVERITY_STATUS_ENUM[(text || '').toLowerCase()] || text },
    { label: '错误资源类型', code: 'resource_type' },
    { 
      // label: '策略内容', 
      layout: 'vertical',
      code: 'rego', 
      format: (text) => (
        <Coder
          style={{ height: 350 }}
          selfClassName='idcos-common-gray-background-coder'
          options={{ mode: 'rego' }}
          value={text || ''}
        />
      )
    }
  ];

  const onSuppress = (e) => {
    e.stopPropagation();
    Modal.confirm({
      width: 480,
      title: `屏蔽策略`,
      content: (
        <div style={{ wordBreak: 'break-all' }}>
          <span>该操作将在当前{TARGET_TYPE_ENUM[targetType]}中屏蔽</span>
          “<b>{data.policyName || '-'}</b>” 
          <span>策略，请谨慎操作</span> 
        </div>
      ),
      icon: <InfoCircleFilled />,
      okText: '确认',
      cancelText: '取消',
      cancelButtonProps: {
        className: 'ant-btn-tertiary' 
      },
      onOk: () => updateSuppress()
    });
  };

  return (
    <div className={styles.collapse}>
      <Row 
        className={styles.collapse_header} 
        justify='space-between' 
        align='middle'
        onClick={() => setCollapsed(!collapsed)}
      >
        <Col className={styles.collapse_header_title}>
          <Space>
            <StatusIcon type={data.status} />
            <span style={{ color: 'rgba(0, 0, 0, 0.86)' }}>{data.policyName}</span>
            {data.status === 'violated' && (
              <Button className='ant-btn-tertiary' disabled={data.policySuppress} onClick={onSuppress}>屏蔽此策略</Button>
            )}
          </Space>
        </Col>
        <Col className={styles.collapse_header_extra}>
          <span className={styles.collapse_header_extra_collapse}>
            {collapsed ? <DropRightIcon /> : <DropDownIcon />}
          </span>
        </Col>
      </Row>
      {!collapsed && (
        <div className={styles.collapse_body}>
          <Space size='middle' direction='vertical' style={{ width: '100%' }}>
            {(isError ? failedList : passedList).map(({ label, code, format, layout = 'horizontal' }) => (
              <Descriptions 
                column={1}
                colon={false}
                layout={layout}
                labelStyle={{ color: 'rgba(0, 0, 0, 0.86)' }}
                contentStyle={{ color: 'rgba(0, 0, 0, 0.46)' }}
              >
                <Descriptions.Item 
                  style={{ padding: 0 }} 
                  label={label}
                  labelStyle={{ color: 'rgba(0, 0, 0, 0.86)' }}
                  contentStyle={{ color: 'rgba(0, 0, 0, 0.46)' }}
                >
                  {(isFunction(format) ? format(data[code], data) : data[code]) || '-'}
                </Descriptions.Item>
              </Descriptions>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};