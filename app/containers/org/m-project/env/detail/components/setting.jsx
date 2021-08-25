import React, { useState, useEffect, memo, useRef } from 'react';
import { Card, DatePicker, Select, Form, Tooltip, Button, Checkbox, notification, Row, Col } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from "react-redux";

import getPermission from "utils/permission";
import copy from 'utils/copy';
import { Eb_WP } from 'components/error-boundary';
import { AUTO_DESTROY, destoryType } from 'constants/types';
import envAPI from 'services/env';
import tokensAPI from 'services/tokens';

import AdvancedConfig from '../../deploy/advanced-config';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
const { Option } = Select;
    
const Index = (props) => {
  
  const { match, info, reload, userInfo } = props;
  const { params: { orgId, projectId, envId } } = match;
  const { PROJECT_OPERATOR } = getPermission(userInfo);

  const configRef = useRef();

  const [ fileLoading, setFileLoading ] = useState(false);
  const [ submitLoading, setSubmitLoading ] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (info.autoApproval) {
      info.triggers = (info.triggers || []).concat(['autoApproval']);
    }
    if (!!info.autoDestroyAt) {
      info.type = 'time';
      form.setFieldsValue({ destroyAt: moment(info.autoDestroyAt) });
    } else if (info.ttl === '' || info.ttl === null || info.ttl == 0) {
      info.type = 'infinite';
      form.setFieldsValue({ ttl: '0' });
    } else {
      info.type = 'timequantum';
      form.setFieldsValue({ ttl: info.ttl });
    }
    form.setFieldsValue(info);
  }, [info]);

  const onFinish = async (taskType) => {
    try {
      const values = await form.validateFields();
      const configData = await configRef.current.onfinish();
      if (values.triggers) {
        values.autoApproval = values.triggers.indexOf('autoApproval') !== -1 ? true : false;
        values.triggers = values.triggers.filter(d => d !== 'autoApproval'); 
      }
      if (values.type === 'infinite') {
        values.ttl = '0';
      }
      delete values.type;
      setSubmitLoading(true);
      const res = await envAPI.envsEdit({ orgId, projectId, ...values, envId: envId ? envId : undefined });
      setSubmitLoading(false);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      reload();
      notification.success({
        description: '保存成功'
      });
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
  };

  const archive = async() => {
    try {
      setFileLoading(true);
      const res = await envAPI.envsArchive({
        orgId, projectId, envId
      });
      setFileLoading(false);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      reload();
    } catch (e) {
      setFileLoading(false);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const copyToUrl = async(action) => {
    try {
      const res = await tokensAPI.getTriggerUrl({
        orgId, envId, action, projectId
      });
      let data = res.result || {};
      let copyData = `${window.location.origin}/api/v1/trigger/send?token=${data.key}`;
      if (res.code === 200) {
        if (!res.result) {
          const resCreat = await tokensAPI.createToken({
            orgId, envId, action, projectId
          });
          copyData = `${window.location.origin}/api/v1/trigger/send?token=${resCreat.result.key}`;
        }
        copy(copyData);
      }
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'设置'}>
      <AdvancedConfig 
        configRef={configRef}
        isCollapse={false}
      />
      {
        PROJECT_OPERATOR ? (
          <Row style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Button loading={fileLoading} onClick={archive} disabled={info.status !== 'inactive'} >归档</Button>
            <Button loading={submitLoading} type='primary' onClick={() => onFinish()} style={{ marginLeft: 20 }} >保存</Button>
          </Row>
        ) : null
      }
    </Card>
  </div>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(
  Eb_WP()(memo(Index))
);
