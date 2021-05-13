import React, { useState, useEffect } from 'react';
import { Input, notification, Table, Card, Button, Select } from 'antd';
import { ctAPI, orgsAPI } from 'services/base';

import MarkdownParser from 'components/coder/markdown-parser';

import moment from 'moment';

const { Option } = Select;

export default ({ stepHelper, selection, setSelection, curOrg }) => {
  const [ loading, setLoading ] = useState(false),
    [ codeStr, setCodeStr ] = useState(''),
    [ vcsList, setVcsList ] = useState([]),
    [ vcsValue, setVcsValue ] = useState(),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  useEffect(() => {
    fetchVcsList();
  }, []);

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchVcsList = async () => {
    try {
      const res = await orgsAPI.searchVcs({
        pageSize: 5000,
        orgId: curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const list = res.result.list;
      setVcsList(list);
      setVcsValue(list[0] && list[0].id);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };


  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await ctAPI.listRepo({
        ...query,
        orgId: curOrg.id
      });
      if (res.code !== 200) {
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

  const fetchReadme = async ({ repoId }) => {
    try {
      const res = await ctAPI.repoReadme({
        repoId,
        orgId: curOrg.id,
        branch: 'master'
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const { content = '' } = res.result || {};
      setCodeStr(content);
    } catch (e) {
      notification.error({
        message: e.message
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
      dataIndex: 'taskUpdatedAt',
      title: '更新时间',
      width: '50%',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
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
      fetchReadme({
        repoId: selectedRowKeys[0]
      });
    }
  };

  const hasSelection = () => selection.selectedRowKeys && selection.selectedRowKeys.length;

  return <div className='step1'>
    <div className={hasSelection() ? 'hidden' : ''}>
      <div>
        <Select style={{ width: 160, marginRight: 8 }} placeholder='请选择' value={vcsValue} onChange={setVcsValue}>
          {vcsList.map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
        <Input.Search
          placeholder='请输入仓库名称搜索'
          style={{ width: 240, marginBottom: 16 }}
          onSearch={v => changeQuery({ name: v, pageNo: 1 })}
        />
      </div>
      <Table
        rowKey='id'
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
          <MarkdownParser
            value={codeStr}
          />
        </Card>
        <Button type='primary' onClick={() => stepHelper.next()}>下一步</Button>
      </> : null
    }
  </div>;
};

