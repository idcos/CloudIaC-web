import React, { useRef, useEffect, useState } from 'react';
import { Button, Spin, notification } from 'antd';
import { connect } from "react-redux";

import VariableForm from 'components/variable-form';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import varsAPI from 'services/variables';
import getPermission from "utils/permission";

import styles from './styles.less';

const defaultScope = 'project';

const ProjectVariable = ({ match = {}, userInfo }) => {

  const { orgId, projectId } = match.params || {};
  const varRef = useRef();
  const [ spinning, setSpinning ] = useState(false);
  const [ vars, setVars ] = useState([]);
  const { PROJECT_OPERATOR } = getPermission(userInfo);

  useEffect(() => {
    getVars();
  }, []);

  const getVars = async () => {
    try {
      setSpinning(true);
      const res = await varsAPI.search({ orgId, projectId, scope: defaultScope });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setVars(res.result || []);
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const save = async () => {
    try {
      const varData = await varRef.current.validateForm();
      setSpinning(true);
      const res = await varsAPI.update({ orgId, projectId, ...varData });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
      setSpinning(false);
      getVars();
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
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
            <VariableForm varRef={varRef} defaultScope={defaultScope} defaultData={{ variables: vars }} />
            {
              PROJECT_OPERATOR ? (
                <div className='btn-wrapper'>
                  <Button type='primary' onClick={save}>保存</Button>
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