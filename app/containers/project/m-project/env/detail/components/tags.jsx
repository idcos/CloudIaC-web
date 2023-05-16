/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState, useEffect, useContext } from 'react';
import { Button, Space, Divider, Table, Popconfirm, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { Eb_WP } from 'components/error-boundary';
import getPermission from 'utils/permission';
import { t } from 'utils/i18n';
import DetailPageContext from '../detail-page-context';
import styled from 'styled-components';
import TagModal from 'components/tag-modal';

const TagsContainer = styled.div`
  border-radius: 3px;
  margin-top: 10px;
  border: 2px solid #e1e4e8;
  .header {
    height: 53px;
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-right: 24px;
    justify-content: space-between;
    background: #fafafa;
    border-bottom: 1px solid #e1e4e8;
    .title {
      font-weight: 600;
      color: #24292f;
      line-height: 22px;
      font-size: 18px;
    }
  }
  .content {
    margin: 10px 0;
    border-top: 1px solid #e1e4e8;
  }
  .column-title {
    font-weight: 500;
    color: #24292f;
    font-size: 12px;
    line-height: 20px;
  }
  .colume-main {
    font-weight: 400;
    color: #57606a;
    line-height: 22px;
    font-size: 12px;
  }
`;

const Tags = props => {
  const { envInfo = {}, userInfo = {}, reload } = useContext(DetailPageContext);
  const [tagModalVsible, setTagModalVsible] = useState(true);
  const [opt, setOpt] = useState('add');
  const [curRecord, setCurRecord] = useState({});
  const { userTags = [], envTags = [], tokenName } = envInfo;

  const toggleTagModalVsible = () => {
    setTagModalVsible(!tagModalVsible);
  };

  const handleDeleteTag = () => {
    console.log('Delete Tag');
  };
  const handleEditTag = value => {
    console.log('Edit Tag', value);
  };
  const handleaAddTag = value => {
    console.log('Add Tag', value);
  };
  const operation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: param => handleaAddTag(param),
        delete: param => handleDeleteTag(param),
        edit: param => handleEditTag(param),
      };
      let params = {
        ...payload,
      };
      const res = await method[action](params);
      // if (res.code !== 200) {
      //   throw new Error(res.message_detail || res.message);
      // }

      notification.success({
        message: t('define.message.opSuccess'),
      });
      // const { result } = res;
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message_detail || e.message,
      });
    }
  };
  const tags = [
    {
      key: 'key1',
      value: 'value1',
      type: 'env',
      source: 'YDD',
    },
    {
      key: 'key2',
      value: 'value3',
      type: 'env',
      source: 'YDD',
    },
    {
      key: 'key3',
      value: 'value3',
      type: 'user',
      source: 'USER',
    },
    {
      key: 'key4',
      value: 'value4',
      type: 'user',
      source: 'USER',
    },
  ];
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const columns = [
    {
      title: <span className='column-title'>{t('define.key')}</span>,
      dataIndex: 'key',
      key: 'key',
      width: 230,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: <span className='column-title'>{t('define.value')}</span>,
      dataIndex: 'value',
      key: 'value',
      width: 500,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: <span className='column-title'>{t('define.source')}</span>,
      dataIndex: 'source',
      key: 'source',
      width: 300,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: '',
      render: (_, record) =>
        PROJECT_OPERATOR && record.type === 'user' ? (
          <Space split={<Divider type='vertical' />}>
            <a
              onClick={() => {
                setOpt('edit');
                toggleTagModalVsible();
                setCurRecord(record);
              }}
            >
              {t('define.action.modify')}
            </a>
            <Popconfirm
              title={t('define.tag.action.delete.confirm.title')}
              onConfirm={() =>
                operation({
                  action: 'delete',
                })
              }
            >
              <a>{t('define.action.delete')}</a>
            </Popconfirm>
          </Space>
        ) : (
          '-'
        ),
    },
  ];
  return (
    <TagsContainer>
      <div className='header'>
        <div className='title'>{t('define.tag')}</div>
        <Button
          onClick={() => {
            setOpt('add');
            toggleTagModalVsible();
            setCurRecord({});
          }}
        >
          <EditOutlined />
          {t('define.addTag')}
        </Button>
      </div>
      <div className='content'>
        <Table columns={columns} dataSource={tags} pagination={false} />
      </div>
      {tagModalVsible && (
        <TagModal
          opt={opt}
          visible={tagModalVsible}
          toggleVisible={toggleTagModalVsible}
          operation={operation}
          reload={reload}
          curRecord={curRecord}
        />
      )}
    </TagsContainer>
  );
};

export default Eb_WP()(memo(Tags));
