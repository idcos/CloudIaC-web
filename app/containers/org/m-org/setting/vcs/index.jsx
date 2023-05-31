/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Button, Divider, notification, Space, Table, Modal } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import vcsAPI from 'services/vcs';
import OpModal from 'components/vcs-modal';
import { t } from 'utils/i18n';

const VCS = ({ title, orgId }) => {
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
      const res = await vcsAPI.searchVcs({
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
      width: 200,
      ellipsis: true,
    },
    {
      dataIndex: 'vcsType',
      title: t('define.type'),
      width: 100,
      ellipsis: true,
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 100,
      ellipsis: true,
      render: text => (
        <div className='tableRender'>
          <span
            className={`status-tip ${
              text === 'disable' ? 'disabled' : 'enabled'
            }`}
          >
            {text === 'disable'
              ? t('define.status.disabled')
              : t('define.status.enabled')}
          </span>
        </div>
      ),
    },
    {
      dataIndex: 'address',
      title: t('define.address'),
      width: 230,
      ellipsis: true,
    },
    {
      title: t('define.action'),
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space split={<Divider type='vertical' />}>
            <a
              onClick={() => {
                setOpt('edit');
                toggleVisible();
                setCurRecord(record);
              }}
            >
              {t('define.action.modify')}
            </a>
            {record.status === 'disable' ? (
              <a
                onClick={() =>
                  operation({
                    doWhat: 'edit',
                    payload: { id: record.id, status: 'enable' },
                  })
                }
              >
                {t('define.status.enable')}
              </a>
            ) : (
              <a onClick={() => disableConfirm(record)}>
                {t('define.status.disabled')}
              </a>
            )}
            <a onClick={() => delConfirm(record)}>
              {t('define.action.delete')}
            </a>
          </Space>
        );
      },
    },
  ];

  const disableConfirm = record => {
    const { name, id } = record;
    Modal.confirm({
      width: 480,
      title: `${t('define.vcs.disable.confirm.title.prefix')} ${name} ${t(
        'define.vcs.disable.confirm.title.suffix',
      )}`,
      icon: <InfoCircleFilled />,
      content: t('define.vcs.disable.confirm.content'),
      cancelButtonProps: {
        className: 'ant-btn-tertiary',
      },
      onOk: () => {
        operation({ doWhat: 'edit', payload: { id, status: 'disable' } });
      },
    });
  };

  const delConfirm = record => {
    const { name, id } = record;
    Modal.confirm({
      width: 480,
      title: `${t('define.vcs.delete.confirm.title.prefix')} ${name} ${t(
        'define.vcs.delete.confirm.title.suffix',
      )}`,
      icon: <InfoCircleFilled />,
      content: t('define.vcs.delete.confirm.content'),
      cancelButtonProps: {
        className: 'ant-btn-tertiary',
      },
      onOk: () => {
        operation({ doWhat: 'del', payload: { id } });
      },
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: param => vcsAPI.createVcs(param),
        del: ({ orgId, id }) => vcsAPI.deleteVcs({ orgId, id }),
        edit: param => vcsAPI.updateVcs(param),
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
        message: t('define.message.getFail'),
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
          {t('define.vcs.add')}
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

export default VCS;
