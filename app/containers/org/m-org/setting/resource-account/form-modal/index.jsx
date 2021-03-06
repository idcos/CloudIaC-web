
import { useState } from 'react';
import { Modal, Form, Input, Button, Space, Checkbox, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default ({ orgId, event$ }) => {

  const [form] = Form.useForm();
  const [ visible, setVisible ] = useState(false);
  const [ id, setId ] = useState();

  // 查询详情
  const {
    loading: detailLoading,
    run: fetchFormDetail
  } = useRequest(
    (id) => requestWrapper(
      varGroupAPI.detail.bind(null, { orgId, id })
    ), {
      onSuccess: (detail) => {
        form.setFieldsValue(detail || {});
      },
      manual: true
    }
  );

  // 创建
  const {
    loading: createLoading,
    run: createResourceAccount
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.create.bind(null, { orgId, type: 'environment', ...params }),
      { 
        autoSuccess: true 
      }
    ), {
      manual: true,
      onSuccess: () => {
        onClose();
        event$.emit({ type: 'refresh' });
      }
    }
  );

  // 更新
  const {
    loading: updateLoading,
    run: updateResourceAccount
  } = useRequest(
    (params) => requestWrapper(
      varGroupAPI.update.bind(null, { orgId, type: 'environment', id, ...params }),
      { 
        autoSuccess: true 
      }
    ), {
      manual: true,
      onSuccess: () => {
        onClose();
        event$.emit({ type: 'refresh' });
      }
    }
  );

  const onOpen = (id) => {
    setVisible(true);
    if (id) {
      setId(id);
      fetchFormDetail(id);
    }
  };

  const onClose = () => {
    setVisible(false);
    setId();
    form.resetFields();
  };

  const onOk = async () => {
    const { name, variables } = await form.validateFields();
    const params = {
      name,
      variables: variables.filter((it) => !!it).map(({ id, ...variable }) => ({ ...variable, id: id || uuidv4(), description: name }))
    };
    id ? updateResourceAccount(params) : createResourceAccount(params);
  };

  event$.useSubscription(({ type, data = {} }) => {
    switch (type) {
      case 'open-resource-account-form-modal':
        onOpen(data.id);
        break;
      default:
        break;
    }
  });

  return (
    <Modal 
      visible={visible} 
      title={id ? '编辑资源账号' : '添加资源账号'}
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={id ? updateLoading : createLoading}
      width={683}
    >
      <Spin spinning={detailLoading}>
        <Form form={form} {...FL}>
          <Form.Item 
            name='name'
            label='账号描述'
            rules={[
              {
                required: true,
                message: '请输入账号描述'
              }
            ]}
          >
            <Input style={{ width: 254 }} placeholder='请输入账号描述'/>
          </Form.Item>
          <Form.Item
            label='资源账号'
            style={{ marginBottom: 0 }}
          >
            <Form.List name='variables' initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                    <>
                      <Form.Item
                        name={[name, 'id']}
                        fieldKey={[fieldKey, 'id']}
                        style={{ display: 'none' }}
                      >
                        <Input />
                      </Form.Item>
                      <Space key={key} size={12} style={{ display: 'flex', alignItems: 'start' }}>
                        <Form.Item
                          rules={[
                            { required: true, message: '请输入key' },
                            () => ({
                              validator(_, value) {
                                return new Promise((resolve, reject) => {
                                  const { variables } = form.getFieldValue();
                                  const filterList = variables.filter(({ name }) => name === value);
                                  if (filterList.length > 1 && value) {
                                    reject(new Error('key值不允许重复!'));
                                  }
                                  resolve();
                                });
                              }
                            })
                          ]}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                        >
                          <Input style={{ width: 188 }} placeholder='请输入key' />
                        </Form.Item>
                        <Form.Item
                          noStyle
                          dependencies={[['variables', name, 'sensitive']]}
                        >
                          {
                            ({ getFieldValue }) => {
                              const { id, sensitive } = getFieldValue(['variables', name]) || {};
                              return (
                                sensitive ? (
                                  <Form.Item
                                    name={[name, 'value']}
                                    fieldKey={[fieldKey, 'value']}
                                  >
                                    <Input.Password
                                      style={{ width: 194 }}
                                      autoComplete='new-password'
                                      placeholder={id ? '空值保存时不会修改原有值' : '请输入value'}
                                      visibilityToggle={false}
                                    />
                                  </Form.Item>
                                ) : (
                                  <Form.Item
                                    rules={[{ required: true, message: '请输入value' }]}
                                    name={[name, 'value']}
                                    fieldKey={[fieldKey, 'value']}
                                  >
                                    <Input style={{ width: 194 }} placeholder='请输入value' />
                                  </Form.Item>
                                )
                              );
                            }
                          }
                        </Form.Item>
                        <Form.Item
                          name={[name, 'sensitive']}
                          fieldKey={[fieldKey, 'sensitive']}
                          initialValue={false}
                          valuePropName='checked'
                        >
                          <Checkbox style={{ marginLeft: 9 }}>敏感</Checkbox>
                        </Form.Item>
                        {
                          fields.length > 1 && (
                            <Button style={{ padding: '4px 0' }} type='link' onClick={() => remove(name)}>删除</Button>
                          )
                        }
                      </Space>
                    </>
                  ))}
                  <Form.Item>
                    <Button 
                      type='link'
                      icon={<PlusOutlined />} 
                      onClick={() => add({})}
                      style={{ paddingLeft: 0 }}
                    >添加</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};