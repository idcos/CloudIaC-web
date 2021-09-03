import React, { useState } from 'react';
import { Button, Table, Space, Input, Select, Divider, Tag } from 'antd';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { requestWrapper } from 'utils/request';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { useSearchFormAndTable } from 'utils/hooks';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import policiesAPI from 'services/policies';
import Detection from './detection';

const Policy = () => {

  const [visible, setVisible] = useState(false);

  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList
  } = useRequest(
    (params) => requestWrapper(
      policiesAPI.list.bind(null, params)
    ), {
      manual: true
    }
  );

  const { 
    tableProps, 
    onChangeFormParams
  } = useSearchFormAndTable({
    tableData: {
      list: tableData
    },
    onSearch: (params) => {
      const { current: currentPage, ...restParams } = params;
      fetchList({ currentPage, ...restParams });
    }
  });

  const goEditPage = (id) => {
    history.push(`/compliance/policy-config/policy/policy-form/${id}`);
  };

  const goCreatePage = () => {
    history.push('/compliance/policy-config/policy/policy-form');
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '策略名称',
      render: (text, record) => {
        return <a >{text}</a>
      }
    },
    {
      dataIndex: 'tags',
      title: '标签',
      render: (text) => {
        const tags = text ? text.split(',') : [];
        return (
          <>
            {
              tags.slice(0, 3).map((it) => <Tag>{it}</Tag>)
            }
            {
              tags.length > 3 && <Tag>+{tags.length - 3}</Tag>
            }
          </>
        )
      }
    },
    {
      dataIndex: 'groupId',
      title: '策略组'
      // render: (text) => <a href={text} target='_blank'>{text}</a>
    },
    {
      dataIndex: 'severity',
      title: '严重性',
      render: (text) => POLICIES_SEVERITY_ENUM[text]
    },
    {
      dataIndex: 'passed',
      title: '通过'
    },
    {
      dataIndex: 'failed',
      title: '不通过'
    },
    {
      dataIndex: 'suppressed',
      title: '屏蔽'
    },
    {
      dataIndex: 'creator',
      title: '创建者'
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新时间',
      render: (text) => moment(text).format('YYYY-M-DD HH:mm')
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      render: (record) => {
        const { id } = record;
        return (
          <Space split={<Divider type='vertical'/>}>
            <Button style={{ padding: 0 }} type='link'>检测</Button>
            <Button style={{ padding: 0 }} type='link' onClick={() => goEditPage(id)}>编辑</Button>
            <Button style={{ padding: 0 }} type='link'>禁用</Button>
          </Space>
        );
      }
    }
  ];

  return <Layout
    extraHeader={<PageHeader
      title='策略'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <Space size={16} direction='vertical' style={{ width: '100%'}}>
        <Space>
          <Button type={'primary'} onClick={goCreatePage}>
            新建策略
          </Button>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择策略组'
            onChange={(groupId) => onChangeFormParams({ groupId })}
          >
          </Select>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择严重性'
            onChange={(severity) => onChangeFormParams({ severity })}
          >
            {
              Object.keys(POLICIES_SEVERITY_ENUM).map((it) => (
                <Select.Option value={it}>{POLICIES_SEVERITY_ENUM[it]}</Select.Option>
              ))
            }
          </Select>
          <Input.Search
            style={{ width: 240 }}
            allowClear={true}
            placeholder='请输入策略名称搜索'
            onSearch={(q) => onChangeFormParams({ q })}
          />
        </Space>
        <Table
          columns={columns}
          scroll={{ x: 'max-content' }}
          loading={tableLoading}
          {...tableProps}
        />
      </Space>
    </div>
    <Detection visible={visible} toggleVisible={() => setVisible(false)} />
  </Layout>;
};

export default Policy;
