import React, { memo, useState, useEffect } from 'react';
import { Card, Table, Tooltip, Collapse } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';

import { requestWrapper } from 'utils/request';
import envAPI from 'services/env';
import { SCOPE_ENUM } from 'constants/types';
import { Eb_WP } from 'components/error-boundary';

const { Panel } = Collapse;

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
      }
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
  return <div className={'collapseInTable'}>
    <Collapse expandIconPosition={'right'} style={{ padding: 0 }} defaultActiveKey={['1']} forceRender={true}>
      <Panel header='Terraform变量' key='1'><Table
        loading={loading}
        columns={columns}
        dataSource={defaultTerraformVars}
        pagination={false}
      />

      </Panel>
    </Collapse>
    <Collapse expandIconPosition={'right'} style={{ marginTop: 24 }} defaultActiveKey={['1']} forceRender={true}>
      <Panel header='环境变量' key='1'>
        <Table
          loading={loading}
          columns={columns}
          dataSource={defaultEnvVars}
          pagination={false}
        />

      </Panel>
    </Collapse>
  </div>;
};

export default Eb_WP()(memo(Variable));
