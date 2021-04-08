import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Select, Space, Button, Checkbox, notification } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

import { sysAPI } from 'services/base';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const { Option } = Select;

export default ({ visible, opt, toggleVisible, curRecord, curOrg, reload, operation }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false),
    [ ctRunnerList, setCtRunnerList ] = useState([]);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    operation({
      doWhat: opt,
      payload: {
        id: curRecord && curRecord.id,
        ...values
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
      const res = await sysAPI.listCTRunner();
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

  return <Modal
    title={`${opt == 'add' ? '添加' : '编辑'}成员`}
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
        label='资源名称'
        name='name'
        rules={[
          {
            required: true,
            message: '请输入'
          }
        ]}
      >
        <Input placeholder='请输入资源名称'/>
      </Form.Item>
      <Form.Item
        label='CT Runner'
        name='ctServiceIds'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select placeholder='请选择' mode='multiple'>
          {ctRunnerList.map(it => <Option value={it.ID}>{it.Service}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='描述'
        name='description'
        rules={[
          {
            message: '请输入'
          }
        ]}
      >
        <Input.TextArea placeholder='请输入描述'/>
      </Form.Item>
      <Form.Item
        label='资源账号'
      >
        <Form.List name='params'>
          {(fields, { add, remove }) => <>
            {
              fields.map(({ key, name, fieldKey, ...restField }) => {
                const isSecret = <Form.Item
                  {...restField}
                  name={[ name, 'isSecret' ]}
                  fieldKey={[ fieldKey, 'isSecret' ]}
                  noStyle={true}
                  valuePropName='checked'
                  initialValue={false}
                >
                  <Checkbox disabled={form.getFieldValue([ 'params', name, 'isSecret' ])}>密文</Checkbox>
                </Form.Item>;
                return <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='center'>
                  <Form.Item
                    {...restField}
                    name={[ name, 'key' ]}
                    fieldKey={[ fieldKey, 'key' ]}
                    rules={[{ required: true, message: '请输入' }]}
                    noStyle={true}
                  >
                    <Input placeholder='ACCESS_KEY_ID' />
                  </Form.Item>
                  <Form.Item
                    noStyle={true}
                    shouldUpdate={true}
                  >
                    {({ getFieldValue }) => {
                      return <Form.Item
                        {...restField}
                        name={[ name, 'value' ]}
                        fieldKey={[ fieldKey, 'value' ]}
                        rules={[{ required: true, message: '' }]}
                        noStyle={true}
                      >
                        {
                          getFieldValue([ 'params', name, 'isSecret' ]) ? <Input.Password
                            visibilityToggle={false}
                            addonAfter={isSecret}
                          /> : <Input
                            placeholder='ACCESS_KEY'
                            addonAfter={isSecret}
                          />
                        }
                      </Form.Item>;
                    }}
                  </Form.Item>
                  <DeleteOutlined onClick={() => remove(name)} />
                </Space>;
              })
            }
            <Form.Item
              noStyle={true}
            >
              <Button type='dashed' onClick={() => add()} block={true}>
                添加资源账号
              </Button>
            </Form.Item>
          </>}
        </Form.List>
      </Form.Item>
    </Form>
  </Modal>;
};
