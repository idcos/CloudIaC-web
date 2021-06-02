import React, { useState, useCallback, useEffect } from 'react';
import { EditableCell, columnsOverride } from 'components/editable-table-ele';

import { Alert, Card, Form, Table, Divider, Button, notification, Input, Row, Col, Checkbox, Select, Tooltip } from 'antd';
import { ctAPI } from 'services/base';
import uuid from 'utils/uuid.js';

const { Option } = Select;
const pseudoID = 'a-new-id';

const Variable = ({ routesParams: { detailInfo, curOrg, reload } }) => {

  const [tfvarsForm] = Form.useForm();
  const [ tfvars, setTfvars ] = useState([]);
  const [ varsData, setVarsData ] = useState({
    terraformVars: [],
    envVars: []
  });

  useEffect(() => {
    tfvarsForm.setFieldsValue({ varfile: detailInfo.varfile || null });
  }, [detailInfo.varfile]);

  useEffect(() => {
    const { repoId, repoBranch } = detailInfo;
    if (repoId && repoBranch && tfvars.length === 0) {
      fetchTfvars();
    }
  }, [ detailInfo.repoId, detailInfo.repoBranch ]);

  useEffect(() => {
    setVarsData({
      terraformVars: (detailInfo.vars || []).filter(it => it.type == 'terraform'),
      envVars: (detailInfo.vars || []).filter(it => it.type == 'env')
    });
  }, [detailInfo.vars]);

  const fetchTfvars = async () => {
    try {
      const { repoId, repoBranch, vcsId } = detailInfo;
      const res = await ctAPI.tfvars({
        orgId: curOrg.id,
        repoId,
        repoBranch,
        vcsId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTfvars(res.result || []);
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const genColumns = ({ canSearchByKey, disabled, editingKey, cancel, edit, save, del, form }) => {
    const options = [
      { key: 'key1', value: 'value1', description: '描述信息1' },
      { key: 'key2', value: 'value2', description: '描述信息2' },
      { key: 'key3', value: 'value3', description: '描述信息3' },
      { key: 'key4', value: 'value4', description: '' }
    ];
    const handleChange = (val) => {
      const data = options.find((option) => option.key === val);
      form.setFieldsValue(data);
    };
    return [
      {
        title: 'key',
        dataIndex: 'key',
        editable: true,
        ... canSearchByKey ? {
          inputType: 'other',
          inputRender: ({ getFieldValue, setFieldsValue }) => {
            return (
              <Form.Item name='key' 
                rules={[
                  {
                    required: true,
                    message: "请选择"
                  }
                ]}
                style={{ margin: 0 }}
              >
                <Select 
                  style={{ width: 287 }} optionLabelProp='value' placeholder='请选择' 
                  showArrow={false} showSearch={true} onChange={handleChange}
                  dropdownRender={menu => (
                    <div className='variable-list-dropdown'>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div className='footer'>
                        <span>
                          查看更多变量内容
                        </span>
                      </div>
                    </div>
                  )}
                >
                  {
                    options.map((option) => {
                      const { key, value, description } = option;
                      const keyValueTpl = <span>{ key }: { value }</span>;
                      const descriptionTpl = <span>描述内容：{ description || '无' }</span>;
                      return (
                        <Option value={key}>
                          <div className='key-value idcos-text-ellipsis'>
                            <Tooltip title={keyValueTpl}>
                              { keyValueTpl }
                            </Tooltip>
                          </div>
                          <div className='description idcos-text-ellipsis'>
                            <Tooltip title={descriptionTpl}>
                              { descriptionTpl }
                            </Tooltip>
                          </div>
                        </Option>
                      );
                    })
                  }
                </Select>
              </Form.Item>
            );
          }
        } : {}
      },
      {
        title: 'value',
        dataIndex: 'value',
        editable: true,
        inputType: 'other',
        inputRender: ({ getFieldValue, setFieldsValue }) => {
          const isSecret = <Form.Item
            name={'isSecret'}
            noStyle={true}
            valuePropName='checked'
            initialValue={false}
          >
            <Checkbox >
              密文
            </Checkbox>
          </Form.Item>;
          return (
            <Form.Item
              name='value'
              rules={[
                {
                  required: !(
                    editingKey !== pseudoID && getFieldValue("isSecret")
                  ), // 编辑状态下密文value可留空
                  message: "请输入"
                }
              ]}
              style={{
                margin: 0
              }}
            >
              {getFieldValue("isSecret") ? (
                <Input.Password
                  placeholder={editingKey !== pseudoID ? "空值保存时不会修改原有值" : ""} // 编辑状态密文可留空
                  addonAfter={isSecret}
                  visibilityToggle={false}
                />
              ) : (
                <Input addonAfter={isSecret} />
              )}
            </Form.Item>
          );
        },
        render: (text, record) => record.isSecret ? '***' : text
      },
      {
        title: '描述信息',
        dataIndex: 'description',
        editable: true,
        fieldItemProps: {
          rules: [{ message: '请输入' }]
        }
      },
      {
        title: '操作',
        width: 100,
        render: (_, record) => {
          const editable = editingKey == record.id;
          return editable ? (
            <span>
              <a type='link' onClick={() => save(record)}>保存</a>
              <Divider type='vertical' />
              <a type='link' onClick={() => cancel(record)}>取消</a>
            </span>
          ) : <span className='inlineOp'>
            <a type='link' onClick={() => edit(record)} disabled={editingKey || disabled}>编辑</a>
            <Divider type='vertical' />
            <a type='link' className={(editingKey || disabled) ? '' : 'danger'} disabled={editingKey || disabled} onClick={() => del(record)}>删除</a>
          </span>;
        }
      }
    ];
  };

  const api = async ({ doWhat, varfile, ...payload }, cb) => {
    try {
      const method = {
        del: ({ id }) => (detailInfo.vars || []).filter(it => it.id !== id),
        edit: ({ id, ...payload }) => (detailInfo.vars || []).map(it => (it.id == id ? { id, ...payload } : it)),
        add: (param) => [ ...detailInfo.vars || [], param ]
      };

      const reqPayload = doWhat ? { vars: method[doWhat](payload) } : { varfile };
      const res = await ctAPI.edit({
        orgId: curOrg.id,
        id: detailInfo.id,
        ...reqPayload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      reload();
      cb && cb();
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  return <div className='variable'>
    <Card
      title='Terraform变量'
    >
      <Alert
        message='Terraform变量参数会在保存后自动加TF_VAR_前缀'
        type='info'
        showIcon={true}
        closable={true}
      />
      <FormWithInTable
        disabled={detailInfo.status === "disable"}
        genColumns={(props) => genColumns({ ...props, canSearchByKey: true })}
        addBtnTxt={'添加Terraform变量'}
        dataSource={varsData.terraformVars}
        dataType='terraform'
        api={api}
      />
    </Card>
    <Card
      title='环境变量'
      style={{ marginTop: 24 }}
    >
      <FormWithInTable
        disabled={detailInfo.status === "disable"}
        genColumns={genColumns}
        addBtnTxt={'添加环境变量'}
        dataSource={varsData.envVars}
        dataType='env'
        api={api}
      />
    </Card>
    <Card
      title='tfvars路径'
      style={{ marginTop: 24 }}
    >
      <Form
        form={tfvarsForm}
        onFinish={(values) => {
          api({ varfile: values.varfile || '' });
        }}
      >
        <Row gutter={8}>
          <Col span={20}>
            <Form.Item
              name='varfile'
              rules={[
                {
                  required: false,
                  message: '请选择'
                }
              ]}
            >
              <Select allowClear={true} placeholder='请选择tfvars路径'>
                {tfvars.map(it => <Option value={it}>{it}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Button disabled={detailInfo.status === "disable"} htmlType='submit'>保存</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>;
};


const FormWithInTable = ({ genColumns, addBtnTxt, api, dataSource, dataType, disabled }) => {
  const [ editingKey, setEditingKey ] = useState(null),
    [ resultList, setResultList ] = useState(dataSource);

  useEffect(() => {
    if (editingKey) {
      setEditingKey(null);
    }
    setResultList(dataSource);
  }, [dataSource]);

  const [form] = Form.useForm();
  const isEditing = useCallback((record) => {
    return record.id === editingKey;
  }, [editingKey]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.id);
  };

  const cancel = (record) => {
    if (record.id == pseudoID) {
      setResultList(resultList.slice(0, resultList.length - 1));
    }
    setEditingKey(null);
  };

  const add = () => {
    form.resetFields();
    setResultList([
      ...resultList,
      { id: pseudoID }
    ]);
    setEditingKey(pseudoID);
  };

  const save = async (record) => {
    const values = await form.validateFields();
    const doWhat = record.id == pseudoID ? 'add' : 'edit';
    await api({
      id: record.id == pseudoID ? uuid() : record.id,
      ...values,
      doWhat,
      type: dataType
    }, () => {
      setEditingKey(null);
    });
  };

  const del = (record) => api(
    { id: record.id, doWhat: 'del' },
    () => {
      setEditingKey(null);
    }
  );

  return <Form
    form={form}
    className='tableWrapperForm'
  >
    <Table
      className='editable-table'
      components={{
        body: {
          cell: EditableCell
        }
      }}
      columns={
        columnsOverride(genColumns({
          disabled,
          cancel,
          edit,
          editingKey,
          del,
          save,
          form
        }), isEditing)
      }
      dataSource={resultList}
      pagination={false}
    />
    <Button
      block={true}
      type='dashed'
      className='blockAdd'
      onClick={() => add()}
      disabled={editingKey || disabled}
    >
      {addBtnTxt}
    </Button>
  </Form>;
};

export default Variable;
