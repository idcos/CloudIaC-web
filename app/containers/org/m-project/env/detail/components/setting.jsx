import React, { useState, useEffect, memo } from 'react';
import { Card, Tooltip, Select, Form, Input, Button, Checkbox, notification, Row, Col } from "antd";
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';

import { pjtAPI, orgsAPI } from 'services/base';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const PL = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
let autoDestroy = [
  { name: '不限', code: '0' },
  { name: '12小时', code: '12h' },
  { name: '一天', code: '1d' },
  { name: '三天', code: '3d' },
  { name: '一周', code: '1w' },
  { name: '半个月', code: '15d' },
  { name: '一个月', code: '28/29/30/31' }
];
const { Option } = Select;
    
const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: panel
    });
  const [form] = Form.useForm();

  const onFinish = async(values) => {
    console.log(values);
  };
  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus } = query;
      const res = await pjtAPI.projectList({
        statu: panel,
        orgId: orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  return <div>
    <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'资源列表'}>
      <Form
        colon={true}
        form={form}
        {...FL}
        onFinish={onFinish}
      >
        <Form.Item
          name='vcs'
          rules={[
            {
              required: true,
              message: '请选择'
            }
          ]}
          {...PL}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8} style={{ paddingLeft: 45 }}>
                <Checkbox value='A'>每次推送到该分支时自动重新部署</Checkbox>
              </Col>
              <Col span={8} style={{ paddingLeft: 45 }}>
                <Checkbox value='B'>该分支提交PR/MR时自动执行plan计划</Checkbox>
              </Col>
              <Col span={8} style={{ paddingLeft: 45 }}>
                <Checkbox value='C'>自动通过审批</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Row>
          <Col span={8}>
            <Form.Item
              label='生命周期：'
              name='autoDestroyAt'
              rules={[
                {
                  required: true,
                  message: '请选择'
                }
              ]}
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
        <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
          <Button >归档</Button>
          <Button type='primary' >保存</Button>
        </Form.Item>
      </Form>
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));
