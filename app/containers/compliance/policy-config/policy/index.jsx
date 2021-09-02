import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Input, Select, Divider, Tag } from 'antd';
import history from 'utils/history';
import { connect } from "react-redux";
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { useSearchAndTable } from 'utils/hooks';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';
import Detection from './detection';

const Policy = () => {

  const [visible, setVisible] = useState(false);
  const [ resultMap, setResultMap ] = useState({
    list: [],
    total: 0
  });
  const { tableProps, onChangeSearchParams } = useSearchAndTable({
    resultMap,
    onSearch: (params) => {
      const { current, pageSize } = params;
      setResultMap({
        list: Array.from(new Array(pageSize), (it, index) => ({
          "createdAt": "2006-01-02 15:04:05",
          "creatorId": "u-c3lcrjxczjdywmk0go90",
          "enabled": true,
          "fixSuggestion": "1. 设置 internet_max_bandwidth_out = 0\n 2. 取消设置 allocate_public_ip",
          "groupId": "lg-c3lcrjxczjdywmk0go90",
          "id": index,
          "name": "ECS分配公网IP",
          "policyType": "alicloud",
          "referenceId": "iac_aliyun_public_26",
          "rego": "package idcos ...",
          "resourceType": "alicloud_instance",
          "revision": 1,
          "ruleName": "instanceNoVpc",
          "severity": "medium",
          "tags": "security,aliyun,huawei,小黑,绿豆",
          "updatedAt": "2006-01-02 15:04:05"
        })),
        total: 100
      });
    }
  });

  const columns = [
    {
      dataIndex: 'name',
      title: '策略名称'
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
      dataIndex: 'activeEnvironment',
      title: '通过'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '不通过'
    },
    {
      dataIndex: 'activeEnvironment',
      title: '屏蔽'
    },
    {
      dataIndex: 'creatorId',
      title: '创建者'
    },
    {
      dataIndex: 'updatedAt',
      title: '最后更新时间'
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => setVisible(true)}>检测</a>
            <Divider type={'vertical'} />
            <a type='link'>编辑</a>
            <Divider type={'vertical'} />
            <a type='link'>禁用</a>
          </span>
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
          <Button
            type={'primary'}
            onClick={() => {
              history.push('/compliance/policy-config/policy/policy-form');
            }}
          >
            新建策略
          </Button>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择策略组'
            onChange={(groupId) => onChangeSearchParams({ groupId })}
          >
            <Select.Option value={1}>1</Select.Option>
          </Select>
          <Select
            style={{ width: 282 }}
            allowClear={true}
            placeholder='请选择严重性'
            onChange={(severity) => onChangeSearchParams({ severity })}
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
            onSearch={(q) => onChangeSearchParams({ q })}
          />
        </Space>
        <Table
          columns={columns}
          scroll={{ x: 'max-content' }}
          {...tableProps}
        />
      </Space>
    </div>
    <Detection visible={visible} toggleVisible={() => setVisible(false)} />
  </Layout>;
};

export default connect((state) => {
  return {
    userInfo: state.global.get('userInfo').toJS()
  };
})(Eb_WP()(Policy));
