/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Button, Divider, notification, Space, Table, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import keysAPI from 'services/keys';
import getPermission from 'utils/permission';
import OpModal from './components/op-modal';
import { t } from 'utils/i18n';

const SSH = ({ orgId, userInfo }) => {
  const { ORG_SET } = getPermission(userInfo);
  const [loading, setLoading] = useState(false),
    [visible, setVisible] = useState(false),
    [opt, setOpt] = useState(null),
    [curRecord, setCurRecord] = useState(null),
    [resultMap, setResultMap] = useState({
      list: [],
      total: 0,
    }),
    [query, setQuery] = useState({
      currentPage: 1,
      pageSize: 10,
    });

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await keysAPI.list({
        ...query,
        orgId,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0,
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const changeQuery = payload => {
    setQuery({
      ...query,
      ...payload,
    });
  };

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
      setCurRecord(null);
    }
    setVisible(!visible);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 300,
      ellipsis: true,
    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 169,
      ellipsis: true,
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 169,
      ellipsis: true,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('define.action'),
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: record => {
        const creatorIsSelf = record.creatorId === userInfo.id;
        return (
          <Space split={<Divider type='vertical' />}>
            <a
              disabled={!ORG_SET && !creatorIsSelf}
              onClick={() => del(record)}
            >
              {t('define.action.delete')}
            </a>
          </Space>
        );
      },
    },
  ];

  const del = record => {
    const { id, name } = record;
    Modal.confirm({
      title: t('define.action.delete.confirm.title'),
      content: `${t(
        'define.action.delete.confirm.content.prefix',
      )} “${name}” ${t('define.action.delete.confirm.content.suffix')}`,
      icon: <InfoCircleFilled />,
      cancelButtonProps: {
        className: 'ant-btn-tertiary',
      },
      onOk: () => operation({ doWhat: 'del', payload: { id } }),
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: param => keysAPI.create(param),
        del: ({ orgId, id }) => keysAPI.del({ orgId, keyId: id }),
      };
      const res = await method[doWhat]({
        orgId,
        ...payload,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess'),
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message,
      });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Button
          type='primary'
          onClick={() => {
            setOpt('add');
            toggleVisible();
          }}
        >
          {t('define.ssh.action.add')}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        scroll={{ x: 'min-content' }}
        pagination={{
          current: query.currentPage,
          pageSize: query.pageSize,
          total: resultMap.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total =>
            t('define.pagination.showTotal', { values: { total } }),
          onChange: (page, pageSize) => {
            changeQuery({
              currentPage: page,
              pageSize,
            });
          },
        }}
      />
      {visible && (
        <OpModal
          visible={visible}
          opt={opt}
          toggleVisible={toggleVisible}
          operation={operation}
          curRecord={curRecord}
        />
      )}
    </div>
  );
};

export default SSH;
