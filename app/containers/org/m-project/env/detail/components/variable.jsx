import React, { memo, useState, useEffect } from 'react';
import { Card, Table, Tooltip, notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import { SCOPE_ENUM } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';

const Variable = (props) => {

  const { type, match, taskInfo = {} } = props;
  const { params: { orgId, projectId, envId } } = match;

  const [ variables, setVariables ] = useState([]);

  const { loading, run: fetchVariables } = useRequest(
    () => requestWrapper(
      envAPI.getVariables.bind(null, {
        orgId, projectId, envId
      })
    ), {
      manual: true,
      onSuccess: (data) => {
        setVariables(data || []);
      },
    }
  );

  useEffect(() => {
    if (type === 'env') {
      fetchVariables();
    } else {
      setVariables(taskInfo.variables);
    }
  }, []);

    
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
  const defaultTerraformVars = (variables || []).filter(it => it.type === 'terraform');
  const defaultEnvVars = (variables || []).filter(it => it.type === 'environment');
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'Terraform变量'}>
      <Table
        loading={loading}
        columns={columns}
        dataSource={defaultTerraformVars}
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
        loading={loading}
        columns={columns}
        dataSource={defaultEnvVars}
        pagination={false}
      />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Variable));
