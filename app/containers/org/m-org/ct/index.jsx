import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, notification, Space } from 'antd';
import history from 'utils/history';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import EllipsisText from 'components/EllipsisText';
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import ImportModal from './components/importModal';
import DetectionDrawer from './components/detection-drawer';
import tplAPI from 'services/tpl';
import ctplAPI from 'services/ctpl';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { SCAN_DISABLE_STATUS } from 'constants/types';
import { downloadImportTemplate } from 'utils/util';
import { useLoopPolicyStatus } from 'utils/hooks';
import { UploadtIcon } from 'components/iconfont';
import PolicyStatus from 'components/policy-status';
import isEmpty from 'lodash/isEmpty';

const CTList = ({ match = {} }) => {

  const { check } = useLoopPolicyStatus();
  const { orgId } = match.params || {};
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ selectedRowKeys, setSelectedRowKeys ] = useState([]),
    [ selectedRows, setSelectedRows ] = useState([]),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10
    });
  const [ detectionDrawerProps, setDetectionDrawerProps ] = useState({
    visible: false,
    id: null
  });

  useEffect(() => {
    fetchList();
  }, [query]);

  const openDetectionDrawer = ({ id }) => {
    setDetectionDrawerProps({
      id,
      visible: true
    });
  };

  // 关闭检测详情刷新下列表的检测状态字段
  const closeDetectionDrawer = () => {
    setDetectionDrawerProps({
      id: null,
      visible: false
    });
  };

  // 批量扫描合规检测
  const {
    run: batchScan
  } = useRequest(
    () => requestWrapper(
      ctplAPI.runBatchScan.bind(null, { ids: selectedRows.map(it => it.id) }), {
        autoSuccess: true
      }
    ), {
      manual: true,
      onSuccess: () => {
        fetchList();
      }
    }
  );

  const columns = [
    {
      dataIndex: 'name',
      title: '云模板名称',
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: '云模板描述',
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'activeEnvironment',
      title: '活跃环境',
      width: 78,
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
      dataIndex: 'policyStatus',
      title: '合规状态',
      width: 100,
      ellipsis: true,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record)
        };
        return <PolicyStatus policyStatus={policyStatus} clickProps={clickProps} />;
      }
    },
    {
      dataIndex: 'creator',
      title: '创建人',
      width: 70,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 152,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        return (
          <Space>
            <a type='link' onClick={() => updateCT(record.id)}>编辑</a>
            <a type='link' onClick={() => onDel(record.id)}>删除</a>
          </Space>
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
      check({ 
        list: res.result.list || [],
        loopFn: () => fetchList()
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

  const batchScanDisabled = useMemo(() => {
    return !selectedRows.length || selectedRows.find(it => SCAN_DISABLE_STATUS.includes(it.policyStatus));
  });

  return <Layout
    extraHeader={<PageHeader
      title='云模板'
      breadcrumb={true}
    />}
  >
    <div className='idcos-card'>
      <div>
        <Space style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type='primary' onClick={createCT}>新建云模板</Button>
            <Button disabled={batchScanDisabled} onClick={batchScan}>合规检测</Button>
          </Space>
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
                setSelectedRows(rows);
              },
              getCheckboxProps: (R) => ({
                disabled: R.internal
              })
            }
          }
        />
      </div>
      {detectionDrawerProps.visible && <DetectionDrawer 
        {...detectionDrawerProps}
        onClose={closeDetectionDrawer}
      />} 
      {visible && <ImportModal orgId={orgId} reload={() => fetchList()} toggleVisible={() => setVisible(false)}/>}
    </div>
  </Layout>;
};

export default Eb_WP()(CTList);
