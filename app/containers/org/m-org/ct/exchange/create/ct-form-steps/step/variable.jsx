import React, { useRef, useMemo, useImperativeHandle } from 'react';
import { Button, Space } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { t } from 'utils/i18n';
import VariableForm from 'components/variable-form';

const Variable = ({
  repoInfo,
  tplId,
  goCTlist,
  childRef,
  stepHelper,
  type,
  opType,
  ctData,
  orgId,
  saveLoading,
}) => {
  const varRef = useRef();

  useImperativeHandle(childRef, () => ({
    onFinish: async index => {
      const varData = await varRef.current.validateForm();
      stepHelper.updateData({
        type,
        data: varData,
      });
      stepHelper.go(index);
    },
  }));

  const onFinish = async () => {
    const varData = await varRef.current.validateForm();
    stepHelper.updateData({
      type,
      data: varData,
      isSubmit: opType === 'edit',
    });
    opType === 'add' && stepHelper.next();
  };

  const fetchParams = useMemo(() => {
    if (isEmpty(repoInfo)) {
      return null;
    }
    return {
      ...repoInfo,
      orgId,
      tplId,
      objectType: opType === 'add' ? 'org' : 'template',
    };
  }, [repoInfo, orgId]);

  return (
    <div className='form-wrapper'>
      <VariableForm
        varRef={varRef}
        showOtherVars={true}
        canImportTerraformVar={true}
        defaultScope='template'
        defaultData={ctData[type]}
        fetchParams={fetchParams}
      />
      <div className='btn-wrapper'>
        <Space size={24}>
          {opType === 'add' ? (
            <>
              <Button type='primary' onClick={onFinish}>
                {t('define.action.next')}
              </Button>
            </>
          ) : (
            <>
              <Button className='ant-btn-tertiary' onClick={goCTlist}>
                {t('define.action.cancel')}
              </Button>
              <Button type='primary' onClick={onFinish} loading={saveLoading}>
                {t('define.action.submit')}
              </Button>
            </>
          )}
        </Space>
      </div>
    </div>
  );
};

export default Variable;
