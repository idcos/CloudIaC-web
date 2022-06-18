import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table, notification, Space, Popconfirm, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
import { SCAN_DISABLE_STATUS } from 'constants/types';
import { downloadImportTemplate } from 'utils/util';
import { t } from 'utils/i18n';
import { useLoopPolicyStatus } from 'utils/hooks';
import { UploadIcon, DownIcon } from 'components/iconfont';
import PolicyStatus from 'components/policy-status';
import isEmpty from 'lodash/isEmpty';

const CTList = ({ match = {} }) => {
  const { check, loopRequesting } = useLoopPolicyStatus();
  const { orgId } = match.params || {};
  const [ visible, setVisible ] = useState(false),
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

  // 列表查询
  const {
    data: resultMap = {
      list: [],
      total: 0
    },
    run: fetchList,
    loading
  } = useRequest(
    () => requestWrapper(
      tplAPI.list.bind(null, { 
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        q: query.q,
        orgId
      })
    ), {
      manual: true,
      formatResult: (data) => ({
        list: data.list || [],
        total: data.total || 0
      }),
      onSuccess: (data) => {
        check({ 
          list: data.list,
          loopFn: () => fetchList()
        });
      }
    }
  );


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
        clearSelected();
      }
    }
  );

  const clearSelected = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

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

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'activeEnvironment',
      title: t('define.activeEnvironment'),
      width: 78,
      ellipsis: true
    },
    {
      dataIndex: 'repoAddr',
      title: t('define.repo'),
      width: 249,
      ellipsis: true,
      render: (text) => <a href={text} target='_blank'><EllipsisText>{text}</EllipsisText></a>
    },
    {
      dataIndex: 'policyStatus',
      title: t('policy.detection.complianceStatus'),
      width: 110,
      ellipsis: true,
      render: (policyStatus, record) => {
        const clickProps = {
          style: { cursor: 'pointer' },
          onClick: () => openDetectionDrawer(record)
        };
        return <PolicyStatus policyStatus={policyStatus} clickProps={clickProps} empty='-' />;
      }
    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 70,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 152,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: t('define.action'),
      width: 120,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        return (
          record.isDemo ? 
            <></> :
            <Space>
              <a type='link' onClick={() => updateCT(record.id)}>{t('define.action.modify')}</a>
              <Popconfirm
                placement='left'
                title={t('define.ct.delete.confirm.title')}
                onConfirm={() => onDel(record.id)}
              >
                <a type='link'>{t('define.action.delete')}</a>
              </Popconfirm>
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

  const importFromExchange = () => {
    history.push(`/org/${orgId}/m-org-ct/importCT-exchange`);
  };

  const onDel = async (tplId) => {
    try {
      const res = await tplAPI.del({
        tplId,
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchList();
    } catch (e) {
      notification.error({
        message: t('define.message.opFail'),
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

  const download = async () => {
    const ids = selectedRowKeys;
    let keys;
    if (selectedRowKeys && !isEmpty(selectedRowKeys)) {
      keys = selectedRowKeys.map(key => {
        return `ids=${key}`;
      }).join('&');
    }
    let url = `/api/v1/templates/export?download=true${!isEmpty(ids) && ('&' + keys) || ''}`;
    await downloadImportTemplate(url, { orgId });
    clearSelected();
  };

  const batchScanDisabled = useMemo(() => {
    return !selectedRows.length || selectedRows.find(it => SCAN_DISABLE_STATUS.includes(it.policyStatus));
  });

  return (
    <div style={{ padding: '36px 24px' }}>
      <div>
        <Space style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type='primary' onClick={createCT}>{t('define.addTemplate')}</Button>
            <Button onClick={importFromExchange}>{t('define.import.fromExchange')}</Button>
            <Button disabled={batchScanDisabled} onClick={batchScan}>{t('define.complianceScan')}</Button>
          </Space>
          <Space>
            <Input
              style={{ width: 320 }}
              allowClear={true}
              placeholder={t('define.ct.search.placeholder')}
              prefix={<SearchOutlined />}
              onPressEnter={(e) => {
                const q = e.target.value;
                changeQuery({ q });
              }}
            />
            <Button icon={<DownIcon />} onClick={() => setVisible(true)}>{t('define.import')}</Button>
            <Button disabled={selectedRowKeys.length === 0} icon={<UploadIcon />} onClick={() => download()}>{t('define.export')}</Button>
          </Space>
        </Space>
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={resultMap.list}
          loading={loading && !loopRequesting}
          scroll={{ x: 'min-content' }}
          pagination={{
            current: query.pageNo,
            pageSize: query.pageSize,
            total: resultMap.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
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
                disabled: R.internal || R.isDemo
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
  );
};

export default Eb_WP()(CTList);
