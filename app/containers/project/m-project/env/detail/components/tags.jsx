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
import tagsAPI from 'services/tags';

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
  const [tagModalVsible, setTagModalVsible] = useState(false);
  const [opt, setOpt] = useState('add');
  const [curRecord, setCurRecord] = useState({});
  const { userTags = [], envTags = [], tokenName } = envInfo;

  const _userTags = (userTags || []).map(tag => ({
    ...tag,
    type: 'user',
    sourceName: 'USER',
  }));
  const _envTags = (envTags || []).map(tag => ({
    ...tag,
    type: 'env',
    sourceName: tokenName,
  }));
  const tags = [..._userTags, ..._envTags];

  // const tags = [
  //   {
  //     key: 'key1',
  //     value: 'value1',
  //     type: 'env',
  //     sourceName: 'YDD',
  //     keyId: '5dsfweW',
  //     valueId: '7Y6534QT',
  //   },
  //   {
  //     key: 'key2',
  //     value: 'value3',
  //     type: 'env',
  //     sourceName: 'YDD',
  //     keyId: 'i8uyuftw',
  //     valueId: 'ne12341weq',
  //   },
  //   {
  //     key: 'key3',
  //     value: 'value3',
  //     type: 'user',
  //     sourceName: 'USER',
  //     keyId: 'zxf314wr',
  //     valueId: '03thisa',
  //   },
  //   {
  //     key: 'key4',
  //     value: 'value4',
  //     type: 'user',
  //     sourceName: 'USER',
  //     keyId: 'o02ri0j',
  //     valueId: 'gersdfd',
  //   },
  // ];

  // 更新tag
  const { run: updateTag } = useRequest(
    tag =>
      requestWrapper(tagsAPI.updateTag.bind(null, tag), {
        autoSuccess: true,
      }),
    {
      manual: true,
    },
  );

  // 删除tag
  const { run: deleteTag } = useRequest(
    tag =>
      requestWrapper(tagsAPI.deleteTag.bind(null, tag), {
        autoSuccess: true,
      }),
    {
      manual: true,
    },
  );

  // 增加tag
  const { run: addTag } = useRequest(
    tag =>
      requestWrapper(tagsAPI.addTag.bind(null, tag), {
        autoSuccess: true,
      }),
    {
      manual: true,
    },
  );

  const toggleTagModalVsible = () => {
    setTagModalVsible(!tagModalVsible);
  };

  const handleDeleteTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
    };
    return deleteTag(requestParam);
  };
  const handleEditTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
      keyId: curRecord.keyId,
      valueId: curRecord.valueId,
    };
    return updateTag(requestParam);
  };
  const handleaAddTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
    };
    return addTag(requestParam);
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
      if (res.code !== 200) {
        throw new Error(res.message_detail || res.message);
      }

      notification.success({
        message: t('define.message.opSuccess'),
      });
      reload();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message_detail || e.message,
      });
    }
  };
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
      dataIndex: 'sourceName',
      key: 'sourceName',
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
                  payload: {
                    keyId: record.keyId,
                    valueId: record.valueId,
                  },
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
        {PROJECT_OPERATOR && (
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
        )}
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
