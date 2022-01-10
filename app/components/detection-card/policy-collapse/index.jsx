import React, { useState } from 'react';
import { Space, Row, Col, Descriptions } from 'antd';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import isFunction from 'lodash/isFunction';
import Coder from "components/coder";
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import StatusIcon from '../components/status-icon';
import styles from './styles.less';

export default ({ data }) => {

  const isError = data.status === 'violated' || data.status === 'failed';
  const [ collapsed, setCollapsed ] = useState(true);

  const passedList = [
    { label: '严重等级', code: 'severity', format: (text) => POLICIES_SEVERITY_ENUM[text] || text },
    { 
      label: '策略内容', 
      layout: 'vertical',
      code: '', 
      format: (text, record) => (
        <Coder
          style={{ height: 350, border: '1px solid #ebebeb' }}
          selfClassName='form-coder-cotent'
          options={{ mode: 'rego' }}
          value={'rego'}
        />
      )
    }
  ];

  const failedList = [
    { label: '严重等级', code: 'severity', format: (text) => POLICIES_SEVERITY_ENUM[text] || text },
    { label: '资源类型', code: 'resource_type' },
    { label: '文件', code: 'file' },
    { label: '行数', code: 'line' },
    { 
      label: '策略内容', 
      layout: 'vertical',
      code: '', 
      format: (text, record) => (
        <Coder
          style={{ height: 350, border: '1px solid #ebebeb' }}
          selfClassName='form-coder-cotent'
          options={{ mode: 'rego' }}
          value={'rego'}
        />
      )
    },
    { 
      label: '错误资源类型所在的tf代码段', 
      layout: 'vertical',
      code: '', 
      format: (text, record) => (
        <Coder
          style={{ height: 350, border: '1px solid #ebebeb' }}
          selfClassName='form-coder-cotent'
          options={{ mode: 'tf' }}
          value={'tf'}
        />
      )
    }
  ];

  return (
    <div className={styles.collapse}>
      <Row className={styles.collapse_header} justify='space-between' align='middle'>
        <Col className={styles.collapse_header_title}>
          <Space>
            <StatusIcon type={data.status} />
            <span style={{ color: 'rgba(0, 0, 0, 0.86)' }}>{data.policyName}</span>
            {/* <Button>屏蔽此策略</Button> */}
          </Space>
        </Col>
        <Col className={styles.collapse_header_extra}>
          <span className={styles.collapse_header_extra_collapse} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <RightOutlined /> : <DownOutlined />}
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
                  {isFunction(format) ? format(data[code], data) : data[code]}
                </Descriptions.Item>
              </Descriptions>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};