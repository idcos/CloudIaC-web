import React, { useState, useEffect, memo } from 'react';
import { Card, DatePicker, Select, Form, Input, Button, Checkbox, notification, Row, Col } from "antd";
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
let awd = [{
  name: '无限', value: 'infinite'
}, {
  name: '时间段', value: 'timequantum'
}, {
  name: '时间', value: 'time'
}];
let autoDestroy = [
  { name: '12小时', code: '12h' },
  { name: '一天', code: '1d' },
  { name: '三天', code: '3d' },
  { name: '一周', code: '1w' },
  { name: '半个月', code: '15d' },
  { name: '一个月', code: '28/29/30/31' }];
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
      if (!!values.destroyAt) {
        values.destroyAt = moment(values.destroyAt).format('YYYY-MM-DD HH:mm');
      }
      if (values.type === 'infinite') {
        values.ttl = '';
      }
      delete values.type;
      delete values.xxx;
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
        data.triggers = (data.triggers || []).concat(['autoApproval']);
      }
      if (!!data.destroyAt) {
        data.type = 'time';
        form.setFieldsValue({ destroyAt: moment(data.destroyAt) });
      } else if (data.ttl === '' || data.ttl === null || data.ttl == 0) {
        data.type = 'infinite';
      } else {
        data.type = 'timequantum';
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
            {/* <Form.Item
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
            </Form.Item> */}
            <Form.Item 
              name='xxx'
              label='生命周期'
            >
              <Row>
                <Col span={8}>
                  <Form.Item 
                    name='type'
                    initialValue={'infinite'}
                  >
                    <Select style={{ width: '90%' }}>
                      {awd.map(d => <Option value={d.value}>{d.name}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    noStyle={true}
                    shouldUpdate={true}
                  >
                    {({ getFieldValue }) => {
                      let type = getFieldValue('type'); 
                      if (type === 'infinite') {
                        return <></>;
                      }
                      if (type === 'timequantum') {
                        return <Form.Item 
                          name='ttl'
                          noStyle={true}
                          shouldUpdate={true}
                        >
                          <Select style={{ width: '100%' }}>
                            {autoDestroy.map(it => <Option value={it.code}>{it.name}</Option>)}
                          </Select>
                        </Form.Item>;
                      }
                      if (type === 'time') {
                        return <Form.Item 
                          name='destroyAt'
                          noStyle={true}
                          shouldUpdate={true}
                        >
                          <DatePicker showTime={true}/>
                        </Form.Item>;
                      }
                    }}
                  </Form.Item>
                </Col>
              </Row>
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
