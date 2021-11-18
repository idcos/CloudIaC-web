import React, { useRef } from 'react';
import { Button, Spin, notification } from 'antd';
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import VariableForm, { formatVariableRequestParams } from 'components/variable-form';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import varsAPI from 'services/variables';
import varGroupAPI from 'services/var-group';
import styles from './styles.less';

const defaultScope = 'org';

export default ({ match }) => {

  const event$ = useEventEmitter();
  const { orgId } = match.params || {};
  const varRef = useRef();

  // 变量查询
  const {
    loading: spinning,
    data: vars = [],
    run: getVars
  } = useRequest(
    () => requestWrapper(
      varsAPI.search.bind(null, { orgId, scope: defaultScope })
    )
  );

  // 更新变量
  const {
    loading: updateLoading,
    run: updateVars
  } = useRequest(
    (params) => requestWrapper(
      varsAPI.update.bind(null, { orgId, scope: defaultScope, objectId: orgId, ...formatVariableRequestParams(params, defaultScope) }),
    ),
    {
      manual: true,
      onSuccess: () => {
        getVars();
      }
    }
  );

  // 更新变量组
  const {
    loading: updateVarGroupLoading,
    run: updateVarGroup
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.updateRelationship.bind(null, { orgId, objectType: defaultScope, objectId: orgId, ...params })
    ),
    {
      manual: true,
      onSuccess: () => {
        event$.emit({ type: 'fetchVarGroupList' });
      }
    }
  );

  const save = async () => {
    const varData = await varRef.current.validateForm();
    const { varGroupIds, delVarGroupIds, ...params } = varData;
    await updateVars(params);
    await updateVarGroup({ varGroupIds, delVarGroupIds });
    notification.success({ message: '操作成功' });
  };

  return (
    <Layout
      extraHeader={<PageHeader
        title='变量'
        breadcrumb={true}
      />}
    >
      <Spin spinning={spinning}>
        <div className={styles.variable}>
          <div className='idcos-card'>
            <VariableForm 
              fetchParams={{ orgId }} 
              varRef={varRef} 
              defaultScope={defaultScope} 
              defaultData={{ variables: vars }}
              event$={event$}
            />
            <div className='btn-wrapper'>
              <Button type='primary' onClick={save} loading={updateLoading || updateVarGroupLoading}>保存</Button>
            </div>
          </div>
        </div>
      </Spin>
    </Layout>
  );
};
