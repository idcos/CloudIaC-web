import React, { useState, useEffect, memo } from 'react';
import { Card, Table, Tooltip, Input, notification, Descriptions, Menu } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { SCOPE_ENUM } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';

import varsAPI from 'services/variables';
import { pjtAPI } from 'services/base';

const Index = (props) => {
  const { match, info } = props,
    { params: { orgId, projectId, tplId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ vars, setVars ] = useState([]);
    
  // useEffect(() => {
  //   getVars();
  // }, []);

  // const getVars = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await varsAPI.search({ orgId, projectId, tplId, scope: 'env' });
  //     if (res.code !== 200) {
  //       throw new Error(res.message);
  //     }
  //     setLoading(false);
  //     setVars(res.result || []);
  //   } catch (e) {
  //     setLoading(false);
  //     notification.error({
  //       message: '获取失败',
  //       description: e.message
  //     });
  //   }
  // };
  const columns = [
    {
      dataIndex: 'scope',
      title: '定义于',
      render: (t, r) => (<span>{SCOPE_ENUM[t]}</span>)
    },
    {
      dataIndex: 'name',
      title: 'key'
    },
    {
      dataIndex: 'value',
      title: 'value'
    },
    {
      dataIndex: 'description',
      title: '描述信息'
    },
    {
      dataIndex: 'sensitive',
      title: <span>是否敏感: <Tooltip title='敏感是隐藏的，并且会被加密以采取安全措施。'><InfoCircleOutlined /></Tooltip></span>,
      editable: true,
      render: (t, r) => {
        return (<div>{t ? '是' : '否'}</div>); 
      }
    }
  ];
  const defaultTerraformVars = (info.variables || []).filter(it => it.type === 'terraform');
  const defaultEnvVars = (info.variables || []).filter(it => it.type === 'environment');
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'Terraform变量'}>
      <Table
        columns={columns}
        dataSource={defaultTerraformVars}
        loading={loading}
        pagination={false}
      />
    </Card>
    <Card 
      style={{ marginTop: 24 }}
      headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} 
      type={'inner'} 
      title={'环境变量'}
    >
      <Table
        columns={columns}
        dataSource={defaultEnvVars}
        loading={loading}
        pagination={false}
      />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
