
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Checkbox, Spin, Select, AutoComplete } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import varGroupAPI from 'services/var-group';
import projectAPI from 'services/project';
import { t } from 'utils/i18n';

const { Option } = Select;

const FL = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};
let providerOptions = [{ value: 'alicloud' }, { value: 'aws' }, { value: 'azure' }, { value: 'google' }, { value: 'tencentcloud' }, { value: 'huaweicloud' }];

export default ({ orgId, event$ }) => {

  const [form] = Form.useForm();
  const [ visible, setVisible ] = useState(false);
  const [ id, setId ] = useState();
  const [ objectList, setObjectList ] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

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

  const fetchList = async () => {
    const res = await projectAPI.projectList({
      orgId,
      pageSize: 0,
      pageNo: 1
    });
    if (res.code != 200) {
      throw new Error(res.message);
    }
    setObjectList(res.result.list || []);
  };

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
    const { name, variables, projectIds, provider, costCounted } = await form.validateFields();
    const params = {
      name,
      variables: variables.filter((it) => !!it).map(({ id, ...variable }) => ({ ...variable, id: id || uuidv4(), description: name })),
      projectIds,
      provider, 
      costCounted
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
      title={id ? t('define.resourceAccount.action.modify') : t('define.resourceAccount.action.add')}
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={id ? updateLoading : createLoading}
      width={700}
      className='antd-modal-type-form'
      cancelButtonProps={{ 
        className: 'ant-btn-tertiary' 
      }}
    >
      <Spin spinning={detailLoading}>
        <Form form={form} {...FL}>
          <Form.Item 
            name='name'
            label={t('define.des')}
            rules={[
              {
                required: true,
                message: t('define.form.input.placeholder')
              }
            ]}
          >
            <Input style={{ width: 254 }} placeholder={t('define.form.input.placeholder')}/>
          </Form.Item>
          <Form.Item
            label={t('define.resourceAccount.title')}
            style={{ marginBottom: 0 }}
          >
            <Form.List name='variables' initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey }) => (
                    <>
                      <Form.Item
                        name={[ name, 'id' ]}
                        fieldKey={[ fieldKey, 'id' ]}
                        style={{ display: 'none' }}
                      >
                        <Input />
                      </Form.Item>
                      <Space key={key} size={12} style={{ display: 'flex', alignItems: 'start' }}>
                        <Form.Item
                          rules={[
                            { required: true, message: `${t('define.form.input.placeholder')} key` },
                            () => ({
                              validator(_, value) {
                                return new Promise((resolve, reject) => {
                                  const { variables } = form.getFieldValue();
                                  const filterList = variables.filter(({ name }) => name === value);
                                  if (filterList.length > 1 && value) {
                                    reject(new Error(t('define.variable.sameKeyError')));
                                  }
                                  resolve();
                                });
                              }
                            })
                          ]}
                          name={[ name, 'name' ]}
                          fieldKey={[ fieldKey, 'name' ]}
                        >
                          <Input style={{ width: 188 }} placeholder={`${t('define.form.input.placeholder')} key`} />
                        </Form.Item>
                        <Form.Item
                          noStyle={true}
                          dependencies={[[ 'variables', name, 'sensitive' ]]}
                        >
                          {
                            ({ getFieldValue }) => {
                              const { id, sensitive } = getFieldValue([ 'variables', name ]) || {};
                              return (
                                sensitive ? (
                                  <Form.Item
                                    name={[ name, 'value' ]}
                                    fieldKey={[ fieldKey, 'value' ]}
                                  >
                                    <Input.Password
                                      style={{ width: 194 }}
                                      autoComplete='new-password'
                                      placeholder={id ? t('define.emptyValueSave.placeholder') : `${t('define.form.input.placeholder')} value`}
                                      visibilityToggle={false}
                                    />
                                  </Form.Item>
                                ) : (
                                  <Form.Item
                                    rules={[{ required: true, message: `${t('define.form.input.placeholder')} value` }]}
                                    name={[ name, 'value' ]}
                                    fieldKey={[ fieldKey, 'value' ]}
                                  >
                                    <Input style={{ width: 194 }} placeholder={`${t('define.form.input.placeholder')} value`} />
                                  </Form.Item>
                                )
                              );
                            }
                          }
                        </Form.Item>
                        <Form.Item
                          name={[ name, 'sensitive' ]}
                          fieldKey={[ fieldKey, 'sensitive' ]}
                          initialValue={false}
                          valuePropName='checked'
                        >
                          <Checkbox style={{ marginLeft: 9 }}>{t('define.variable.sensitive')}</Checkbox>
                        </Form.Item>
                        {
                          fields.length > 1 && (
                            <Button style={{ padding: '4px 0' }} type='link' onClick={() => remove(name)}>{t('define.action.delete')}</Button>
                          )
                        }
                      </Space>
                    </>
                  ))}
                  <Form.Item>
                    <Space onClick={() => add({})} style={{ cursor: 'pointer' }}>
                      <PlusOutlined />
                      <span>{t('define.resourceAccount.action.add')}</span>
                    </Space>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            name={'projectIds'}
            label={t('define.bindProject')}
          >
            <Select
              getPopupContainer={triggerNode => triggerNode.parentNode} 
              allowClear={true} 
              placeholder={t('define.allProject')}
              style={{ width: 395 }}
              mode={'multiple'}
              optionFilterProp='children'
              showSearch={true}
              showArrow={true}
            >
              {objectList.map(it => <Option value={it.id}>{it.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name={'provider'}
            label={'Provider'}
          >
            <AutoComplete
              options={providerOptions}
              filterOption={(inputValue, option) =>
                option.value.indexOf(inputValue) !== -1
              }
              style={{ width: 395 }}
              placeholder={t('define.form.select.placeholder')}
              showArrow={true}
            />
          </Form.Item>

          <Form.Item noStyle={true} shouldUpdate={true}>
            {
              ({ getFieldValue }) => {
                const providerValue = getFieldValue('provider');
                if (providerValue === 'alicloud') {
                  return (
                    <Form.Item
                      name={'costCounted'}
                      initialValue={false}
                      valuePropName='checked'
                      wrapperCol={{ offset: 4 }}
                    >
                      <Checkbox>{t('define.costStatistics')}</Checkbox>
                    </Form.Item>
                  );
                }
              }}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};