/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState, useEffect } from 'react';
import {
  Button,
  Divider,
  notification,
  Popconfirm,
  Space,
  Table,
  Card,
  Input,
  Tooltip,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import styled from 'styled-components';
import tokensAPI from 'services/tokens';
import TokenForm from './components/add-modal';
import EditTokenForm from './components/edit-modal';
import { t } from 'utils/i18n';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  .item-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .item-title {
    width: 100px;
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
  }
  .item-content {
    width: 100%;
  }
`;

const ApiToken = ({ orgId }) => {
  const [loading, setLoading] = useState(false),
    [visible, setVisible] = useState(false),
    [editVisible, setEditVisible] = useState(false),
    [curRecord, setCurRecord] = useState({}),
    [resultMap, setResultMap] = useState({
      list: [],
      total: 0,
    }),
    [newKey, setNewKey] = useState(''),
    [newKeyName, setNewKeyName] = useState('-'),
    [showNewKey, setShowNewKey] = useState(false),
    [query, setQuery] = useState({
      pageNo: 1,
      pageSize: 10,
    });

  useEffect(() => {
    fetchList();
  }, [query]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await tokensAPI.listToken({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
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
  const toggleEditVsible = () => setEditVisible(!editVisible);
  const toggleVisible = () => setVisible(!visible);

  const changeQuery = payload => {
    setQuery({
      ...query,
      ...payload,
    });
  };

  const showResult = result => {
    console.log(result);
    const { key, name } = result;
    setNewKey(key);
    setNewKeyName(name);
    setShowNewKey(true);
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        edit: param => tokensAPI.editToken(param),
        add: param => tokensAPI.createToken(param),
        del: ({ id, orgId }) => tokensAPI.delToken({ id, orgId }),
      };
      const res = await method[doWhat]({
        ...payload,
        orgId,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess'),
      });
      if (doWhat === 'add') {
        showResult(res.result);
      }
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

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 200,
      render: text => text || '-',
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 286,
      ellipsis: true,
    },
    {
      dataIndex: 'expiredAt',
      title: t('define.token.expiredAt'),
      width: 160,
      ellipsis: true,
      render: text => (text ? moment(text).format(dateFormat) : '-'),
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 160,
      ellipsis: true,
      render: text => moment(text).format(dateFormat),
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 120,
      ellipsis: true,
      render: (text, record) => (
        <div className='tableRender'>
          {record.expiredAt && Date.parse(record.expiredAt) <= Date.now() ? (
            <span className={'status-tip expired'}>{t('define.expired')}</span>
          ) : (
            <span
              className={`status-tip ${
                text === 'disable' ? 'disabled' : 'enabled'
              }`}
            >
              {text === 'disable'
                ? t('define.status.disabled')
                : t('define.status.enabled')}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t('define.action'),
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space split={<Divider type='vertical' />}>
            {!(
              record.expiredAt && Date.parse(record.expiredAt) <= Date.now()
            ) &&
              (record.status === 'disable' ? (
                <Popconfirm
                  title={t('define.token.action.enable.confirm.title')}
                  onConfirm={() =>
                    operation({
                      doWhat: 'edit',
                      payload: { id: record.id, status: 'enable' },
                    })
                  }
                >
                  <a>{t('define.status.enabled')}</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title={t('define.token.action.disabled.confirm.title')}
                  onConfirm={() =>
                    operation({
                      doWhat: 'edit',
                      payload: { id: record.id, status: 'disable' },
                    })
                  }
                >
                  <a>{t('define.status.disabled')}</a>
                </Popconfirm>
              ))}
            <a
              onClick={() => {
                setCurRecord(record);
                toggleEditVsible();
              }}
            >
              {t('define.action.modify')}
            </a>

            <Popconfirm
              title={t('define.token.action.delete.confirm.title')}
              onConfirm={() =>
                operation({ doWhat: 'del', payload: { id: record.id } })
              }
            >
              <a>{t('define.action.delete')}</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {showNewKey && (
        <Card
          title={t('define.token.newToken.title')}
          style={{ marginBottom: '20px' }}
        >
          <CardContent>
            <div className='item-container'>
              <div className='item-title'>{`${t('define.name')}:`}</div>
              <div className='item-content'>{newKeyName || '-'}</div>
            </div>
            <div className='item-container'>
              <div className='item-content'>
                <Input.Group compact>
                  <Input
                    style={{ width: '400px' }}
                    value={newKey}
                    disabled={true}
                  />
                  <Tooltip title={t('define.action.copyContent')}>
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => {
                        copy(newKey);
                      }}
                    />
                  </Tooltip>
                </Input.Group>
              </div>
            </div>
          </CardContent>

          <div
            style={{ marginBottom: '4px', fontSize: '14px', color: '#5e5e5e' }}
          >
            {t('define.token.newToken.hint')}
          </div>
        </Card>
      )}

      <div style={{ marginBottom: 20 }}>
        <Button
          type='primary'
          onClick={() => {
            toggleVisible();
          }}
        >
          {t('define.token.action.add')}
        </Button>
        {visible && (
          <TokenForm
            orgId={orgId}
            reload={fetchList}
            operation={operation}
            toggleVisible={toggleVisible}
            visible={visible}
          />
        )}
        {editVisible && (
          <EditTokenForm
            reload={fetchList}
            operation={operation}
            toggleVisible={toggleEditVsible}
            visible={editVisible}
            record={curRecord}
          />
        )}
      </div>
      <Table
        columns={columns}
        dataSource={resultMap.list}
        loading={loading}
        scroll={{ x: 'min-content' }}
        pagination={{
          current: query.pageNo,
          pageSize: query.pageSize,
          total: resultMap.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total =>
            t('define.pagination.showTotal', { values: { total } }),
          onChange: (page, pageSize) => {
            changeQuery({
              pageNo: page,
              pageSize,
            });
          },
        }}
      />
    </>
  );
};

export default ApiToken;
