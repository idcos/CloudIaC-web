import React, { memo, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import VariableForm from 'components/variable-form';
import envAPI from 'services/env';
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

  return (
    <Spin spinning={loading}>
      <VariableForm 
        fetchParams={{ orgId, projectId, envId }} 
        defaultScope='env'
        defaultData={{ variables }}
        readOnly={true}
      />
    </Spin>
  );
};

export default Eb_WP()(memo(Variable));
