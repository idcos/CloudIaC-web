import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Button, Divider, notification, Popconfirm, Space, Table } from 'antd';
import EllipsisText from 'components/EllipsisText';
import orgsAPI from 'services/orgs';
import changeOrg from "utils/changeOrg";
import { t } from "utils/i18n";
import OrgModal from './components/orgModal';

const Orgs = ({ title, dispatch }) => {
  const [ loading, setLoading ] = useState(false),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null),
    [ curRecord, setCurRecord ] = useState({}),
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
      const res = await orgsAPI.list({
        ...query
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

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
  };

  const resfreshGlobalOrg = () => {
    dispatch({
      type: 'global/getOrgs',
      payload: {
        status: 'enable'
      }
    });
  };

  const operation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        changeStatus: (param) => orgsAPI.changeStatus(param),
        add: (param) => orgsAPI.create(param),
        edit: (param) => orgsAPI.update({
          ...param,
          orgId: curRecord.id
        })
      };
      const res = await method[doWhat]({
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchList();
      resfreshGlobalOrg();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message
      });
    }
  };

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
    }
    setVisible(!visible);
  };

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 240,
      ellipsis: true,
      render: (_, record) => <div className='tableRender'>
        <h2 className='reset-styles'><EllipsisText>{record.name}</EllipsisText></h2>
        <p className='reset-styles'>{record.id}</p>
      </div>
    },
    {
      dataIndex: 'description',
      width: 240,
      ellipsis: true,
      title: t('define.des')
    },
    {
      dataIndex: 'status',
      width: 150,
      ellipsis: true,
      title: t('define.status'),
      render: (text) => <div className='tableRender'>
        <span className={`status-tip ${text == 'disable' ? 'disabled' : 'enabled'}`}>{text == 'disable' ? t('define.status.disabled') : t('define.status.enabled')}</span>
      </div>
    },
    {
      title: t('define.action'),
      width: 180,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return <Space split={<Divider type='vertical' />}>
          {
            record.status == 'disable' ? <Popconfirm
              title={t('define.page.sysSet.org.enable.confirm.title')}
              onConfirm={() => operation({ doWhat: 'changeStatus', payload: { id: record.id, status: 'enable' } })}
            >
              <a>{t('define.status.enabled')}</a>
            </Popconfirm> : <Popconfirm
              title={t('define.page.sysSet.org.disable.confirm.title')}
              onConfirm={() => operation({ doWhat: 'changeStatus', payload: { id: record.id, status: 'disable' } })}
            >
              <a>{t('define.status.disabled')}</a>
            </Popconfirm>
          }
          <a onClick={() => {
            setOpt('edit');
            setCurRecord(record);
            toggleVisible();
          }}
          >{t('define.action.modify')}</a>   
          <a disabled={record.status == 'disable'} onClick={() => changeOrg({ orgId: record.id, dispatch })}>{t('define.action.enter')}</a>       
        </Space>;
      }
    }
  ];

  return <>
    <div style={{ marginBottom: 20 }}>
      <Button 
        type='primary'
        onClick={() => {
          setOpt('add');
          toggleVisible();
        }}
      >{t('define.page.sysSet.org.action.create')}</Button>
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
    {
      visible && <OrgModal
        visible={visible}
        toggleVisible={toggleVisible}
        opt={opt}
        curRecord={curRecord}
        operation={operation}
      />
    }
  </>;
};

export default connect()(Orgs);
