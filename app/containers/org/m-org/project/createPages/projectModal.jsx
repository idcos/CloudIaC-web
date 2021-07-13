import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, Space, Button, Checkbox, notification } from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { pjtAPI } from 'services/base';
import { PROJECT_ROLE } from 'constants/types';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord, orgId, reload, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ userList, setUserList ] = useState([]);
  const [form] = Form.useForm();

  const onOk = async () => {
    const { params, ...restValues } = await form.validateFields();
    operation({
      action: opt,
      payload: {
        orgId,
        projectId: curRecord.id,
        ...restValues, 
        userAuthorization: params 
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  useEffect(() => {
    if (opt === 'edit') {
      fetchPjtInfo();
    }
    fetchUser();
  }, []);
  const fetchPjtInfo = async() => {
    try {
      const res = await pjtAPI.detailProject({ projectId: curRecord.id, orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };
  const fetchUser = async () => {
    try {
      const res = await pjtAPI.userList({ orgId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setUserList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const paramsFormListChildren = (fields, { add, remove }) => {
    return <>
      {fields.map(({ key, name, fieldKey, ...restField }) => {
        return (
          <Space
            key={key}
            style={{ display: "flex" }}
            align='center'
          >
            <Form.Item
              {...restField}
              name={[ name, "userId" ]}
              fieldKey={[ fieldKey, "userId" ]}
              rules={[{ required: true, message: "请输入" }]}
            >
              <Select 
                style={{ width: 185 }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='请选择'
              >
                {userList.map(it => <Option value={it.id}>{it.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item noStyle={true} shouldUpdate={true}>
              {({ getFieldValue }) => {
                const fieldValue = getFieldValue([ "params", name ]) || {};
                return (
                  <Form.Item
                    {...restField}
                    name={[ name, "role" ]}
                    fieldKey={[ fieldKey, "role" ]}
                    rules={[
                      { required: true, message: "" } // 编辑状态密文可留空
                    ]}
                  >
                    <Select 
                      style={{ width: 185 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placeholder='请选择'
                    >
                      {Object.keys(PROJECT_ROLE).map(it => <Option value={it}>{PROJECT_ROLE[it]}</Option>)}
                    </Select>
                  </Form.Item>
                );
              }}
            </Form.Item>
            <Form.Item>
              <DeleteOutlined onClick={() => remove(name)} />
            </Form.Item>
          </Space>
        );
      })}
      <Form.Item noStyle={true}>
        <Space onClick={() => add()} ><PlusOutlined style={{ color: '#13C2C2' }} /><a>添加授权用户</a></Space>
      </Form.Item>
    </>;
  };

  return <Modal
    title={`${opt == 'add' ? '创建' : '编辑'}项目`}
    visible={visible}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    onOk={onOk}
    width={600}
  >
    <Form
      {...FL}
      form={form}
      initialValues={curRecord}
    >
      <Form.Item
        label='项目名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入项目名称'
          }
        ]}
      >
        <Input style={{ width: 254 }} placeholder='请输入项目名称'/>
      </Form.Item>
      <Form.Item
        label='项目描述'
        name='description'
        rules={[
          {
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea style={{ width: 400 }} placeholder='请输入项目描述'/>
      </Form.Item>
      <Form.Item
        label='授权用户'
      >
        <Form.List name='params'>
          {paramsFormListChildren}
        </Form.List>
      </Form.Item>
    </Form>
  </Modal>;
};
