import React, { useState, useCallback, useEffect } from 'react';
import { EditableCell, columnsOverride } from 'components/editable-table-ele';

import { Alert, Card, Form, Table, Divider, Button, notification, Input, Row, Col } from 'antd';

const MOCK_DATA = [{
  key: '1',
  value: '1',
  des: '123'
}];

const FL = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
};

const pseudoKEY = 'a-new-key';

const Variable = (props) => {
  const genColumns = ({ editingKey, cancel, edit, save, del }) => {
    return [
      {
        title: 'key',
        dataIndex: 'key',
        editable: true
      },
      {
        title: 'value',
        dataIndex: 'value',
        editable: true
      },
      {
        title: '描述信息',
        dataIndex: 'des',
        editable: true
      },
      {
        title: '操作',
        width: 100,
        render: (_, record) => {
          const editable = editingKey == record.key;
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

  return <div className='variable'>
    <Card
      title='全局参数'
    >
      <Alert
        message='全局参数会在保存后自动加TF_VARS前缀'
        type='info'
        showIcon={true}
        closable={true}
      />
      <FormWithInTable
        genColumns={genColumns}
        addBtnTxt={'添加全局变量'}
        apis={{
          list: '',
          add: '',
          del: '',
          edit: ''
        }}
      />
    </Card>
    <Card
      title='环境变量'
      style={{ marginTop: 16 }}
    >
      <FormWithInTable
        genColumns={genColumns}
        addBtnTxt={'添加环境变量'}
        apis={{
          list: '',
          add: '',
          del: '',
          edit: ''
        }}
      />
    </Card>
    <Card
      title='tfvars路径'
      style={{ marginTop: 16 }}
    >
      <Form
        onFinish={(values) => {
          console.log('Success:', values);
        }}
      >
        <Row gutter={8}>
          <Col span={20}>
            <Form.Item
              name='tfvarsPath'
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


const FormWithInTable = ({ genColumns, addBtnTxt, apis }) => {

  const [ loading, setLoading ] = useState(false),
    [ editingKey, setEditingKey ] = useState(null),
    [ resultMap, setResultMap ] = useState({
      list: MOCK_DATA,
      total: 0
    });

  const [form] = Form.useForm();
  const isEditing = useCallback((record) => {
    return record.key === editingKey;
  }, [editingKey]);

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = (record) => {
    if (record.key == pseudoKEY) {
      setResultMap({
        ...resultMap,
        list: resultMap.list.slice(0, resultMap.list.length - 1)
      });
    }
    setEditingKey(null);
  };

  const add = () => {
    form.resetFields();
    setResultMap({
      ...resultMap,
      list: [ ... resultMap.list, { key: pseudoKEY }]
    });

    setEditingKey(pseudoKEY);
  };

  const save = async (record) => {
    const values = await form.validateFields();
    const doWhat = record.key == pseudoKEY ? apis.add : apis.edit;
    const res = await doWhat({
      id: record.key,
      ...values
    });
    fetchList();
    setEditingKey(null);
  };

  const del = async (record) => {
    //删除
    const res = await apis.del(record.key);
    fetchList();
    setEditingKey(null);
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await apis.list();
      if (!res.isSuccess) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.list || [],
        total: res.meta.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: e.message
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return <Form
    form={form}
    className='tableWrapperForm'
  >
    <Table
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
          save
        }), isEditing)
      }
      dataSource={resultMap.list}
      loading={loading}
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
