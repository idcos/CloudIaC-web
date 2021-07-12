import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Input, notification, Select, Form } from 'antd';

import { Eb_WP } from 'components/error-boundary';
import styles from '../styles.less';

import { pjtAPI } from 'services/base';

const { Option } = Select;

const Index = (props) => {
  const { match, routesParams, routes } = props;
  const form = useContext(EditableContext);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };

  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [
        {
          "createdAt": "2006-01-02 15:04:05",
          "email": "mail@example.com",
          "id": "x-c3ek0co6n88ldvq1n6ag",
          "typeUser": 'false',
          "name": "张三",
          "newbieGuide": "{\"1\"}",
          "phone": "18888888888",
          "status": "enable",
          "updatedAt": "2006-01-02 15:04:05"
        }
      ],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: 'all'
    }),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null);
  const tableFilterFieldName = 'taskStatus';

  const columns = [
    {
      dataIndex: 'name',
      title: '姓名'
    },
    {
      dataIndex: 'email',
      title: '邮箱'
    },
    {
      dataIndex: 'phone',
      title: '手机'
    },
    {
      dataIndex: 'data',
      title: '加入时间'
    },
    {
      dataIndex: 'typeUser',
      title: '项目角色',
      editable: true,
      width: 200,
      render: (t, r) => {
        return (<div>{t}</div>); 
      }
    }
  ];
  const handleSave = (row) => {
    console.log(row, 'row');
    const newData = [...resultMap.list];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setResultMap({ ...resultMap, list: newData });
  };

  const columnsIsEdit = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        form,
        handleSave: handleSave
      })
    };
  });
  useEffect(() => {
    // fetchList();
  }, [query]);

  const edit = (v) => {
    console.log(v);
  };
  
  const del = (v) => {
    console.log(v);
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const { combinedStatus, status, ...restQuery } = query;
      const res = await pjtAPI.projectList({
        ...restQuery,
        [tableFilterFieldName]: combinedStatus || status,
        orgId: routesParams.curOrg.id
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };
  
  return <div className={styles.ct}>
    <div className='searchPanel'>
      <Input.Search
        placeholder='请输入项目名称搜索'
        style={{ width: 240 }}
        onSearch={v => changeQuery({ name: v, pageNo: 1 })}
      />
    </div>
    <Table
      components={components}
      columns={columnsIsEdit}
      dataSource={resultMap.list}
      loading={loading}
      onChange={(pagination, filters, sorter, { action }) => {
        if (action == 'filter') {
          const statusFilter = filters[tableFilterFieldName];
          changeQuery({
            status: 'all',
            combinedStatus: statusFilter ? statusFilter.join(',') : undefined
          });
        }
      }}
      pagination={{
        current: query.pageNo,
        pageSize: query.pageSize,
        total: resultMap.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共${total}条`,
        onChange: (page, pageSize) => {
          changeQuery({
            pageNo: page,
            pageSize
          });
        }
      }}
    />
  </div>;
};

export default Eb_WP()(Index);

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [ editing, setEditing ] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        initialValue={record[dataIndex]}
        style={{
          margin: 0
        }}
      >
        <Select onChange={save}>
          {[ 1, 2, 3, 4, 5 ].map(key => (
            <Option key={key} value={key}>
              {key}
            </Option>
          ))}
        </Select>
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps} style={{ padding: editing ? 5 : 12 }}>{childNode}</td>;
};