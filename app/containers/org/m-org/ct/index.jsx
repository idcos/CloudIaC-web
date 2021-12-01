import React, { useState, useEffect } from 'react';
import { Button, Table, notification, Divider, Space } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import EllipsisText from 'components/EllipsisText';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import ImportModal from './components/importModal';
import tplAPI from 'services/tpl';
import { VerticalAlignBottomOutlined, ImportOutlined } from '@ant-design/icons';
import { downloadImportTemplate } from 'utils/util';
import { UploadtIcon } from 'components/iconfont';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

const CTList = ({ match = {} }) => {
  const { orgId } = match.params || {};
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      width: 154,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: '云模板描述',
      width: 213,
      ellipsis: true
    },
    {
      dataIndex: 'activeEnvironment',
      title: '活跃环境',
      width: 102,
      ellipsis: true
    },
    {
      dataIndex: 'repoAddr',
      title: '仓库',
      width: 249,
      ellipsis: true,
      render: (text) => <a href={text} target='_blank'><EllipsisText>{text}</EllipsisText></a>
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 100,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 160,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => updateCT(record.id)}>编辑</a>
            <Divider type='vertical' />
            <a type='link' onClick={() => onDel(record.id)}>删除</a>
          </span>
        );
      }
    }
  ];

  const createCT = () => {
    history.push(`/org/${orgId}/m-org-ct/createCT`);
  };

  const updateCT = (tplId) => {
    history.push(`/org/${orgId}/m-org-ct/updateCT/${tplId}`);
  };

  const onDel = async (tplId) => {
    try {
      setLoading(true);
      const res = await tplAPI.del({
        tplId,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      notification.success({
        message: '删除成功'
      });
      fetchList();
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '删除失败',
        description: e.message
      });
    }
  };

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await tplAPI.list({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setLoading(false);
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
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

  const download = () => {
    const ids = selectedRowKeys;
    let keys;
    if (selectedRowKeys && !isEmpty(selectedRowKeys)) {
      keys = selectedRowKeys.map(key => {
        return `ids=${key}`;
      }).join('&');
    }
    let url = `/api/v1/templates/export?download=true${!isEmpty(ids) && ('&' + keys) || ''}`;
    downloadImportTemplate(url, { orgId });
  };

  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div>
        <Space style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            type='primary'
            onClick={createCT}
          >新建云模板</Button>
          <span>
            <Button disabled={selectedRowKeys.length === 0} icon={<VerticalAlignBottomOutlined />} style={{ marginRight: 8 }} onClick={() => download()}>导出</Button>
            <Button icon={<UploadtIcon />} onClick={() => setVisible(true)}>导入</Button>
          </span>
        </Space>
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={resultMap.list}
          loading={loading}
          scroll={{ x: 'min-content', y: 570 }}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条`,
            onChange: (pageNo, pageSize) => {
              changeQuery({
                pageNo,
                pageSize
              });
            }
          }}
          rowSelection={
            {
              columnWidth: 26,
              fixed: true,
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys);
              },
              getCheckboxProps: (R) => ({
                disabled: R.internal
              })
            }
          }
        />
      </div>
      {visible && <ImportModal orgId={orgId} reload={() => fetchList()} toggleVisible={() => setVisible(false)}/>}
    </div>
  </Layout>;
};

export default Eb_WP()(CTList);
