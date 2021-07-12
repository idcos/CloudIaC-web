import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, Space, Button, Checkbox, notification } from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import uuid from 'utils/uuid.js';
import { sysAPI } from 'services/base';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord, curOrg, reload, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [form] = Form.useForm();

  const onOk = async () => {
    const { params, ...restValues } = await form.validateFields();
    const dealParams = (params || []).map((param) => {
      param.id = param.id || uuid();
      return param;
    });
    operation({
      doWhat: opt,
      payload: {
        id: curRecord && curRecord.id,
        ...restValues,
        params: dealParams
      }
    }, (hasError) => {
      setSubmitLoading(false);
      !hasError && toggleVisible();
    });
  };

  useEffect(() => {
    fetchCTRunner();
  }, []);

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({ orgId: 3 });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtRunnerList(res.result || []);
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
        const isSecret = (
          <Form.Item
            {...restField}
            name={[ name, "isSecret" ]}
            fieldKey={[ fieldKey, "isSecret" ]}
            noStyle={true}
            valuePropName='checked'
          >
            <Checkbox >
              密文
            </Checkbox>
          </Form.Item>
        );
        return (
          <Space
            key={key}
            style={{ display: "flex" }}
            align='center'
          >
            <Form.Item
              {...restField}
              name={[ name, "key" ]}
              fieldKey={[ fieldKey, "key" ]}
              rules={[{ required: true, message: "请输入" }]}
            >
              <Select 
                style={{ width: 185 }}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='请选择'
              >
                {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item noStyle={true} shouldUpdate={true}>
              {({ getFieldValue }) => {
                const fieldValue = getFieldValue([ "params", name ]) || {};
                return (
                  <Form.Item
                    {...restField}
                    name={[ name, "value" ]}
                    fieldKey={[ fieldKey, "value" ]}
                    rules={[
                      { required: !(fieldValue.isSecret && fieldValue.id), message: "" } // 编辑状态密文可留空
                    ]}
                  >
                    <Select 
                      style={{ width: 185 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placeholder='请选择'
                    >
                      {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
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
        {/* <Button type='dashed' onClick={() => add({ isSecret: false })} block={true}>
          添加授权用户
        </Button> */}
        <Space onClick={() => add({ isSecret: false })} ><PlusOutlined style={{ color: '#13C2C2' }} /><a>添加授权用户</a></Space>
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
