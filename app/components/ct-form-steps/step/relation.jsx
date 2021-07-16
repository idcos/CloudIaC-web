import React, { useState, useEffect } from 'react';
import { Space, Checkbox, Form, Button, Row, Divider, notification } from "antd";

import { pjtAPI } from 'services/base';
import history from 'utils/history';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};

export default ({ stepHelper, orgId, type }) => {

  const [form] = Form.useForm();

  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ projectList, setProjectList ] = useState([]);
  const [ indeterminate, setIndeterminate ] = useState(true);
  const [ checkAll, setCheckAll ] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async() => {
    let res = await pjtAPI.projectList({ orgId, pageSize: 99999, pageNo: 1 });
    if (res.code === 200) {
      setProjectList(res.result.list || []);
    }
  };

  const onFinish = (values) => {
    stepHelper.updateData({
      type, 
      data: values,
      isSubmit: true
    });
  };

  const onChange = (list) => {
    setIndeterminate(!!list.length && list.length < projectList.length);
    setCheckAll(list.length === projectList.length);
  };

  const onCheckAllChange = (e) => {
    form.setFieldsValue({
      projectId: e.target.checked ? projectList.map(it => it.id) : []
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return <div className='form-wrapper' style={{ width: 720 }}>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Row>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          选择全部项目
        </Checkbox>
      </Row>
      <Divider style={{ margin: '8px 0' }} />
      <Form.Item 
        name='projectId'
        rules={
          [
            { required: true, message: '请选择项目' }
          ]
        }
      >
        <Checkbox.Group onChange={onChange}>
          <Space direction='vertical' size={6}>
            {projectList.map(it => <Checkbox value={it.id}>{it.name}</Checkbox>)}
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <div className='btn-wrapper'>
        <Space size={24}>
          <Button onClick={() => stepHelper.prev()} disabled={submitLoading}>上一步</Button>
          <Button type='primary' htmlType={'submit'} loading={submitLoading}>完成</Button>
        </Space>
      </div>
    </Form>
  </div>;
};
