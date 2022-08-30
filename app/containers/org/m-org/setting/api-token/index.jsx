import React, { useState, useEffect } from 'react';
import { Button, Divider, notification, Popconfirm, Space, Table } from 'antd';
import moment from 'moment';
import tokensAPI from 'services/tokens';
import TokenForm from './components/add-modal';
import Popover from 'components/Popover';
import { t } from 'utils/i18n';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const ApiToken = ({ orgId }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
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
      const res = await tokensAPI.listToken({
        currentPage: query.pageNo,
        pageSize: query.pageSize,
        orgId
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
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const toggleVisible = () => setVisible(!visible);

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        edit: (param) => tokensAPI.editToken(param),
        add: (param) => tokensAPI.createToken(param),
        del: ({ id, orgId }) => tokensAPI.delToken({ id, orgId })
      };
      const res = await method[doWhat]({
        ...payload, 
        orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message
      });
    }
  };

  const columns = [
    {
      dataIndex: 'key',
      title: 'Token',
      width: 286
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 200,
      ellipsis: true
    },
    {
      dataIndex: 'expiredAt',
      title: t('define.token.expiredAt'),
      width: 160,
      ellipsis: true,
      render: (text) => text ? moment(text).format(dateFormat) : '-'
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 160,
      ellipsis: true,
      render: (text) => moment(text).format(dateFormat)
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 120,
      ellipsis: true,
      render: (text, record) => (
        <div className='tableRender'>
          {
            (record.expiredAt && Date.parse(record.expiredAt) <= Date.now()) ? 
              <span className={`status-tip expired`}>{t('define.expired')}</span> :
              <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? t('define.status.disabled') : t('define.status.enabled')}</span>
          }
        </div>
      )
    },
    {
      title: t('define.action'),
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          {
            !(record.expiredAt && Date.parse(record.expiredAt) <= Date.now()) && (record.status == 'disable' ? <Popconfirm
              title={t('define.token.action.enable.confirm.title')}
              onConfirm={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'enable' } })}
            >
              <a>{t('define.status.enabled')}</a>
            </Popconfirm> : <Popconfirm
              title={t('define.token.action.disabled.confirm.title')}
              onConfirm={() => operation({ doWhat: 'edit', payload: { id: record.id, status: 'disable' } })}
            >
              <a>{t('define.status.disabled')}</a>
            </Popconfirm>)
          }
          <Popconfirm
            title={t('define.token.action.delete.confirm.title')}
            onConfirm={() => operation({ doWhat: 'del', payload: { id: record.id } })}
          >
            <a>{t('define.action.delete')}</a>
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <>
    <div style={{ marginBottom: 20 }}>
      <Button 
        type='primary'
        onClick={() => {
          toggleVisible();
        }}
      >{t('define.token.action.add')}</Button>
      {
        visible && <TokenForm 
          orgId={orgId}
          reload={fetchList}
          operation={operation}
          toggleVisible={toggleVisible}
          visible={visible}
        />
      }
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
        showTotal: (total) => t('define.pagination.showTotal', { values: { total } }),
        onChange: (page, pageSize) => {
          changeQuery({
            pageNo: page,
            pageSize
          });
        }
      }}
    />
  </>;
};

export default ApiToken;
