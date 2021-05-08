import React, { useState, useCallback, useEffect } from 'react';
import { EditableCell, columnsOverride } from 'components/editable-table-ele';

import { Alert, Card, Form, Table, Divider, Button, notification, Input, Row, Col, Checkbox } from 'antd';
import { ctAPI } from 'services/base';
import uuid from 'utils/uuid.js';

const pseudoID = 'a-new-id';

const Variable = ({ routesParams: { detailInfo, curOrg, reload } }) => {
  const genColumns = ({ editingKey, cancel, edit, save, del, form }) => {
    return [
      {
        title: 'key',
        dataIndex: 'key',
        editable: true
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
            <Checkbox
              onChange={() => setFieldsValue({ value: undefined })}
            >
              密文
            </Checkbox>
          </Form.Item>;
          return <Form.Item
            name='value'
            rules={[
              {
                required: true,
                message: '请输入'
              }
            ]}
            style={{
              margin: 0
            }}
          >
            {getFieldValue('isSecret') ? <Input.Password addonAfter={isSecret} visibilityToggle={false}/> : <Input addonAfter={isSecret}/>}
          </Form.Item>;
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
            <a type='link' onClick={() => edit(record)} disabled={editingKey}>编辑</a>
            <Divider type='vertical' />
            <a type='link' className={editingKey ? '' : 'danger'} disabled={editingKey} onClick={() => del(record)}>删除</a>
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

      const reqPayload = varfile ? { varfile } : { vars: method[doWhat](payload) };
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
        genColumns={genColumns}
        addBtnTxt={'添加Terraform变量'}
        dataSource={(detailInfo.vars || []).filter(it => it.type == 'terraform')}
        dataType='terraform'
        api={api}
      />
    </Card>
    <Card
      title='环境变量'
      style={{ marginTop: 16 }}
    >
      <FormWithInTable
        genColumns={genColumns}
        addBtnTxt={'添加环境变量'}
        dataSource={(detailInfo.vars || []).filter(it => it.type == 'env')}
        dataType='env'
        api={api}
      />
    </Card>
    <Card
      title='tfvars路径'
      style={{ marginTop: 16 }}
    >
      <Form
        onFinish={(values) => {
          api({ varfile: values.varfile });
        }}
        initialValues={{
          varfile: detailInfo.varfile
        }}
      >
        <Row gutter={8}>
          <Col span={20}>
            <Form.Item
              name='varfile'
              rules={[
                {
                  required: true,
                  message: '请输入'
                }
              ]}
            >
              <Input placeholder='请输入tfvars路径' />
            </Form.Item>
          </Col>
          <Col>
            <Button htmlType='submit'>保存</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>;
};


const FormWithInTable = ({ genColumns, addBtnTxt, api, dataSource, dataType }) => {
  const [ editingKey, setEditingKey ] = useState(null),
    [ resultList, setResultList ] = useState(dataSource);

  useEffect(() => {
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
      disabled={editingKey}
    >
      {addBtnTxt}
    </Button>
  </Form>;
};

export default Variable;
