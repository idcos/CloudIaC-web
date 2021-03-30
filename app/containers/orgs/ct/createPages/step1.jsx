import React, { useState, useEffect } from 'react';
import { Input, notification, Table, Card, Button } from 'antd';
import { ctAPI } from "../../../../services/base";

export default ({ stepHelper, selection, setSelection }) => {
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [{ name: 1, id: 1 }],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  useEffect(() => {
    fetchList();
  }, [query]);


  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await ctAPI.list(query);
      if (!res.isSuccess) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.resultObject.pageElements || [],
        total: res.resultObject.total || 0
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

  const columns = [
    {
      dataIndex: 'name',
      title: '仓库名称',
      width: '50%'
    },
    {
      dataIndex: 'time',
      title: '更新时间',
      width: '50%'
    }
  ];

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selection.selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelection({
        selectedRowKeys,
        selectedRows
      });
    }
  };

  const hasSelection = () => selection.selectedRowKeys && selection.selectedRowKeys.length;

  return <div className='step1'>
    <div className={hasSelection() ? 'hidden' : ''}>
      <Input.Search
        placeholder='请输入仓库名称搜索'
        style={{ width: 240, marginBottom: 16 }}
        onSearch={v => changeQuery({ name: v, pageNo: 1 })}
      />
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        rowSelection={rowSelection}
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
    </div>
    {
      hasSelection() ? <>
        <Card
          style={{ marginBottom: 16 }}
        >
          <div className='cardContent'>
            <span>当前仓库：{selection.selectedRows[0].name}</span>
            <a onClick={() => setSelection({ selectedRowKeys: [], selectedRows: [] })}>重新选择</a>
          </div>
        </Card>
        <Card
          title={'README.md'}
          style={{ marginBottom: 16 }}
        >
        </Card>
        <Button type='primary' onClick={() => stepHelper.next()}>下一步</Button>
      </> : null
    }
  </div>;
};
