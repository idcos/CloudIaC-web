import { Modal, Form, Input, Button, Space, Checkbox, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest, useDynamicList } from 'ahooks';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

export default ({ orgId, visible, id, event$ }) => {

  const [form] = Form.useForm();

  // 查询详情
  const {
    loading: detailLoading
  } = useRequest(
    () => requestWrapper(
      varGroupAPI.detail.bind(null, { orgId, id })
    ), {
      ready: !!id,
      onSuccess: (detail) => {
        form.setFieldsValue(detail || {});
      }
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
        event$.emit('close');
        event$.emit('refresh');
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
        event$.emit('close');
        event$.emit('refresh');
      }
    }
  );

  const onOk = async () => {
    const { name, variables } = await form.validateFields();
    const params = {
      name,
      variables: variables.filter((it) => !!it)
    };
    id ? updateResourceAccount(params) : createResourceAccount(params);
  };

  return (
    <Modal 
      visible={visible} 
      title={id ? '编辑资源账号' : '添加资源账号'}
      onCancel={() => event$.emit('close')}
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
                        rules={[{ required: true, message: '请输入value' }]}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                      >
                        <Input style={{ width: 188 }} placeholder='请输入value' />
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