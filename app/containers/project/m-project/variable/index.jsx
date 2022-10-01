import React, { useRef } from 'react';
import { Button, Spin, notification } from 'antd';
import { connect } from "react-redux";
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import VariableForm, { formatVariableRequestParams } from 'components/variable-form';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import varsAPI from 'services/variables';
import varGroupAPI from 'services/var-group';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';
import styles from './styles.less';

const defaultScope = 'project';

const ProjectVariable = ({ match = {}, userInfo }) => {

  const event$ = useEventEmitter();
  const { orgId, projectId } = match.params || {};
  const varRef = useRef();
  const { PROJECT_OPERATOR } = getPermission(userInfo);

  // 变量查询
  const {
    loading: spinning,
    data: vars = [],
    run: getVars
  } = useRequest(
    () => requestWrapper(
      varsAPI.search.bind(null, { orgId, projectId, scope: defaultScope })
    )
  );

  // 更新变量
  const {
    loading: updateLoading,
    run: updateVars
  } = useRequest(
    (params) => requestWrapper(
      varsAPI.update.bind(null, { orgId, projectId, scope: defaultScope, objectId: projectId, ...formatVariableRequestParams(params, defaultScope) }),
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
      varGroupAPI.updateRelationship.bind(null, { orgId, projectId, objectType: defaultScope, objectId: projectId, ...params })
    ),
    {
      manual: true,
      onSuccess: () => {
        event$.emit({ type: 'fetchVarGroupList' });
      }
    }
  );

  const save = async () => {
    try {
      const varData = await varRef.current.validateForm().catch(() => {
        throw {
          message: t('define.form.error'),
          description: t('define.form.error.variable')
        };
      });
      const { varGroupIds, delVarGroupIds, ...params } = varData;
      await updateVars(params);
      await updateVarGroup({ varGroupIds, delVarGroupIds });
      notification.success({ message: t('define.message.opSuccess') });
    } catch (err) {
      notification.error(err);
    }
  };

  return (
    <Layout
      extraHeader={<PageHeader
        title={t('define.variable')}
        breadcrumb={true}
      />}
    >
      <Spin spinning={spinning}>
        <div className={styles.variable}>
          <div className='idcos-card'>
            <VariableForm 
              fetchParams={{ orgId, projectId }} 
              varRef={varRef} 
              defaultScope={defaultScope} 
              defaultData={{ variables: vars }}
              event$={event$}
              readOnly={!PROJECT_OPERATOR}
            />
            {
              PROJECT_OPERATOR ? (
                <div className='btn-wrapper'>
                  <Button type='primary' onClick={save} loading={updateLoading || updateVarGroupLoading}>{t('define.action.save')}</Button>
                </div>
              ) : null
            }
          </div>
        </div>
      </Spin>
    </Layout>
  );
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(ProjectVariable);