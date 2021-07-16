import React, { useState, useEffect, memo } from 'react';
import { Card, Tooltip, Select, Form, Input, Button, Checkbox, notification, Row, Col } from "antd";
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { pjtAPI, envAPI } from 'services/base';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
let autoDestroy = [
  { name: '不限', code: 0, time: 0 },
  { name: '12小时', code: '12h', time: moment().add(12, "hours").format("YYYY-MM-DD HH:mm") },
  { name: '一天', code: '1d', time: moment().add(1, "days").format("YYYY-MM-DD HH:mm") },
  { name: '三天', code: '3d', time: moment().add(3, "days").format("YYYY-MM-DD HH:mm") },
  { name: '一周', code: '1w', time: moment().add(1, "weeks").format("YYYY-MM-DD HH:mm") },
  { name: '半个月', code: '15d', time: moment().add(15, "days").format("YYYY-MM-DD HH:mm") },
  { name: '一个月', code: '28/29/30/31', time: moment().add(1, "months").format("YYYY-MM-DD HH:mm") }
];
const { Option } = Select;
    
const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId, projectId, envId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
      total: 0
    }),
    [ info, setInfo ] = useState({});
  const [form] = Form.useForm();

  
  const onFinish = async (taskType) => {
    try {
      const values = await form.validateFields();
      if (values.triggers) {
        values.autoApproval = values.triggers.indexOf('autoApproval') !== -1 ? true : undefined;
        values.triggers = values.triggers.filter(d => d !== 'autoApproval'); 
      }
      const res = await envAPI.envsEdit({ orgId, projectId, ...values, taskType, envId: envId ? envId : undefined });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        description: '保存成功'
      });
    } catch (e) {
      notification.error({
        message: '保存失败',
        description: e.message
      });
    }
  };
  useEffect(() => {
    fetchInfo();
  }, []);
  const archive = async() => {
    try {
      const res = await envAPI.envsArchive({
        orgId, projectId, envId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
    
  };
  const fetchInfo = async () => {
    try {
      const res = await envAPI.envsInfo({
        orgId, projectId, envId
      });
      let data = res.result || {};
      if (data.autoApproval) {
        data.triggers.push('autoApproval');
      }
      if (res.code != 200) {
        throw new Error(res.message);
      }
      form.setFieldsValue(data);
      setInfo(data);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'资源列表'}>
      <Form
        form={form}
        {...FL}
        onFinish={onFinish}
      >
        <Form.Item
          name='triggers'
          {...PL}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8} style={{ paddingLeft: '3%' }}>
                <Checkbox value='commit'>每次推送到该分支时自动重新部署</Checkbox>
              </Col>
              <Col span={8} style={{ paddingLeft: '3%' }}>
                <Checkbox value='prmr'>该分支提交PR/MR时自动执行plan计划</Checkbox>
              </Col>
              <Col span={8} style={{ paddingLeft: '3%' }}>
                <Checkbox value='autoApproval'>自动通过审批</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Row>
          <Col span={8} style={{ marginLeft: '3%' }}>
            <Form.Item
              label='生命周期'
              name='ttl'
            >
              <Select 
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='请选择生命周期'
                style={{ width: '80%' }}
              >
                {autoDestroy.map(it => <Option value={it.code}>{it.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={archive} >归档</Button>
          <Button type='primary' onClick={onFinish} style={{ marginLeft: 20 }} >保存</Button>
        </Row>
      </Form>
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
